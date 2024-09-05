'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import * as React from 'react'

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-between"
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: .25 }}
    >
      {children}
    </motion.div>
  )
}