<template>
  <a-modal
    :visible="visible"
    centered
    :width="350"
    :footer="false"
    :mask-closable="false"
    :closable="false"
    wrap-class-name="modalPinCode"
  >
    <div>
      <div>
        <div class="relative flex justify-center px-5">
          <div class="font-550 text-[18px]">{{ title }}</div>
          <PinCodeClose class="absolute right-5 top-2 cursor-pointer" @click="closeModal" />
        </div>
        <a-divider class="bg-gray-11 !mb-0 !mt-3" />
      </div>
      <div>
        <div class="font-475 m-auto max-w-[296px] pt-10 text-center text-[18px]">
          <p
            v-if="errorValidate"
            class="font-475 text-red-1 m-auto mb-2 max-w-[296px] text-center text-[16px]"
          >
            {{ errorValidate }}
          </p>
          {{ stepText }}
        </div>
      </div>
      <div class="p-5 pb-20">
        <PinCodeDesktop
          :length="6"
          :is-refresh="isRefresh"
          :fail-count="failCount"
          :only-number="true"
          @pin-code-data="getPinCodeData"
        />
      </div>
    </div>
  </a-modal>
</template>
<script setup>
import PinCodeClose from '@/assets/svgs/pin-close.svg'

const emits = defineEmits(['close', 'finalPinCode'])
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  stepText: {
    type: String,
    default: ''
  },
  errorValidate: {
    type: String,
    default: ''
  },
  isRefresh: {
    type: Boolean,
    default: false
  },
  failCount: {
    type: Number,
    default: 0
  }
})

const closeModal = () => {
  emits('close')
}

const getPinCodeData = (data) => {
  emits('finalPinCode', data)
}
</script>
<style lang="scss">
.modalPinCode {
  .ant-modal-content {
    @apply rounded-[10px];
  }

  .ant-modal-body {
    @apply px-0 py-4;
  }
}
</style>
