import { Trash } from 'lucide-react'
import React, { useCallback } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Loader } from '@/components/ui/loader'
import { TableCell, TableRow } from '@/components/ui/table'
import { useDeleteOrder } from '@/hooks/order'
import { useDialog } from '@/hooks/useDialog'
import { formatDate, formatCurrency } from '@/lib/utils'
import { SaleOrder } from '@/types'

interface SaleDataProps {
  data: SaleOrder[]
  table: any
}

export default function SaleData({ data, table }: SaleDataProps) {
  const {
    dialogsOpen,
    itemRef: saleOrderRef,
    closeDialog,
    openDialog,
    setDialogsOpen
  } = useDialog<SaleOrder>({
    delete: false
  })

  const deleteSaleOrderMutation = useDeleteOrder('sale', () => {
    closeDialog('delete')
  })

  const handleDeleteSaleOrder = useCallback((saleOrder: SaleOrder) => {
    openDialog('delete', saleOrder)
  }, [openDialog])

  const confirmDeleteSaleOrder = useCallback(() => {
    if (saleOrderRef.current) {
      deleteSaleOrderMutation.mutate(saleOrderRef.current.orderId)
    }
  }, [deleteSaleOrderMutation, saleOrderRef])

  const rows = table.getRowModel().rows

  if (rows.length === 0) {
    return (
      <TableRow>
        <TableCell
          colSpan={7}
          className="h-24 text-center text-muted-foreground"
        >
          No import orders available.
        </TableCell>
      </TableRow>
    )
  }

  return (
    <>
      {rows.map((row: any) => {
        const order = row.original
        return (
          <TableRow key={order.orderId}>
            <TableCell className="text-center">
              {order.orderId}
            </TableCell>
            <TableCell className="text-center">
              <Badge variant="outline" className="dark:bg-primary/10 dark:text-primary">
                {order.type}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              {formatDate(order.date)}
            </TableCell>
            <TableCell className="text-center">
              {formatCurrency(order.totalPrice)}
            </TableCell>
            <TableCell className="text-center">
              {order.orderDetailsCount}
            </TableCell>
            <TableCell className="text-center">
              {order.totalQuantity}
            </TableCell>
            <TableCell className="text-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleDeleteSaleOrder(order)}
              >
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </TableCell>
          </TableRow>
        )
      })}

      <Dialog open={dialogsOpen.delete} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, delete: open }))}>
        <DialogContent className="w-[26.5rem]">
          <DialogHeader>
            <DialogTitle>Delete Sale Order</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this sale order?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" onClick={() => closeDialog('delete')} variant="outline">Cancel</Button>
            <Button
              type="submit"
              className={`bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary ${deleteSaleOrderMutation.isPending ? 'flex items-center gap-3 cursor-not-allowed pointer-events-none' : ''}`}
              onClick={confirmDeleteSaleOrder}
            >
              {deleteSaleOrderMutation.isPending ? (
                <>
                  Deleting...
                  <Loader color="#62c5ff" size="1.25rem" />
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}