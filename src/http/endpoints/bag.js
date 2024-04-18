import { storeToRefs } from 'pinia'
import { useAuthUserStore } from '@/stores/modules/auth-user'

const BAG_PREFIX = '/member/v1/users/planner'
const BAG_PUBLIC_PREFIX = '/member/v1/users/public/planner'

const getUserId = () => {
  const { currentAuthUser } = storeToRefs(useAuthUserStore())
  return currentAuthUser.value?.userSeqNo
}
export const GET_BAG_LIST = () => `${BAG_PREFIX}/${getUserId()}/bags`
export const GET_BAG_DETAIL = (id) => `${BAG_PREFIX}/bags/${id}`
export const GET_BAG_DETAIL_PUBLIC = (id) => `${BAG_PUBLIC_PREFIX}/bags/${id}`
export const GET_BAG_CONTENT = () => `${BAG_PREFIX}/${getUserId()}/bag/content`
export const GET_BAG_IMAGES = () => `${BAG_PREFIX}/${getUserId()}/bag/images`
export const CREATE_BAG = () => `${BAG_PREFIX}/${getUserId()}/bag`
export const DELETE_BAG = (id) => `${BAG_PREFIX}/${getUserId()}/bags/${id}`
export const DELETE_MULTIPLE_BAG = () => `${BAG_PREFIX}/${getUserId()}/bags`
