import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { parseCreateSubscriptionRequest } from '../../../src/lib/billingWebhookCore.ts';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const keyId = Deno.env.get('RAZORPAY_KEY_ID')?.trim();
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')?.trim();
    // Fail loudly and stop. Never fall back to a guess, and never a partial
    // configuration: an id without a secret would create subscriptions that
    // could never be verified.
    if (!keyId || !keySecret) return json({ error: 'Payments are not configured.' }, 500);

    // The caller's identity comes from the JWT, never from the body.
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

    const parsed = parseCreateSubscriptionRequest(await req.json().catch(() => null));
    if (!parsed.ok) return json({ error: parsed.error }, 400);

    // The price, the interval and the Razorpay plan id all come from here, and
    // only from here. The body supplied a plan code and a currency; nothing it
    // sent is trusted for anything else.
    const { data: plan, error: planError } = await supabase
      .from('billing_plans')
      .select('amount, currency, total_count, razorpay_plan_id, label')
      .eq('code', parsed.plan)
      .eq('currency', parsed.currency)
      .maybeSingle();

    if (planError || !plan) return json({ error: 'That plan is not available.' }, 404);

    const response = await fetch('https://api.razorpay.com/v1/subscriptions', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        plan_id: plan.razorpay_plan_id,
        total_count: plan.total_count,
        quantity: 1,
        customer_notify: 1,
        // The only note we attach, and the only place the user id appears in
        // the Razorpay payload. It is a convenience for the dashboard, not a
        // trust boundary: the webhook resolves the user from this table.
        notes: { user_id: user.id },
      }),
    });

    if (!response.ok) {
      console.error('Razorpay rejected the subscription', response.status, await response.text());
      return json({ error: 'Could not start checkout.' }, 502);
    }

    const subscription = (await response.json()) as { id?: string };
    const subscriptionId = subscription?.id;
    if (!subscriptionId) return json({ error: 'Could not start checkout.' }, 502);

    const { error: insertError } = await supabase.from('subscriptions').insert({
      user_id: user.id,
      razorpay_subscription_id: subscriptionId,
      plan: parsed.plan,
      currency: plan.currency,
      amount: plan.amount,
      status: 'created',
    });
    if (insertError) {
      console.error('Could not record the subscription', insertError);
      return json({ error: 'Could not start checkout.' }, 500);
    }

    return json({
      subscriptionId,
      keyId,
      amount: plan.amount,
      currency: plan.currency,
      label: plan.label,
    });
  } catch (e) {
    console.error(e);
    return json({ error: 'Could not start checkout.' }, 500);
  }
});
