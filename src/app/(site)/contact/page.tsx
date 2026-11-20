import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage, PolicySection } from "@/components/site/policy-page";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = { title: "Contact & Support", description: `Contact SWECompanion at ${BUSINESS.supportEmail} for billing, account, technical and privacy support.`, alternates: { canonical: "/contact" } };

export default function Page() {
  return <PolicyPage title="Contact & Support" description="Help with your account, a purchase, the Mac app or a privacy request.">
    <PolicySection title="Email SWECompanion">
      <p><a className="break-all text-lg font-medium" href={`mailto:${BUSINESS.supportEmail}`}>{BUSINESS.supportEmail}</a></p>
      <p>SWECompanion is based in {BUSINESS.location}. Include your account email and a brief explanation. For billing questions, include the purchase date or invoice reference. Please do not send passwords, full card numbers or unnecessary sensitive screenshots.</p>
    </PolicySection>
    <PolicySection title="Manage billing">
      <p>Use <Link href="/account">Manage plan in your account</Link> to cancel future renewal or update payment details. If you are dissatisfied, contact us; refund requests are <Link href="/refund-policy">reviewed case by case</Link>.</p>
    </PolicySection>
    <PolicySection title="Policies">
      <p>Read our <Link href="/terms">Terms of Service</Link>, <Link href="/privacy">Privacy Policy</Link> and <Link href="/refund-policy">Refund Policy</Link>.</p>
    </PolicySection>
  </PolicyPage>;
}
