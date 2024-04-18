import { USER_API_PREFIX } from './address'

export const ORDER_API_PREFIX = '/order/v1/salesorders'
const ORDER_PUBLIC_PREFIX = '/order/v1/public'
const COUPON_PREFIX = '/coupon/v1'
const POINT_PREFIX = '/point/private/point/v1'
const AUTO_SHIP_PREFIX = '/subscription/v1'
const PAYMENT_PREFIX = '/payment/v2'
const POINT_ORDER_PREFIX = '/point/private/order/v1'

export const CREATE_SALE_ORDER_ENDPOINT = `${ORDER_API_PREFIX}/sheet`
export const GET_ORDER_COMPLETE = (id) => `${ORDER_API_PREFIX}/salesOrder/${id}`
export const PAYMENT_ORDER_CREDIT_CARD = `${ORDER_API_PREFIX}/salesOrder`
export const DECRYPT_ORDER_IDENTIFY_ENDPOINT = `${ORDER_API_PREFIX}/sheet/decrypt`
export const REFRESH_IDENTIFY_ENDPOINT = `${ORDER_API_PREFIX}/sheet/refresh`
export const SAVE_CARD = (id) => `${USER_API_PREFIX}/${id}/favorite-cards`
export const GET_LIST_CARD = (id) => `${USER_API_PREFIX}/${id}/favorite-cards`
export const CREATE_PIN_CODE = (id) => `${USER_API_PREFIX}/${id}/order-password`
export const CHECK_PIN_CODE_MATCH = (id) => `${USER_API_PREFIX}/${id}/order-password/match`
export const DELETE_OR_EDIT_CARD = (userId, cardId) =>
  `${USER_API_PREFIX}/${userId}/favorite-cards/${cardId}`
export const CALCULATE_TAX_PUBLIC_ENDPOINT = `${ORDER_PUBLIC_PREFIX}/tax/calculate`
export const CALCULATE_TAX_ENDPOINT = `${ORDER_API_PREFIX}/tax/calculate`
export const GET_SHIPPING_FEE_ENDPOINT = `${ORDER_API_PREFIX}/salesOrder/calculate`
export const GET_SHIPPING_FEE_PUBLIC_ENDPOINT = `${ORDER_PUBLIC_PREFIX}/salesorders/salesOrder/calculate`
export const CREATE_SALE_ORDERS_PUBLIC = `${ORDER_PUBLIC_PREFIX}/salesOrder/sheet`
export const DECRYPT_ORDER_IDENTIFY_PUBLIC_ENDPOINT = `${ORDER_PUBLIC_PREFIX}/salesOrder/sheet/decrypt`
export const REFRESH_IDENTIFY_PUBLIC_ENDPOINT = `${ORDER_PUBLIC_PREFIX}/salesOrder/sheet/refresh`
export const EASY_PAYMENT_NON_MEMBER = `${ORDER_PUBLIC_PREFIX}/salesOrder`
export const GET_DETAIL_ORDER_NON_MEMBER = `${ORDER_PUBLIC_PREFIX}/salesOrder/detail-order-none-member`
export const GET_ORDER_COMPLETE_NON_MEMBER = `${ORDER_PUBLIC_PREFIX}/salesOrder/get-order-completion-none-member`
export const GET_COUPONS_LIST = `${COUPON_PREFIX}/coupons/get-available`
export const GET_POINT_ORDER = (id) => `${POINT_PREFIX}/findPoint/${id}`
export const GET_LIST_PRODUCTS_AUTO_SHIP = (id) => `${AUTO_SHIP_PREFIX}/create/${id}`
export const PAYMENT_FOR_AUTO_SHIP = `${AUTO_SHIP_PREFIX}/create/payment`
export const CREATE_SHEET_ORDER_AUTO_SHIP = `${AUTO_SHIP_PREFIX}/create`
export const DETAIL_AUTO_SHIP = `${AUTO_SHIP_PREFIX}/subscriptionCompleted`
export const PAYMENT_BY_APPLE = `${PAYMENT_PREFIX}/button-iframe-url`
export const POINT_EARN_ORDER = `${POINT_ORDER_PREFIX}/calculatePointEarn`
export const VALIDATE_QUANTITY_PURCHASED = `${ORDER_API_PREFIX}/validate-product`
export const INFO_ORDER_SUMMARY = `${ORDER_API_PREFIX}/order-summary`
export const TURNING_TRAIN_SALE_ORDER = `${AUTO_SHIP_PREFIX}/turningTrainBySaleOrder`
export const PAYMENT_IMMEDIATELY_AUTO_SHIP = `${AUTO_SHIP_PREFIX}/immediately/payment`
export const CANCEL_ORDER_AUTOSHIP_HISTORY = (id) => `${ORDER_API_PREFIX}/subscribe/${id}`
export const GET_SHEET_PRODUCT_WHEN_LOGIN = `${ORDER_API_PREFIX}/sheet`
