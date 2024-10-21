import { Loader } from '@/components/ui/loader'

export default function DashboardFetchLoader() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-[20rem]">
      <Loader color="#fff" size="2.85rem" />
      <span className="text-[.85rem] text-black dark:text-muted">Fetching user data...</span>
    </div>
  )
}
