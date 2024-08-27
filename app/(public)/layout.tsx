import * as React from 'react'

import HomeNavbar from '@/components/Home/HomeNavbar'
import PageWrapper from '@/components/PageWrapper'

interface HomeLayoutProps {
  children: React.ReactNode
}

/**
 * HomeLayout component
 * Renders the main layout for public pages including the navbar and children content
*/

export default function HomeLayout({ children }: HomeLayoutProps) {
  const navItems = [
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
    <PageWrapper>
      <HomeNavbar navItems={navItems} />
      {children}
    </PageWrapper>
  )
}