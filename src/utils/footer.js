import { getIsLoggedIn } from '@/utils/auth'
import { AppRoutes } from '@/router/path'
import { useAuthUserStore } from '@/stores/modules/auth-user'

export const handleTransitMenuFooter = (child, router) => {
  const authStore = useAuthUserStore()
  if (child?.externalLink && child?.url) {
    window.open(child?.url, '_blank')
    return
  }

  if (child?.tab && child?.url) {
    !getIsLoggedIn() && authStore.setActiveAuthenticationTab(child?.tab)
    router.push(!getIsLoggedIn() ? child?.url : AppRoutes.myPage.path)
    return
  }

  if (child?.url) {
    router.push(
      child?.typeExternal
        ? child?.url
        : {
          name: AppRoutes.product.productCategory.name,
          params: { category: child?.url }
        }
    )
  }
}
