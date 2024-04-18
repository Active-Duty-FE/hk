import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMemberBannerStore = defineStore('member-banner', () => {
  const isShowBannerWelcome = ref(false)

  function setBannerWelcome(value) {
    isShowBannerWelcome.value = value
  }

  return { isShowBannerWelcome, setBannerWelcome }
})
