import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
  } from '@/components/ui/breadcrumb'
  import OrderTable from './order-table'

const sampleOrders = [
  {
    "orderId": "5c1d646d-e182-470e-b3af-5e5f8cc9798d",
    "type": "Import",
    "date": "2024-11-17T21:14:45.522888Z",
    "totalPrice": 216.00,
    "orderDetailsCount": 0,
    "totalQuantity": 0
  },
  {
    "orderId": "ab7fccc1-ab25-41a1-aec0-06bc5dc5499c",
    "type": "Import",
    "date": "2024-11-17T21:25:00.755297Z",
    "totalPrice": 216.00,
    "orderDetailsCount": 0,
    "totalQuantity": 0
  },
  {
    "orderId": "934e7b11-c0a8-4289-8069-8283316444d8",
    "type": "Import",
    "date": "2024-11-17T21:26:39.248911Z",
    "totalPrice": 216.00,
    "orderDetailsCount": 0,
    "totalQuantity": 0
  },
  {
    "orderId": "69933936-eae6-4edb-ad11-96ce4d336754",
    "type": "Import",
    "date": "2024-11-17T21:26:49.164018Z",
    "totalPrice": 216.00,
    "orderDetailsCount": 0,
    "totalQuantity": 0
  },
  {
    "orderId": "333f1a8f-c30b-43bc-9893-ee4b78852bb4",
    "type": "Sale",
    "date": "2024-11-17T21:26:56.15852Z",
    "totalPrice": 316.00,
    "orderDetailsCount": 0,
    "totalQuantity": 0
  },
  {
    "orderId": "cc087e37-cf65-4afc-b02f-dd74a2b8b197",
    "type": "Sale",
    "date": "2024-11-17T21:25:10.356648Z",
    "totalPrice": 316.00,
    "orderDetailsCount": 0,
    "totalQuantity": 0
  },
  {
    "orderId": "d814d65f-c6b8-4ed2-b35b-03f52580ca3c",
    "type": "Import",
    "date": "2024-11-20T15:02:55.271776Z",
    "totalPrice": 216.00,
    "orderDetailsCount": 0,
    "totalQuantity": 0
  },
  {
    "orderId": "9f8c17e5-f464-4131-b883-d7e8accd1b8b",
    "type": "Sale",
    "date": "2024-12-30T14:00:00Z",
    "totalPrice": 116.00,
    "orderDetailsCount": 0,
    "totalQuantity": 0
  },
  {
    "orderId": "00083f43-e2c5-4a89-af67-9234ab856a10",
    "type": "Sale",
    "date": "2024-11-20T15:02:55.271Z",
    "totalPrice": 116.00,
    "orderDetailsCount": 0,
    "totalQuantity": 0
  },
  {
    "orderId": "9a318bd0-7cb0-4949-b8ee-cb13fb2df785",
    "type": "Import",
    "date": "2024-11-20T15:17:58.06294Z",
    "totalPrice": 216.00,
    "orderDetailsCount": 0,
    "totalQuantity": 0
  }
]

const initialPage = {
  size: 10,
  pageNumber: 1,
  totalElements: 10,
  totalPages: 1,
  sortBy: "Id",
  sortAsc: true
}

  
  export default function OrdersPage() {
    return (
      <>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Orders</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-[.5rem]">
          <div className="flex flex-col gap-[.3rem]">
            <h1 className="text-[1.5rem] font-bold">Orders Management</h1>
            <p className="text-[.85rem] text-muted-foreground">
              Manage orders and assign their roles effectively here.
            </p>
          </div>
            <div className="container mx-auto py-10">
            <OrderTable initialOrders={sampleOrders} initialPage={initialPage} />
            </div>
        </div>
      </>
    )
  }