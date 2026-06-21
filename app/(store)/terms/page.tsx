import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions governing your use of Narya Kitchenware.',
}

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content: 'By accessing or using the Narya Kitchenware website (naryakitchenware.co.ke) or placing an order with us, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our services. We reserve the right to update these terms at any time; continued use of the site after changes are posted constitutes acceptance of the revised terms.',
  },
  {
    title: '2. Eligibility',
    content: 'You must be at least 18 years old and a resident of Kenya to place an order. By creating an account or placing an order, you represent that you meet these requirements. If you are ordering on behalf of a business, you represent that you have authority to bind that business to these terms.',
  },
  {
    title: '3. Products & Descriptions',
    content: 'We take care to ensure our product descriptions, images, and specifications are accurate. However, slight variations in colour may occur due to screen calibration differences. All prices are listed in Kenyan Shillings (KSh) and are inclusive of applicable VAT. We reserve the right to correct pricing errors and to limit quantities. In the event of a pricing error, we will notify you before processing the order.',
  },
  {
    title: '4. Orders & Payment',
    content: `When you place an order, you are making an offer to purchase the item(s). We accept payment via:

• M-Pesa (Lipa na M-Pesa / Paybill)
• Visa and Mastercard (processed securely by Stripe)
• Narya Points (for eligible redemptions)

An order is confirmed when you receive a confirmation email from us. We reserve the right to cancel any order due to stock unavailability, pricing errors, or suspected fraud. In such cases, a full refund will be issued within 3 business days.`,
  },
  {
    title: '5. Delivery',
    content: 'Delivery terms, timelines, and costs are set out in our Shipping & Returns policy. We are not liable for delays caused by third-party courier partners, natural events, or circumstances beyond our control. Risk of loss and title for products pass to you upon delivery.',
  },
  {
    title: '6. Returns & Refunds',
    content: 'Our return policy is set out in full on our Shipping & Returns page. By purchasing, you agree to the conditions and process described there. Refunds are issued to the original payment method only. We do not offer cash refunds.',
  },
  {
    title: '7. Narya Rewards Programme',
    content: 'Narya Points are a loyalty benefit, not a currency. Points have no cash value, are non-transferable, and cannot be sold or gifted. We reserve the right to modify, suspend, or terminate the Rewards programme at any time with 30 days\' notice. Points accrued before termination will be honoured for 90 days after notice is given.',
  },
  {
    title: '8. User Accounts',
    content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at hello@naryakitchenware.co.ke if you suspect unauthorised access. We are not liable for losses resulting from unauthorised use of your account due to your failure to keep credentials secure.',
  },
  {
    title: '9. Intellectual Property',
    content: 'All content on this website — including text, images, logos, product descriptions, recipes, and guides — is the intellectual property of Narya Kitchenware or its content providers and is protected by Kenyan and international copyright law. You may not reproduce, distribute, or create derivative works from our content without our prior written permission.',
  },
  {
    title: '10. Prohibited Uses',
    content: `You agree not to use our website or services to:

• Place fraudulent orders or provide false personal information.
• Engage in any activity that disrupts or interferes with our services.
• Scrape or extract data from our website using automated tools.
• Impersonate Narya or any of our staff members.
• Use our platform for any unlawful purpose under Kenyan law.

Violation of these prohibitions may result in immediate account suspension and legal action.`,
  },
  {
    title: '11. Limitation of Liability',
    content: 'To the maximum extent permitted by Kenyan law, Narya Kitchenware\'s total liability to you for any claim arising from these terms or your purchase shall not exceed the amount you paid for the product(s) in question. We are not liable for indirect, incidental, or consequential losses. Nothing in these terms limits our liability for death or personal injury caused by our negligence, or for fraud.',
  },
  {
    title: '12. Governing Law',
    content: 'These Terms of Service are governed by and construed in accordance with the laws of Kenya. Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts of Nairobi, Kenya. We encourage you to contact us first — most disputes can be resolved quickly and informally.',
  },
  {
    title: '13. Contact',
    content: 'For questions about these Terms of Service, contact us at legal@naryakitchenware.co.ke or by writing to: Narya Kitchenware, Westlands, Nairobi, Kenya.',
  },
]

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="text-[11px] tracking-[0.25em] uppercase text-terra font-medium mb-2">Legal</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-earth mb-2">Terms of Service</h1>
        <p className="text-earth/45 text-sm">Last updated: June 2026 · Effective date: June 21, 2026</p>
      </div>

      <p className="text-sm text-earth/65 leading-relaxed mb-8 p-4 bg-ivory-dark rounded-xl border border-earth/8">
        Please read these Terms of Service carefully before using our website or placing an order. These terms constitute a legally binding agreement between you and <strong className="text-earth">Narya Kitchenware</strong>, a business registered in Nairobi, Kenya.
      </p>

      <div className="space-y-6">
        {SECTIONS.map((section, i) => (
          <div key={i} className="bg-white rounded-2xl border border-earth/10 p-5 sm:p-6">
            <h2 className="font-serif text-lg text-earth mb-3">{section.title}</h2>
            <div className="text-sm text-earth/65 leading-relaxed space-y-3">
              {section.content.split('\n\n').map((para, j) => (
                <p key={j}>
                  {para.split('\n').map((line, k) => (
                    <span key={k}>
                      {line}
                      {k < para.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-5 bg-ivory-dark rounded-2xl border border-earth/8 text-center">
        <p className="text-sm text-earth/60 mb-3">Questions about our terms?</p>
        <Link href="/contact" className="inline-block bg-earth text-ivory px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-earth/90 transition-colors">
          Contact Us
        </Link>
      </div>
    </div>
  )
}
