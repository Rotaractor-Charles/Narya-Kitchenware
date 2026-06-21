import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Narya Kitchenware team — we\'re here to help.',
}

const CHANNELS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: 'Email',
    value: 'hello@naryakitchenware.co.ke',
    detail: 'We respond within 24 hours on business days.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.41 2 2 0 0 1 3.59 1.21h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z"/>
      </svg>
    ),
    label: 'WhatsApp / Phone',
    value: '+254 700 000 000',
    detail: 'Mon – Fri, 8 am – 6 pm EAT.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    label: 'Visit Us',
    value: 'Westlands, Nairobi, Kenya',
    detail: 'By appointment only. Contact us to schedule.',
  },
]

const FAQS = [
  {
    q: 'How long does delivery take?',
    a: 'Nairobi orders are delivered within 1–2 business days. Outside Nairobi, allow 3–5 business days. We ship via trusted courier partners.',
  },
  {
    q: 'Can I return or exchange a product?',
    a: 'Yes. We offer free returns within 14 days of delivery if the item is unused and in its original packaging. See our Shipping & Returns page for full details.',
  },
  {
    q: 'Do you offer bulk or wholesale pricing?',
    a: 'We offer special pricing for orders of 10 or more items. Get in touch via email with your requirements and we\'ll send a custom quote.',
  },
  {
    q: 'Are your products available in physical stores?',
    a: 'Currently, Narya is online-only. We are exploring retail partnerships in Nairobi — sign up to our newsletter to be the first to know.',
  },
  {
    q: 'How do I track my order?',
    a: 'Once your order ships, you\'ll receive an SMS and email with a tracking link. You can also use the Track Your Order link in the header.',
  },
]

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

      {/* Header */}
      <div className="mb-10">
        <p className="text-[11px] tracking-[0.25em] uppercase text-terra font-medium mb-2">Get in touch</p>
        <h1 className="font-serif text-3xl sm:text-4xl text-earth mb-3">We'd love to hear from you.</h1>
        <p className="text-earth/50 text-base max-w-lg">
          Whether it's a question about an order, a product recommendation, or just a great recipe to share — our team is ready.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Contact form */}
        <div className="bg-white rounded-2xl border border-earth/10 p-6 sm:p-7">
          <h2 className="font-serif text-xl text-earth mb-5">Send a message</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-earth/45 mb-1.5">First name</label>
                <input type="text" placeholder="Jane" className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors" />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-earth/45 mb-1.5">Last name</label>
                <input type="text" placeholder="Wanjiku" className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-earth/45 mb-1.5">Email</label>
              <input type="email" placeholder="jane@email.com" className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-earth/45 mb-1.5">Subject</label>
              <select className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth bg-white focus:outline-none focus:border-terra transition-colors">
                <option>Order enquiry</option>
                <option>Product question</option>
                <option>Return / exchange</option>
                <option>Wholesale / bulk order</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-earth/45 mb-1.5">Message</label>
              <textarea rows={5} placeholder="Tell us how we can help…" className="w-full border border-earth/15 rounded-xl px-3 py-2.5 text-sm text-earth focus:outline-none focus:border-terra transition-colors resize-none" />
            </div>
            <button type="submit" className="w-full bg-earth text-ivory py-3 rounded-xl text-sm font-semibold hover:bg-earth/90 transition-colors">
              Send Message
            </button>
          </form>
        </div>

        {/* Right: Channels + FAQ */}
        <div className="space-y-6">

          {/* Contact channels */}
          <div className="space-y-3">
            {CHANNELS.map(c => (
              <div key={c.label} className="bg-white rounded-2xl border border-earth/10 p-4 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-terra/10 text-terra flex items-center justify-center shrink-0">
                  {c.icon}
                </div>
                <div>
                  <p className="text-[11px] text-earth/40 uppercase tracking-widest font-medium">{c.label}</p>
                  <p className="text-sm font-semibold text-earth mt-0.5">{c.value}</p>
                  <p className="text-xs text-earth/45 mt-0.5">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="bg-ivory-dark rounded-2xl border border-earth/8 p-5">
            <h3 className="font-serif text-lg text-earth mb-4">Common Questions</h3>
            <div className="space-y-4">
              {FAQS.map((faq, i) => (
                <div key={i} className={i > 0 ? 'pt-4 border-t border-earth/8' : ''}>
                  <p className="text-sm font-semibold text-earth mb-1">{faq.q}</p>
                  <p className="text-xs text-earth/55 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
