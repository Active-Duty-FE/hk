import {
  CREATE_ADDRESS_SAVED_ENDPOINT,
  DELETE_ADDRESS_SAVED_ENDPOINT,
  GET_ADDRESS_SAVED_DETAIL_ENDPOINT,
  GET_ADDRESS_SAVED_ENDPOINT,
  UPDATE_ADDRESS_SAVED_ENDPOINT,
  UPDATE_DEFAULT_ADDRESS_SAVED_ENDPOINT
} from '@/http/endpoints/address'
import { response } from '@/http/response'

export default (axiosInstance) => ({
  getAddressSavedList() {
    return response(axiosInstance.get(GET_ADDRESS_SAVED_ENDPOINT))
  },

  getAddressDetail(id) {
    return response(axiosInstance.get(`${GET_ADDRESS_SAVED_DETAIL_ENDPOINT}/${id}`))
  },

  createAddressSaved(payload) {
    return response(axiosInstance.post(CREATE_ADDRESS_SAVED_ENDPOINT, payload))
  },

  updateAddressSaved({ userAddressId, payload }) {
    return response(axiosInstance.put(`${UPDATE_ADDRESS_SAVED_ENDPOINT}/${userAddressId}`, payload))
  },

  updateDefaultAddressSaved(userAddressId) {
    return response(axiosInstance.put(`${UPDATE_DEFAULT_ADDRESS_SAVED_ENDPOINT}/${userAddressId}`))
  },

  deleteAddressSaved(userAddressId) {
    return response(axiosInstance.delete(`${DELETE_ADDRESS_SAVED_ENDPOINT}/${userAddressId}`))
  }
})
