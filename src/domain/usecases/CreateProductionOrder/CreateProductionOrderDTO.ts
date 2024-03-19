export interface CreateProductionOrderDTO {
  order: {
    id: string
    status: string
    totalPrice: number
    createdAt: Date
    updatedAt: Date
    products: {
      id: string
      name: string
      quantity: number
      price: number
    }[]
  }
}