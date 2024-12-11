export const DIALOG_TYPES = {
  EDIT: 'edit',
  DETAIL: 'detail',
  DELETE: 'delete',
  ADD: 'add',
  ADD_CATEGORY: 'addCategory',
  MANAGE_CATEGORY: 'manageCategory'
} as const

export type DialogType = typeof DIALOG_TYPES[keyof typeof DIALOG_TYPES]
