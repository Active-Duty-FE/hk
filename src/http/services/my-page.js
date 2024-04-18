import {
  CANCEL_AUTOSHIP,
  CANCEL_ORDER_HISTORY,
  CHANGE_DELIVERY_DATE,
  CHANGE_PASSWORD,
  EDIT_CARD_PAYMENT_AUTOSHIP,
  EDIT_DELIVERY_AUTOSHIP,
  CHANGE_PRODUCT_AUTOSHIP,
  GET_AUTOSHIP_SUBSCRIBE,
  GET_AUTOSHIP_SUBSCRIBE_DETAIL,
  GET_COUPON_MY_PAGE,
  GET_ORDER_HISTORY,
  GET_ORDER_MY_PAGE,
  GET_POINT_MY_PAGE,
  GET_PROFILE,
  QR_API_PREFIX,
  SEARCH_HAVE_COUPON,
  SKIP_TURNING_TRAIN,
  UPDATE_PROFILE,
  VIEW_USED_COUPON,
  SUMMARY_MY_POINT,
  HISTORY_MY_POINT,
  GET_SOCIAL_ACCOUNT,
  MY_PERSONAL_MAIL_INFO,
  CREATE_PERSONAL_MAIL_INFO,
  UPDATE_PERSONAL_MAIL_INFO,
  TRACK_MEMBER_NUMBER,
  GET_ANNUAL_FEE_USER,
  PAYMENT_MEMBER_SHIP,
  GENERATE_ORDER_NUMBER,
  CONVERT_TO_INDIVIDUAL,
  CONVERT_TO_CORPORATION,
  GET_INFO_CORPORATION,
  SAVE_INFO_CORPORATION,
  GET_REVIEW_LIST,
  DELETE_REVIEW,
  GET_INFO_USERS_CONVERT_PLANNER,
  SEND_MAIL_VERIFY_WITHDRAW,
  VERIFY_MAIL_WITHDRAW,
  REASON_MAIL_WITHDRAW,
  WITHDRAW_MEMBER
} from '@/http/endpoints/my-page'
import { response } from '@/http/response'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import storage from '@/utils/storage'
import { getSaveTokenStorage } from '@/utils/auth'
import {
  STORAGE_ACCESS_TOKEN,
  VITE_APP_RBO_API_BASE_URL,
  VITE_APP_RBO_LOGIN_URL,
  VITE_RBO_CLIENT_ID,
  VITE_RBO_TOKEN
} from '@/helpers/constant'
import axios from 'axios'
import { useNotification } from '@/composables/notification'

const getUserId = () => {
  const authUserStore = useAuthUserStore()
  const { currentAuthUser } = authUserStore
  return currentAuthUser?.userSeqNo
}

