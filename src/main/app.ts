import 'reflect-metadata'
import { config } from 'dotenv'

config()

import { initializeContainer, startConsumers } from './factories'
import { startHttpServer } from '../presentation/gateway/httpServer'

async function startApp() {
  await initializeContainer()
  await startConsumers()
  startHttpServer()
}

startApp().catch(error => {
  console.error('Failed to start app:', error)
})