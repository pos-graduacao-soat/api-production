import { Entity } from './Entity'
import { ProductionOrderProduct } from './ProductionOrderProduct'

export class ProductionOrder extends Entity<ProductionOrder> {
  public constructor(props: Partial<ProductionOrder>) {
    super(props)
  }

  public products: ProductionOrderProduct[]

  public status: Status

  public totalPrice: number
}

export enum Status {
  RECEIVED = 'RECEIVED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DONE = 'DONE',
}
