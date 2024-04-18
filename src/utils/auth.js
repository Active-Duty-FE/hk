import storage from '@/utils/storage'
import { STORAGE_AUTOMATIC_LOGIN, STORAGE_IS_LOGGED_IN } from '@/helpers/constant'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { LevelUserEnum } from '@/helpers/enum'
import Pool from '@/assets/images/avatar/pool.png'
import PoolPlus from '@/assets/images/avatar/pool-plus.png'
import PoolPremium from '@/assets/images/avatar/pool-premium.png'
import Planner from '@/assets/images/avatar/planner.png'
import Manager from '@/assets/images/avatar/manager.png'
import SeniorManager from '@/assets/images/avatar/senior-manager.png'
import TeamLeader from '@/assets/images/avatar/team-leader.png'
import SeniorDirector from '@/assets/images/avatar/senior-director.png'
import Director from '@/assets/images/avatar/director.png'
import NationalDirector from '@/assets/images/avatar/national-director.png'
import Executive from '@/assets/images/avatar/executive.png'

export const getSaveTokenStorage = () => {
  const isAutomaticLogin = storage.get(STORAGE_AUTOMATIC_LOGIN, 'localStorage') === true
  return isAutomaticLogin ? 'localStorage' : 'sessionStorage'
}

export const getIsLoggedIn = () => {
  const saveStorage = getSaveTokenStorage()
  return storage.get(STORAGE_IS_LOGGED_IN, saveStorage)
}

export const getFullName = computed(() => {
  const { currentAuthUser } = storeToRefs(useAuthUserStore())
  if (!currentAuthUser.value) return ''
  const name = []
  const { firstName, lastName } = currentAuthUser.value
  if (firstName) name.push(firstName)
  if (lastName) name.push(lastName)
  return name.join(' ')
})

export const handleRenderAvatarCustomer = computed(() => {
  const { currentAuthUser } = storeToRefs(useAuthUserStore())

  switch (currentAuthUser.value?.rank?.code) {
    case LevelUserEnum.POOL:
      return Pool

    case LevelUserEnum.POOL_PLUS:
      return PoolPlus

    case LevelUserEnum.POOL_PREMIUM:
      return PoolPremium
    case LevelUserEnum.PLANNER:
      return Planner
    case LevelUserEnum.MANAGER:
      return Manager
    case LevelUserEnum.SENIOR_MANAGER:
      return SeniorManager
    case LevelUserEnum.TEAM_LEADER:
      return TeamLeader
    case LevelUserEnum.SENIOR_DIRECTOR:
      return SeniorDirector
    case LevelUserEnum.DIRECTOR:
      return Director
    case LevelUserEnum.NATIONAL_DIRECTOR:
      return NationalDirector
    case LevelUserEnum.EXECUTIVE:
      return Executive

    default:
      return Pool
  }
})
