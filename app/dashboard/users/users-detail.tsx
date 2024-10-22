import { User, Mail, Phone, Building, Briefcase, MapPin } from 'lucide-react'
import React, { useState, useMemo, useCallback } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { TransitionPanel } from '@/components/ui/transition-panel'
import { useUserDetail } from '@/hooks/user'
import { UserDetail } from '@/types'

const InfoItem = React.memo(({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => {
  const labelsWithTooltip = ['Company Name']

  const shouldShowTooltip = labelsWithTooltip.includes(label)

  const content = (
    <div className={`flex items-center p-3 rounded-lg ${shouldShowTooltip ? 'cursor-pointer' : ''}`}>
      <div className="flex-shrink-0 w-10 h-10 bg-black text-white dark:bg-primary/10 dark:text-primary rounded-full flex items-center justify-center mr-3.5">
        {icon}
      </div>
      <div className="flex flex-col overflow-hidden">
        <p className="text-[.75rem] text-muted-foreground">{label}</p>
        <p className="text-[.85rem] font-semibold truncate">{value}</p>
      </div>
    </div>
  )

  if (shouldShowTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent sideOffset={-22}>
            <p>{value}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return content
})
InfoItem.displayName = 'InfoItem'

const UserHeader = React.memo(({ userDetail }: { userDetail: UserDetail }) => (
  <div className="flex items-center gap-4">
    <Avatar className="h-16 w-16">
      <AvatarImage src={userDetail?.avatarImage || ''} alt={userDetail?.name || ''} />
      <AvatarFallback>{userDetail?.name?.slice(0, 2).toUpperCase() || ''}</AvatarFallback>
    </Avatar>
    <div className="flex flex-col gap-1">
      <h2 className="text-xl font-semibold">{userDetail?.name}</h2>
      <p className="text-sm text-muted-foreground">User ID: {userDetail?.id}</p>
    </div>
  </div>
))
UserHeader.displayName = 'UserHeader'
const TabButtons = React.memo(({ items, activeIndex, setActiveIndex }: {
  items: { title: string }[],
  activeIndex: number,
  setActiveIndex: (index: number) => void
}) => (
  <div className='mb-4 flex space-x-2'>
    {items.map((item, index) => (
      <Button
        key={index}
        onClick={() => setActiveIndex(index)}
        className={`rounded-md w-1/2 h-[2rem] text-[.75rem] font-medium ${
          activeIndex === index
            ? 'bg-black text-white dark:bg-primary/10 dark:text-primary'
            : 'bg-transparent hover:dark:bg-primary/10 hover:dark:text-primary text-muted-foreground'
        }`}
      >
        {item.title}
      </Button>
    ))}
  </div>
))
TabButtons.displayName = 'TabButtons'

export default function UsersDetail({ user, onClose }: { user: UserDetail, onClose: () => void }) {
  const { data: userDetail } = useUserDetail(user?.id || '')

  const [activeIndex, setActiveIndex] = useState<number>(0)

  const userInfoItems = useMemo(() => [
    {
      title: 'User Information',
      content: (
        <div className="flex flex-col gap-4">
          <InfoItem icon={<User className="h-4 w-4" />} label="Name" value={userDetail?.name || 'Not available'} />
          <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={userDetail?.email || 'Not available'} />
          <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone" value={userDetail?.phone || 'Not available'} />
        </div>
      )
    },
    {
      title: 'Company Information',
      content: (
        <div className="grid grid-cols-2 gap-4">
          <InfoItem icon={<Building className="h-4 w-4" />} label="Company Name" value={userDetail?.companyName || 'Not available'} />
          <InfoItem icon={<Briefcase className="h-4 w-4" />} label="Company ID" value={userDetail?.companyId || 'Not available'} />
          <InfoItem icon={<Phone className="h-4 w-4" />} label="Company Phone" value={userDetail?.companyPhone || 'Not available'} />
          <InfoItem icon={<Mail className="h-4 w-4" />} label="Company Email" value={userDetail?.companyEmail || 'Not available'} />
          <div className="col-span-2">
            <InfoItem icon={<MapPin className="h-4 w-4" />} label="Company Address" value={userDetail?.companyAddress || 'Not available'} />
          </div>
        </div>
      )
    }
  ], [userDetail])

  const handleSetActiveIndex = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  if (!userDetail) return null

  return (
    <div className="space-y-6">
      <UserHeader userDetail={userDetail} />

      <TabButtons items={userInfoItems} activeIndex={activeIndex} setActiveIndex={handleSetActiveIndex} />

      <div className='border-t pt-[.65rem] border-zinc-200 dark:border-zinc-700'>
        <TransitionPanel
          activeIndex={activeIndex}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          variants={{
            enter: { opacity: 0, x: -50, filter: 'blur(4px)' },
            center: { opacity: 1, x: 0, filter: 'blur(0px)' },
            exit: { opacity: 0, x: 50, filter: 'blur(4px)' }
          }}
        >
          {userInfoItems.map((item, index) => (
            <div key={index}>
              {item.content}
            </div>
          ))}
        </TransitionPanel>
      </div>

      <DialogFooter>
        <Button
          onClick={onClose}
          className="bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary"
        >
          Close
        </Button>
      </DialogFooter>
    </div>
  )
}
