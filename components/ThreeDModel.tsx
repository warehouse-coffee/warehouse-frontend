'use client'

import Spline from '@splinetool/react-spline'

export default function ThreeDModel({ className, scene }: { className: string, scene: string }) {
  return (
    <div className={className}>
      <Spline
        className="w-full h-full"
        scene={scene}
      />
    </div>
  )
}