import storage from '@/utils/storage'
import { STORAGE_ACCESS_TOKEN } from '@/helpers/constant'
import { AppRoutes } from './path'
import { getSaveTokenStorage } from '@/utils/auth'

const defaultRoutePath = ''

const SPECIAL_PATH = [AppRoutes.register.complete.name, AppRoutes.register.businessInformation.name]

export function setupBeforeEach(router) {
  router.beforeEach((routeTo, routeFrom, next) => {
    const accessToken = storage.get(STORAGE_ACCESS_TOKEN, getSaveTokenStorage())
    if (routeTo.meta.requiredAuth && !accessToken) {
      next({ path: AppRoutes.login.path, query: { redirect: routeTo.fullPath } })
    } else if (routeTo.meta.authRoute && accessToken && !SPECIAL_PATH.includes(routeTo.name)) {
      if (routeTo?.query?.referrerCode) {
        window.referrerCode = routeTo?.query?.referrerCode
      }
      next({ path: defaultRoutePath })
    } else {
      next()
    }
  })
}

// NEED enhance in next sprint
// export function setupBeforeResolve(router) {
//   router.beforeResolve(async (routeTo, routeFrom, next) => {
//     try {
//       for (const route of routeTo.matched) {
//         await new Promise((resolve, reject) => {
//           if (route?.meta?.beforeResolve) {
//             route.meta.beforeResolve(routeTo, routeFrom, (...args) => {
//               if (args.length) {
//                 if (routeFrom.name === args[0].name) {
//                   //
//                 }
//                 next(...args)
//                 reject(new Error('Redirected'))
//               } else {
//                 resolve()
//               }
//             })
//           } else {
//             resolve()
//           }
//         })
//       }
//     } catch (error) {
//       return
//     }
//     next()
//   })
// }

export function setupAfterEach(router) {
  router.afterEach(() => {})
}
