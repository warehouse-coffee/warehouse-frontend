import { Loader } from './ui/loader'

interface PageLoadingProps {
  loadingText?: string
}

export default function PageLoading({ loadingText = 'Loading...' }: PageLoadingProps) {
  return (
    <div className="absolute top-0 left-0 flex flex-col gap-3.5 w-full h-screen items-center justify-center bg-black/60 backdrop-blur-sm z-[99999]">
      <Loader className="stroke-white" size="3.5rem" />
      <span className="text-[1rem] font-medium text-white dark:text-white">{loadingText}</span>
    </div>
  )
}