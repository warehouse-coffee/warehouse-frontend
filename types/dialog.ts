import { DialogType } from '@/constants'

export type DialogState = {
  [key in DialogType]?: boolean
}