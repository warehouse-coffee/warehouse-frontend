'use client'

import Spline from '@splinetool/react-spline'
import React from 'react'

const ThreeDModel = ({ className, scene }: { className: string, scene: string }) => {
  return (
    <div className={className}>
      <Spline
        className="w-full h-full"
        scene={scene}
      />
    </div>
  )
}

export default React.memo(ThreeDModel)
