<template>
  <div class="mb-[25px] cursor-pointer" @click="handleResetPassCode">
    <a-divider class="bg-black-50 mb-[25px] mt-0" />
    <div class="flex items-center justify-between">
      <span class="font-475 text-lg">Reset Payment Passcode</span>
      <ArrowRight />
    </div>
  </div>
  <CellphoneModal v-model:visible="creditCardStore.visibleModalReset" />
  <!-- Pin code mobile -->
</template>
<script setup>
import ArrowRight from '@/assets/svgs/arrow-right.svg'
import { useCreditCardStore } from '@/stores/modules/credit-card'

const creditCardStore = useCreditCardStore()

const handleResetPassCode = () => {
  creditCardStore.handleChangeStatusModalReset(true)
}
</script>

<style lang="scss">
.cellphonePopup {
  .ant-modal-header {
    @apply border-none pb-7 pt-5;
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
    @apply font-550 text-center text-2xl leading-6;
  }

  .ant-modal-body {
    @apply p-5 pt-0;
  }
}
</style>
