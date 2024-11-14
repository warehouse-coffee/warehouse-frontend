import { User } from './user'
import { EmployeeDetail } from './employee'

export type UpdateUser = User & {
  password: string
}

export type UpdateEmployee = EmployeeDetail;

