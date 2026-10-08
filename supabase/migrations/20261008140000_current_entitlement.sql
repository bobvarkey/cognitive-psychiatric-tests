-- The caller's active grant, in full, and the two functions derived from it.
--
-- Adds no table and no policy: it only reads what `20261008120000` created. Run
-- after `20261008120000` and `20261008130000`.

-- The caller's active grant.
--
-- SECURITY INVOKER (the default) on purpose: the caller's own RLS read policy
-- applies, so this can only ever see the caller's own row. `now()` is the
-- database clock, never the device clock.
--
-- A table-returning function is used rather than a boolean because the client
-- needs `source` to apply the native suppression rule, and answering both
-- questions in one call keeps it to a single round trip.
CREATE OR REPLACE FUNCTION public.current_entitlement()
RETURNS TABLE (plan text, source text, expires_at timestamptz, permanent boolean)
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT e.plan, e.source, e.expires_at, (e.expires_at IS NULL)
  FROM public.entitlements e
  WHERE e.user_id = auth.uid()
    AND (e.expires_at IS NULL OR e.expires_at > now())
  LIMIT 1;
$$;

-- Anonymous callers cannot ask; signed-in callers can.
REVOKE EXECUTE ON FUNCTION public.current_entitlement() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_entitlement() TO authenticated;

-- "Does the caller hold any active grant." Now a thin wrapper, so the access
-- rule lives in exactly one place. Signature and meaning are unchanged.
CREATE OR REPLACE FUNCTION public.has_premium()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.current_entitlement());
$$;

-- Kept verbatim: anonymous callers cannot ask; signed-in callers can.
REVOKE EXECUTE ON FUNCTION public.has_premium() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_premium() TO authenticated;

-- The tier, as `start_trial()` expects to return it. Rewritten from
-- `20261008130000` to delegate, so there is one rule rather than two.
CREATE OR REPLACE FUNCTION public.entitlement_tier()
RETURNS text
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT COALESCE((
    SELECT CASE WHEN e.source = 'trial' THEN 'trial' ELSE 'full' END
    FROM public.current_entitlement() e
  ), 'none');
$$;

REVOKE EXECUTE ON FUNCTION public.entitlement_tier() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.entitlement_tier() TO authenticated;
