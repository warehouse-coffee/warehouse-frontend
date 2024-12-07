import { Loader } from '@/components/ui/loader'

export default function DashboardFetchLoader() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-[20rem]">
      <Loader color="#62c5ff" size="2.85rem" />
      <span className="text-[.85rem] text-black dark:text-muted">Fetching data...</span>
    </div>
  )
}
