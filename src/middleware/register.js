import { STORAGE_CURRENT_STEP } from '@/helpers/constant'
import { AppRoutes } from '@/router/path'
import storage from '@/utils/storage'

export default function middlewareRegister(to, from, next) {
  const fromPath = storage.get(STORAGE_CURRENT_STEP) || [
    `${AppRoutes.register.path}/${AppRoutes.register.onBoarding.path}`
  ]
  if (!fromPath.includes(to.path)) {
    // If the condition is not met, redirect to another route
    return next(fromPath[fromPath.length - 1])
  }
  // If the condition is met, allow access to the route
  return next()
}
