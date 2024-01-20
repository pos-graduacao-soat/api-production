import { Router } from 'express'
import { container } from 'tsyringe'
import { adaptRoute } from '../../adapters/ExpressRouteAdapter'

function registerProductionOrderRoutes(router: Router) {
  // router.patch('/production-orders/:productionOrderId', adaptRoute(container.resolve()))
  // router.get('/production-orders/:productionOrderId', adaptRoute(container.resolve()))

  return router
}

export { registerProductionOrderRoutes }