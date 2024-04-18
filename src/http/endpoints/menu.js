const MENU_PREFIX = '/product/v1/public/categories'
const MENU_AUTH_PREFIX = '/product/v1/categories'

export const LIST_MENU_ENDPOINT = `${MENU_PREFIX}`
export const LIST_MENU_AUTH_ENDPOINT = `${MENU_AUTH_PREFIX}`
export const MENU_DETAIL_ENDPOINT = (id) => `${MENU_PREFIX}/${id}`
export const MENU_DETAIL_AUTH_ENDPOINT = (id) => `${MENU_AUTH_PREFIX}/${id}`
