import { ValueObject } from './valueObject'
import { OrderProduct } from './OrderProduct'

export class Order extends ValueObject<Order> {
  public constructor(props: Partial<Order>) {
    super(props)
  }
  public id: string
  public products: OrderProduct[]

  public status: Status

  public totalPrice: number
}

export enum Status {
  WAITINGPAYMENT = 'WAITING_PAYMENT',
  PAYMENTPROBLEM = 'PAYMENT_PROBLEM',
  SUCCESSFULPAYMENT = 'SUCCESSFUL_PAYMENT',
  RECEIVED = 'RECEIVED',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DONE = 'DONE',
}
