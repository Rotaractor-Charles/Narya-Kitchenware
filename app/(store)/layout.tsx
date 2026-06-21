import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Providers from '@/components/Providers'
import DevUserSwitcher from '@/components/dev/DevUserSwitcher'
import ImpersonationBanner from '@/components/store/ImpersonationBanner'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Navbar />
      <main>{children}</main>
      <Footer />
      {process.env.NODE_ENV === 'development' && <DevUserSwitcher />}
      <ImpersonationBanner />
    </Providers>
  )
}
