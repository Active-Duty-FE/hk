const ORDER_PUBLIC_PREFIX = '/order/v1'
const PRODUCT_BO_PREFIX = '/product/v1/public/media-storage/upload'
const ORDER_PREFIX = ORDER_PUBLIC_PREFIX + '/media-storage/upload'

export const UPLOAD_FILE_SINGLE = `${PRODUCT_BO_PREFIX}`
export const UPLOAD_FILE_MULTIPLE = `${PRODUCT_BO_PREFIX}/multiple`
export const ORDER_UPLOAD_FILE_MULTIPLE = `${ORDER_PREFIX}/multiple`
