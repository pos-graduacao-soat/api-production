import 'reflect-metadata'
import { config } from 'dotenv'

config()

import { initializeContainer } from './factories'
import { startHttpServer } from '../presentation/gateway/httpServer'
import { container } from 'tsyringe'
import { GetNewOrdersScheduler } from '../infra/schedulers/GetNewOrders'

async function startApp() {
  await initializeContainer()
  startHttpServer()

  const scheduler = container.resolve<GetNewOrdersScheduler>('GetNewOrdersScheduler')
  scheduler.execute()
}

startApp().catch(error => {
  console.error('Failed to start app:', error)
})