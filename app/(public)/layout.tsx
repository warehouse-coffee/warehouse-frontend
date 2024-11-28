import { Metadata } from 'next'
import * as React from 'react'

import HomeNavbar from '@/components/home/home-navbar'
import PageWrapper from '@/components/page-wrapper'
import { ThemeProvider } from '@/components/theme-provider'

interface HomeLayoutProps {
  children: React.ReactNode
}

/**
 * HomeLayout component
 * Renders the main layout for public pages including the navbar and children content
*/

export const metadata: Metadata = {
  icons: {
    icon: '/icon.png'
  }
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' }
  ]

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      storageKey="public-theme"
    >
      <PageWrapper>
        <HomeNavbar navItems={navItems} />
        {children}
      </PageWrapper>
    </ThemeProvider>
  )
}