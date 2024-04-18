import { GET_MAIN_LIST } from '@/http/endpoints/main'

import { response } from '@/http/response'

export default (axiosInstance) => ({
  getCmsList(params) {
    return response(axiosInstance.get(GET_MAIN_LIST, { params }))
  }
})
