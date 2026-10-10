-- The server-owned plan catalogue: the single source of truth for price,
-- currency, interval and the Razorpay plan id.
--
-- This is a table rather than a constant inside the edge function because
-- Razorpay plan ids are created outside this repo and change when a price
-- changes. Here the operator updates a price with one UPDATE, without a
-- redeploy — and the client still cannot influence it, because there is
-- deliberately no write policy below and every client write is rejected.

CREATE TABLE public.billing_plans (
  code             TEXT NOT NULL CHECK (code IN ('monthly','yearly')),
  currency         TEXT NOT NULL CHECK (currency IN ('INR','USD')),
  -- Minor units: paise for INR, cents for USD. Razorpay reports amounts this
  -- way, so storing anything else invites a factor-of-100 bug at the boundary.
  amount           INTEGER NOT NULL CHECK (amount > 0),
  interval_unit    TEXT NOT NULL CHECK (interval_unit IN ('month','year')),
  -- Razorpay requires a finite number of billing cycles. 120 monthly cycles is
  -- about 10 years and 10 yearly cycles is 10 years, so "renews unless
  -- cancelled" holds for any realistic subscription.
  total_count      INTEGER NOT NULL CHECK (total_count > 0),
  razorpay_plan_id TEXT NOT NULL,
  label            TEXT NOT NULL,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (code, currency)
);

ALTER TABLE public.billing_plans ENABLE ROW LEVEL SECURITY;

-- Prices are public information: anyone may read the catalogue to see a price.
CREATE POLICY "billing_plans are readable by anyone"
  ON public.billing_plans FOR SELECT USING (true);

GRANT SELECT ON public.billing_plans TO anon, authenticated;
-- There is deliberately NO insert, update or delete policy, and no write grant.
-- Only the service role, which bypasses RLS, may change the catalogue.

-- Seed the four rows. The `razorpay_plan_id` values are placeholders: the
-- operator replaces them with the real plan ids in Operator step 2. They are
-- non-empty on purpose, so a function that reads this table and forgets to
-- check for a real id still fails loudly at Razorpay rather than silently
-- creating a subscription against nothing.
INSERT INTO public.billing_plans
  (code, currency, amount, interval_unit, total_count, razorpay_plan_id, label)
VALUES
  ('monthly', 'INR',  29900, 'month', 120, 'REPLACE_ME_INR_MONTHLY', 'PsyCognito Premium — Monthly'),
  ('yearly',  'INR', 299900, 'year',   10, 'REPLACE_ME_INR_YEARLY',  'PsyCognito Premium — Yearly'),
  ('monthly', 'USD',    299, 'month', 120, 'REPLACE_ME_USD_MONTHLY', 'PsyCognito Premium — Monthly'),
  ('yearly',  'USD',   2499, 'year',   10, 'REPLACE_ME_USD_YEARLY',  'PsyCognito Premium — Yearly');

-- `updated_at` should follow the row. A trigger rather than an application
-- concern, because the only writer is a hand-run SQL statement or the
-- operator's UPDATE, and neither should have to remember.
CREATE OR REPLACE FUNCTION public.touch_billing_plans()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER billing_plans_touch
  BEFORE UPDATE ON public.billing_plans
  FOR EACH ROW EXECUTE FUNCTION public.touch_billing_plans();
