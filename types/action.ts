import { User } from './user'

export type UpdateUser = User & {
  password: string
}