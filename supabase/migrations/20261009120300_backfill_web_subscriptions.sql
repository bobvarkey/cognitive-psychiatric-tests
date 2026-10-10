-- Carry the buyers who paid under the retired one-time-order path into the new
-- one. Two writes per buyer: an `entitlements` row, which is what actually
-- grants access, and a `subscriptions` row, so the account page has a plan,
-- an amount and a date to show.
--
-- The join is on lower(email) against auth.users, because web_subscriptions
-- recorded an email and an entitlement is keyed to a user id. A buyer with no
-- auth account is skipped: there is nowhere to hang their grant, and inventing
-- a user is not this migration's business.
--
-- Neither table is mutated, so re-running this is safe: the entitlements upsert
-- conflicts on user_id, and the subscriptions insert is guarded by the unique
-- razorpay_subscription_id.

-- 1. Grants.
INSERT INTO public.entitlements (user_id, plan, source, expires_at, note)
SELECT *
FROM (
  -- One row per buyer. `web_subscriptions.email` is not unique, so two paid rows
  -- can map to the same user id; without this the upsert below would address the
  -- same `user_id` twice and Postgres would abort the whole statement with
  -- SQLSTATE 21000, granting nobody. The latest period end wins.
  SELECT DISTINCT ON (u.id)
    u.id,
    ws.plan,                  -- already 'monthly' | 'yearly', per its own CHECK
    'razorpay',
    ws.current_period_end,
    'backfilled from web_subscriptions'
  FROM public.web_subscriptions ws
  JOIN auth.users u ON lower(u.email) = lower(ws.email)
  WHERE ws.status = 'paid'
    -- A NULL period end cannot be shown as a renewal date and cannot be relied on
    -- as access, so those buyers are left for a human rather than granted a
    -- placeholder. Check the count of them after running this.
    AND ws.current_period_end IS NOT NULL
    AND ws.current_period_end > now()
  ORDER BY u.id, ws.current_period_end DESC
) AS latest_grant
ON CONFLICT (user_id) DO UPDATE
  SET plan = EXCLUDED.plan,
      source = EXCLUDED.source,
      expires_at = EXCLUDED.expires_at,
      note = EXCLUDED.note,
      updated_at = now()
  -- Never overwrite an admin grant (the BEFORE UPDATE trigger from
  -- 20261009120200 enforces this too), and never move a buyer's expiry
  -- backwards: a legacy row with an older period end must not shorten a later
  -- razorpay/trial/demo grant. A permanent (NULL) non-admin grant is left alone.
  WHERE public.entitlements.source <> 'admin'
    AND public.entitlements.expires_at IS NOT NULL
    AND public.entitlements.expires_at < EXCLUDED.expires_at;

-- 2. Subscription rows, so the account page has something to render. These
--    carry no Razorpay id of their own -- the old path used orders, not
--    subscriptions -- so the legacy order id is used as the unique key. It can
--    never collide with a real `sub_...` id.
--
--    `created_at` carries `ws.created_at`, not the default: a row stamped with
--    the time the migration is run would look newer than the buyer's real
--    subscription, and the account page reads newest-first, so it would shadow
--    the real one the moment they buy again.
INSERT INTO public.subscriptions
  (user_id, razorpay_subscription_id, plan, currency, amount, status, current_period_end, created_at)
SELECT
  u.id,
  'legacy_order_' || ws.order_id,
  ws.plan,
  -- `subscriptions.currency` has a CHECK for exactly these two values, while
  -- `web_subscriptions.currency` is free text. An unrecognised currency would
  -- abort the whole migration, so it is mapped rather than passed through: a
  -- row whose currency is wrong is better than no backfill at all, and the
  -- amount stays the amount that was actually charged.
  CASE WHEN ws.currency IN ('INR', 'USD') THEN ws.currency ELSE 'INR' END,
  ws.amount,
  'active',
  ws.current_period_end,
  ws.created_at
FROM public.web_subscriptions ws
JOIN auth.users u ON lower(u.email) = lower(ws.email)
WHERE ws.status = 'paid'
  AND ws.current_period_end IS NOT NULL
  AND ws.current_period_end > now()
  AND NOT EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.razorpay_subscription_id = 'legacy_order_' || ws.order_id
  );

-- Note: a backfilled `subscriptions` row is display data only. Nothing here
-- writes an entitlement that the first statement did not already write, and no
-- webhook will ever update these rows -- their ids do not exist at Razorpay.
-- `checkout_verified_at` is deliberately left NULL: no checkout signature was
-- ever verified for these, and claiming one was would be a fabrication.
