import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
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

    // The email comes from the verified session and nowhere else. Any email in
    // the body is ignored, so this cannot be used to claim someone else's
    // purchase or to probe whether an address has ever paid.
    if (!user.email || !user.email_confirmed_at) {
      return json({ error: 'Confirm your email address first.' }, 403);
    }

    // Normalised and matched exactly. `ilike` would read this value as a
    // pattern: `_` and `%` are legal in an email local part, so a caller could
    // register an address that wildcard-matches a stranger's paid address and
    // restore their purchase. Lowercasing loses no matches, because the one
    // writer of this column lowercases before insert (razorpay-create-order).
    // It does forgo the `lower(email)` index, which an equality test cannot
    // use — a cost worth a lookup that cannot be widened by its own input.
    const email = user.email.trim().toLowerCase();

    const { data: purchase, error: lookupError } = await supabase
      .from('web_subscriptions')
      .select('plan, current_period_end')
      .eq('email', email)
      .eq('status', 'paid')
      .gt('current_period_end', new Date().toISOString())
      .order('current_period_end', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (!purchase) return json({ restored: false });

    const { error: grantError } = await supabase.from('entitlements').upsert(
      {
        user_id: user.id,
        plan: purchase.plan,
        source: 'razorpay',
        expires_at: purchase.current_period_end,
        note: 'restored from web_subscriptions',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    );
    if (grantError) throw grantError;

    return json({ restored: true, plan: purchase.plan, expiresAt: purchase.current_period_end });
  } catch (e) {
    console.error(e);
    return json({ error: 'Could not restore access.' }, 500);
  }
});
