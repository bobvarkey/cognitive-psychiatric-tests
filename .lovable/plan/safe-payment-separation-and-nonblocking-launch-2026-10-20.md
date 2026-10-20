# Safe payment separation and nonblocking launch

## Audit results
- **FAIL — launch access:** a fresh desktop launch displays an unclosable paywall instead of the assessments. Confirmed in the running preview; no page errors occurred.
- **PASS — diagnostic removal:** AccessDiagnostic is not rendered by AuthGuard or PaywallModal.
- **PASS — existing iOS protection:** iOS device detection and native host detection select store billing; the wrapper readiness timeout is already 10 seconds.
- **PASS — requested INR display prices:** the checked-in web prices are already ₹299 monthly and ₹2,999 yearly. The live server catalogue has not been verified during this audit.
- **WARNING — payment security:** a Checkout callback and an editable browser record cannot prove payment or securely grant premium. The requested client-only paid unlock will not be implemented.
- **WARNING — product identifiers:** `monthly_pro` and `yearly_pro` in the upload differ from earlier store instructions. Their existence in the store and RevenueCat offering has not been verified.
- **WARNING — legacy access:** SubscriptionContext also considers a legacy locally stored subscription when deriving premium. Its trust boundary needs focused review before changing payment grants.
- **UNKNOWN — real purchases:** Apple/Google device purchase and restore behavior has not been tested.

## Proposed result
Doctors can open the app and browse clinical tests immediately, without an access spinner, diagnostic banner, or automatic blocking paywall. Upgrade opens a closable paywall on demand. iOS continues to use Apple purchases through RevenueCat only; failed or slow store initialization never prevents browsing. Clinical assessments, scoring, exports, patient storage, and existing routes remain unchanged.

Web payments continue through Razorpay with trusted verification before premium is activated. Do not replace subscription checkout with a browser-only one-time charge or trust localStorage as proof of payment. The project already has Lovable Cloud; it needs no new external backend account.

## Proposed file changes after approval
| File | Change and reason | Protection and verification |
| --- | --- | --- |
| `src/components/AuthGuard.tsx` | Remove launch blocking and deep-link rewriting; always render children and retain the on-demand, closable PaywallModal. | Preserve routes and subscription state; test anonymous browsing during access checks and after denial. |
| `src/components/AuthGuard.test.tsx` | Replace launch-blocking expectations with immediate browsing and on-demand paywall behavior. | Assert browsing does not grant premium, routes stay unchanged, and closing clears paywall state. |
| `src/components/PaywallModal.tsx` | Keep store-only iOS presentation; skip the web catalogue request in store mode; retain dismissal while the store is unavailable. | Keep native prices sourced from RevenueCat, disclosures, restore, and verified web checkout unchanged. |
| `src/components/PaywallModal.native.test.tsx` | Cover closable unavailable-store state and absence of web checkout/catalogue requests on iOS. | Exercise loading, missing packages, and restore without making a real purchase. |
| `AGENTS.md` | Record that launch access is nonblocking and paid status still requires a trusted source. | Document the architecture without altering clinical code. |

No changes are proposed to `src/lib/billing.ts`, store keys, product IDs, payment functions, or patient data in this first implementation. The uploaded public Razorpay Key ID will not replace the server-returned checkout key without validating its pairing with the existing server credentials. No packages, deployment, or live payments are required.

## Owner decisions and follow-up
1. Approve the safe scope above rather than the uploaded browser-only premium grant.
2. Confirm whether `monthly_pro` and `yearly_pro` are actual existing store products before a separate product-mapping change. Until confirmed, retain the existing offering/package mapping.
3. A full payment-security review of legacy locally stored access can be planned separately; do not silently change existing entitlements in this launch fix.

## Validation
Run the affected access and native-paywall tests plus existing checkout/restore tests. Check fresh desktop and iOS-browser launches, browse an assessment, open and dismiss Upgrade, and confirm iOS never loads Razorpay. Check preview errors after edits. Real store transactions and live Razorpay payment verification remain device/provider checks, not simulated proof.

## Approval boundary
The read-only audit is complete. Application files remain unchanged. Approval authorizes only the listed safe implementation, not client-only payment grants, store product creation, publication, or production-data changes.