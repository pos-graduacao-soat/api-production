import { CreateProductionOrderDTO } from './CreateProductionOrderDTO'

export interface ICreateProductionOrderUseCase {
  execute: (params: CreateProductionOrderDTO) => Promise<void>
}