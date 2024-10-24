export const DIALOG_TYPES = {
  EDIT: 'edit',
  DETAIL: 'detail',
  DELETE: 'delete',
  ADD: 'add'
} as const

export type DialogType = typeof DIALOG_TYPES[keyof typeof DIALOG_TYPES]
