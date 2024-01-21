import { Router } from 'express'
import { container } from 'tsyringe'
import { adaptRoute } from '../../adapters/ExpressRouteAdapter'
import { GetOpenProductionOrdersController } from '../../controllers/GetOpenProductionOrdersController'
import { UpdateProductionOrderController } from '../../controllers/UpdateProductionOrderStatusController'

function registerProductionOrderRoutes(router: Router) {
  router.patch('/production-orders/:productionOrderId', adaptRoute(container.resolve(UpdateProductionOrderController)))
  router.get('/production-orders', adaptRoute(container.resolve(GetOpenProductionOrdersController)))

  return router
}

export { registerProductionOrderRoutes }