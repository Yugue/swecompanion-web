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
5. **Seed quizzes** (once, and again any time quiz content changes): from the repo root, run
   `npm run seed:quizzes`. This writes both questions and answers to Firestore - neither ships in
   the static site, so nothing about a quiz is visible until this has run. Needs Admin SDK
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
realism made directly to users. The ML quiz content was ported unchanged from the Flutter app.
