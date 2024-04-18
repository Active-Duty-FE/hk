import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { useCartStore } from '@/stores/modules/cart'
import storage from '@/utils/storage'
import { STORAGE_REFERRAL_CODE } from '@/helpers/constant'
import { AuthenticateTabEnum } from '@/helpers/enum'

export const useAuthUserStore = defineStore('authUser', () => {
  const currentAuthUser = ref(null)
  const referrerCode = ref()
  const referralInfo = ref(null)
  const activeAuthenticationTab = ref(AuthenticateTabEnum.PLANNER)
  const infoUserToConvert = reactive({})

  function setCurrentAuthUser(value) {
    currentAuthUser.value = value
    storage.remove(STORAGE_REFERRAL_CODE)
    const cartStore = useCartStore()
    const { setStandardCartBadge, setAutoShipCartBadge, setNfrCartBadge } = cartStore
    if (!value) {
      setStandardCartBadge(0)
      setAutoShipCartBadge(0)
      setNfrCartBadge(0)
    }
  }

  function setReferrerCode(value) {
    referrerCode.value = value
    storage.set(STORAGE_REFERRAL_CODE, value)
  }
  function setReferralInfo(value) {
    referralInfo.value = value
  }
  function setActiveAuthenticationTab(tab) {
    activeAuthenticationTab.value = tab
  }
  function resetActiveAuthenticationTab() {
    activeAuthenticationTab.value = AuthenticateTabEnum.PLANNER
  }
  function setInfoUserToConvert(data) {
    Object.assign(infoUserToConvert, data)
  }

  return {
    referrerCode,
    referralInfo,
    currentAuthUser,
    activeAuthenticationTab,
    infoUserToConvert,
    setCurrentAuthUser,
    setReferrerCode,
    setReferralInfo,
    setActiveAuthenticationTab,
    resetActiveAuthenticationTab,
    setInfoUserToConvert
  }
})
