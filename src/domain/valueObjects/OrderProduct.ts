import { ValueObject } from './valueObject'

export class OrderProduct extends ValueObject<OrderProduct>{
  public constructor(props: Partial<OrderProduct>) {
    super(props)
  }

  public id: string

  public name: string

  public quantity: number

  public price: number
}