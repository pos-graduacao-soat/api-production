import { inject, injectable } from 'tsyringe'
import { IProductionOrderRepository } from '../../../domain/ports/repositories/ProductionOrder'
import { RedisClient } from '../../database/RedisClient'
import { ProductionOrder, Status } from '../../../domain/entities/ProductionOrder'

@injectable()
export class RedisProductionOrderRepository implements IProductionOrderRepository {
  constructor(
    @inject('RedisClient') protected readonly redisClient: RedisClient
  ) { }

  async create(productionOrder: ProductionOrder): Promise<void> {
    const key = `production-order:${productionOrder.id}`
    const value = JSON.stringify(productionOrder)

    await this.redisClient.set(key, value)
  }

  async getById(productionOrderId: string): Promise<ProductionOrder | null> {
    const key = `production-order:${productionOrderId}`
    const value = await this.redisClient.get(key)

    if (!value) return null

    const productionOrder = JSON.parse(value) as ProductionOrder

    return productionOrder
  }

  async updateStatus(productionOrderId: string, status: Status): Promise<void> {
    const key = `production-order:${productionOrderId}`
    const value = await this.redisClient.get(key)

    if (!value) throw new Error('Production order not found in redis')

    const currentProductionOrder = JSON.parse(value) as ProductionOrder

    const productionOrder = new ProductionOrder({
      ...currentProductionOrder,
      status
    })

    const updatedValue = JSON.stringify(productionOrder)

    await this.redisClient.set(key, updatedValue)
  }

  async list(filters: Partial<ProductionOrder>): Promise<ProductionOrder[]> {
    const keys = await this.redisClient.keys('*')

    const orders: ProductionOrder[] = []

    for (const key of keys) {
      const valueFound = await this.redisClient.get(key)

      if (!valueFound) throw new Error('Production order not found in redis')

      const productionOrder = JSON.parse(valueFound) as ProductionOrder

      if (this.matchesStatusFilter(productionOrder, filters)) {
        orders.push(productionOrder)
      }
    }

    return orders
  }

  async delete(productionOrderId: string): Promise<void> {
    const key = `production-order:${productionOrderId}`

    return this.redisClient.del(key)
  }

  private matchesStatusFilter(productionOrder: ProductionOrder, filters: Partial<ProductionOrder>): boolean {
    if (!filters.status) {
      return true
    }

    return productionOrder.status === filters.status
  }
}