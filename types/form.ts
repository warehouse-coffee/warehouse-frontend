export type CreateUserInput = {
  userName: string;
  password: string;
  email: string;
  phoneNumber: string;
  companyId: string
  roleName: 'Super-Admin' | 'Admin' | 'Customer'
}

export type CreateUser = CreateUserInput