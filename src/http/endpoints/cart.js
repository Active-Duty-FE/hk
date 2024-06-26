const CART_API_PREFIX = '/order/v1'
const SUBSCRIPTION_API_PREFIX = '/subscription/v1'

export const GET_STANDARD_CART_BADGE_ENDPOINT = `${CART_API_PREFIX}/cart/badge`
export const ADD_PRODUCT_TO_CART_ENDPOINT = `${CART_API_PREFIX}/cart`
export const UPDATE_CART_QUANTITY_ENDPOINT = (cartId) => `${CART_API_PREFIX}/cart/${cartId}`
export const DELETE_SINGLE_CART_ENDPOINT = (cartId) => `${CART_API_PREFIX}/cart/${cartId}`
export const DELETE_MULTIPLE_CART_ENDPOINT = `${CART_API_PREFIX}/cart/list`
export const GET_STANDARD_CART_LIST_ENDPOINT = `${CART_API_PREFIX}/cart`
export const GET_NFR_CART_LIST_ENDPOINT = `${CART_API_PREFIX}/cart/NFR`

// AUTO SHIP
export const ADD_PRODUCT_TO_AUTOSHIP_CART_ENDPOINT = `${SUBSCRIPTION_API_PREFIX}/carts`
export const GET_AUTOSHIP_CART_BADGE_ENDPOINT = `${SUBSCRIPTION_API_PREFIX}/carts`
export const GET_AUTOSHIP_CART_LIST_ENDPOINT = `${SUBSCRIPTION_API_PREFIX}/carts/page`
export const UPDATE_AUTOSHIP_CART_QUANTITY_ENDPOINT = (cartId) =>
  `${SUBSCRIPTION_API_PREFIX}/carts/${cartId}`
export const DELETE_SINGLE_AUTOSHIP_CART_ENDPOINT = (cartId) =>
  `${SUBSCRIPTION_API_PREFIX}/carts/delete/${cartId}`
export const DELETE_MULTIPLE_AUTOSHIP_CART_ENDPOINT = `${SUBSCRIPTION_API_PREFIX}/carts/delete/list`
