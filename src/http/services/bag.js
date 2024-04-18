import { response } from '@/http/response'
import {
  CREATE_BAG,
  DELETE_BAG,
  DELETE_MULTIPLE_BAG,
  GET_BAG_CONTENT,
  GET_BAG_DETAIL,
  GET_BAG_DETAIL_PUBLIC,
  GET_BAG_IMAGES,
  GET_BAG_LIST
} from '@/http/endpoints/bag'

export default (axiosInstance) => ({
  getBagList(params) {
    return response(axiosInstance.get(GET_BAG_LIST(), { params }))
  },
  getBagDetailPublic(id) {
    return response(axiosInstance.get(GET_BAG_DETAIL_PUBLIC(id)))
  },
  getBagDetail(id) {
    return response(axiosInstance.get(GET_BAG_DETAIL(id)))
  },
  getBagContent() {
    return response(axiosInstance.get(GET_BAG_CONTENT()))
  },
  getBagImage(type) {
    return response(
      axiosInstance.get(GET_BAG_IMAGES(), {
        params: {
          bagImageType: type
        }
      })
    )
  },
  createBag(payload) {
    return response(axiosInstance.post(CREATE_BAG(), payload))
  },
  deleteBag(id) {
    return response(axiosInstance.delete(DELETE_BAG(id)))
  },
  deleteMultipleBag(payload) {
    return response(axiosInstance.delete(DELETE_MULTIPLE_BAG(), { data: payload }))
  }
})
