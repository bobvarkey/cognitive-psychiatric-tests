import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { constantTimeEqual, hmacSha256Hex } from '../../../src/lib/billingWebhookCore.ts';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')?.trim();
    if (!keySecret) return json({ error: 'Payments are not configured.' }, 500);

    const authHeader = req.headers.get('Authorization') ?? '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) return json({ error: 'Not signed in.' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    const user = userData?.user;
    if (userError || !user) return json({ error: 'Not signed in.' }, 401);

    const body = await req.json().catch(() => ({}));
    const paymentId = String(body?.razorpay_payment_id ?? '');
    const subscriptionId = String(body?.razorpay_subscription_id ?? '');
    const signature = String(body?.razorpay_signature ?? '');
    if (!paymentId || !subscriptionId || !signature) {
      return json({ error: 'Missing payment details.' }, 400);
    }

    // Razorpay's subscription checkout signs `payment_id|subscription_id`.
    const expected = await hmacSha256Hex(keySecret, `${paymentId}|${subscriptionId}`);
    if (!constantTimeEqual(expected, signature)) {
      return json({ error: 'Payment could not be verified.' }, 400);
    }

    // Scoped to the caller's own row. A signature proves the payment is real;
    // it does not prove this session is the one that made it, so the update is
    // keyed to the JWT's user id as well as the subscription id.
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ checkout_verified_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('razorpay_subscription_id', subscriptionId)
      .eq('user_id', user.id);
    if (updateError) {
      console.error('Could not record the verified checkout', updateError);
      return json({ error: 'Payment could not be verified.' }, 500);
    }

    // No entitlements write. That is the whole point.
    return json({ verified: true });
  } catch (e) {
    console.error(e);
    return json({ error: 'Payment could not be verified.' }, 500);
  }
});
