import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useReturnExchangeStore = defineStore('return-exchange', () => {
  const orderInformation = ref()
  const estimateDetail = ref()
  const returnNumberOrder = ref()

  const setOrderInfo = (data) => {
    orderInformation.value = data
  }

  const setEstimateOrderInfo = (data) => {
    estimateDetail.value = data
  }

  const setReturnNumberOrder = (data) => {
    returnNumberOrder.value = data
  }

  return {
    orderInformation,
    estimateDetail,
    returnNumberOrder,
    setOrderInfo,
    setEstimateOrderInfo,
    setReturnNumberOrder
  }
})
