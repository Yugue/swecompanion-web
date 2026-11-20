import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage, PolicySection } from "@/components/site/policy-page";
import { BUSINESS } from "@/lib/business";
import { PRICING, formatPrice } from "@shared/pricing";

export const metadata: Metadata = { title: "Terms of Service", description: "SWECompanion terms for accounts, paid plans, renewal, refunds, acceptable use and liability.", alternates: { canonical: "/terms" } };

export default function Page() {
  return <PolicyPage title="Terms of Service" description="Clear terms for using SWECompanion’s website, learning materials and macOS app.">
    <PolicySection title="1. Our agreement">
      <p>These Terms are between you and SWECompanion, based in {BUSINESS.location}. By using our service, you agree to these Terms. You must be legally able to enter this agreement; if you act for an organization, you must have its authority. Our <Link href="/privacy">Privacy Policy</Link> explains our data handling.</p>
    </PolicySection>
    <PolicySection title="2. Accounts and permitted use">
      <p>Keep your account details accurate and your credentials secure. Use the service only lawfully and in accordance with applicable interview, assessment, employer and platform rules. Capture or submit only content you have permission to use. Do not upload confidential information or another person’s personal data without appropriate authorization.</p>
      <p>Do not share or resell account access, bypass payment or usage controls, compromise security, or infringe others’ rights. We may restrict access reasonably necessary to address misuse, nonpayment, security risks or legal requirements.</p>
    </PolicySection>
    <PolicySection title="3. Paid plans, renewal and usage">
      <p>Checkout shows your price, currency, billing interval and applicable taxes before purchase. The current monthly plan is {formatPrice(PRICING.monthly.amount)} USD per month. The introductory purchase is {formatPrice(PRICING.threeMonthPass.amount)} USD for your first three calendar months, then {formatPrice(PRICING.monthly.amount)} USD per month. Both renew automatically until canceled. Existing plans keep their agreed billing terms.</p>
      <p>Cancel future renewal through <Link href="/account">Manage plan in your account</Link>. Cancellation preserves access through the paid period and stops subsequent renewal. Deleting the app or requesting a refund does not itself cancel renewal. Legacy nonrenewing purchases end on their stated expiry date.</p>
      <p>Included AI usage allowances reset monthly on your account’s usage anniversary; unused allowance expires at reset and does not roll over or have cash value. Rate, concurrency and request-size limits also apply. A generation can consume allowance even if it fails, times out or is canceled after generation starts.</p>
    </PolicySection>
    <PolicySection title="4. Refund requests" id="refunds">
      <p>If you are dissatisfied, email <a href={`mailto:${BUSINESS.supportEmail}`}>{BUSINESS.supportEmail}</a>. We review refund requests case by case; a request does not guarantee approval. See the <Link href="/refund-policy">Refund Policy</Link>. Nothing here limits a refund or other remedy required by law.</p>
    </PolicySection>
    <PolicySection title="5. Content and intellectual property">
      <p>You retain your rights in content you submit and give us permission to process it with our service providers to deliver the service. You are responsible for having the necessary rights and permissions. We retain rights in our software, branding and original learning materials, subject to third-party rights. We grant you a limited, nonexclusive, nontransferable right to use the service for its intended purposes while you comply with these Terms.</p>
    </PolicySection>
    <PolicySection title="6. AI output and availability">
      <p>AI answers may be incorrect, incomplete or nonunique. Review and test them yourself. We do not guarantee employment, interview results, uninterrupted availability, or invisibility in every recording or screen-sharing setup. Compatibility depends on your Mac, operating system and other software.</p>
      <p>To the extent permitted by law, the service is provided “as is” and “as available,” without warranties of accuracy, merchantability, fitness for a particular purpose or noninfringement. This does not exclude warranties or remedies that cannot lawfully be excluded.</p>
    </PolicySection>
    <PolicySection title="7. Limits on liability">
      <p>To the extent permitted by law, SWECompanion is not liable for indirect, incidental, special or consequential losses, including lost profits, opportunities or data. Our total liability arising from the service is limited to the fees you paid us for it in the 12 months before the event giving rise to the claim. These limits do not apply to fraud, intentional misconduct or any liability that applicable law does not allow us to exclude or limit.</p>
    </PolicySection>
    <PolicySection title="8. Changes, governing law and contact">
      <p>We may update the service and these Terms prospectively, posting the revised date and providing notice where law requires it. Washington State law governs, except where mandatory law gives you other protections. Nothing in these Terms waives nonwaivable consumer rights or access to remedies required by law. If one provision is unenforceable, the remaining provisions continue to apply.</p>
      <p>Questions or concerns: <a href={`mailto:${BUSINESS.supportEmail}`}>{BUSINESS.supportEmail}</a>.</p>
    </PolicySection>
  </PolicyPage>;
}
