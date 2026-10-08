-- Trial tier: one 3-day trial per account, recorded server-side.
--
-- A trial is a *reduced* tier, not full access. The server answers only
-- "is this account in a trial, and has it already had its one"; which
-- assessments a trial may see is presentation scope and lives in the app
-- (src/config/trialScope.ts), because it can change without changing access.

-- What tier is the caller on? 'none' | 'trial' | 'full'.
--
-- SECURITY INVOKER (the default) on purpose: the caller's own RLS policy
-- applies, so this can only ever see the caller's rows. When an account holds
-- both a trial and something better, full wins.
CREATE OR REPLACE FUNCTION public.entitlement_tier()
RETURNS text
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT COALESCE((
    SELECT CASE WHEN e.source = 'trial' THEN 'trial' ELSE 'full' END
    FROM public.entitlements e
    WHERE e.user_id = auth.uid()
      AND (e.expires_at IS NULL OR e.expires_at > now())
    -- false sorts before true, so a non-trial row is preferred.
    ORDER BY (e.source = 'trial') ASC
    LIMIT 1
  ), 'none');
$$;

-- Start the one trial this account is ever allowed.
--
-- SECURITY DEFINER, because there is deliberately no INSERT policy on
-- `entitlements`. This function is the single narrow exception to that, and it
-- can only ever write one row: a trial, for the caller, expiring three days
-- from the database clock, and only when the caller holds no entitlement row
-- at all. It cannot grant 'developer', cannot extend or replace an existing
-- row, and can never touch another user.
--
-- The expiry is computed with now() and never taken from the client, so
-- changing the device clock cannot lengthen a trial.
CREATE OR REPLACE FUNCTION public.start_trial()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  caller uuid := auth.uid();
BEGIN
  IF caller IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  -- One per account, ever. Any existing row — trial, paid or admin — blocks a
  -- second trial, which is what makes it one-per-account rather than
  -- one-per-clever-client.
  IF EXISTS (SELECT 1 FROM public.entitlements WHERE user_id = caller) THEN
    RETURN public.entitlement_tier();
  END IF;

  INSERT INTO public.entitlements (user_id, plan, source, expires_at, note)
  VALUES (caller, 'demo', 'trial', now() + interval '3 days', 'self-started 3-day trial');

  RETURN 'trial';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.entitlement_tier() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.entitlement_tier() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.start_trial() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.start_trial() TO authenticated;

-- ---------------------------------------------------------------------------
-- NOT YET WIRED. `entitlement_tier()` and `start_trial()` are additions only:
-- nothing in the app calls them until the enforcement commit lands. That commit
-- must not ship before this file is applied and email OTP is enabled, because
-- the gate it installs reads from here.
-- ---------------------------------------------------------------------------
