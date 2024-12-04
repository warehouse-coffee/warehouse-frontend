export type Order = {
  orderId: string
  type: string
  date: string
  totalPrice: number
  orderDetailsCount: number
  totalQuantity: number
}

export type ImportOrder = Order

export type SaleOrder = Order

export type TopOrder = {
  id: string
  type: string
  status: string
  date: string
  totalPrice: number
}

export type TopOrderResponse = {
  saleOrders: TopOrder[]
  importOrders: TopOrder[]
}

export interface ImportOrderFormData {
  totalPrice: number
  customerName: string
  customerPhoneNumber: string
  products: {
    name: string
    unit: string
    quantity: number
    price: number
    note: string
    expiration: string
    categoryId: number
    areaId: number
    storageId: number
  }[]
}

export interface SaleOrderFormData {
  totalPrice: number
  customerId: number
  dateExport: string
  products: {
    productName: string
    quantity: number
    price: number
    expectedPickupDate: string
  }[]
}