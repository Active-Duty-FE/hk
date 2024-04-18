import { USER_API_PREFIX } from './address'

export const SAVE_CARD = (id) => `${USER_API_PREFIX}/${id}/favorite-cards/register`
export const LIST_CARD = (id) => `${USER_API_PREFIX}/${id}/favorite-cards`
export const CREATE_PIN_CODE = (id) => `${USER_API_PREFIX}/${id}/order-password`
export const CHECK_PIN_CODE_MATCH = (id) => `${USER_API_PREFIX}/${id}/order-password/match`
export const DELETE_OR_EDIT_CARD = (userId, cardId) =>
  `${USER_API_PREFIX}/${userId}/favorite-cards/${cardId}`
export const UNLOCK_CARD = (userId) => `${USER_API_PREFIX}/${userId}/favorite-cards/unlock`
export const UPDATE_PIN_CARD = (userId) => `${USER_API_PREFIX}/${userId}/order-password/change`
