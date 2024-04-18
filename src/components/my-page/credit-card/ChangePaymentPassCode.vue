<template>
  <div class="mb-[25px]" @click="handleChangePassCode">
    <a-divider class="bg-black-50 mb-[25px] mt-0" />
    <div class="flex items-center justify-between">
      <span class="font-475 text-lg">Change Payment Passcode</span>
      <ArrowRight />
    </div>
  </div>
</template>
<script setup>
import ArrowRight from '@/assets/svgs/arrow-right.svg'
import { useModalPinCode } from '@/stores/modules/modal-pincode'
import { useCreditCardStore } from '@/stores/modules/credit-card'

const modalPinCode = useModalPinCode()
const creditCardStore = useCreditCardStore()

const handleChangePassCode = () => {
  creditCardStore.updateStatusConditionPinCode({ change: true, reset: false, dataReset: {} })
  modalPinCode.doShowPinPopup('Change Payment Passcode', 'Please enter your existing password')
}
</script>
