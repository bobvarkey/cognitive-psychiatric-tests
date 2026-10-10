-- Billing bookkeeping for Razorpay Subscriptions, and the webhook dedupe log.
--
-- Deliberately NOT the access rule. `current_period_end` records what Razorpay
-- said; `entitlements.expires_at` is what grants access (20261008120000). One
-- writer per rule is what keeps both checkable — a bookkeeping bug here cannot
-- by itself hand out premium.

CREATE TABLE public.subscriptions (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  razorpay_subscription_id TEXT NOT NULL UNIQUE,
  plan                     TEXT NOT NULL CHECK (plan IN ('monthly','yearly')),
  currency                 TEXT NOT NULL CHECK (currency IN ('INR','USD')),
  amount                   INTEGER NOT NULL,
  status                   TEXT NOT NULL DEFAULT 'created'
    CHECK (status IN ('created','active','cancelled','halted','completed')),
  current_period_end       TIMESTAMPTZ,
  -- Set by billing-verify-checkout. Records that a signed checkout callback was
  -- seen; it grants nothing on its own.
  checkout_verified_at     TIMESTAMPTZ,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX subscriptions_user_idx ON public.subscriptions (user_id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Read your own rows, and only your own. There is deliberately no write policy:
-- rows are written only by the functions, under the service role.
CREATE POLICY "a user reads only their own subscriptions"
  ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

GRANT SELECT ON public.subscriptions TO authenticated;

-- The webhook dedupe log. `id` is Razorpay's X-Razorpay-Event-Id, or a digest of
-- the raw body when that header is absent, so a missing header cannot defeat
-- deduplication.
--
-- Written AFTER the event is processed, never before: recording first would
-- swallow a retry, because the retry would see a duplicate and return 200 while
-- the grant was never written.
CREATE TABLE public.webhook_events (
  id          TEXT PRIMARY KEY,
  event_type  TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
-- No policies at all, and no grants to anon or authenticated: this is not a
-- user-facing table. Service-role access only.
