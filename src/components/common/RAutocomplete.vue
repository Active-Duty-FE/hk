<template>
  <a-auto-complete v-bind="props" :class="{ loading }">
    <template #option="item">
      <slot name="option" v-bind="item" />
    </template>
  </a-auto-complete>
</template>

<script setup>
const props = defineProps({
  class: {
    type: String,
    default: 'h-12 border-gray-5'
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
:deep(.ant-select-selection-placeholder) {
  @apply flex items-center;
}

:deep(.ant-select-selector) {
  height: 100% !important;
  border-color: #e0e0e0 !important;
  border-radius: 0 !important;
}

:deep(.ant-select-selection-search-input) {
  height: 100% !important;
}

.loading :deep(.ant-select-selector) {
  &::before,
  &::after {
    animation: around 0.7s ease-in-out infinite;
    @apply absolute right-2 top-1/2 inline-block h-4 w-4 rounded-[20px] border border-solid border-[#a6a7a6_#a6a7a6_transparent_transparent] content-[''];
  }

  &::after {
    animation: around 0.7s ease-in-out 0.1s infinite;
    background: transparent;
  }
}

@keyframes around {
  0% {
    transform: translateY(-50%) rotate(0deg);
  }
  100% {
    transform: translateY(-50%) rotate(360deg);
  }
}
</style>
