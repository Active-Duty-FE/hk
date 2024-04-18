import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCartStore = defineStore('cartStore', () => {
  const standardCartBadge = ref(0)
  const autoShipCartBadge = ref(0)
  const nfrCartBadge = ref(0)

  const totalCartBadge = computed(
    () => standardCartBadge.value + autoShipCartBadge.value + nfrCartBadge.value
  )

  function setStandardCartBadge(value) {
    standardCartBadge.value = value
  }

  function setAutoShipCartBadge(value) {
    autoShipCartBadge.value = value
  }

  function setNfrCartBadge(value) {
    nfrCartBadge.value = value
  }
  return {
    standardCartBadge,
    autoShipCartBadge,
    nfrCartBadge,
    totalCartBadge,
    setStandardCartBadge,
    setAutoShipCartBadge,
    setNfrCartBadge
  }
})
