// import React, { useState, useCallback } from 'react'

// import { Button } from '@/components/ui/button'
// import { DialogFooter } from '@/components/ui/dialog'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import { Loader } from '@/components/ui/loader'
// import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { useCreateImportOrder } from '@/hooks/orders'
// import { cn } from '@/lib/utils'

// const initialFormState = {
//   productName: '',
//   quantity: '',
//   price: '',
//   supplierId: '',
//   status: 'PENDING'
// }

// export default function AddOrderForm({ onClose }: { onClose: () => void }) {
//   const [createForm, setCreateForm] = useState(initialFormState)
//   const createOrderMutation = useCreateImportOrder(onClose)

//   const handleCreateOrder = useCallback((e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault()
//     createOrderMutation.mutate(createForm)
//   }, [createForm, createOrderMutation])

//   const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setCreateForm(prev => ({ ...prev, [name]: value }))
//   }, [])

//   return (
//     <form onSubmit={handleCreateOrder}>
//       <div className="flex flex-col gap-4">
//         {/* Form fields */}
//       </div>
//       <DialogFooter className="mt-6">
//         <Button type="button" variant="outline" className={cn('bg-accent')} onClick={() => setCreateForm(initialFormState)}>
//           Reset
//         </Button>
//         <Button
//           type="submit"
//           className={cn(
//             'bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary',
//             createOrderMutation.isPending && 'flex items-center gap-3 cursor-wait pointer-events-none'
//           )}
//         >
//           {createOrderMutation.isPending ? (
//             <>
//               Adding...
//               <Loader color="#62c5ff" size="1.25rem" />
//             </>
//           ) : (
//             'Add order'
//           )}
//         </Button>
//       </DialogFooter>
//     </form>
//   )
// }