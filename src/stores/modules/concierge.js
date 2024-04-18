import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConciergeStore = defineStore('concierge-icon', () => {
  const isShowConcierge = ref(false)

  return { isShowConcierge }
})
