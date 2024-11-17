import { EmployeeDetail } from './employee'
import { User } from './user'

export type UpdateUser = User & {
  password?: string
}

export type UpdateEmployee = EmployeeDetail;