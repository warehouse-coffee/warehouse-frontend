import { useState, useCallback, useRef } from 'react'

import { DialogType } from '@/constants'
import { DialogState } from '@/types'

export function useDialog<T>(initialState: DialogState = {
  detail: false,
  edit: false,
  delete: false
}) {
  const [dialogsOpen, setDialogsOpen] = useState<DialogState>(initialState)
  const itemRef = useRef<T | null>(null)

  const openDialog = useCallback((type: DialogType, item: T) => {
    itemRef.current = item
    setDialogsOpen(prev => ({ ...prev, [type]: true }))
  }, [])

  const closeDialog = useCallback((type: DialogType) => {
    setDialogsOpen(prev => ({ ...prev, [type]: false }))
    setTimeout(() => {
      itemRef.current = null
    }, 250)
  }, [])

  return {
    dialogsOpen,
    itemRef,
    openDialog,
    closeDialog,
    setDialogsOpen
  }
}