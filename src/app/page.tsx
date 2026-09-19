import { redirect } from "next/navigation";
import { CODING_PATH } from "@/lib/codingPaths";

// The site has no landing page of its own: the root always lands on the coding guide. (Production
// also redirects this at the hosting layer - see firebase.json - this covers `next dev` and any
// host without those rules.)
export default function Root() {
  redirect(CODING_PATH);
}
