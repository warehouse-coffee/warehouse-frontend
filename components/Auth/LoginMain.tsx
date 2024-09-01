'use client'

import { motion } from 'framer-motion'
import * as React from 'react'

import DotPattern from '@/components/magicui/dot-pattern'
import { cn } from '@/lib/utils'

export function LoginMain({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen overflow-hidden rounded-md bg-neutral-950 relative flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
      <DotPattern
        className={cn(
          '[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]'
        )}
      />
    </div>
  )
}
