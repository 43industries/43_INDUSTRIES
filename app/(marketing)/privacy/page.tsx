import { SiteHeader } from "@/components/site-header";

const sections = [
  {
    title: "1. Information We Collect",
    body: `When you create an account we collect your display name, email address, and profile image as provided through our authentication provider (Clerk). When you use the Platform we collect the content you create (threads, comments, challenge submissions), participation metadata (timestamps, reactions, clan memberships), and progression data (points, levels, reputation scores). We do not collect payment information or government-issued identification.`,
  },
  {
    title: "2. How We Use Your Information",
    body: `Your information is used to operate and improve the Platform: displaying your profile to other members, powering leaderboards and progression systems, surfacing relevant content, enforcing community standards through moderation, and communicating service updates. We do not sell your personal information.`,
  },
  {
    title: "3. Information Sharing",
    body: `We share information only in the following circumstances: with service providers who operate infrastructure on our behalf (hosting, authentication, database), when required by law or valid legal process, to protect the safety or rights of members and the public, and in aggregated or anonymized form that cannot identify you. Your public profile, threads, and comments are visible to other authenticated members.`,
  },
  {
    title: "4. XRPL Wallet Data",
    body: `If you participate in the 43 token rewards program, your XRPL wallet address is associated with your account. On-chain transactions (trust lines, token transfers) are recorded on the public XRP Ledger and are not controlled by 43 Industries. We store your wallet address to facilitate reward issuance but do not store private keys.`,
  },
  {
    title: "5. Cookies and Local Storage",
    body: `The Platform uses essential cookies for authentication session management. We use local storage for UI preferences. We do not use third-party advertising or tracking cookies.`,
  },
  {
    title: "6. Data Retention",
    body: `Account data is retained for the lifetime of your account. When you delete your account, your personal information is removed within 30 days. Content you posted (threads, comments) may be anonymized rather than deleted to preserve conversation context for other members. Server logs containing IP addresses are retained for up to 90 days for security purposes.`,
  },
  {
    title: "7. Data Security",
    body: `We implement industry-standard security measures including encrypted connections (TLS), secure authentication through Clerk, role-based access controls, and regular security reviews. No system is completely secure; we cannot guarantee absolute protection of your data.`,
  },
  {
    title: "8. Your Rights",
    body: `You may access, correct, or delete your personal information through your profile settings at any time. You may export your data by contacting the moderation team. If you are located in the EU/EEA, you have additional rights under GDPR including the right to data portability and the right to object to processing. Contact us to exercise these rights.`,
  },
  {
    title: "9. Children's Privacy",
    body: `The Platform is not directed at children under 16. We do not knowingly collect personal information from children under 16. If we learn that we have collected such information, we will delete it promptly.`,
  },
  {
    title: "10. Changes to This Policy",
    body: `We may update this privacy policy from time to time. Material changes will be communicated through the Platform. Continued use after changes constitutes acceptance of the revised policy.`,
  },
  {
    title: "11. Contact",
    body: `Privacy inquiries may be directed to the moderation team via the Platform's reporting tools or by contacting us at the address listed on the main site.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-6 py-16 text-zinc-200">
        <p className="text-xs uppercase tracking-[0.2em] text-violet-300">Legal</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Privacy Policy</h1>
        <p className="mt-4 text-zinc-400">
          Last updated April 2026. This policy describes how 43 Industries collects, uses,
          and protects your information.
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
