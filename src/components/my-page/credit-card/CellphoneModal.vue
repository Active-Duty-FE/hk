<template>
  <a-modal centered title="Verification" :width="335" wrap-class-name="full-modal" :footer="false">
    <div class="pt-5">
      <FormCellPhoneCard @handle-data="handleReset" />
    </div>
  </a-modal>
</template>
<script setup>
import { useModalPinCode } from '@/stores/modules/modal-pincode'
import { useCreditCardStore } from '@/stores/modules/credit-card'

const modalPinCodeStore = useModalPinCode()
const creditCardStore = useCreditCardStore()

const handleReset = (data) => {
  creditCardStore.updateStatusConditionPinCode({ change: false, reset: true, dataReset: data })
  modalPinCodeStore.doShowPinPopup('Reset Payment Code', 'Please enter your new password')
}
</script>

<style lang="scss">
.ant-modal-content {
  @apply rounded-[10px];
}
.ant-modal-header {
  @apply rounded-[10px] border-none pb-7 pt-5;
}

.ant-modal-close {
  @apply right-5 top-5;

  &-x {
    @apply h-5 w-5 leading-none;
  }
}

.ant-modal-close-icon {
  @apply h-5 w-5 text-xl;

  svg {
    fill: #212121;
  }
}

.ant-modal-title {
  @apply font-550 text-black-50 text-center text-lg;
}

.ant-modal-body {
  @apply p-5 pt-0;
}
</style>
