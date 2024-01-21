import { inject, injectable } from 'tsyringe'
import { IController } from '../interfaces/IController'
import { IHttpRequest } from '../interfaces/IHttpRequest'
import { ok } from '../adapters/HttpResponseAdapter'
import { IHttpResponse } from '../interfaces/IHttpResponse'
import { IUpdateProductionOrderStatusUseCase } from '../../domain/usecases/UpdateProductionOrderStatus/IUpdateProductionOrderStatus'

@injectable()
export class UpdateProductionOrderController implements IController {
  constructor(
    @inject('IUpdateProductionOrderStatusUseCase')
    readonly updateProductionOrderStatusUseCase: IUpdateProductionOrderStatusUseCase
  ) { }
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { productionOrderId } = httpRequest.params
    const { status } = httpRequest.body

    await this.updateProductionOrderStatusUseCase.update({ status, productionOrderId })

    return ok()
  }
} 