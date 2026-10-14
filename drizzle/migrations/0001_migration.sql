CREATE TABLE public.entitlements (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'developer' CHECK (plan IN ('developer', 'monthly', 'yearly', 'demo')),
  source TEXT NOT NULL DEFAULT 'admin' CHECK (source IN ('admin', 'razorpay', 'trial', 'demo')),
  expires_at TIMESTAMPTZ,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own entitlement" ON public.entitlements
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

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

REVOKE EXECUTE ON FUNCTION public.current_entitlement() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.current_entitlement() TO authenticated;

CREATE OR REPLACE FUNCTION public.has_premium()
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.current_entitlement());
$$;

REVOKE EXECUTE ON FUNCTION public.has_premium() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_premium() TO authenticated;

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