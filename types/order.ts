export type ImportOrder = {
  orderId: string
  type: string
  date: string
  totalPrice: number
  orderDetailsCount: number
  totalQuantity: number
}

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
