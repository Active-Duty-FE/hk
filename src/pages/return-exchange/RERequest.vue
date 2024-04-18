<script setup>
import SelectProduct from '@/components/return-exchange/SelectProduct.vue'
import SelectReason from '@/components/return-exchange/SelectReason.vue'
import { ref, shallowRef, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const salesOrderId = ref(Number(route.params?.salesOrderId ?? 0))
const currentStep = ref(0)
const orderInfo = ref({
  salesOrderId: Number(route.params?.salesOrderId ?? 0),
  imageReturnRequestList: [],
  returnOrderReasonType: undefined,
  returnReasonDetail: undefined,
  returnReasonOtherDetail: undefined,
  personalReason: false,
  returnExchangeType: undefined
})

const steps = shallowRef([
  {
    title: 'Please select a reason for return or exchange.',
    component: SelectReason
  },
  {
    title: 'Please select the product you wish to return or exchange.',
    component: SelectProduct
  }
])

const updateStep = (step) => {
  currentStep.value = step
}

const changeFormData = (data) => {
  orderInfo.value = {
    ...orderInfo.value,
    ...data,
    returnReasonDetail: data.returnReasonDetail === 'Other' ? '' : data.returnReasonDetail
  }
  currentStep.value = 1
}

const scrollToTop = () => {
  const $container = document.querySelector('.container-layout')
  if ($container) {
    $container.scrollTop = 0
  }
}

watch(currentStep, scrollToTop)
</script>

<template>
  <component
    :is="steps[currentStep].component"
    :key="currentStep"
    :title="steps[currentStep].title"
    :order-info="orderInfo"
    @update-step="updateStep"
    @change-form-data="changeFormData"
  />
</template>
