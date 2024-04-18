<template>
  <a-drawer
    class="pincode-drawer"
    :visible="visible"
    :height="height"
    placement="bottom"
    :closable="false"
    :body-style="bodyStyle"
  >
    <div>
      <div class="relative flex justify-center px-5">
        <div class="font-550 text-[18px]">{{ title }}</div>
        <PinCodeClose class="absolute right-5 top-2 cursor-pointer" @click="closeModal" />
      </div>
      <a-divider class="bg-gray-11 !mb-0" />
    </div>
    <div class="body-content">
      <div class="font-475 m-auto max-w-[296px] py-10 text-center text-[18px]">
        <p
          v-if="errorValidate"
          class="font-475 pt- text-red-1 m-auto mb-2 max-w-[296px] text-center text-[16px]"
        >
          {{ errorValidate }}
        </p>
        {{ stepText }}
      </div>
      <PinCodeMobile
        :error-validate="errorValidate"
        :step-text="stepText"
        :is-refresh="isRefresh"
        :fail-count="failCount"
        @pin-code-data="getPinCodeData"
      />
    </div>
  </a-drawer>
</template>
<script setup>
import PinCodeClose from '@/assets/svgs/pin-close.svg'

const height = 'calc(100% - 65px)'
const emits = defineEmits(['close', 'finalPinCode'])
defineProps({
  title: {
    type: String,
    default: ''
  },
  visible: {
    type: Boolean,
    default: false
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

const bodyStyle = {
  padding: '24px 0'
}

const closeModal = () => {
  emits('close')
}

const getPinCodeData = (data) => {
  emits('finalPinCode', data)
}
</script>
<style lang="scss" scoped>
:deep(.ant-drawer-body) {
  @apply px-0;
}
</style>
