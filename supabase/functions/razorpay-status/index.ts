import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

// Returns the caller's own website subscription status.
// The email is taken ONLY from the verified Supabase session (JWT in the
// Authorization header, obtained via the one-time email code). Any email in
// the request body is ignored, so this cannot be used to look up or unlock
// someone else's purchase, or to probe whether an email has paid.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const match = /^Bearer\s+(\S+)$/i.exec(req.headers.get('Authorization') ?? '');
    const token = match?.[1];
    if (!token) return json({ error: 'Sign-in required.' }, 401);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    // Validates the JWT with Supabase Auth (signature, expiry, user exists).
    // The anon/publishable key is not a user token and fails here.
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    const user = userData?.user;
    const email = user?.email?.trim().toLowerCase() ?? '';
    if (userError || !user || !email || !user.email_confirmed_at) {
      return json({ error: 'Sign-in required.' }, 401);
    }

    const { data } = await supabase
      .from('web_subscriptions')
      .select('plan, current_period_end')
      .eq('email', email)
      .eq('status', 'paid')
      .gt('current_period_end', new Date().toISOString())
      .order('current_period_end', { ascending: false })
      .limit(1)
      .maybeSingle();

    return json({
      active: !!data,
      email,
      plan: data?.plan ?? null,
      currentPeriodEnd: data?.current_period_end ?? null,
    });
  } catch (e) {
    console.error(e);
    return json({ error: 'Unexpected error.' }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
