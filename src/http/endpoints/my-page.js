import { ORDER_API_PREFIX } from './order'
import { MEMBER_API_PREFIX } from './auth'
const MY_PAGE_API_PREFIX = '/member/v1/users'
const POINT_API_PREFIX = 'point/private/point/v1'
const COUPONS_API_PREFIX = 'coupon/v1/coupons'
const SUBSCRIPTION_API_PREFIX = 'subscription/v1'
const MY_MALL_API_PREFIX = '/member/v1/users'
const PRODUCT_API_PREFIX = '/product/v1'
const WITHDRAW_MEMBER_PREFIX = '/member/v1'

export const GET_PROFILE = (id) => `${MY_PAGE_API_PREFIX}/${id}/userInfo`
export const UPDATE_PROFILE = (id) => `${MY_PAGE_API_PREFIX}/updateUser/${id}`
export const CHANGE_PASSWORD = (id) => `${MY_PAGE_API_PREFIX}/${id}/changePassword`
export const GET_ORDER_HISTORY = `${ORDER_API_PREFIX}/salesOrderHistory`
export const CANCEL_ORDER_HISTORY = (id) => `${ORDER_API_PREFIX}/${id}`
export const GET_POINT_MY_PAGE = (id) => `${POINT_API_PREFIX}/findPoint/${id}`
export const GET_COUPON_MY_PAGE = `${COUPONS_API_PREFIX}/available/count`
export const GET_ORDER_MY_PAGE = `${ORDER_API_PREFIX}/recent`
export const QR_API_PREFIX = MEMBER_API_PREFIX + '/qrcode'
export const SEARCH_HAVE_COUPON = `${COUPONS_API_PREFIX}/owned`
export const VIEW_USED_COUPON = `${COUPONS_API_PREFIX}/used`
export const GET_AUTOSHIP_SUBSCRIBE = `${SUBSCRIPTION_API_PREFIX}/subscription-common`
export const CANCEL_AUTOSHIP = (id) => `${SUBSCRIPTION_API_PREFIX}/withdraw/${id}`
export const GET_PURCHASE_STATUS = SUBSCRIPTION_API_PREFIX
export const GET_AUTOSHIP_SUBSCRIBE_DETAIL = `${SUBSCRIPTION_API_PREFIX}/subscriptionMyPage`
export const SKIP_TURNING_TRAIN = `${SUBSCRIPTION_API_PREFIX}/skip`
export const CHANGE_DELIVERY_DATE = `${SUBSCRIPTION_API_PREFIX}/edit/delivery-date`
export const EDIT_DELIVERY_AUTOSHIP = `${SUBSCRIPTION_API_PREFIX}/edit/deliveryId`
export const EDIT_CARD_PAYMENT_AUTOSHIP = `${SUBSCRIPTION_API_PREFIX}/edit/userPaymentId`
export const CHANGE_PRODUCT_AUTOSHIP = `${SUBSCRIPTION_API_PREFIX}/edit/products`
export const SUMMARY_MY_POINT = (id) => `${POINT_API_PREFIX}/findPoint/${id}`
export const HISTORY_MY_POINT = `${POINT_API_PREFIX}/findPointHistorySummary`

// PERSONAL MALL
export const MY_PERSONAL_MAIL_INFO = (id) => `${MY_MALL_API_PREFIX}/${id}/personalMall`
export const CREATE_PERSONAL_MAIL_INFO = (id) => `${MY_MALL_API_PREFIX}/${id}/personalMall/register`
export const UPDATE_PERSONAL_MAIL_INFO = (id) => `${MY_MALL_API_PREFIX}/${id}/personalMall/update`
export const TRACK_MEMBER_NUMBER = (id) =>
  `${MY_MALL_API_PREFIX}/public/headerPersonal?userNumber=${id}`
export const CONVERT_TO_INDIVIDUAL = `${MY_MALL_API_PREFIX}/convert/planner/individual`
export const CONVERT_TO_CORPORATION = `${MY_MALL_API_PREFIX}/convert/planner/corporation`
export const GET_SOCIAL_ACCOUNT = (id) => `${MY_PAGE_API_PREFIX}/${id}/socialAccounts`

// MY REVIEW
export const GET_REVIEW_LIST = `${PRODUCT_API_PREFIX}/my-review`
export const DELETE_REVIEW = `${PRODUCT_API_PREFIX}/my-review`

export const GET_ANNUAL_FEE_USER = `${MY_MALL_API_PREFIX}/member-ship/annual`
export const PAYMENT_MEMBER_SHIP = `${MY_MALL_API_PREFIX}/member-ship/annual/payment`
export const GENERATE_ORDER_NUMBER = `${MY_MALL_API_PREFIX}/member-ship/generate/order-number`
// business info
export const GET_INFO_CORPORATION = `${MY_PAGE_API_PREFIX}/corporation`
export const SAVE_INFO_CORPORATION = GET_INFO_CORPORATION

// withdraw
export const SEND_MAIL_VERIFY_WITHDRAW = (id) =>
  `${WITHDRAW_MEMBER_PREFIX}/otp/${id}/withdrawal/email/send`
export const VERIFY_MAIL_WITHDRAW = (id) =>
  `${WITHDRAW_MEMBER_PREFIX}/otp/${id}/withdrawal/email/verify`
export const REASON_MAIL_WITHDRAW = `${WITHDRAW_MEMBER_PREFIX}/codes/public/withdrawal-reasons`
export const WITHDRAW_MEMBER = (id) => `${WITHDRAW_MEMBER_PREFIX}/withdrawal/${id}`
export const GET_INFO_USERS_CONVERT_PLANNER = `${MY_MALL_API_PREFIX}/convert/planner`
