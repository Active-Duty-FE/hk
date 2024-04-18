const PRODUCT_API_AUTH_PREFIX = '/product/v1'
export const PRODUCT_API_PREFIX = '/product/v1/public'

export const LIST_PRODUCT_ENDPOINT = `${PRODUCT_API_PREFIX}/products`
export const LIST_PRODUCT_AUTH_ENDPOINT = `${PRODUCT_API_AUTH_PREFIX}/products`
export const LIST_PRODUCT_BAG_AUTH_ENDPOINT = `${PRODUCT_API_AUTH_PREFIX}/products/bag`
export const GET_PRODUCT_DETAIL = (id) => `${PRODUCT_API_PREFIX}/products/${id}`
export const GET_PRODUCT_DETAIL_AUTH = (id) => `${PRODUCT_API_AUTH_PREFIX}/products/${id}`
export const GET_REVIEW_LIST_BY_PRODUCT = (id) => `${PRODUCT_API_PREFIX}/review/${id}`
export const GET_REVIEW_LIST_BY_PRODUCT_AUTH = (id) => `${PRODUCT_API_AUTH_PREFIX}/review/${id}`
export const CREATE_REVIEW = `${PRODUCT_API_AUTH_PREFIX}/review`
export const PRODUCT_REGISTER_ENDPOINT = `${PRODUCT_API_PREFIX}/products/register`
export const SEARCH_PRODUCT_ENDPOINT = `${PRODUCT_API_PREFIX}/products/search`
export const SEARCH_PRODUCT_AUTH_ENDPOINT = `${PRODUCT_API_AUTH_PREFIX}/products/search`
export const GET_MY_IP_ADDRESS = `${PRODUCT_API_AUTH_PREFIX}/public/ip-address/me`
export const GET_CMS_MAIN = `${PRODUCT_API_PREFIX}/cms-main`
export const GET_PRODUCT_RITUALS = (id) => `${PRODUCT_API_AUTH_PREFIX}/categories/${id}`
export const GET_PUBLIC_PRODUCT_RITUALS = (id) => `${PRODUCT_API_PREFIX}/categories/${id}`
