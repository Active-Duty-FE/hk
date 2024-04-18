import {
  PHONE_RESERVATION,
  INQUIRY_ONE_TO_ONE,
  TOP_TEN_FAQS,
  LIST_FAQS,
  LIST_NOTIFICATIONS,
  DELETE_ALL_NOTIFICATIONS,
  DELETE_SPECIFIC_NOTIFICATIONS,
  RECENT_NOTIFICATIONS,
  READ_NOTIFICATION,
  DELETE_INQUIRY,
  DETAIL_INQUIRY,
  EDIT_INQUIRY,
  INQUIRY_ONE_TO_ONE_MINE
} from '@/http/endpoints/concierge'
import { response } from '@/http/response'

export default (axiosInstance) => ({
  phoneReservation(payload) {
    return response(axiosInstance.post(PHONE_RESERVATION, payload))
  },
  registerInquiryOneToOne(payload) {
    return response(axiosInstance.post(INQUIRY_ONE_TO_ONE, payload))
  },
  topTenFaq() {
    return response(axiosInstance.get(TOP_TEN_FAQS))
  },
  listFaq(params) {
    return response(axiosInstance.get(LIST_FAQS, { params }))
  },
  listNotification(params) {
    return response(axiosInstance.get(LIST_NOTIFICATIONS, { params }))
  },
  deleteAllNotification() {
    return response(axiosInstance.delete(DELETE_ALL_NOTIFICATIONS))
  },
  deleteNotification(id) {
    return response(axiosInstance.delete(DELETE_SPECIFIC_NOTIFICATIONS(id)))
  },
  recentNotification() {
    return response(axiosInstance.get(RECENT_NOTIFICATIONS))
  },
  readNotification(id) {
    return response(axiosInstance.put(READ_NOTIFICATION(id)))
  },
  listMyInquiry(params) {
    return response(axiosInstance.get(INQUIRY_ONE_TO_ONE_MINE, { params }))
  },
  deleteInquiry(id) {
    return response(axiosInstance.delete(DELETE_INQUIRY(id)))
  },
  detailInquiry(id) {
    return response(axiosInstance.get(DETAIL_INQUIRY(id)))
  },
  editInquiry(payload, id) {
    return response(axiosInstance.post(EDIT_INQUIRY(id), payload))
  }
})
