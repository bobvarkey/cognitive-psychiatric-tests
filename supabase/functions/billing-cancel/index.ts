import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

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
    if (!keyId || !keySecret) return json({ error: 'Payments are not configured.' }, 500);

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

    // No input is read. The subscription is resolved from the caller's own id.
    const { data: sub, error: subError } = await supabase
      .from('subscriptions')
      .select('razorpay_subscription_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (subError) throw subError;
    if (!sub) return json({ error: 'There is no active subscription to cancel.' }, 400);

    const response = await fetch(
      `https://api.razorpay.com/v1/subscriptions/${sub.razorpay_subscription_id}/cancel`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`${keyId}:${keySecret}`)}`,
          'Content-Type': 'application/json',
        },
        // Keep the period already paid for. Cancelling immediately would take
        // away time the user has paid for.
        body: JSON.stringify({ cancel_at_cycle_end: 1 }),
      },
    );

    if (!response.ok) {
      console.error('Razorpay refused the cancellation', response.status, await response.text());
      return json({ error: 'Could not cancel the subscription.' }, 502);
    }

    // No entitlements write. The webhook records the cancellation, exactly as
    // it records everything else, and access runs to the period end.
    return json({ cancelled: true });
  } catch (e) {
    console.error(e);
    return json({ error: 'Could not cancel the subscription.' }, 500);
  }
});
