export type CreateUserInput = {
  userName: string;
  password: string;
  email: string;
  phoneNumber: string;
  companyId: string;
  roleName: string;
}

export type CreateEmployeeInput = {
  userName?: string | undefined;
  password?: string | undefined;
  email?: string | undefined;
  phoneNumber?: string | undefined;
  warehouses?: number[] | undefined;
}

export type CreateImportOrderInput = {
  customerName: string
  customerPhoneNumber: string
  products: {
    name: string,
    unit: string,
    quantity: number,
    price: number,
    note?: string,
    expiration: string,
    categoryId: number,
    areaId: number,
    storageId: number
  }[]
  totalPrice: number
}

export type CreateSaleOrderInput = {
  customerId: number
  dateExport: string
  products: {
    productName: string
    quantity: number
    price: number
    expectedPickupDate: string
  }[]
  totalPrice: number
}

export type CreateUser = CreateUserInput
export type CreateEmployee = CreateEmployeeInput
export type CreateImportOrder = CreateImportOrderInput
export type CreateSaleOrder = CreateSaleOrderInput