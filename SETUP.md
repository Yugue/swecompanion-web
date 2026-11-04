# Setup (one-time, manual)

Steps only you can do (need your Firebase/GitHub account access):

1. **Enable sign-in providers.** Firebase console → `swecompanion` project → Authentication →
   Sign-in method → enable only **Email/Password** and **Google**.
2. **Configure sandbox billing**: follow [Authentication and billing](docs/auth-billing.md)
   for shared prices, sandbox catalog, server secrets, and the webhook.
3. **Provision Firestore** (Native mode) if the project doesn't have it yet: Firebase console →
   Firestore Database → Create database.
4. **Deploy Firestore rules**: from the repo root, `firebase login`, `firebase use swecompanion`,
   then `firebase deploy --only firestore:rules`.

Quiz content ships with the static website. There is no quiz collection or seeding step.

5. **Verify subscription access**: complete a sandbox checkout. The billing functions set
   the `subscribed` custom claim and refresh the website session. The old profile `premium`
   field is no longer used for access.
6. **Deploy the site**: `npm run build`, then `firebase deploy --only hosting` (both from the
   repo root).

## Content review

`scripts/leetcodeQuizContent.mjs` has newly-authored mock-interview Q&A for the LeetCode guide -
please review it for accuracy/tone before treating it as final, since it's a claim of interview
realism made directly to users. The original ML banks were ported from the Flutter app; newer domain banks are
original practice content. See `docs/ml-quiz-coverage-audit.md` for the ML inventory,
new-question review scope, and validation commands. Run `npm run check:ml-quizzes` to validate the static ML banks; after building, add `-- --export` to check their exported pages.
