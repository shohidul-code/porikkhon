# Validation record

Validation performed on 24 October 2026.

- Fifty-one automated checks passed, including the original grading/payment rules, all thirteen module rule sets, and an isolated PostgreSQL workflow covering saved settings, planner changes, private attempts, server grading, immutable submissions, activity aggregation, bookmarks, question reports, classroom membership and results, generation quotas, fixed payment prices, denied direct table access, and AAL2 enforcement for enrolled users.
- Live question generation was exercised across all thirteen modules. Gemini failures triggered OpenRouter failover. Content inspection found errors in Bangla generation, leading to stricter language and topic guards, topic-specific reference anchors, and a separate structured review pass. The final opt-in run could not generate any module: Gemini returned 429/503 and the free OpenRouter endpoint returned 429. Earlier successful shape checks do not certify factual correctness or current provider availability. New API quota or a funded compatible backup model is required before calling fresh generation launch-ready.
- The Word export was rendered and visually inspected on both pages of a mixed English/Bangla sample. Missing Bangla glyphs were fixed by embedding licensed Noto Sans Bengali regular and bold fonts. Questions, selected answers, correct answers, scores and explanations were present.
- TypeScript and production build checks passed. A patched production dependency audit reported zero known vulnerabilities. Supabase's security advisor reported no findings after private tables were given explicit deny policies. The deployed private function body was compared with the local source hash, and the live database contained the rate-limit table and fourteen deny policies.
- Browser checks completed for course/module selection, topic and count controls, sign-in gates, registration fields, anonymous practice, answer selection, flags, navigation, server submission and review. A development-proxy origin error was reproduced and fixed without changing production checks. The activity component was checked with explicitly synthetic props in 7-day and 30-day views; database aggregation was tested independently in isolated PostgreSQL. Mobile and tablet course views had no horizontal overflow. Temporary QA pages were removed before deployment. Browser download-event verification timed out in the cloud browser. The deployed Word endpoint was then tested directly: it returned HTTP 200, the correct Word content type, a valid ZIP document containing questions and explanations, and embedded Bengali fonts.

## Verification limits

Public email sign-up, confirmation and password-reset delivery require a configured SMTP sender, correct Supabase callback URLs and a real authorized account. Personal Google Authenticator enrollment and login cannot be represented as live-verified by local SQL tests. No real payment was taken; merchant credentials are missing and billing remains disabled.

Automatic approval review rejected a temporary administrator fixture function because it would create persistent privileged account-management access. It was not deployed. The test suite uses a safer isolated local database instead. No production authentication users were created or deleted by the tests.

The user selected the signed-in account shohidul-code. The private repository https://github.com/shohidul-code/porikkhon was created and all source folders were committed through the authenticated browser. The GitHub connector belongs to another account and cannot access this private repository. Browser archive download-event verification timed out; each source upload and resulting commit was verified in the repository UI.

## Production deployment

Vercel production alias: https://porikkhon-two.vercel.app/ . The production build reached READY. HTTP checks passed for Supabase health, anonymous bootstrap, correct and incorrect answer grading, anonymous private-action rejection, cross-origin rejection, Word download including Bengali fonts, and rejection of disabled payment notifications. A payment browser callback deliberately redirects to a pending result; following that redirect returns a page with HTTP 200 and is not payment confirmation.

The Vercel connector accepted direct project-scoped operations. An explicit team-scoped read returned 403; no project protection was weakened. A helper that might mint a temporary bypass link was rejected by automatic approval review and was not used. Normal public HTTPS requests verified the deployed site.
