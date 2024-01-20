import { Router } from 'express'
import { container } from 'tsyringe'
import { adaptRoute } from '../../adapters/ExpressRouteAdapter'
import { GetOpenProductionOrdersController } from '../../controllers/GetOpenProductionOrdersController'

function registerProductionOrderRoutes(router: Router) {
  // router.patch('/production-orders/:productionOrderId', adaptRoute(container.resolve()))
  router.get('/production-orders', adaptRoute(container.resolve(GetOpenProductionOrdersController)))

  return router
}

export { registerProductionOrderRoutes }