import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalLoadingStore = defineStore('global-loading', () => {
  const isGlobalLoading = ref(false)

  function showGlobalLoading(value) {
    isGlobalLoading.value = value
  }

  return { isGlobalLoading, showGlobalLoading }
})
