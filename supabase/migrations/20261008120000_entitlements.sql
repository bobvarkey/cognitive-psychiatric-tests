-- Per-user entitlement: the single source of truth for premium access.
--
-- Keyed to auth.users.id, never to an email address. An email is a public
-- string that proves nothing about who is asking; identity comes from a
-- verified Supabase session, and ownership of that identity is established by
-- an email one-time code before a session exists at all.
--
-- `expires_at IS NULL` means permanent (a developer/admin grant). Any non-null
-- value must still be in the future for access to be active, and the comparison
-- is made against the database clock, never the device clock.

CREATE TABLE public.entitlements (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'developer' CHECK (plan IN ('developer', 'monthly', 'yearly', 'demo')),
  source TEXT NOT NULL DEFAULT 'admin' CHECK (source IN ('admin', 'razorpay', 'trial', 'demo')),
  -- NULL = never expires. This is what a developer grant uses.
  expires_at TIMESTAMPTZ,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

-- Read your own row, and only your own row.
CREATE POLICY "Users read own entitlement" ON public.entitlements
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- There are deliberately NO insert, update or delete policies on this table.
-- RLS with no write policy means every browser write is rejected; rows are
-- created and revoked only by the service role, which bypasses RLS. That is the
-- entire point: no browser client may write entitlements.

-- The access decision, made by the backend.
--
-- SECURITY INVOKER (the default) on purpose: the caller's own RLS policy applies,
-- so this can only ever see the caller's row. `now()` is the database clock.
CREATE OR REPLACE FUNCTION public.has_premium()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.entitlements
    WHERE user_id = auth.uid()
      AND (expires_at IS NULL OR expires_at > now())
  );
$$;

-- Anonymous callers cannot ask; signed-in callers can.
REVOKE EXECUTE ON FUNCTION public.has_premium() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_premium() TO authenticated;

-- ---------------------------------------------------------------------------
-- Developer access is an admin-only grant on one exact auth user id. It is not
-- created by this migration and must never be created from the browser. Run it
-- once, in the Supabase SQL editor, with the id from Authentication -> Users:
--
--   INSERT INTO public.entitlements (user_id, plan, source, expires_at, note)
--   VALUES ('<your-auth-user-uuid>', 'developer', 'admin', NULL, 'owner')
--   ON CONFLICT (user_id) DO UPDATE
--     SET plan = 'developer', source = 'admin', expires_at = NULL;
--
-- `expires_at = NULL` is what makes it permanent, and because no webhook and no
-- failed charge ever writes this table, that row survives both.
-- ---------------------------------------------------------------------------
