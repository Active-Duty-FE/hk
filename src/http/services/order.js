import {
  CREATE_SALE_ORDER_ENDPOINT,
  GET_ORDER_COMPLETE,
  PAYMENT_ORDER_CREDIT_CARD,
  DECRYPT_ORDER_IDENTIFY_ENDPOINT,
  REFRESH_IDENTIFY_ENDPOINT,
  CALCULATE_TAX_PUBLIC_ENDPOINT,
  GET_SHIPPING_FEE_ENDPOINT,
  GET_SHIPPING_FEE_PUBLIC_ENDPOINT,
  CREATE_SALE_ORDERS_PUBLIC,
  DECRYPT_ORDER_IDENTIFY_PUBLIC_ENDPOINT,
  REFRESH_IDENTIFY_PUBLIC_ENDPOINT,
  EASY_PAYMENT_NON_MEMBER,
  GET_DETAIL_ORDER_NON_MEMBER,
  GET_ORDER_COMPLETE_NON_MEMBER,
  GET_COUPONS_LIST,
  GET_POINT_ORDER,
  GET_LIST_PRODUCTS_AUTO_SHIP,
  PAYMENT_FOR_AUTO_SHIP,
  CREATE_SHEET_ORDER_AUTO_SHIP,
  DETAIL_AUTO_SHIP,
  PAYMENT_BY_APPLE,
  POINT_EARN_ORDER,
  VALIDATE_QUANTITY_PURCHASED,
  INFO_ORDER_SUMMARY,
  TURNING_TRAIN_SALE_ORDER,
  PAYMENT_IMMEDIATELY_AUTO_SHIP,
  CANCEL_ORDER_AUTOSHIP_HISTORY,
  GET_SHEET_PRODUCT_WHEN_LOGIN,
  CALCULATE_TAX_ENDPOINT
} from '@/http/endpoints/order'
import { response } from '@/http/response'

export default (axiosInstance) => ({
  createSaleOrder(payload) {
    return response(axiosInstance.post(CREATE_SALE_ORDER_ENDPOINT, payload))
  },
  getOrderComplete(id) {
    return response(axiosInstance.get(GET_ORDER_COMPLETE(id)))
  },
  paymentOrderCreditCard(payload) {
    return response(axiosInstance.post(PAYMENT_ORDER_CREDIT_CARD, payload))
  },
  decryptSaleOrder(payload) {
    return response(axiosInstance.post(DECRYPT_ORDER_IDENTIFY_ENDPOINT, payload))
  },
  refreshIdentify(payload) {
    return response(axiosInstance.post(REFRESH_IDENTIFY_ENDPOINT, payload))
  },
  calculateTaxOrder(data) {
    return response(axiosInstance.post(CALCULATE_TAX_PUBLIC_ENDPOINT, data))
  },
  calculateTaxOrderForAuth(data) {
    return response(axiosInstance.post(CALCULATE_TAX_ENDPOINT, data))
  },
  getShippingFeeOrder(data) {
    return response(axiosInstance.post(GET_SHIPPING_FEE_ENDPOINT, data))
  },
  getShippingFeePublicOrder(data) {
    return response(axiosInstance.post(GET_SHIPPING_FEE_PUBLIC_ENDPOINT, data))
  },
  createSalesOrderPublic(payload) {
    return response(axiosInstance.post(CREATE_SALE_ORDERS_PUBLIC, payload))
  },
  decryptSaleOrderPublic(payload) {
    return response(axiosInstance.post(DECRYPT_ORDER_IDENTIFY_PUBLIC_ENDPOINT, payload))
  },
  refreshIdentifyPublic(payload) {
    return response(axiosInstance.post(REFRESH_IDENTIFY_PUBLIC_ENDPOINT, payload))
  },
  getListProductsSheet(params) {
    return response(axiosInstance.get(CREATE_SALE_ORDERS_PUBLIC, { params }))
  },
  easyPaymentOrder(payload) {
    return response(axiosInstance.post(EASY_PAYMENT_NON_MEMBER, payload))
  },
  getDetailOrderNonMember(params) {
    return response(axiosInstance.get(GET_DETAIL_ORDER_NON_MEMBER, { params }))
  },
  getOrderCompleteNonMember(params) {
    return response(axiosInstance.get(GET_ORDER_COMPLETE_NON_MEMBER, { params }))
  },
  getCouponList(params) {
    return response(axiosInstance.get(GET_COUPONS_LIST, { params }))
  },
  getPointOrder(id) {
    return response(axiosInstance.get(GET_POINT_ORDER(id)))
  },
  getListProductsAutoShip(id) {
    return response(axiosInstance.get(GET_LIST_PRODUCTS_AUTO_SHIP(id)))
  },
  paymentAutoShip(payload) {
    return response(axiosInstance.post(PAYMENT_FOR_AUTO_SHIP, payload))
  },
  createSheetCheckoutAutoShip(payload) {
    return response(axiosInstance.post(CREATE_SHEET_ORDER_AUTO_SHIP, payload))
  },
  detailOrderAutoShip() {
    return response(axiosInstance.get(DETAIL_AUTO_SHIP))
  },
  getScriptApplePay(payload) {
    return response(axiosInstance.post(PAYMENT_BY_APPLE, payload))
  },
  getPointEarnOrder(payload) {
    return response(axiosInstance.post(POINT_EARN_ORDER, payload))
  },
  validateQuantityPurchased(payload) {
    return response(axiosInstance.post(VALIDATE_QUANTITY_PURCHASED, payload))
  },
  getInfoOrderSummary(payload) {
    return response(axiosInstance.post(INFO_ORDER_SUMMARY, payload))
  },
  getTurningTrainBySaleOrder(payload) {
    return response(axiosInstance.post(TURNING_TRAIN_SALE_ORDER, payload))
  },
  paymentImmediateAutoShip(payload) {
    return response(axiosInstance.post(PAYMENT_IMMEDIATELY_AUTO_SHIP, payload))
  },
  cancelAutoShipHistory(id) {
    return response(axiosInstance.delete(CANCEL_ORDER_AUTOSHIP_HISTORY(id)))
  },
  getProductSheetOrderWhenLogin(params) {
    return response(axiosInstance.get(GET_SHEET_PRODUCT_WHEN_LOGIN, { params }))
  }
})
