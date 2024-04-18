<template>
  <r-button
    v-if="checkStatusReturn(data?.returnOrderStatusCode)?.textBtn"
    class-title="text-navy-1"
    :title="checkStatusReturn(data?.returnOrderStatusCode)?.textBtn"
    class="disabled:(!bg-navy-4 border-1 !border-navy-4) !mx-auto !h-10 w-full !shadow-none"
    @click="handleStatusBtn"
  />

  <RModalAlert
    v-model:visible="buttonState.visibleCheckReason"
    title="Check Reason for Reject"
    text-btn="OK"
    :description="buttonState.reasonForReject"
    :width="280"
    @confirm="() => (buttonState.visibleCheckReason = false)"
  />
  <RModalConfirm
    v-model:visible="buttonState.visibleCancel"
    title=""
    text-ok="OK"
    text-cancel="Cancel"
    description="Do you want to cancel the return request?"
    :width="280"
    @ok="handleCancel"
    @cancel="buttonState.visibleCancel = false"
  />
  <RModalAlert
    v-model:visible="buttonState.visibleModalAlert"
    title="Alarm"
    text-btn="OK"
    :description="buttonState.descriptionAlert"
    :width="280"
    @confirm="() => (buttonState.visibleModalAlert = false)"
  />
</template>

<script setup>
import { checkStatusReturn, ACTIONS_BUTTON_RETURN } from '@/helpers/order-history'
import { reactive, computed } from 'vue'

import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { RETURN_EXCHANGE_TYPE } from '@/helpers/constant'

const storeLoading = useGlobalLoadingStore()
const { showGlobalLoading } = storeLoading

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  loadAgain: {
    type: Function,
    default: () => {}
  }
})

const buttonState = reactive({
  visibleCancel: false,
  visibleCheckReason: false,
  reasonForReject: '',
  visibleModalAlert: false,
  descriptionAlert: ''
})

const handleModalAlert = (status, text = '') => {
  buttonState.visibleModalAlert = status
  buttonState.descriptionAlert = text
}

const isExchange = computed(() => props.data?.returnExchangeType === RETURN_EXCHANGE_TYPE.EXCHANGE)

const checkReason = async () => {
  try {
    showGlobalLoading(true)
    const response = isExchange.value
      ? await apiService.returnService.checkReasonRejectExchange(props.data?.returnOrderRequestId)
      : await apiService.returnService.getReasonForRejection(props.data?.returnOrderNumber)
    if (response.success) {
      buttonState.reasonForReject = response?.data?.reason
      buttonState.visibleCheckReason = true
    } else {
      handleModalAlert(true, response.message)
    }
  } finally {
    showGlobalLoading(false)
  }
}

const handleStatusBtn = async () => {
  const action = checkStatusReturn(props.data?.returnOrderStatusCode)?.action
  if (action === ACTIONS_BUTTON_RETURN.CANCEL) {
    buttonState.visibleCancel = true
  }
  if (action === ACTIONS_BUTTON_RETURN.CHECK_REASON) {
    checkReason()
  }
  if (action === ACTIONS_BUTTON_RETURN.DELIVERY_TRACKING) {
    checkDeliveryTracking()
  }
}

const checkDeliveryTracking = async () => {
  try {
    showGlobalLoading(true)
    const response = await apiService.returnService.getDeliveryTrackingExchange(
      props.data?.returnOrderRequestId
    )
    if (response.success) {
      window.open(
        response?.data?.trackingNumberUrl,
        response?.data?.warehouse,
        'height=600,width=600'
      )
    }
  } finally {
    showGlobalLoading(false)
  }
}

const handleCancel = async () => {
  try {
    showGlobalLoading(true)
    const response = isExchange.value
      ? await apiService.returnService.cancelExchangeRequest(props.data?.returnOrderRequestId)
      : await apiService.returnService.returnCancellation(props.data?.returnOrderNumber)
    if (response.success) {
      buttonState.visibleCancel = false
      props.loadAgain()
    } else {
      handleModalAlert(true, response.message)
    }
  } finally {
    showGlobalLoading(false)
  }
}
</script>
