import { Entity } from './Entity'

export class ProductionOrderProduct extends Entity<ProductionOrderProduct> {
  constructor(props: Partial<ProductionOrderProduct>) {
    super(props)
  }

  public name: string

  public quantity: number
}