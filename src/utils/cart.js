import apiService from '@/http/api'
import { useCartStore } from '@/stores/modules/cart'
import { caculateNfrCartBadge } from '@/utils/common'

export const addProductToCart = async (payload) => {
  return await apiService.cartService.addProductToCart(payload)
}

export const getCurrentCartBadge = async () => {
  const { setStandardCartBadge, setAutoShipCartBadge, setNfrCartBadge } = useCartStore()
  const standardResponse = apiService.cartService.getStandardCartBadge()
  const autoShipResponse = apiService.cartService.getAutoShipCartBadge()
  const nfrResponse = apiService.cartService.getNfrCartList()
  const { data: standardData } = await standardResponse
  const { data: autoShipData } = await autoShipResponse
  const { data: nfrData } = await nfrResponse
  setStandardCartBadge(standardData?.totalCartCount)
  setAutoShipCartBadge(autoShipData?.quantitySum)
  setNfrCartBadge(caculateNfrCartBadge(nfrData))
}
