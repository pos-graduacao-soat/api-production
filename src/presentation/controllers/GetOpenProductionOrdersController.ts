import { inject, injectable } from 'tsyringe'
import { IController } from '../interfaces/IController'
import { IHttpRequest } from '../interfaces/IHttpRequest'
import { ok } from '../adapters/HttpResponseAdapter'
import { IHttpResponse } from '../interfaces/IHttpResponse'
import { IGetOpenProductionOrdersUseCase } from '../../domain/usecases/GetOpenProductionOrders/IGetOpenProductionOrders'

@injectable()
export class GetOpenProductionOrdersController implements IController {
  constructor(
    @inject('IGetOpenProductionOrdersUseCase')
    readonly getOpenProductionOrdersUseCase: IGetOpenProductionOrdersUseCase
  ) { }
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const { status } = httpRequest.query

    const result = await this.getOpenProductionOrdersUseCase.get({ status })

    return ok(result)
  }
} 