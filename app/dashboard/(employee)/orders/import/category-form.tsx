'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Package, Plus, Boxes, Trash } from 'lucide-react'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/ui/loader'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useGetCategoryList, useCreateCategory, useDeleteCategory } from '@/hooks/category'
import { useDialog } from '@/hooks/useDialog'
import { cn } from '@/lib/utils'
import { Category } from '@/types'

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required')
})

type CategoryFormValues = z.infer<typeof categorySchema>

export default function CategoryForm({ onClose }: { onClose: () => void }) {
  const {
    itemRef: categoryRef,
    dialogsOpen,
    setDialogsOpen,
    closeDialog,
    openDialog
  } = useDialog<Category>({
    addCategory: false,
    delete: false
  })
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: ''
    }
  })

  const { data: categoryList } = useGetCategoryList()
  const createCategoryMutation = useCreateCategory(() => closeDialog('addCategory'))

  function onSubmit(data: CategoryFormValues) {
    createCategoryMutation.mutate(data)
  }

  const deleteCategoryMutation = useDeleteCategory(() => {
    closeDialog('delete')
  })

  const handleDeleteCategory = useCallback((category: Category) => {
    openDialog('delete', category)
  }, [openDialog])

  const confirmDeleteCategory = useCallback(() => {
    if (categoryRef.current) {
      deleteCategoryMutation.mutate(categoryRef.current.id.toString())
    }
  }, [deleteCategoryMutation, categoryRef])

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Boxes className="size-5" />
            <h4 className="text-lg font-semibold">Available Categories</h4>
          </div>
          <Dialog open={dialogsOpen.addCategory} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, addCategory: open }))}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-black text-white hover:bg-black hover:text-white dark:bg-primary/10 dark:text-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[25rem]">
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Fill in the category details below
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter category name"
                    {...form.register('name')}
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    className={cn(
                      'bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary',
                      createCategoryMutation.isPending && 'flex items-center gap-3 cursor-wait pointer-events-none'
                    )}
                    type="submit"
                  >
                    {createCategoryMutation.isPending ? (
                      <>
                        Creating...
                        <Loader color="#62c5ff" size="1.25rem" />
                      </>
                    ) : (
                      'Add Category'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-lg">
          <div className="grid grid-cols-12 gap-4 p-4 border-b text-sm font-medium text-muted-foreground">
            <div className="col-span-2">ID</div>
            <div className="col-span-8">Name</div>
            <div className="col-span-2 text-center">Action</div>
          </div>
          <ScrollArea className="max-h-[25rem]">
            <div className="divide-y">
              {!categoryList.length ? (
                <div className="p-4 text-sm text-center text-muted-foreground">No categories found.</div>
              ) : (
                categoryList.map((category: Category) => (
                  <div
                    key={category.id}
                    className="grid grid-cols-12 gap-4 p-4 items-center text-sm"
                  >
                    <div className="col-span-2 font-medium">
                      #{category.id}
                    </div>
                    <div className="col-span-8">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        {category.name}
                      </div>
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteCategory(category)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-accent"
          >
            Cancel
          </Button>
        </DialogFooter>
      </div>
      <Dialog open={dialogsOpen.delete} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, delete: open }))}>
        <DialogContent className="w-[26.5rem]">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button className={cn('bg-accent')} type="button" variant="outline" onClick={() => closeDialog('delete')}>Cancel</Button>
            <Button
              type="submit"
              className={`bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary ${deleteCategoryMutation.isPending ? 'flex items-center gap-3 cursor-not-allowed pointer-events-none' : ''}`}
              onClick={confirmDeleteCategory}
            >
              {deleteCategoryMutation.isPending ? (
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