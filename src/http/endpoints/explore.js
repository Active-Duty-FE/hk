import { PRODUCT_API_PREFIX } from './product'

export const GET_CONTENT_EC = `${PRODUCT_API_PREFIX}/explore-ec/content/filter`
export const GET_CONTENT_BLOG_CATEGORY = `${PRODUCT_API_PREFIX}/explore-ec/blog-category`
export const GET_CONTENT_BLOG_DETAIL = (id) => `${PRODUCT_API_PREFIX}/explore-ec/content/${id}`
export const GET_SNS_DISPLAY_TYPE = `${PRODUCT_API_PREFIX}/explore-ec/sns-display-type`
