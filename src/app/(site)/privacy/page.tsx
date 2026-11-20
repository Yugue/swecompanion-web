import type { Metadata } from "next";
import { PolicyPage, PolicySection } from "@/components/site/policy-page";
import { BUSINESS } from "@/lib/business";

export const metadata: Metadata = { title: "Privacy Policy", description: "How SWECompanion handles account details, billing, screenshots, AI requests and privacy choices.", alternates: { canonical: "/privacy" } };

export default function Page() {
  return <PolicyPage title="Privacy Policy" description="What we process, why we process it, and the choices available to you.">
    <PolicySection title="Who we are">
      <p>SWECompanion, based in {BUSINESS.location}, operates this website and the SWECompanion macOS app. Contact <a href={`mailto:${BUSINESS.supportEmail}`}>{BUSINESS.supportEmail}</a> for privacy questions and requests.</p>
    </PolicySection>
    <PolicySection title="Information we process">
      <p><strong>Account and support:</strong> your email address, display name, account identifier, authentication information, subscription status, and messages you send support. Google sign-in shares the account information needed to sign you in. Firebase Authentication manages sign-in credentials.</p>
      <p><strong>Billing:</strong> Stripe processes payment and billing details. We receive customer and transaction identifiers, invoice information and subscription status needed to manage access and purchases. Our application does not receive or store your full card number or card security code.</p>
      <p><strong>AI requests:</strong> screenshots you capture and submit, relevant conversation history and generated answers are processed by our backend and Anthropic’s API to provide responses. Screenshots can include whatever is visible in the captured area. Submit only content you are authorized to share, and avoid sensitive or confidential information you do not want processed by these providers.</p>
      <p><strong>Usage and technical records:</strong> usage counts, request timing, error and security information, account identifiers, and infrastructure logs that may include IP address, browser or device information. These support service operation, abuse prevention and troubleshooting.</p>
    </PolicySection>
    <PolicySection title="Why we use it and who receives it">
      <p>We use this information to authenticate you, deliver AI responses, process purchases, manage subscriptions and usage, provide support, maintain security, and meet legal obligations.</p>
      <p>Google/Firebase provides authentication, hosting and database infrastructure; Stripe provides payment and billing services; Anthropic processes AI inputs. Support communications are processed through our email service. Providers may process and retain information in the United States or other countries under their applicable service terms and privacy policies.</p>
      <p>We may also disclose information when legally required, to protect rights or safety, or in a business transfer subject to applicable privacy requirements. We do not sell personal information or share it for cross-context behavioral advertising.</p>
    </PolicySection>
    <PolicySection title="Local storage and retention">
      <p>The website stores learning progress and preferences in your browser; learning progress is not synced to your account. Authentication uses browser storage to maintain sign-in. The Mac app maintains local settings, screenshot cache files and current conversation state. Follow-up requests may resend earlier conversation content to the AI service.</p>
      <p>Our account and billing database stores profile, billing and usage records, rather than a cloud library of your screenshots and conversations. Request content still passes through our backend and AI provider. Local files, provider systems, operational logs and backups can have their own retention periods.</p>
      <p>We retain personal information as needed to provide the service, address support and security issues, maintain required financial records, and comply with law. Clearing browser data removes locally stored learning progress; app reset controls clear the current screenshots and conversation. Local caches or backups may require separate removal.</p>
    </PolicySection>
    <PolicySection title="Your choices and rights">
      <p>You can control screen-capture permission in macOS settings, choose what to submit, clear browser data, and stop using the service. To request access, correction or deletion of personal information, email <a href={`mailto:${BUSINESS.supportEmail}`}>{BUSINESS.supportEmail}</a>. We may verify your identity and retain records that law or legitimate security needs require. Rights and exceptions depend on applicable law. Cancel subscription renewal separately through Manage plan in your account.</p>
      <p>We use access controls and other safeguards, but cannot guarantee absolute security. The service is not directed to children under 13. Contact us if you believe a child has provided personal information.</p>
    </PolicySection>
    <PolicySection title="Policy updates">
      <p>We will post changes here with an updated date and provide additional notice or obtain consent where required by law.</p>
    </PolicySection>
  </PolicyPage>;
}
