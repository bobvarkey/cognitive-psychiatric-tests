// Backup Razorpay webhook: marks orders paid if the browser never returned
// after checkout. Idempotent — already-paid orders are left untouched.
import { createClient } from 'npm:@supabase/supabase-js@2';

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const secret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')?.trim();
  if (!secret) return json({ error: 'Webhook not configured' }, 500);

  const raw = await req.text();
  const signature = req.headers.get('x-razorpay-signature') ?? '';
  const expected = await hmacSha256Hex(secret, raw);
  if (!signature || !timingSafeEqual(expected, signature)) {
    return json({ error: 'Invalid signature' }, 401);
  }

  let event: any;
  try {
    event = JSON.parse(raw);
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const type = String(event?.event ?? '');
  if (type !== 'payment.captured' && type !== 'order.paid') {
    return json({ ignored: type });
  }

  const payment = event?.payload?.payment?.entity;
  const orderId = String(event?.payload?.order?.entity?.id ?? payment?.order_id ?? '');
  const paymentId = String(payment?.id ?? '');
  if (!orderId) return json({ ignored: 'no order id' });

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: row, error } = await supabase
    .from('web_subscriptions')
    .select('id, plan, status')
    .eq('order_id', orderId)
    .maybeSingle();

  if (error) {
    console.error(error);
    return json({ error: 'Lookup failed' }, 500); // Razorpay will retry
  }
  if (!row) return json({ ignored: 'unknown order' });
  if (row.status === 'paid') return json({ ok: true, alreadyPaid: true });

  const end = new Date();
  if (row.plan === 'yearly') end.setFullYear(end.getFullYear() + 1);
  else end.setMonth(end.getMonth() + 1);

  const { error: upErr } = await supabase
    .from('web_subscriptions')
    .update({
      payment_id: paymentId || null,
      status: 'paid',
      current_period_end: end.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', row.id)
    .neq('status', 'paid');

  if (upErr) {
    console.error(upErr);
    return json({ error: 'Update failed' }, 500);
  }
  return json({ ok: true });
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
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, '0')).join('');
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
    headers: { 'Content-Type': 'application/json' },
  });
}
