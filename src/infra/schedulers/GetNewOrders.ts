import { inject, injectable } from 'tsyringe'
import { IGetNewOrdersUseCase } from '../../domain/usecases/GetNewOrders/IGetNewOrders'

@injectable()
export class GetNewOrdersScheduler {
  constructor(
    @inject('IGetNewOrdersUseCase')
    readonly getNewOrdersUseCase: IGetNewOrdersUseCase
  ) { }

  async execute(): Promise<void> {
    console.log('[GetNewOrdersScheduler] Starting scheduler...')

    setInterval(async () => {
      await this.getNewOrdersUseCase.execute()
    }, 10000)
  }
}
