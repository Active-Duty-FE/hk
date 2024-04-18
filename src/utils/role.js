import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ROLES_BE, ROLE_CONVERSION, STORAGE_IP_ADDRESS } from '@/helpers/constant'
import { AuthUserEnum, CardEnum, LevelUserEnum } from '@/helpers/enum'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import storage from './storage'

export const handleRole = (role, referral) => {
  switch (role) {
    case AuthUserEnum.CONSUMER:
      return referral ? ROLES_BE.consumer : ROLES_BE.no_referral_consumer
    case AuthUserEnum.PLANNER:
      return ROLES_BE.planner
    case AuthUserEnum.CO_OPERATE:
      return ROLES_BE.corporation
    default:
      return ROLES_BE.consumer
  }
}

export const handleCardType = (role) => {
  return CardEnum.PLANNER
}

export const isBeautyPlanner = computed(() => {
  const { currentAuthUser } = storeToRefs(useAuthUserStore())
  return [ROLES_BE.planner, ROLES_BE.corporation].includes(currentAuthUser.value?.userType?.code)
})

// disable for user accessing other country
export const disableAddCartButtonByCountry = (country) => {
  const { currentAuthUser } = storeToRefs(useAuthUserStore())
  if (currentAuthUser.value && (!currentAuthUser.value?.nationalCode || !country)) return true

  const plannerBuy = {
    US: ['US', 'CA'],
    CA: ['US', 'CA', 'NFR']
  }

  const userBuy = {
    US: ['US'],
    CA: ['CA', 'NFR']
  }

  const user = isBeautyPlanner.value ? plannerBuy : userBuy

  return currentAuthUser.value && !user[currentAuthUser.value?.nationalCode]?.includes(country)
}

export const isCompany = computed(() => {
  return storage.get(ROLE_CONVERSION) === ROLES_BE.corporation
})

export const textFollowRank = computed(() => {
  const { currentAuthUser } = storeToRefs(useAuthUserStore())
  const rank = currentAuthUser.value?.rank?.code
  if (rank === LevelUserEnum.POOL_PLUS) return 'Pool Plus'
  if (rank === LevelUserEnum.POOL_PREMIUM) return 'Pool Premium'
  return ''
})
