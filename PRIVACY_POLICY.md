# Privacy Policy - Cognito

**Effective Date:** April 25, 2026  
**Last Updated:** October 16, 2026

## 1. Introduction

Cognito ("Application", "we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains our practices regarding data collection, use, and protection.

## 2. What We Collect and What Stays on Your Device

**Stays on your device (never sent to our servers):**
- Assessment responses, scores and interpretations
- Any patient name or identifier you choose to type into a result
- Results history (stored in your browser/app storage, IndexedDB)

**Sent to service providers when you use account or billing features:**
- **Account email address** (and sign-in tokens) — processed by Supabase (authentication and our database) when you sign in, start a trial or restore a purchase
- **Subscription and payment records** (plan, amount, status, period end, Razorpay order/subscription/payment IDs, and your email) — stored in our Supabase database; card and bank details are entered on, and held by, Razorpay, never by us
- **App-store purchase status** — handled by Apple/Google (via the AppBuild.diy wrapper and RevenueCat) in the mobile apps

We do not use analytics or advertising trackers, and we do not send assessment or patient data to any third party, including AI/LLM providers.

## 3. Information Storage

### On-Device Storage
- Assessment results are stored only on your device and are not synchronized to cloud services
- They are not backed up by us: clearing browser/app data or uninstalling deletes them permanently. Export results you need to keep into your own clinical records
- On-device storage relies on your device/operating-system security; protect shared devices with a screen lock and a separate user profile

### Server-Side Storage
- Account and billing records (section 2) are stored in Supabase-hosted Postgres with access restricted per user (row-level security)

## 4. Third-Party Services

Cognito uses the following processors:
- **Supabase** — authentication, database and server functions (account email, billing records)
- **Razorpay** — web payment processing (payment details, email)
- **Apple App Store / Google Play, AppBuild.diy and RevenueCat** — in-app purchases in the mobile apps; the AppBuild.diy script is also loaded by the web app
- **Google Fonts** — web fonts (your browser requests font files from Google, which receives your IP address)
- **Hosting/CDN (Lovable, Cloudflare)** — serving the web app

Cognito does not use analytics platforms, crash-reporting services or social media integrations, and sends no assessment data to any third-party API.

## 5. Data You Control

As the sole user of this application:
- You retain complete ownership of any data entered
- You can delete on-device data at any time (Settings, or by clearing app/browser data)
- No backup of your assessment data exists on our servers
- We cannot access your device storage
- To delete your account email and billing records held on our servers, contact us (section 15); in-app "delete account" currently clears on-device data only

## 6. Professional Use

This application is designed for mental health professionals only. Clinicians are responsible for:
- Securing patient information under the laws that apply to them (e.g. India's Digital Personal Data Protection Act, 2023)
- Maintaining separate patient records
- Using the app within their professional protocols
- Deleting assessment data appropriately

## 7. No Patient Data Integration

This application:
- Does not interface with patient management systems
- Does not integrate with electronic health records (EHR)
- Does not export patient identifiable information
- Does not store long-term clinical records

**Clinicians are responsible for:**
- Recording assessment results in secure patient records
- Following institutional and legal data-protection requirements
- Maintaining data handling according to their organization

## 8. Security Measures

### Application Level
- Assessments are scored locally and work offline
- Internet is used only for sign-in, billing, fonts and app updates
- All network traffic uses HTTPS (TLS)

### Device Level
- Encryption at rest (device operating system)
- Secure memory handling
- No cache of sensitive information
- Automatic cleanup on app termination

## 9. Device Permissions

The application requests minimal permissions:
- **Storage:** To save local assessment data
- **Clipboard:** Optional, for data sharing
- **No access required for:** Camera, Microphone, Location, Contacts

## 10. Compliance

### Standards
Cognito does not claim HIPAA, GDPR, CCPA or other certification. Assessment data is processed on-device and is not transmitted to us; account email and billing records are processed as described above. Clinicians remain responsible for compliance with the data-protection laws that apply to their practice (in India, the Digital Personal Data Protection Act, 2023).

## 11. Children & Minors

This application is designed for professional healthcare use only and should not be used by minors without appropriate supervision. Parents/guardians are responsible for ensuring appropriate use by minors.

## 12. Data Retention

- **Assessment Data:** Retained on device until deleted by user
- **Account and billing records:** Retained on our servers while your account exists and as required for tax/accounting; deleted on request
- **Cache:** Automatically cleared periodically
- **Backups:** User is responsible for personal device backups

## 13. Your Rights

You have the right to:
- Access all data stored on your device
- Delete assessment data at any time
- Uninstall the application (removing all local data)
- Request clarification on data practices
- Export assessment data in commonly used formats

## 14. Changes to This Policy

We may update this Privacy Policy as the application evolves. Changes will be reflected in the "Last Updated" date above. Continued use implies acceptance of changes.

## 15. Contact Information

For privacy questions or concerns:

**Email:** privacy@psycognito.com  
**Mailing Address:**  
Cognito Privacy Team  
[Company Address]  

**Response Time:** Within 30 days of inquiry

## 16. Disclaimer

This Privacy Policy applies to the Cognito application specifically. Clinical information provided through assessment tools is subject to applicable healthcare privacy laws. Healthcare providers must comply with HIPAA, state privacy laws, and institutional policies.

## 17. Summary for Clinicians

As a professional user, you should know:

✅ **What we DON'T do:**
- Collect your information
- Collect patient information
- Store data on servers
- Transmit data externally
- Track your usage
- Require accounts

✅ **What you MUST do:**
- Maintain your own patient records
- Comply with HIPAA
- Follow institutional protocols
- Secure assessment results
- Delete data appropriately

---

**Version:** 2.0  
**Effective Date:** April 25, 2026  
**Status:** Current & Compliant
