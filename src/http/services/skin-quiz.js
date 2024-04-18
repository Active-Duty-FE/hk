import {
  LIST_QUESTION_ENDPOINT,
  LIST_PRODUCT_SET_ENDPOINT,
  SAVE_ANSWER_ENDPOINT
} from '@/http/endpoints/skin-quiz'
import { response } from '@/http/response'

export default (axiosInstance) => ({
  getListQuestion() {
    return response(axiosInstance.get(LIST_QUESTION_ENDPOINT))
  },
  saveAnswer(payload) {
    return response(axiosInstance.post(SAVE_ANSWER_ENDPOINT, payload))
  },
  getSetProduct(payload) {
    return response(axiosInstance.post(LIST_PRODUCT_SET_ENDPOINT, payload))
  }
})
