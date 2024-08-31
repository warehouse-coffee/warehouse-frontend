'use client'

import { motion } from 'framer-motion'
import * as React from 'react'

import { BackgroundBeams } from '../ui/background-beams'

export function LoginMain({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen rounded-md bg-neutral-950 relative flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
      <BackgroundBeams />
    </div>
  )
}
