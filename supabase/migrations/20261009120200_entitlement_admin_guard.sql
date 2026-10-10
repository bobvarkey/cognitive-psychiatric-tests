-- Billing must never overwrite a developer grant.
--
-- The standing order requires that "webhooks and failed charges must not remove
-- it". The spec expresses that as `WHERE public.entitlements.source <> 'admin'`
-- inside the webhook's upsert — but the webhook writes through PostgREST, whose
-- upsert has no conditional-update form, so there is no place for that clause on
-- the function side.
--
-- A BEFORE trigger puts the rule in the database instead, which is stronger: it
-- binds every writer — the webhook, billing-restore, and the operator's backfill
-- — rather than only the one that remembered to include the clause.
--
-- It discards silently rather than raising. Raising would surface as a 500 from
-- the webhook, and a webhook is auto-disabled after 24 hours of non-2xx.

CREATE OR REPLACE FUNCTION public.protect_admin_entitlement()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  existing_source text;
BEGIN
  -- Only a write that would replace an existing admin row is of interest.
  -- A brand-new row, or a row that is not the caller's business, passes.
  IF TG_OP <> 'UPDATE' THEN
    RETURN NEW;
  END IF;

  SELECT e.source INTO existing_source
  FROM public.entitlements e
  WHERE e.user_id = NEW.user_id;

  IF existing_source = 'admin' THEN
    -- Leave the row exactly as it is.
    RETURN OLD;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER entitlements_protect_admin
  BEFORE UPDATE ON public.entitlements
  FOR EACH ROW EXECUTE FUNCTION public.protect_admin_entitlement();

-- An upsert that hits an existing row is an UPDATE, so the trigger covers it.
-- An insert of a user who already holds an admin row cannot happen: the primary
-- key is user_id, so it conflicts and takes the UPDATE path.
