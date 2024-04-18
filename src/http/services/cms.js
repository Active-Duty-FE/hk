import {
  GET_CONTACT_US,
  GET_CONTENT_EXPLORE,
  GET_DETAIL_CONTENT_EXPLORE,
  GET_POLICY,
  GET_LIST_PRODUCT_RITUALS,
  GET_LIST_PRODUCT_RITUALS_PUBLIC
} from '@/http/endpoints/cms'
import { response } from '@/http/response'

export default (axiosInstance) => ({
  getContentExplore(params, payload) {
    return response(axiosInstance.post(GET_CONTENT_EXPLORE, payload, { params }))
  },
  getDetailContent(id, params) {
    return response(axiosInstance.get(GET_DETAIL_CONTENT_EXPLORE(id), { params }))
  },
  getContactUsDetail() {
    return response(axiosInstance.get(GET_CONTACT_US))
  },
  getPolicyList(payload, params) {
    return response(axiosInstance.post(GET_POLICY, payload, { params }))
  },
  getListProductRitualExplore(params) {
    return response(axiosInstance.get(GET_LIST_PRODUCT_RITUALS, { params }))
  },
  getListProductRitualPublicExplore(params) {
    return response(axiosInstance.get(GET_LIST_PRODUCT_RITUALS_PUBLIC, { params }))
  }
})
