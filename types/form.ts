export type CreateUserInput = {
  userName: string;
  password: string;
  email: string;
  phoneNumber: string;
  companyId: string
  roleName: string
}

export type CreateUser = CreateUserInput