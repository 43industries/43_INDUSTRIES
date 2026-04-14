import { SiteHeader } from "@/components/site-header";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using the 43 Industries platform ("the Platform"), you agree to be bound by these Terms of Use. If you do not agree to all of these terms, you may not access the Platform. We reserve the right to update these terms at any time; continued use after changes constitutes acceptance of the revised terms.`,
  },
  {
    title: "2. Eligibility",
    body: `You must be at least 16 years of age to create an account. By registering, you represent that the information you provide is accurate and that you are legally permitted to use the Platform in your jurisdiction.`,
  },
  {
    title: "3. User Accounts",
    body: `Each member is responsible for maintaining the confidentiality of their account credentials. You are responsible for all activity that occurs under your account. Notify us immediately if you suspect unauthorized use. Accounts are non-transferable and may not be shared.`,
  },
  {
    title: "4. Community Conduct",
    body: `Members agree to engage respectfully within all society features including threads, comments, challenges, and clan governance. Prohibited conduct includes: spam and unsolicited promotion, harassment or targeted abuse, deliberate misinformation, impersonation, circumventing moderation actions, and any activity that violates applicable law. Violation of these standards may result in content removal, posting restrictions, or account suspension.`,
  },
  {
    title: "5. User-Generated Content",
    body: `You retain ownership of content you create on the Platform. By posting, you grant 43 Industries a worldwide, royalty-free, non-exclusive license to display, distribute, and archive that content within the Platform. You may delete your content at any time; cached copies may persist briefly during propagation.`,
  },
  {
    title: "6. Intellectual Property",
    body: `The Platform's design, code, branding, and original content are the property of 43 Industries. You may not reproduce, modify, or distribute Platform materials without prior written permission. The 43 token and associated reward mechanics are proprietary systems.`,
  },
  {
    title: "7. Moderation and Enforcement",
    body: `Reports are reviewed by designated Elders, Moderators, and Administrators. Actions taken may include content removal, warnings, temporary posting cooldowns, or account suspension. Decisions are made at the discretion of the moderation team. Appeals may be submitted via the reporting system.`,
  },
  {
    title: "8. Disclaimers",
    body: `The Platform is provided "as is" without warranties of any kind, express or implied. 43 Industries does not guarantee uptime, data preservation, or the accuracy of user-generated content. The 43 token is a participation reward with no guaranteed monetary value.`,
  },
  {
    title: "9. Limitation of Liability",
    body: `To the maximum extent permitted by law, 43 Industries and its operators shall not be liable for indirect, incidental, or consequential damages arising from your use of the Platform, including loss of data, reputation, or digital assets.`,
  },
  {
    title: "10. Termination",
    body: `We may suspend or terminate your account at any time for violation of these terms or for any reason consistent with maintaining community safety. You may delete your account at any time through your profile settings.`,
  },
  {
    title: "11. Governing Law",
    body: `These terms shall be governed by and construed in accordance with applicable law. Any disputes shall be resolved through binding arbitration in the jurisdiction of 43 Industries' principal place of business.`,
  },
  {
    title: "12. Contact",
    body: `Questions about these terms may be directed to the moderation team via the Platform's reporting tools or by contacting us at the address listed on the main site.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 py-16 text-zinc-200">
        <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Legal</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Terms of Use</h1>
        <p className="mt-4 text-zinc-400">
          Last updated April 2026. Please read these terms carefully before using the 43
          Industries platform.
        </p>

        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-zinc-100">{section.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
