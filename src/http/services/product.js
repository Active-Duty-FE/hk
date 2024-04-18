import {
  CREATE_REVIEW,
  GET_PRODUCT_DETAIL,
  GET_PRODUCT_DETAIL_AUTH,
  GET_REVIEW_LIST_BY_PRODUCT,
  GET_REVIEW_LIST_BY_PRODUCT_AUTH,
  LIST_PRODUCT_AUTH_ENDPOINT,
  LIST_PRODUCT_ENDPOINT,
  PRODUCT_REGISTER_ENDPOINT,
  SEARCH_PRODUCT_AUTH_ENDPOINT,
  SEARCH_PRODUCT_ENDPOINT,
  GET_MY_IP_ADDRESS,
  LIST_PRODUCT_BAG_AUTH_ENDPOINT,
  GET_CMS_MAIN,
  GET_PRODUCT_RITUALS,
  GET_PUBLIC_PRODUCT_RITUALS
} from '@/http/endpoints/product'
import { GET_LINK_CATEGORY_LIST } from '@/http/endpoints/main'
import { response } from '@/http/response'
import { getIsLoggedIn } from '@/utils/auth'

export default (axiosInstance) => ({
  getProductDetail(id) {
    return response(
      axiosInstance.get(getIsLoggedIn() ? GET_PRODUCT_DETAIL_AUTH(id) : GET_PRODUCT_DETAIL(id))
    )
  },
  getListProducts(params) {
    return response(
      axiosInstance.get(getIsLoggedIn() ? LIST_PRODUCT_AUTH_ENDPOINT : LIST_PRODUCT_ENDPOINT, {
        params
      })
    )
  },
  getProductBagList(params) {
    return response(axiosInstance.get(LIST_PRODUCT_BAG_AUTH_ENDPOINT, { params }))
  },
  getReviewListByProduct(id, params) {
    return response(
      axiosInstance.get(
        getIsLoggedIn() ? GET_REVIEW_LIST_BY_PRODUCT_AUTH(id) : GET_REVIEW_LIST_BY_PRODUCT(id),
        {
          params
        }
      )
    )
  },
  createReview(payload) {
    return response(axiosInstance.post(CREATE_REVIEW, payload))
  },
  getProductRegister(params) {
    return response(axiosInstance.get(PRODUCT_REGISTER_ENDPOINT, { params }))
  },
  searchListProducts(params) {
    return response(
      axiosInstance.get(getIsLoggedIn() ? SEARCH_PRODUCT_AUTH_ENDPOINT : SEARCH_PRODUCT_ENDPOINT, {
        params
      })
    )
  },
  getMyIpAddress() {
    return response(axiosInstance.get(GET_MY_IP_ADDRESS))
  },
  getCmSMain(params) {
    return response(axiosInstance.get(GET_CMS_MAIN, { params }))
  },
  getProductCategories(id, params) {
    return response(axiosInstance.get(GET_PRODUCT_RITUALS(id), { params }))
  },
  getProductPublicCategories(id, params) {
    return response(axiosInstance.get(GET_PUBLIC_PRODUCT_RITUALS(id), { params }))
  },
  getLinkToCategory(params) {
    return response(axiosInstance.get(GET_LINK_CATEGORY_LIST, { params }))
  }
})
