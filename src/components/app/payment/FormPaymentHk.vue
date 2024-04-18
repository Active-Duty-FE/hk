<template>
  <div class="form-payment-hk">
    <div class="form-payment-hk__switch flex flex-col gap-5 pb-8">
      <p class="title-switch-payment text-base font-medium">
        {{ $t('auth.sign_up.selectRecommend.payment_method') }}
      </p>
      <div class="flex flex-row items-center gap-2">
        <a-switch v-model:checked="states.savedCardPayment"></a-switch>
        <span
          :class="['text-base font-medium', states.savedCardPayment ? 'opacity-100' : 'opacity-50']"
        >{{ $t('auth.sign_up.selectRecommend.save_card_title') }}</span
        >
      </div>
    </div>
    <RModalConfirm
      v-model:visible="states.modalPayment"
      :width="400"
      :mask-closable="true"
      :footer="false"
    >
      <template #extraTitle> </template>
      <template #extraDescription>
        <div class="text-navy-deep flex flex-col gap-4 pt-3 text-base font-medium">
          <r-button
            v-if="states.paymentStatus"
            class-title="text-white"
            :title="$t('auth.sign_up.agree_term_condition.sign_up_complete')"
            class="!bg-navy-6 !border-navy-6 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full"
            :disabled="!states.paymentStatus"
            @click="payment"
          >
          </r-button>

          <r-button
            class-title="text-black"
            title="Close"
            class="!border-navy-6 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full"
            @click="handleOpenModal"
          >
          </r-button>
        </div>
      </template>
    </RModalConfirm>
  </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue'
import RModalConfirm from '@/components/common/RModalConfirm.vue'
import RButton from '@/components/common/RButton.vue'
import apiService from '@/http/api'
import { MESSAGE } from '@/helpers/constant'
const TIME_OUT_GET_STATUS_PAYMENT = 2000
const props = defineProps({
  checkTerm: {
    type: Boolean,
    default: true
  },
  dataPayment: {
    type: Object,
    default: () => {}
  }
})
const emits = defineEmits(['handlePayment', 'paymentSuccess'])
const states = reactive({
  savedCardPayment: false,
  modalPayment: false,
  paymentStatus: false
})
const handleOpenModal = () => {
  states.modalPayment = !states.modalPayment
}
const payment = () => {
  emits('paymentSuccess')
}

const checkStatusPayment = async () => {
  const payloadGetStatus = {
    tokenOrder: props.dataPayment?.tokenOrder,
    tokenUser: props.dataPayment?.registerCompleteToken
  }
  const res = await apiService.authService.getStatusPayment(payloadGetStatus)
  if (res?.data === MESSAGE.COMPLETED) {
    states.paymentStatus = true
  } else {
    setTimeout(checkStatusPayment, TIME_OUT_GET_STATUS_PAYMENT)
  }
}

defineExpose({
  handleOpenModal
})

onMounted(() => {
  checkStatusPayment()
})
</script>
<style scoped lang="scss">
.form-payment-hk {
  @apply px-5;
  .title-switch-payment {
    &::after {
      content: '*';
      @apply text-red-1000;
    }
  }
}
</style>
