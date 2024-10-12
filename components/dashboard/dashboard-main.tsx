'use client'

import { motion, AnimatePresence } from 'framer-motion'
import React, { useState } from 'react'

import DashboardHeader from './dashboard-header'
import DashboardSidebar from './dashboard-sidebar'

export default function DashboardMain({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebar open={sidebarOpen} />
      <div className="test flex-1 overflow-auto">
        <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <AnimatePresence>
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: .25 }}
            className="p-6"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  )
}