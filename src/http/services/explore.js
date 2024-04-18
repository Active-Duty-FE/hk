import {
  GET_CONTENT_EC,
  GET_CONTENT_BLOG_CATEGORY,
  GET_CONTENT_BLOG_DETAIL,
  GET_SNS_DISPLAY_TYPE
} from '@/http/endpoints/explore'
import { response } from '@/http/response'

export default (axiosInstance) => ({
  getContentEC(payload, params) {
    return response(axiosInstance.post(GET_CONTENT_EC, payload, { params }))
  },
  getContentCategory() {
    return response(axiosInstance.get(GET_CONTENT_BLOG_CATEGORY))
  },
  getContentBlogDetail(id) {
    return response(axiosInstance.get(GET_CONTENT_BLOG_DETAIL(id)))
  },
  getSnsDisplayType(params) {
    return response(axiosInstance.get(GET_SNS_DISPLAY_TYPE, { params }))
  }
})
