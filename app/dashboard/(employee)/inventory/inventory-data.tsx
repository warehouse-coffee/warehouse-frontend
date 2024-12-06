'use client'

import { format } from 'date-fns'
import { Pencil } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { useDialog } from '@/hooks/useDialog'
import { formatCurrency } from '@/lib/utils'
import { Inventory } from '@/types'

import SafeStockForm from './safe-stock-form'

interface InventoryDataProps {
  data: Inventory[]
  table: any
}

export default function InventoryData({ data, table }: InventoryDataProps) {
  const {
    itemRef,
    dialogsOpen,
    openDialog,
    closeDialog
  } = useDialog<number>({
    edit: false
  })

  const handleOpenDialog = (open: boolean, id: number) => {
    if (open) {
      openDialog('edit', id)
    } else {
      closeDialog('edit')
    }
  }

  const rows = table.getRowModel().rows

  if (rows.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
          No inventory data found.
        </TableCell>
      </TableRow>
    )
  }

  return rows.map((row: any) => {
    const rowId = row.getValue('id')
    const isDialogOpen = dialogsOpen.edit && itemRef.current === rowId

    return (
      <TableRow key={rowId}>
        <TableCell className="text-center">#{rowId}</TableCell>
        <TableCell className="text-center">{row.getValue('productName')}</TableCell>
        <TableCell className="text-center">{row.getValue('availableQuantity')}</TableCell>
        <TableCell className="text-center">
          {format(new Date(row.getValue('expiration')), 'dd/MM/yyyy')}
        </TableCell>
        <TableCell className="text-center">{formatCurrency(row.getValue('totalPrice'))}</TableCell>
        <TableCell className="text-center">{formatCurrency(row.getValue('totalSalePrice'))}</TableCell>
        <TableCell className="text-center">
          <Dialog
            open={isDialogOpen}
            onOpenChange={(open) => handleOpenDialog(open, rowId)}
          >
            <DialogTrigger asChild>
              <button className="group inline-flex items-center gap-2 px-2 py-1 rounded-md bg-accent text-accent-foreground">
                <span>{row.getValue('safeStock')}</span>
                <Pencil className="h-3.5 w-3.5" />
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-[28rem]" onCloseAutoFocus={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>Annual Safe Stock Calculation</DialogTitle>
                <DialogDescription className="space-y-2">
                  <p>Set the safe stock level for this inventory item for the entire year.</p>
                  <div className="mt-2 rounded-md">
                    <p className="text-sm font-medium">What is Safe Stock?</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Safe stock is the minimum inventory level you want to maintain throughout the year to:
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-2">
                      <li>Prevent stockouts</li>
                      <li>Handle demand fluctuations</li>
                      <li>Account for lead time variations</li>
                    </ul>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <SafeStockForm inventoryId={rowId} onClose={() => closeDialog('edit')} />
            </DialogContent>
          </Dialog>
        </TableCell>
        <TableCell className="text-center">
          {row.getValue('status') === 'In Stock' ? (
            <Badge variant="outline" className="dark:bg-primary/10 dark:text-primary">
              {row.getValue('status')}
            </Badge>
          ) : row.getValue('status') === 'Low Stock' ? (
            <Badge variant="outline" className="dark:bg-yellow-100/10 dark:text-yellow-400">
              {row.getValue('status')}
            </Badge>
          ) : (
            <Badge variant="destructive" className="dark:bg-destructive/30 dark:text-red-500">
              {row.getValue('status')}
            </Badge>
          )}
        </TableCell>
      </TableRow>
    )
  })
}