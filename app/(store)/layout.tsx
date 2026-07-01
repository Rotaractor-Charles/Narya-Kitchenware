import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Providers from '@/components/Providers'
import DevUserSwitcher from '@/components/dev/DevUserSwitcher'
import ImpersonationBanner from '@/components/store/ImpersonationBanner'
import { getMenuItems } from '@/lib/api/menus'

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [desktopNav, mobileNav, footerShop, footerLearn, footerCompany] = await Promise.all([
    getMenuItems('header_primary'),
    getMenuItems('mobile_drawer'),
    getMenuItems('footer_shop'),
    getMenuItems('footer_learn'),
    getMenuItems('footer_company'),
  ])

  return (
    <Providers>
      <Navbar desktopNav={desktopNav} mobileNav={mobileNav} />
      <main>{children}</main>
      <Footer footerShop={footerShop} footerLearn={footerLearn} footerCompany={footerCompany} />
      {process.env.NODE_ENV === 'development' && <DevUserSwitcher />}
      <ImpersonationBanner />
    </Providers>
  )
}
