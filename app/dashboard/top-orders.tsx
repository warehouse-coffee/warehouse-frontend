'use client'

import { motion } from 'framer-motion'
import { memo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TransitionPanel } from '@/components/ui/transition-panel'
import { useGetTopOrders } from '@/hooks/order'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TopOrder } from '@/types'

const variants = {
  enter: { y: 20, opacity: 0 },
  center: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 }
}

export function TopOrders({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState<number>(0)
  const { data: ordersData } = useGetTopOrders()

  return (
    <Card id={id} className="w-full pb-3.5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2.5">
        <CardTitle className="text-xl font-medium">Top 5 Orders</CardTitle>
        <div className="flex items-center space-x-2">
          <Button
            variant={activeTab === 0 ? 'default' : 'ghost'}
            onClick={() => setActiveTab(0)}
            className={`${activeTab === 0 ? 'text-black dark:text-white' : 'text-muted-foreground'}
              relative bg-transparent h-9 text-sm hover:bg-transparent px-4`}
          >
            Sale Orders
            {activeTab === 0 && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[.1rem] dark:bg-primary bg-black"
                layoutId="activeTab"
              />
            )}
          </Button>
          <Button
            variant={activeTab === 1 ? 'default' : 'ghost'}
            onClick={() => setActiveTab(1)}
            className={`${activeTab === 1 ? 'text-black dark:text-white' : 'text-muted-foreground'}
              relative bg-transparent h-9 text-sm hover:bg-transparent px-4`}
          >
            Import Orders
            {activeTab === 1 && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-[0.125rem] bg-primary"
                layoutId="activeTab"
              />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-1.5 pb-2 flex-1">
        <TransitionPanel
          activeIndex={activeTab}
          variants={variants}
          transition={{ duration: 0.3 }}
          className="h-full"
        >
          {[
            <OrderList key="sales" orders={ordersData?.saleOrders} />,
            <OrderList key="imports" orders={ordersData?.importOrder} />
          ]}
        </TransitionPanel>
      </CardContent>
    </Card>
  )
}

const OrderList = memo(({ orders }: { orders?: TopOrder[] }) => {
  if (!orders || orders.length === 0) {
    return <p className="text-center text-muted-foreground py-[.75rem]">No orders found</p>
  }

  return (
    <div className="space-y-2">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
        >
          <div className="space-y-0.5">
            <p className="font-medium text-sm">{order.id}</p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>{order.type}</span>
              <span>•</span>
              <span>{formatDate(order.date)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`rounded-full text-xs font-medium py-1 px-1.5
                  ${
        order.status === 'Completed'
          ? 'dark:bg-primary/10 dark:text-primary'
          : 'dark:bg-yellow-100/10 dark:text-yellow-400'
        }`}
            >
              {order.status}
            </div>
            <p className="font-medium tabular-nums text-sm">{formatCurrency(order.totalPrice)}</p>
          </div>
        </div>
      ))}
    </div>
  )
})

OrderList.displayName = 'OrderList'