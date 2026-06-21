import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Dashboard — Admin' }

const atAGlance = [
  { label: 'Products',   value: '—', icon: '📦', href: '/admin/products',  color: 'text-blue-400'  },
  { label: 'Orders',     value: '—', icon: '🛒', href: '/admin/orders',    color: 'text-green-400' },
  { label: 'Customers',  value: '—', icon: '👥', href: '/admin/customers', color: 'text-purple-400'},
  { label: 'Revenue',    value: '—', icon: '💰', href: '/admin/orders',    color: 'text-amber-400' },
]

const quickLinks = [
  { label: 'Add new product',  href: '/admin/products/new', icon: '＋' },
  { label: 'View all orders',  href: '/admin/orders',       icon: '📋' },
  { label: 'Manage customers', href: '/admin/customers',    icon: '👤' },
  { label: 'Seed products',    href: '/admin/products',     icon: '🌱' },
]

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-5">

      {/* Welcome panel */}
      <div className="bg-gradient-to-r from-sienna/20 to-terra/10 border border-sienna/20 rounded-xl p-5 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-ivory font-serif text-xl mb-1">Welcome to Narya Admin</h1>
          <p className="text-ivory/45 text-xs leading-relaxed max-w-lg">
            Manage your products, orders, and customers from here. Use the sidebar to navigate between sections.
          </p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <Link href="/admin/products/new" className="px-3 py-1.5 bg-sienna text-ivory text-xs font-medium rounded-lg hover:bg-sienna/90 transition-colors">
              Add new product
            </Link>
            <Link href="/" target="_blank" className="px-3 py-1.5 border border-white/15 text-ivory/60 hover:text-ivory/90 text-xs rounded-lg transition-colors">
              View store ↗
            </Link>
          </div>
        </div>
        <div className="text-4xl opacity-30 shrink-0">🍳</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left — main column */}
        <div className="lg:col-span-2 space-y-5">

          {/* At a Glance */}
          <div className="bg-[#1a2a1a] border border-white/8 rounded-xl overflow-hidden">
            <div className="border-b border-white/8 px-5 py-3">
              <h2 className="text-xs font-semibold text-ivory/50 uppercase tracking-widest">At a Glance</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-white/6">
              {atAGlance.map(s => (
                <Link key={s.label} href={s.href} className="flex flex-col items-center justify-center py-6 hover:bg-white/4 transition-colors group">
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{s.icon}</span>
                  <span className={`text-2xl font-semibold ${s.color}`}>{s.value}</span>
                  <span className="text-ivory/30 text-[11px] mt-1">{s.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent orders placeholder */}
          <div className="bg-[#1a2a1a] border border-white/8 rounded-xl overflow-hidden">
            <div className="border-b border-white/8 px-5 py-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold text-ivory/50 uppercase tracking-widest">Recent Orders</h2>
              <Link href="/admin/orders" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all</Link>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/6 bg-white/2">
                  <th className="text-left px-5 py-2.5 text-ivory/25 font-medium">Order</th>
                  <th className="text-left px-4 py-2.5 text-ivory/25 font-medium">Date</th>
                  <th className="text-left px-4 py-2.5 text-ivory/25 font-medium">Status</th>
                  <th className="text-left px-4 py-2.5 text-ivory/25 font-medium">Customer</th>
                  <th className="text-right px-5 py-2.5 text-ivory/25 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-ivory/20 text-sm">
                    No orders yet — they will appear here once customers start buying.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Low stock */}
          <div className="bg-[#1a2a1a] border border-white/8 rounded-xl overflow-hidden">
            <div className="border-b border-white/8 px-5 py-3 flex items-center justify-between">
              <h2 className="text-xs font-semibold text-ivory/50 uppercase tracking-widest">Stock Alerts</h2>
              <Link href="/admin/products?stock=lowstock" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View all</Link>
            </div>
            <div className="px-5 py-8 text-center text-ivory/20 text-sm">
              Stock alert data loads once products are seeded.
            </div>
          </div>

        </div>

        {/* Right — sidebar widgets */}
        <div className="space-y-5">

          {/* Quick links */}
          <div className="bg-[#1a2a1a] border border-white/8 rounded-xl overflow-hidden">
            <div className="border-b border-white/8 px-5 py-3">
              <h2 className="text-xs font-semibold text-ivory/50 uppercase tracking-widest">Quick Actions</h2>
            </div>
            <ul className="divide-y divide-white/5">
              {quickLinks.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="flex items-center gap-3 px-5 py-3 hover:bg-white/4 transition-colors group">
                    <span className="text-base w-5 text-center">{l.icon}</span>
                    <span className="text-ivory/55 group-hover:text-ivory text-xs transition-colors">{l.label}</span>
                    <span className="ml-auto text-ivory/15 group-hover:text-ivory/40 text-xs transition-colors">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Store health */}
          <div className="bg-[#1a2a1a] border border-white/8 rounded-xl overflow-hidden">
            <div className="border-b border-white/8 px-5 py-3">
              <h2 className="text-xs font-semibold text-ivory/50 uppercase tracking-widest">Store Setup</h2>
            </div>
            <ul className="divide-y divide-white/5 text-xs">
              {[
                { label: 'Products added',    done: false, href: '/admin/products'  },
                { label: 'Payments configured', done: false, href: '/admin/settings' },
                { label: 'Shipping set up',   done: false, href: '/admin/shipping'  },
                { label: 'Admin secured',     done: true,  href: '/admin/settings'  },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="flex items-center gap-3 px-5 py-3 hover:bg-white/4 transition-colors group">
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] shrink-0 ${item.done ? 'bg-green-500/20 border-green-500/40 text-green-400' : 'border-white/15 text-ivory/20'}`}>
                      {item.done ? '✓' : ''}
                    </span>
                    <span className={`transition-colors ${item.done ? 'text-ivory/30 line-through' : 'text-ivory/55 group-hover:text-ivory'}`}>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Activity log placeholder */}
          <div className="bg-[#1a2a1a] border border-white/8 rounded-xl overflow-hidden">
            <div className="border-b border-white/8 px-5 py-3">
              <h2 className="text-xs font-semibold text-ivory/50 uppercase tracking-widest">Activity</h2>
            </div>
            <div className="px-5 py-6 text-center text-ivory/20 text-xs">
              Recent activity will appear here.
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
