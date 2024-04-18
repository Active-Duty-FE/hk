export const RETURN_ORDER_API_PREFIX = '/order/v1/returnorder'
export const EXCHANGE_ORDER_API_PREFIX = '/order/v1/exchange'

export const LOAD_PRODUCT_RETURN = `${RETURN_ORDER_API_PREFIX}`
export const CREATE_RETURN_ORDER = `${RETURN_ORDER_API_PREFIX}`
export const ESTIMATE_RETURN_ORDER = `${RETURN_ORDER_API_PREFIX}/estimate`
export const REFUND_CONSENT_PROCESSING = (id) => `${RETURN_ORDER_API_PREFIX}/request/agree/${id}`
export const RETURN_CANCELATION = (id) => `${RETURN_ORDER_API_PREFIX}/request/cancel/${id}`
export const GET_REASON_FOR_REJECT = (id) => `${RETURN_ORDER_API_PREFIX}/reject/${id}`
export const RETURN_HISTORIES = `${RETURN_ORDER_API_PREFIX}/list`
export const RETURN_ORDER_DETAILS = (id) => `${RETURN_ORDER_API_PREFIX}/${id}`
export const CANCEL_EXCHANGE = (id) => `${EXCHANGE_ORDER_API_PREFIX}/${id}/cancel`
export const CHECK_REJECT_EXCHANGE = (id) => `${EXCHANGE_ORDER_API_PREFIX}/${id}/reject`
export const DELIVERY_TRACKING_EXCHANGE = (id) =>
  `${EXCHANGE_ORDER_API_PREFIX}/${id}/delivery-tracking`
export const CREATE_EXCHANGE = `${EXCHANGE_ORDER_API_PREFIX}`
