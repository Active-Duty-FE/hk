const EXPLORE_PREFIX = '/product/v1/public/explore-ec'
const ETC_PREFIX = '/etc'

export const GET_CONTENT_EXPLORE = `${EXPLORE_PREFIX}/content/filter`
export const GET_DETAIL_CONTENT_EXPLORE = (id) => `${EXPLORE_PREFIX}/content/${id}`
export const GET_CONTACT_US = `${ETC_PREFIX}/cms/ec/v1/public/contact-us`
const RITUAL_PRODUCT_EXPLORE_PUBLIC = '/product/v1/public/products/ritual'
const RITUAL_PRODUCT_EXPLORE = '/product/v1/products/ritual'

export const GET_LIST_PRODUCT_RITUALS_PUBLIC = `${RITUAL_PRODUCT_EXPLORE_PUBLIC}/list`
export const GET_LIST_PRODUCT_RITUALS = `${RITUAL_PRODUCT_EXPLORE}/list`
export const GET_POLICY = `${ETC_PREFIX}/cms/ec/v1/public/policy`
