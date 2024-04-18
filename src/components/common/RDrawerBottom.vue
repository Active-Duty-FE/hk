<template>
  <a-drawer
    v-model:visible="visible"
    class="drawerBottom"
    placement="bottom"
    :title="title"
    :closable="closable"
    :height="visible ? height : 0"
    @close="onClose"
  >
    <template #closeIcon>
      <CloseIcon />
    </template>

    <slot />
  </a-drawer>
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import CloseIcon from '@/assets/svgs/pin-close.svg'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  closable: {
    type: Boolean,
    default: true
  },
  height: {
    type: [Number, String],
    default: ''
  }
})

const emits = defineEmits(['update:modelValue', 'close'])

const visible = useVModel(props, 'modelValue', emits)

const onClose = () => {
  emits('close')
}
</script>

<style lang="scss">
.drawerBottom {
  transform: none !important;
  @apply flex justify-center;
  @apply md:items-center;

  @media (min-width: 768px) {
    transition: none !important;
  }

  .ant-drawer-content,
  .ant-drawer-content-wrapper {
    @apply h-fit max-h-[calc(100vh-150px)]  overflow-auto rounded-t-xl;
    @apply md:rounded-xl;
  }

  .ant-drawer-content-wrapper {
    @apply max-w-3xl;
    @apply md:relative;
  }

  .ant-drawer-header {
    @apply p-5;
  }

  .ant-drawer-header-title {
    @apply flex-row-reverse items-center;
  }

  .ant-drawer-title {
    @apply font-550 leading-base text-gray-10 text-center text-lg;
  }

  .ant-drawer-close {
    @apply absolute right-5 top-1/2 m-0 flex -translate-y-1/2 items-center p-0;
  }

  .ant-drawer-body {
    @apply px-5 py-10;
  }
}
</style>
