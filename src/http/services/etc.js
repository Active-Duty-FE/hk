import {
  NOTICE_DETAIL,
  NOTICE_LIST,
  ARCHIVE_DETAIL,
  ARCHIVE_SEARCH_LIST
} from '@/http/endpoints/etc'
import { response } from '@/http/response'
export default (axiosInstance) => ({
  getNoticeList(payload, params) {
    return response(axiosInstance.post(NOTICE_LIST, payload, { params }))
  },
  getNoticeDetail(id) {
    return response(axiosInstance.get(NOTICE_DETAIL(id)))
  },
  getArchiveSearchList(payload, params) {
    return response(axiosInstance.post(ARCHIVE_SEARCH_LIST, payload, { params }))
  },
  getArchiveDetail(id) {
    return response(axiosInstance.get(ARCHIVE_DETAIL(id)))
  }
})
