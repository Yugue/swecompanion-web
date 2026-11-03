# Setup (one-time, manual)

Steps only you can do (need your Firebase/GitHub account access):

1. **Enable sign-in providers.** Firebase console → `swecompanion` project → Authentication →
   Sign-in method → enable **Email/Password**, **Google**, and **GitHub**.
2. **GitHub OAuth App** (needed for the GitHub provider): create one at
   https://github.com/settings/developers with callback URL
   `https://swecompanion.firebaseapp.com/__/auth/handler`, then paste its Client ID/Secret into
   Firebase's GitHub provider settings.
3. **Provision Firestore** (Native mode) if the project doesn't have it yet: Firebase console →
   Firestore Database → Create database.
4. **Deploy Firestore rules**: from the repo root, `firebase login`, `firebase use swecompanion`,
   then `firebase deploy --only firestore:rules`.
ML domain quizzes need no account, membership, Firestore seed, or premium grant.
They are published directly from `scripts/quizzes.json` when the site is built.
The following legacy quiz setup applies only to any remaining database-backed content.

5. **Seed database-backed quizzes** (once, and again any time that content changes): from the repo root, run
   `npm run seed:quizzes`. This writes both questions and answers to Firestore - ML quiz pages already include their own public questions and answers and do not depend on this step. Needs Admin SDK
   credentials - either run it while `gcloud auth application-default login`'d against the
   project, or drop a service-account key at `scripts/serviceAccountKey.json` (gitignored, never
   commit it).
6. **Grant premium manually** (no payment flow yet): Firestore console → `users/{uid}` → set
   `premium` to `true`. This is the only way `premium` becomes true - the client can never set it.
7. **Deploy the site**: `npm run build`, then `firebase deploy --only hosting` (both from the
   repo root).

## Content review

`scripts/leetcodeQuizContent.mjs` has newly-authored mock-interview Q&A for the LeetCode guide -
please review it for accuracy/tone before treating it as final, since it's a claim of interview
realism made directly to users. The original ML banks were ported from the Flutter app; newer domain banks are
original practice content. See `docs/ml-quiz-coverage-audit.md` for the ML inventory,
new-question review scope, and validation commands. Run `npm run check:ml-quizzes -- --remote` with owner credentials to detect missing or outdated stored banks.
