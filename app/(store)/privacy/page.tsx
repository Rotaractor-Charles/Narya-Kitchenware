import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Narya Kitchenware collects, uses, and protects your personal information.',
}

const SECTIONS = [
  {
    title: '1. Information We Collect',
    content: `When you create an account, place an order, or contact us, we collect the following information:

**Account & order data:** Full name, email address, phone number, delivery address, and order history.

**Payment data:** We do not store card numbers or M-Pesa PINs. Payments are processed by Stripe and Safaricom respectively, both of which are PCI-DSS compliant.

**Usage data:** Pages visited, products viewed, search terms, and browsing behaviour on our site. This data is collected via cookies and analytics tools to help us improve our service.

**Communications:** When you contact us by email, WhatsApp, or our contact form, we retain those records to resolve your enquiry.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use your personal data only for the following purposes:

• To process and fulfil your orders, and to notify you of shipping and delivery status.
• To provide customer support and respond to your enquiries.
• To personalise your shopping experience and show you relevant products.
• To send order confirmations, account updates, and — where you have opted in — promotional emails and SMS.
• To improve our website, product catalogue, and services through analytics.
• To comply with Kenyan tax laws and legal obligations.

We do not sell, rent, or trade your personal information to third parties for their own marketing purposes.`,
  },
  {
    title: '3. Cookies',
    content: `Our website uses cookies — small text files stored on your browser — to:

• Keep you logged in across sessions.
• Remember your cart contents.
• Understand how visitors use our site (via Google Analytics).
• Show you relevant advertising where applicable.

You may disable cookies in your browser settings. Note that disabling cookies may affect the functionality of the shopping cart and account features. We do not use third-party advertising cookies without your explicit consent.`,
  },
  {
    title: '4. Data Sharing',
    content: `We share your information only with trusted third parties who help us operate our business:

• **Delivery partners** (G4S, Wells Fargo Kenya, Posta Kenya): receive your name and delivery address to fulfil your order.
• **Payment processors** (Stripe, Safaricom M-Pesa): receive transaction details to process payments securely.
• **Email & SMS providers** (Mailchimp, Africa's Talking): receive your contact details to send order notifications and — where consented — marketing communications.
• **Analytics** (Google Analytics): receive anonymised usage data to help us improve our site.

All third-party partners are contractually obligated to handle your data securely and only for the stated purpose.`,
  },
  {
    title: '5. Data Retention',
    content: `We retain your personal data for as long as necessary to fulfil the purposes described in this policy, or as required by Kenyan law:

• Order records are retained for 7 years for tax and accounting purposes.
• Account data is retained for as long as your account is active. You may request deletion at any time.
• Marketing preferences and opt-out records are retained indefinitely to respect your communication choices.`,
  },
  {
    title: '6. Your Rights',
    content: `Under the Kenya Data Protection Act 2019, you have the right to:

• **Access** the personal data we hold about you.
• **Correct** any inaccurate or incomplete information.
• **Delete** your account and personal data (subject to legal retention requirements).
• **Object** to the processing of your data for marketing purposes.
• **Portability** — request a copy of your data in a machine-readable format.

To exercise any of these rights, contact us at privacy@naryakitchenware.co.ke. We will respond within 14 days.`,
  },
  {
    title: '7. Data Security',
    content: `We take the security of your personal data seriously. We implement:

• SSL/TLS encryption for all data transmitted between your browser and our servers.
• Secure, access-controlled storage for all customer data.
• Two-factor authentication for all staff with access to customer data.
• Regular security audits of our systems and third-party integrations.

No method of transmission over the internet is 100% secure. While we strive to protect your data, we cannot guarantee absolute security. In the event of a data breach that affects your personal information, we will notify you within 72 hours as required by the Kenya Data Protection Act.`,
  },
  {
    title: '8. Children\'s Privacy',
    content: `Our services are not directed at children under the age of 18. We do not knowingly collect personal data from minors. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.`,
  },
  {
    title: '9. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. When we make material changes, we will notify you by email or by posting a notice on our website. The updated policy will indicate the date of the most recent revision. Your continued use of our services after the effective date constitutes your acceptance of the updated policy.`,
  },
  {
    title: '10. Contact & Complaints',
    content: `For questions, requests, or complaints about this Privacy Policy or our data practices, contact our Data Protection Officer at:

**Email:** privacy@naryakitchenware.co.ke
**Address:** Narya Kitchenware, Westlands, Nairobi, Kenya

If you are not satisfied with our response, you may lodge a complaint with the Office of the Data Protection Commissioner (ODPC) at www.odpc.go.ke.`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="text-[11px] tracking-[0.25em] uppercase text-terra font-medium mb-2">Legal</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-earth mb-2">Privacy Policy</h1>
        <p className="text-earth/45 text-sm">Last updated: June 2026 · Effective date: June 21, 2026</p>
      </div>

      <p className="text-sm text-earth/65 leading-relaxed mb-8 p-4 bg-ivory-dark rounded-xl border border-earth/8">
        Narya Kitchenware ("Narya", "we", "us") is committed to protecting your privacy. This policy explains what personal information we collect, how we use it, and the choices you have. It applies to all services offered at naryakitchenware.co.ke and complies with the <strong className="text-earth">Kenya Data Protection Act 2019</strong>.
      </p>

      <div className="space-y-8">
        {SECTIONS.map((section, i) => (
          <div key={i} className="bg-white rounded-2xl border border-earth/10 p-5 sm:p-6">
            <h2 className="font-serif text-lg text-earth mb-3">{section.title}</h2>
            <div className="text-sm text-earth/65 leading-relaxed space-y-3">
              {section.content.split('\n\n').map((para, j) => (
                <p key={j} className={para.startsWith('•') || para.startsWith('**') ? '' : ''}>
                  {para.split('\n').map((line, k) => (
                    <span key={k}>
                      {line.split(/(\*\*[^*]+\*\*)/).map((part, l) =>
                        part.startsWith('**') && part.endsWith('**')
                          ? <strong key={l} className="text-earth font-semibold">{part.slice(2, -2)}</strong>
                          : part
                      )}
                      {k < para.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
