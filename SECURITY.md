# Security Policy

## Reporting a vulnerability

Please report security issues privately. **Do not open a public GitHub issue.**

- Email: **security@<yourdomain>** <!-- TODO(owner): replace with a real, monitored address -->
- Or use GitHub's private vulnerability reporting ("Report a vulnerability" under the Security tab) if it is enabled for this repository.

Please include steps to reproduce, the affected URL or file, and the impact. We aim to acknowledge reports within 5 working days and to agree a disclosure date with you once a fix is available. Please don't access data that isn't yours, run denial-of-service tests, or test payments with real cards.

## Scope

- The web app (https://cognitive-psychiatric-tests.lovable.app) and the iOS/Android apps
- Supabase edge functions in `supabase/functions` and the database policies in `supabase/migrations`

Assessment results are stored on the user's device, not on our servers. Account email and billing records are stored in Supabase.

## Supported versions

Only the latest deployed version is supported.
