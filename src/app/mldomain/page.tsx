import { redirect } from "next/navigation";
import { DEFAULT_ML_DOMAIN_PATH } from "@/lib/mlDomains";

// The ML section has no page of its own: /mldomain always lands on the default domain's hub, so a
// domain is always selected. (Production also redirects this at the hosting layer - see
// firebase.json - this covers `next dev` and any host without those rules.)
export default function MlDomainRoot() {
  redirect(DEFAULT_ML_DOMAIN_PATH);
}
