import {
  ADD_PRODUCT_TO_AUTOSHIP_CART_ENDPOINT,
  ADD_PRODUCT_TO_CART_ENDPOINT,
  DELETE_MULTIPLE_AUTOSHIP_CART_ENDPOINT,
  DELETE_MULTIPLE_CART_ENDPOINT,
  DELETE_SINGLE_AUTOSHIP_CART_ENDPOINT,
  DELETE_SINGLE_CART_ENDPOINT,
  GET_AUTOSHIP_CART_BADGE_ENDPOINT,
  GET_AUTOSHIP_CART_LIST_ENDPOINT,
  GET_STANDARD_CART_BADGE_ENDPOINT,
  GET_STANDARD_CART_LIST_ENDPOINT,
  UPDATE_AUTOSHIP_CART_QUANTITY_ENDPOINT,
  UPDATE_CART_QUANTITY_ENDPOINT,
  GET_NFR_CART_LIST_ENDPOINT
} from '@/http/endpoints/cart'
import { response } from '@/http/response'

export default (axiosInstance) => ({
  getStandardCartBadge() {
    return response(axiosInstance.get(GET_STANDARD_CART_BADGE_ENDPOINT))
  },
  addProductToCart(payload) {
    return response(axiosInstance.post(ADD_PRODUCT_TO_CART_ENDPOINT, payload))
  },
  updateCartQuantity(cartId, payload) {
    return response(axiosInstance.patch(UPDATE_CART_QUANTITY_ENDPOINT(cartId), payload))
  },

  deleteSingleCartQuantity(cartId) {
    return response(axiosInstance.delete(DELETE_SINGLE_CART_ENDPOINT(cartId)))
  },
  deleteMultipleCartQuantity(payload) {
    return response(
      axiosInstance.delete(DELETE_MULTIPLE_CART_ENDPOINT, {
        data: payload
      })
    )
  },
  getStandardCartList() {
    return response(axiosInstance.get(GET_STANDARD_CART_LIST_ENDPOINT))
  },
  getNfrCartList() {
    return response(axiosInstance.get(GET_NFR_CART_LIST_ENDPOINT))
  },
  // AUTO SHIP
  addProductToAutoShipCart(payload) {
    return response(axiosInstance.post(ADD_PRODUCT_TO_AUTOSHIP_CART_ENDPOINT, payload))
  },
  getAutoShipCartBadge() {
    return response(axiosInstance.get(GET_AUTOSHIP_CART_BADGE_ENDPOINT))
  },
  getAutoShipCartList() {
    return response(axiosInstance.get(GET_AUTOSHIP_CART_LIST_ENDPOINT))
  },
  updateAutoShipCartQuantity(cartId, payload) {
    return response(axiosInstance.patch(UPDATE_AUTOSHIP_CART_QUANTITY_ENDPOINT(cartId), payload))
  },
  deleteSingleAutoShipCartQuantity(cartId) {
    return response(axiosInstance.delete(DELETE_SINGLE_AUTOSHIP_CART_ENDPOINT(cartId)))
  },
  deleteMultipleAutoShipCartQuantity(cartIds) {
    return response(
      axiosInstance.delete(DELETE_MULTIPLE_AUTOSHIP_CART_ENDPOINT, {
        data: {
          cartIds
        }
      })
    )
  }
})
