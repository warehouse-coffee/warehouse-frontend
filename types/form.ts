export type CreateUserInput = {
  userName: string;
  password: string;
  email: string;
  phoneNumber: string;
  companyId: string
  roleName: string
}

export type CreateEmployeeInput = {
  userName?: string | undefined;
  password?: string | undefined;
  email?: string | undefined;
  phoneNumber?: string | undefined;
  warehouses?: number[] | undefined;
}

export type CreateImportOrderInput = {
  orderNumber: string;
  orderDate: string;
  supplierId: string;
}

export type CreateUser = CreateUserInput
export type CreateEmployee = CreateEmployeeInput
export type CreateImportOrder = CreateImportOrderInput