import * as React from 'react'

import HomeNavbar from '@/components/Home/HomeNavbar'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const navbars = [
    {
      name: 'Home',
      href: '/'
    },
    {
      name: 'About',
      href: '/about'
    },
    {
      name: 'Services',
      href: '/services'
    },
    {
      name: 'Contact',
      href: '/contact'
    }
  ]

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <HomeNavbar navbars={navbars} />
      {children}
    </main>
  )
}