# Porikkhon

A Bangladesh-focused exam practice platform built with Next.js, Supabase Auth and PostgreSQL, Gemini question generation with OpenRouter failover, and Vercel hosting.

## Features

- Thirteen learning modules across admission, BCS and jobs, SSC and HSC, and computing and reasoning skills.
- Module-specific topics, question counts, difficulty and language. Structured generation, a separate review pass, duplicate checks, language checks, and controlled topic allocation.
- Timed saved attempts with database-owned deadlines, grading, negative marking, review flags and explanations.
- Saved activity and progress, bookmarks, a study planner, opt-in daily sprint rankings, and teacher classrooms with join codes, question banks, assigned tests and results.
- Supabase email/password accounts, confirmation and recovery routes, and Google Authenticator-compatible TOTP enrollment and challenges. Enrolled accounts must complete AAL2 before accessing private data.
- Word and CSV answer reviews. Word exports embed an open-licensed Bengali font when required.
- Hosted SSLCOMMERZ checkout scaffolding, fixed server pricing, verified callbacks, and server-controlled prepaid Plus entitlements. Billing is disabled until all merchant and privileged server credentials are configured.

## Local setup

Use Node.js 24 and npm. Run `npm ci`, copy `.env.example` to `.env.local`, and configure the real Supabase project URL and publishable key. API keys belong only in `.env.local` or encrypted hosting variables. Never place them in `NEXT_PUBLIC_` variables, source, or client code. Empty optional model variables use the tested defaults.

Live deployment: https://porikkhon-two.vercel.app/ . Private source: https://github.com/shohidul-code/porikkhon . The app is linked to Vercel project `porikkhon` and Supabase project `jwuwwgkvjzbzqrezpyko`. Account linkage is local configuration and is excluded from Git. The original private Sites deployment remains separate and is preserved as the earlier version; its ChatGPT identity records are not silently assigned to new Supabase accounts.

`supabase/schema.sql` and the matching baseline migration define the database. Apply only to the intended project. Private tables deny direct client access. The public RPC wrappers call private, explicitly scoped business functions, which validate `auth.uid()` and the authenticator assurance level. Supabase's secret/service-role key must never reach a browser.

Run `npm run dev`, `npm run typecheck`, `npm test`, and `npm run build`. The automated database tests use an isolated local PostgreSQL engine with synthetic fixtures; they do not create administrator endpoints or production authentication users. Live generation checks are opt-in: `node --conditions=react-server --import ./scripts/node-ts-loader.mjs scripts/check-generators.mjs`. These consume provider quota. Set `GENERATION_MODULES` to a comma-separated list to narrow a recheck.

## Auth configuration required before public sign-up

In Supabase Authentication settings:

1. Set Site URL to the actual HTTPS production origin.
2. Allow the production `/auth/callback` URL and the intended development callback URL. Avoid broad production redirect wildcards.
3. Connect a production SMTP sender and verify its sending domain. Supabase's default sender only serves authorized project-team addresses; it is not public production email delivery.
4. Keep email confirmation enabled, set a strong password policy of at least 12 characters, retain secure email-change checks and sensible authentication rate limits, and enable TOTP enrollment and verification.
5. Check the confirmation and recovery email templates. The `/auth/confirm` route accepts token hashes; the `/auth/callback` route accepts PKCE codes. A recovery callback must retain `next=reset`.
6. Verify sign-up, email confirmation, login, password reset, authenticator enrollment, wrong-code rejection, sign-out and sign-in with a fresh authenticator challenge using a real authorized account.

The application has no access to your mail-provider credentials or personal authenticator. These operational checks are required; local SQL access-control tests do not claim to verify email delivery or your personal TOTP device.

## Generation and cost controls

Gemini is the primary provider. OpenRouter is the fallback and uses the tested free model by default. Free provider quotas and availability still apply. The application reserves generation requests atomically: 5 daily requests per free account, 20 for verified Plus, and 200 across the site. Failed requests count toward the quota to prevent quota-reset abuse. The database also rate-limits writes. Provider errors are logged as status and stage without credentials or request headers. Only curriculum settings and draft questions are sent to providers, not learner emails or private results.

Questions are AI-generated practice material, not official past questions. Automated checks and a review pass reduce errors but are not expert content certification. Learners can report issues from a submitted review. The original 60-question starter bank remains available without AI access.

## Payments and domain

Proposed launch prices are BDT 199 for 30 days and BDT 1,799 for 365 days; no automatic renewal. Live payment activation requires `BILLING_ENABLED=true`, merchant ID/password, `SSLCOMMERZ_MODE`, `PUBLIC_APP_URL`, and a server-only Supabase service-role key. Sandbox validation must cover success, failure, cancellation, exact amount/currency, risk review and duplicate callbacks before live use. No live charge was performed.

Connecting `porikkhon.com` requires the DNS and ownership records returned by Vercel. Earlier Sites DNS instructions must not be used for a Vercel deployment. Establish real support, billing terms, refund handling, data-retention and incident-response processes before commercial launch; these have not been invented in the UI.

## Security and validation

Strict nonce-based CSP, secure session cookies on HTTPS, same-origin JSON mutations, no-store private responses, input constraints, database-owned grading and deadlines, account and classroom checks, denied direct table access, payment verification, and CSV formula protection are implemented. The framework and schema validator were patched after dependency audit findings. Exact production dependency versions and the lockfile are committed.

See `VALIDATION.md` for the checks and their limits. No independent penetration-test certification is claimed.

## Current custom domain records

Vercel returned these records for `porikkhon.com` on 24 October 2026. At the current DNS provider, replace the existing apex parking A record with `@ A 76.76.21.21`, and add `_vercel TXT vc-domain-verify=porikkhon.com,5c2b56b78b6efa5241fe`. Preserve mail and unrelated records. Domain ownership is still pending; no DNS records were changed automatically.
