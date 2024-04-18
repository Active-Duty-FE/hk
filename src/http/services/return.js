import {
  CANCEL_EXCHANGE,
  CHECK_REJECT_EXCHANGE,
  CREATE_EXCHANGE,
  CREATE_RETURN_ORDER,
  DELIVERY_TRACKING_EXCHANGE,
  ESTIMATE_RETURN_ORDER,
  GET_REASON_FOR_REJECT,
  LOAD_PRODUCT_RETURN,
  REFUND_CONSENT_PROCESSING,
  RETURN_CANCELATION,
  RETURN_HISTORIES,
  RETURN_ORDER_DETAILS
} from '@/http/endpoints/return'
import { response } from '@/http/response'

export default (axiosInstance) => ({
  loadProductReturn(payload) {
    return response(axiosInstance.get(LOAD_PRODUCT_RETURN, { params: payload }))
  },
  createReturnOrder(payload) {
    return response(axiosInstance.post(CREATE_RETURN_ORDER, payload))
  },
  estimateReturnOrder(payload) {
    return response(axiosInstance.post(ESTIMATE_RETURN_ORDER, payload))
  },
  refundConsentProcessing(id, payload) {
    return response(axiosInstance.post(REFUND_CONSENT_PROCESSING(id), payload))
  },
  returnCancellation(id) {
    return response(axiosInstance.delete(RETURN_CANCELATION(id)))
  },
  getReasonForRejection(id) {
    return response(axiosInstance.get(GET_REASON_FOR_REJECT(id)))
  },
  getReturnHistories(payload) {
    return response(axiosInstance.get(RETURN_HISTORIES, { params: payload }))
  },
  getReturnOrderDetails(id) {
    return response(axiosInstance.get(RETURN_ORDER_DETAILS(id)))
  },
  cancelExchangeRequest(id) {
    return response(axiosInstance.post(CANCEL_EXCHANGE(id)))
  },
  checkReasonRejectExchange(id) {
    return response(axiosInstance.post(CHECK_REJECT_EXCHANGE(id)))
  },
  getDeliveryTrackingExchange(id) {
    return response(axiosInstance.post(DELIVERY_TRACKING_EXCHANGE(id)))
  },
  createExchange(payload) {
    return response(axiosInstance.post(CREATE_EXCHANGE, payload))
  }
})
