import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  constantTimeEqual,
  effectForEvent,
  eventIdFor,
  hmacSha256Hex,
} from '../../../src/lib/billingWebhookCore.ts';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  // 1. The RAW body, before any parsing. Re-serialising it would change the
  //    signed bytes and break every signature.
  const raw = await req.text();

  // 2. The signature header.
  const signature = (req.headers.get('X-Razorpay-Signature') ?? '').trim();
  if (!/^[0-9a-f]{64}$/i.test(signature)) {
    return json({ error: 'Missing or malformed signature.' }, 400);
  }

  const secret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')?.trim();
  if (!secret) return json({ error: 'Payments are not configured.' }, 500);

  // 3. Verify before parsing. No database read or write has happened yet.
  const expected = await hmacSha256Hex(secret, raw);
  if (!constantTimeEqual(expected, signature.toLowerCase())) {
    return json({ error: 'Invalid signature.' }, 400);
  }

  // 4. Only now is the body trusted enough to parse.
  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ error: 'Malformed body.' }, 400);
  }

  try {
    const eventType = String(payload?.event ?? '');
    const effect = effectForEvent(eventType);
    // 5. Idempotent dedupe key, derived before processing so it is available
    //    for the record-after step below.
    const eventId = await eventIdFor(req.headers.get('X-Razorpay-Event-Id'), raw);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const razorpaySubscriptionId = String(
      payload?.payload?.subscription?.entity?.id ?? '',
    );

    // An unknown event type is routine, not an error: answer 200 so Razorpay
    // does not disable the webhook.
    if (effect && razorpaySubscriptionId) {
      const { data: sub, error: subError } = await supabase
        .from('subscriptions')
        .select('id, user_id, plan')
        .eq('razorpay_subscription_id', razorpaySubscriptionId)
        .maybeSingle();

      if (subError) throw subError;

      if (sub) {
        // The period end Razorpay reports, in seconds since the epoch.
        const currentEnd = payload?.payload?.subscription?.entity?.current_end;
        const periodEnd =
          typeof currentEnd === 'number' && currentEnd > 0
            ? new Date(currentEnd * 1000).toISOString()
            : null;

        const { error: statusError } = await supabase
          .from('subscriptions')
          .update({
            status: effect.status,
            current_period_end: periodEnd,
            updated_at: new Date().toISOString(),
          })
          .eq('razorpay_subscription_id', razorpaySubscriptionId);
        if (statusError) throw statusError;

        if (effect.writesEntitlement && periodEnd) {
          // An absolute assignment, never an increment: applying the same
          // event twice produces the same row, so a redelivery cannot compound
          // access. `plan` comes from the subscription row the server wrote at
          // checkout, never from the webhook body.
          //
          // No `source <> 'admin'` guard appears here because PostgREST's
          // upsert cannot express a conditional update. The guard lives in the
          // trigger added by Task 7, which binds every writer of this table
          // rather than only this one. Deploy Task 7's migration with this
          // function, or the owner's grant is overwritable.
          const { error: grantError } = await supabase
            .from('entitlements')
            .upsert(
              {
                user_id: sub.user_id,
                plan: sub.plan,
                source: 'razorpay',
                expires_at: periodEnd,
                note: `razorpay ${eventType} ${razorpaySubscriptionId}`,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'user_id' },
            );
          if (grantError) throw grantError;
        }
      } else {
        // Not our subscription. Retrying will not help, so do not ask for one.
        console.warn('Webhook for an unknown subscription', razorpaySubscriptionId);
      }
    }

    // 6. Record AFTER processing. Recording first would swallow a retry: the
    //    retry would see a duplicate and return 200 while the grant was never
    //    written.
    const { error: dedupeError } = await supabase
      .from('webhook_events')
      .insert({ id: eventId, event_type: eventType });
    // A unique-violation here means a genuine concurrent redelivery that both
    // processed. Processing is idempotent, so the second write was harmless.
    if (dedupeError && dedupeError.code !== '23505') throw dedupeError;

    return json({ received: true });
  } catch (e) {
    // A genuine processing failure must NOT be a silent 200: Razorpay would
    // stop retrying and the grant would be lost permanently.
    console.error('Webhook processing failed', e);
    return json({ error: 'Processing failed.' }, 500);
  }
});
