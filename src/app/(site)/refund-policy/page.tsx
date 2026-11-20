import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage, PolicySection } from "@/components/site/policy-page";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = { title: "Refund Policy", description: BUSINESS.refundSummary, alternates: { canonical: "/refund-policy" } };

export default function Page() {
  return <PolicyPage title="Refund Policy" description="If you’re dissatisfied with SWECompanion, contact us so we can review your concern.">
    <PolicySection title="Request a review">
      <p>Email <a href={`mailto:${BUSINESS.supportEmail}`}>{BUSINESS.supportEmail}</a> with your account email, purchase date or invoice reference, and the reason you are dissatisfied. We review refund requests case by case. Contacting us does not guarantee that a refund will be approved.</p>
    </PolicySection>
    <PolicySection title="Cancellation and your rights">
      <p>A refund request does not itself cancel automatic renewal. To stop future renewal, open <Link href="/account">Manage plan in your account</Link>. Cancellation keeps access through the paid period.</p>
      <p>This policy does not limit any refund, cancellation right or other remedy required by applicable law. See our <Link href="/terms">Terms of Service</Link> for the subscription and usage terms.</p>
    </PolicySection>
  </PolicyPage>;
}
