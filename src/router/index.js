import { createRouter, createWebHistory } from 'vue-router'
import { setupAfterEach, setupBeforeEach } from './guard'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  scrollBehavior() {
    return Promise.resolve({ left: 0, top: 0, behavior: 'smooth' })
  }
})

// Before each route evaluates...
setupBeforeEach(router)

// Before resolve route evaluates...
// setupBeforeResolve(router)

// When each route is finished evaluating...
setupAfterEach(router)

export default router