export default (axiosInstance) => ({
  getProfile() {
    return response(axiosInstance.get(GET_PROFILE(getUserId())))
  },

  updateProfile(payload) {
    return response(axiosInstance.put(UPDATE_PROFILE(getUserId()), payload))
  },

  changePassword(payload) {
    return response(axiosInstance.put(CHANGE_PASSWORD(getUserId()), payload))
  },

  // Tạm thời dùng api bên BO

  getOrderHistory(params) {
    return response(
      axiosInstance.get(GET_ORDER_HISTORY, {
        params
      })
    )
  },
  cancelOrderHistory(id, payload) {
    return response(axiosInstance.delete(CANCEL_ORDER_HISTORY(id), { data: payload }))
  },
  getDetailOrder(id) {
    return response(axiosInstance.get(CANCEL_ORDER_HISTORY(id)))
  },
  getPointMyPage(id) {
    return response(axiosInstance.get(GET_POINT_MY_PAGE(id)))
  },
  getCouponMyPage() {
    return response(axiosInstance.get(GET_COUPON_MY_PAGE))
  },
  getOrderMyPage() {
    return response(axiosInstance.get(GET_ORDER_MY_PAGE))
  },
  getAutoShipSubscribe() {
    return response(axiosInstance.get(GET_AUTOSHIP_SUBSCRIBE))
  },
  getAutoShipSubscribeDetail() {
    return response(axiosInstance.get(GET_AUTOSHIP_SUBSCRIBE_DETAIL))
  },
  skipTurningTrain(payload) {
    return response(axiosInstance.put(SKIP_TURNING_TRAIN, payload))
  },
  changeDeliveryDate(payload) {
    return response(axiosInstance.put(CHANGE_DELIVERY_DATE, payload))
  },
  changeProductAutoship(payload) {
    return response(axiosInstance.put(CHANGE_PRODUCT_AUTOSHIP, payload))
  },
  getReferralQRCode(params) {
    return response(
      axiosInstance.get(QR_API_PREFIX, {
        params,
        headers: {
          Accept: 'application/octet-stream'
        }
      })
    )
  },
  viewHaveCoupon(params) {
    return response(axiosInstance.get(SEARCH_HAVE_COUPON, { params }))
  },
  viewUsedCoupon(params) {
    return response(axiosInstance.get(VIEW_USED_COUPON, { params }))
  },
  cancelAutoShip(id) {
    return response(axiosInstance.put(CANCEL_AUTOSHIP(id)))
  },
  editDeliveryAutoShip(payload) {
    return response(axiosInstance.put(EDIT_DELIVERY_AUTOSHIP, payload))
  },
  editCardPaymentAutoShip(payload) {
    return response(axiosInstance.put(EDIT_CARD_PAYMENT_AUTOSHIP, payload))
  },
  getMySummaryPoint(id) {
    return response(axiosInstance.get(SUMMARY_MY_POINT(id)))
  },
  getHistoryPoint(params) {
    return response(axiosInstance.get(HISTORY_MY_POINT, { params }))
  },
  // PERSONAL MALL
  getMyPersonalMall(id) {
    return response(axiosInstance.get(MY_PERSONAL_MAIL_INFO(id)))
  },
  createMyPersonalMall(id, payload) {
    return response(axiosInstance.post(CREATE_PERSONAL_MAIL_INFO(id), payload))
  },
  updateMyPersonalMall(id, payload) {
    return response(axiosInstance.post(UPDATE_PERSONAL_MAIL_INFO(id), payload))
  },
  trackingMemberNumber(id) {
    return response(axiosInstance.get(TRACK_MEMBER_NUMBER(id)))
  },
  convertToIndividual(payload) {
    return response(axiosInstance.post(CONVERT_TO_INDIVIDUAL, payload))
  },
  convertToCorporation(payload) {
    return response(axiosInstance.post(CONVERT_TO_CORPORATION, payload))
  },
  getSocialAccount() {
    return response(axiosInstance.get(GET_SOCIAL_ACCOUNT(getUserId())))
  },
  connectSocialAccount(payload) {
    return response(axiosInstance.post(GET_SOCIAL_ACCOUNT(getUserId()), payload))
  },
  disconnectSocialAccount(payload) {
    return response(axiosInstance.delete(GET_SOCIAL_ACCOUNT(getUserId()), { data: payload }))
  },
  getAnnualMemberShip() {
    return response(axiosInstance.get(GET_ANNUAL_FEE_USER))
  },
  paymentMemberShip(data) {
    return response(axiosInstance.post(PAYMENT_MEMBER_SHIP, data))
  },
  generateOrderNumber() {
    return response(axiosInstance.get(GENERATE_ORDER_NUMBER))
  },
  // corporation
  getCorporationInfo() {
    return response(axiosInstance.get(GET_INFO_CORPORATION))
  },
  saveCorporationInfo(payload) {
    return response(axiosInstance.post(SAVE_INFO_CORPORATION, payload))
  },
  getReviewList(params) {
    return response(axiosInstance.get(GET_REVIEW_LIST, { params }))
  },
  deleteReview(payload) {
    return response(axiosInstance.delete(DELETE_REVIEW, { data: payload }))
  },
  // withdraw
  sendMailWithdraw(id, payload) {
    return response(axiosInstance.post(SEND_MAIL_VERIFY_WITHDRAW(id), payload))
  },
  verifyCodeWithdraw(id, payload) {
    return response(axiosInstance.post(VERIFY_MAIL_WITHDRAW(id), payload))
  },
  reasonWithdraw() {
    return response(axiosInstance.get(REASON_MAIL_WITHDRAW))
  },
  withdrawMember(id, payload) {
    return response(axiosInstance.post(WITHDRAW_MEMBER(id), payload))
  },
  getInfoUserConvertPlanner() {
    return response(axiosInstance.get(GET_INFO_USERS_CONVERT_PLANNER))
  },
  async rboSelfLogin() {
    const saveStorage = getSaveTokenStorage()
    const authUserStore = useAuthUserStore()
    const { currentAuthUser } = authUserStore

    const instance = axios.create({
      baseURL: VITE_APP_RBO_API_BASE_URL,
      timeout: 10000,
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    const headers = {
      'x-client-id': VITE_RBO_CLIENT_ID,
      Authorization: `Basic ${VITE_RBO_TOKEN}`
    }
    const form = new FormData()
    form.append('username', currentAuthUser.userSeqNo)
    form.append('grant_type', 'password')
    form.append('scope', 'write')
    form.append('region_code', 'US')
    form.append('client_id', VITE_RBO_CLIENT_ID)
    form.append('login_type', 'RBO_SELF_LOGIN')
    form.append('my_token', storage.get(STORAGE_ACCESS_TOKEN, saveStorage))

    try {
      const response = await instance.post('/oauth/token', form, { headers })
      if (response?.status === 200) {
        windowOpenPopup('', 1300, 1000, null, 'PopupRbo')
        const form = document.createElement('form')
        form.target = 'PopupRbo'
        form.method = 'get'
        form.action = VITE_APP_RBO_LOGIN_URL
        form.appendChild(createElement('accessType', 'bo'))
        form.appendChild(createElement('email', response?.data?.email))
        form.appendChild(createElement('mobileNumber', response?.data?.mobileNumber))
        form.appendChild(createElement('userId', response?.data?.user_id))
        form.appendChild(createElement('userName', response?.data?.user_display_name))
        form.appendChild(createElement('userType', response?.data?.user_type))
        form.appendChild(createElement('userMasterId', response?.data?.user_master_id))
        form.appendChild(createElement('regionCode', response?.data?.regionCode))
        form.appendChild(createElement('nationalCode', response?.data?.nationalCode))
        form.appendChild(createElement('rank', response?.data?.rank))
        form.appendChild(createElement('accessToken', response?.data?.access_token))
        form.appendChild(createElement('refreshToken', response?.data?.refresh_token))
        document.body.appendChild(form)
        form.submit()
      }
    } catch (e) {
      // error
      console.log('RBO LOGIN ERROR', e)
      const { showNotification } = useNotification()
      showNotification({ type: 'error', message: 'RBO login error. !' })
    }
  }
})

export function windowOpenPopup(popUrl, popWidth, popHeight, resizeYn = null, popupName = null) {
  const winHeight = window.screen.availHeight
  const winWidth = document.body.clientWidth
  const winX = window.screenX || window.screenLeft || 0
  const winY = window.screenY || window.screenTop || 0
  const popX = winX + (winWidth - popWidth) / 2
  const popY = winY + (winHeight - popHeight) / 2
  const rn = Math.round(Math.random() * 100)
  const popName = popupName || `popup${rn}`
  const strResize = resizeYn || 'yes'

  return window.open(
    popUrl,
    popName,
    `width=${popWidth}px,height=${popHeight}px,top=${popY},left=${popX},toolbar=no, menubar=no, scrollbars=yes, resizable=${strResize}`
  )
}

export function createElement(key, val) {
  const hiddenField = document.createElement('input')
  hiddenField.setAttribute('type', 'hidden')
  hiddenField.setAttribute('name', key)
  hiddenField.setAttribute('value', val)
  return hiddenField
}
