import {
  USERNAME_LOGIN_ENDPOINT,
  REGISTER_ENDPOINT,
  SNS_LOGIN_ENDPOINT,
  CHECK_EXIST_ACCOUNT_ENDPOINT,
  CREDIT_CARD_REGISTER,
  GET_TERMS_ENDPOINT,
  SEND_AUTH_MAIL_ENDPOINT,
  SEND_CODE_MAIL_ENDPOINT,
  SEND_PHONE_ENDPOINT,
  VERIFY_CODE_PHONE_ENDPOINT,
  VERIFY_SSN_ENDPOINT,
  BUSINESS_INFORMATION_ENDPOINT,
  VERIFY_ADDRESS_ENDPOINT,
  SEARCH_ADDRESS_ENDPOINT,
  FIND_ACCOUNT_SEND,
  FIND_ACCOUNT_VERIFY,
  FIND_USER_PASSWORD_ENDPOINT,
  CHANGE_USER_PASSWORD_ENDPOINT,
  GET_CURRENT_USER_ENDPOINT,
  SEARCH_RECOMMENDER_CODE,
  SEARCH_RECOMMENDER_NAME,
  SEARCH_RECOMMENDER_GLOBAL,
  VALIDATE_MOBILE_PHONE,
  TERMS_FOOTER_POLICY,
  SEND_PHONE_CARD_ENDPOINT,
  VERIFY_CODE_PHONE_CARD_ENDPOINT,
  MEMBERSHIP_FEE_ENDPOINT,
  AUTH_EMAIL_ENDPOINT,
  AUTH_ADDRESS_ENDPOINT,
  SAVE_QR_CODE_ENDPOINT,
  LOGIN_WITH_QR_CODE_ENDPOINT,
  REGISTER_INIT_ENDPOINT,
  GEN_URL_CREDIT_CARD,
  GET_STATUS_PAYMENT
} from '@/http/endpoints/auth'
import { response } from '@/http/response'

const oauthToken = import.meta.env.VITE_OAUTH_TOKEN

export default (axiosInstance) => ({
  snsLogin(payload) {
    return response(axiosInstance.post(SNS_LOGIN_ENDPOINT, payload))
  },
  checkExistUser(payload) {
    return response(axiosInstance.post(CHECK_EXIST_ACCOUNT_ENDPOINT, payload))
  },
  register(payload) {
    return response(axiosInstance.post(REGISTER_ENDPOINT, payload))
  },
  registerInit(payload) {
    return response(axiosInstance.post(REGISTER_INIT_ENDPOINT, payload))
  },
  genUrlCreditCard(payload) {
    return response(axiosInstance.post(GEN_URL_CREDIT_CARD, payload))
  },
  getStatusPayment(payload) {
    return response(axiosInstance.post(GET_STATUS_PAYMENT, payload))
  },
  usernameLogin(payload) {
    return response(
      axiosInstance.post(USERNAME_LOGIN_ENDPOINT, payload, {
        headers: {
          authorization: `Basic ${oauthToken}`,
          isPublic: true
        }
      })
    )
  },
  creditCardRegister(payload) {
    return response(axiosInstance.post(CREDIT_CARD_REGISTER, payload))
  },
  terms(params) {
    return response(axiosInstance.get(GET_TERMS_ENDPOINT, { params }))
  },
  sendMailAuthenticate(payload) {
    return response(axiosInstance.post(SEND_AUTH_MAIL_ENDPOINT, payload))
  },
  sendCodeMailAuth(payload) {
    return response(axiosInstance.post(SEND_CODE_MAIL_ENDPOINT, payload))
  },
  checkSsnNumber(params) {
    return response(axiosInstance.get(VERIFY_SSN_ENDPOINT, { params }))
  },

  businessInformation(payload) {
    return response(axiosInstance.post(BUSINESS_INFORMATION_ENDPOINT, payload))
  },
  searchAddress(params) {
    return response(axiosInstance.get(`${SEARCH_ADDRESS_ENDPOINT}`, { params }))
  },
  verifyAddress(params) {
    return response(axiosInstance.get(`${VERIFY_ADDRESS_ENDPOINT}`, { params }))
  },
  findAccountSend(payload) {
    return response(axiosInstance.post(`${FIND_ACCOUNT_SEND}`, payload))
  },
  findAccountVerify(payload) {
    return response(axiosInstance.post(`${FIND_ACCOUNT_VERIFY}`, payload))
  },
  findUserPassword(payload) {
    return response(axiosInstance.post(FIND_USER_PASSWORD_ENDPOINT, payload))
  },
  changeUserPassword(payload) {
    return response(axiosInstance.post(CHANGE_USER_PASSWORD_ENDPOINT, payload))
  },
  me() {
    return response(axiosInstance.get(GET_CURRENT_USER_ENDPOINT))
  },
  searchRecommenderCode(params) {
    return response(axiosInstance.get(SEARCH_RECOMMENDER_CODE, { params }))
  },
  searchRecommenderName(params) {
    return response(axiosInstance.get(SEARCH_RECOMMENDER_NAME, { params }))
  },
  searchRecommenderGlobal(params) {
    return response(axiosInstance.get(SEARCH_RECOMMENDER_GLOBAL, { params }))
  },
  validateCellphone(payload) {
    return response(axiosInstance.post(VALIDATE_MOBILE_PHONE, payload))
  },
  getTermsFooterPolicy(params) {
    return response(axiosInstance.get(TERMS_FOOTER_POLICY, { params }))
  },
  sendPhoneCard(payload) {
    return response(axiosInstance.post(SEND_PHONE_CARD_ENDPOINT, payload))
  },
  verifyPhoneCard(payload) {
    return response(axiosInstance.post(VERIFY_CODE_PHONE_CARD_ENDPOINT, payload))
  },
  getMemberShipFee(params) {
    return response(axiosInstance.get(MEMBERSHIP_FEE_ENDPOINT, { params }))
  },
  authEmail(payload) {
    return response(axiosInstance.post(AUTH_EMAIL_ENDPOINT, payload))
  },
  authAddress(payload) {
    return response(axiosInstance.post(AUTH_ADDRESS_ENDPOINT, payload))
  },
  scanCodeSave(payload) {
    return response(axiosInstance.post(SAVE_QR_CODE_ENDPOINT, payload))
  },
  getScanCodeLogin(params) {
    return response(axiosInstance.get(LOGIN_WITH_QR_CODE_ENDPOINT, { params }))
  }
})
