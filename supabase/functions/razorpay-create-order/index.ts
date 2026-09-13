import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const PLANS = {
  INR: {
    monthly: { amount: 24900, label: 'PsyCognito Premium — Monthly' },
    yearly: { amount: 199900, label: 'PsyCognito Premium — Yearly' },
  },
  USD: {
    monthly: { amount: 299, label: 'PsyCognito Premium — Monthly' },
    yearly: { amount: 2499, label: 'PsyCognito Premium — Yearly' },
  },
} as const;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const plan = body?.plan;
    const currency = body?.currency === 'INR' ? 'INR' : 'USD';
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (plan !== 'monthly' && plan !== 'yearly') {
      return json({ error: 'Invalid plan.' }, 400);
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || email.length > 255) {
      return json({ error: 'A valid email address is required.' }, 400);
    }

    const keyId = Deno.env.get('RAZORPAY_KEY_ID');
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!keyId || !keySecret) return json({ error: 'Payments are not configured.' }, 500);

    const { amount, label } = PLANS[currency][plan as 'monthly' | 'yearly'];
    const auth = btoa(`${keyId}:${keySecret}`);

    const rzpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        currency,
        receipt: `psycog_${Date.now()}`,
        notes: { plan, email, label },
      }),
    });

    const order = await rzpRes.json();
    if (!rzpRes.ok) {
      console.error('Razorpay order failed', order);
      return json({ error: order?.error?.description ?? 'Could not start checkout.' }, 502);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );
    await supabase.from('web_subscriptions').insert({
      email,
      plan,
      order_id: order.id,
      amount,
       currency,
      status: 'created',
    });

    return json({ orderId: order.id, amount, currency, keyId, label });
  } catch (e) {
    console.error(e);
    return json({ error: 'Unexpected error starting checkout.' }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
