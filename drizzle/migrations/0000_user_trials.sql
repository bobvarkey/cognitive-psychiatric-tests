CREATE TABLE public.user_trials (
  user_id UUID PRIMARY KEY,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ends_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '3 days')
);
GRANT SELECT ON public.user_trials TO authenticated;
GRANT ALL ON public.user_trials TO service_role;
ALTER TABLE public.user_trials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own trial" ON public.user_trials FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Starts the one-time trial; never resets an existing one.
CREATE OR REPLACE FUNCTION public.start_trial()
RETURNS public.user_trials
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE r public.user_trials;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Not signed in'; END IF;
  INSERT INTO public.user_trials(user_id) VALUES (auth.uid()) ON CONFLICT (user_id) DO NOTHING;
  SELECT * INTO r FROM public.user_trials WHERE user_id = auth.uid();
  RETURN r;
END $$;
REVOKE EXECUTE ON FUNCTION public.start_trial() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.start_trial() TO authenticated;