import {
  CREATE_PIN_CODE,
  CHECK_PIN_CODE_MATCH,
  DELETE_OR_EDIT_CARD,
  UNLOCK_CARD,
  UPDATE_PIN_CARD,
  SAVE_CARD,
  LIST_CARD
} from '@/http/endpoints/credit-card'
import { response } from '@/http/response'

export default (axiosInstance) => ({
  saveCard(data, id) {
    return response(axiosInstance.post(SAVE_CARD(id), data))
  },
  getListCard(id) {
    return response(axiosInstance.get(LIST_CARD(id)))
  },
  createPinCode(data, id) {
    return response(axiosInstance.post(CREATE_PIN_CODE(id), data))
  },
  resetPinCode(data, id) {
    return response(axiosInstance.put(CREATE_PIN_CODE(id), data))
  },
  checkMatchPinCode(data, id) {
    return response(axiosInstance.post(CHECK_PIN_CODE_MATCH(id), data))
  },
  deleteCard(userId, cardId) {
    return response(axiosInstance.delete(DELETE_OR_EDIT_CARD(userId, cardId)))
  },
  updateCard(userId, cardId) {
    return response(axiosInstance.put(DELETE_OR_EDIT_CARD(userId, cardId)))
  },
  unlockCard(payload, userId) {
    return response(axiosInstance.post(UNLOCK_CARD(userId), payload))
  },
  updatePinCard(payload, userId) {
    return response(axiosInstance.put(UPDATE_PIN_CARD(userId), payload))
  }
})
