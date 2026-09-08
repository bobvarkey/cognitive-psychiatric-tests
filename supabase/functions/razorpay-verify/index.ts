import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const orderId = String(body?.orderId ?? '');
    const paymentId = String(body?.paymentId ?? '');
    const signature = String(body?.signature ?? '');

    if (!orderId || !paymentId || !signature) {
      return json({ error: 'Missing payment details.' }, 400);
    }

    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!keySecret) return json({ error: 'Payments are not configured.' }, 500);

    const expected = await hmacSha256Hex(keySecret, `${orderId}|${paymentId}`);
    if (!timingSafeEqual(expected, signature)) {
      return json({ error: 'Payment could not be verified.' }, 400);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: row, error } = await supabase
      .from('web_subscriptions')
      .select('id, plan, email')
      .eq('order_id', orderId)
      .maybeSingle();

    if (error || !row) return json({ error: 'Order not found.' }, 404);

    const end = new Date();
    if (row.plan === 'yearly') end.setFullYear(end.getFullYear() + 1);
    else end.setMonth(end.getMonth() + 1);

    await supabase
      .from('web_subscriptions')
      .update({
        payment_id: paymentId,
        status: 'paid',
        current_period_end: end.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', row.id);

    return json({ success: true, plan: row.plan, email: row.email, currentPeriodEnd: end.toISOString() });
  } catch (e) {
    console.error(e);
    return json({ error: 'Unexpected error verifying payment.' }, 500);
  }
});

async function hmacSha256Hex(secret: string, message: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
