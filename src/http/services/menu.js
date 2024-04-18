import {
  LIST_MENU_ENDPOINT,
  MENU_DETAIL_ENDPOINT,
  LIST_MENU_AUTH_ENDPOINT,
  MENU_DETAIL_AUTH_ENDPOINT
} from '@/http/endpoints/menu'
import { response } from '@/http/response'
import { getIsLoggedIn } from '@/utils/auth'

export default (axiosInstance) => ({
  getListMenus(params) {
    return response(
      axiosInstance.get(getIsLoggedIn() ? LIST_MENU_AUTH_ENDPOINT : LIST_MENU_ENDPOINT, {
        params
      })
    )
  },
  viewMenuDetail(payload) {
    return response(
      axiosInstance.get(
        getIsLoggedIn() ? MENU_DETAIL_AUTH_ENDPOINT(payload) : MENU_DETAIL_ENDPOINT(payload)
      )
    )
  }
})
