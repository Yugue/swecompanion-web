# Firebase Hosting deployment

Production URL: https://swecompanion.web.app

Pushing a commit to `main` runs `.github/workflows/firebase-hosting.yml`: install the locked dependencies with Node.js 22, build the static `out/` directory, authenticate with a short-lived Google credential, and publish only Firebase Hosting to the live channel. A failed build does not replace the live release. The workflow can also be started manually from `main` in GitHub Actions. Deployment jobs are serialized.

Public `NEXT_PUBLIC_FIREBASE_*` build configuration and `NEXT_PUBLIC_SITE_URL` are GitHub repository variables. These browser-visible values are not Firebase administrative credentials. Production permissions remain enforced by Firebase Authentication and Firestore rules. This workflow does not publish Firestore rules or seed premium quizzes.

Deployment uses service account `web-hosting-deployer@swecompanion.iam.gserviceaccount.com`, with Hosting Admin and Service Usage Consumer roles. Workload Identity Federation accepts only repository ID `1358410667`, owner ID `20194490`, and `refs/heads/main` through the `web-hosting` pool. There is no service-account JSON key stored in GitHub.

View run status at https://github.com/Yugue/swecompanion-web/actions/workflows/firebase-hosting.yml and release history in the Firebase Hosting console. To roll back, restore a previous release there, or revert the relevant commit on `main` and let the workflow publish it.

For a local release, build a clean checkout of the intended commit with the same public environment configuration, then run `firebase deploy --only hosting --project swecompanion`. Do not publish an old `out/` directory from an unrelated workspace build.
