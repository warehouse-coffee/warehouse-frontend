import Icon from '@/components/Icon'
import ThreeDModel from '@/components/ThreeDModel'
import { FlipWords } from '@/components/ui/flip-words'

const wordToFlip = [
  'management',
  'administration',
  'supervision',
  'control'
]

export default function HomePage() {
  return (
    <section className="w-full h-screen overflow-hidden flex items-center bg-[url('/home-bg.png')] bg-no-repeat bg-full-screen bg-center-center relative">
      <div className="absolute top-[14rem] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48rem] text-center z-20">
        <div className="text-white font-italiana text-[3.5rem] font-normal leading-[5rem] mb-[1.25rem]">
          The best <span className="text-[#62c5ff]"><FlipWords words={wordToFlip} /></span>system for your coffee business
        </div>
        <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-[.08rem] text-[.85rem] font-semibold leading-6 text-white inline-block w-[9.5rem] h-[3.25rem]">
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="relative flex justify-between items-center z-10 rounded-full bg-zinc-950 py-2 px-4 ring-1 ring-white/10 w-full h-full">
            <span className='capitalize'>
              Explore Now
            </span>
            <Icon name="move-right" size={16} />
          </div>
          <span className="absolute -bottom-0 left-[1.125rem] h-[.125rem] w-[calc(100%-2.25rem)] bg-gradient-to-r from-[#62c5ff]/0 via-[#62c5ff]/90 to-[#62c5ff]/0 transition-opacity duration-500 group-hover:opacity-40" />
        </button>
      </div>
      <div className="absolute top-[29.25rem] left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className='w-[40rem] h-[40rem] flex items-center justify-center z-10 animate-float'>
          <ThreeDModel
            className="w-full h-full"
            scene="https://prod.spline.design/5MoRKYeAdAaF588j/scene.splinecode"
          />
        </div>
      </div>
    </section>
  )
}
