import ThreeDModel from '@/components/ThreeDModel'
import { FlipWords } from '@/components/ui/flip-words'

export default function HomePage() {
  const wordToFlip = ['management', 'administration', 'supervision', 'control']

  return (
    <section className="w-full h-screen overflow-hidden flex items-center bg-[url('/home-bg.png')] bg-no-repeat bg-full-screen bg-center-center relative">
      <div className="absolute top-[12rem] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48rem] text-center z-20">
        <div className="text-white font-italiana text-[3.5rem] leading-[5.25rem]">
          The best <span className="text-[#62c5ff]"><FlipWords words={wordToFlip} /></span>system for your coffee business
        </div>
      </div>
      <div className="absolute top-[28.75rem] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] flex items-center justify-center z-10">
        <ThreeDModel
          className="w-full h-full"
          scene="https://prod.spline.design/5MoRKYeAdAaF588j/scene.splinecode"
        />
      </div>
    </section>
  )
}
