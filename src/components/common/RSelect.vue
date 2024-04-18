<template>
  <a-select v-bind="props" class="custom-select" :placeholder="placeholder">
    <!-- Default slot for options -->
    <slot v-if="hasDefaultSlot" name="default" />
    <template v-if="hasOptionSlot" #option="item">
      <slot v-bind="item" name="option" />
    </template>
    <template #suffixIcon>
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">
        <path d="M9 1L5 5L1 1" stroke="#212221" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </template>
  </a-select>
</template>

<script setup>
const props = defineProps({
  /** Class custom of select */
  class: {
    type: String,
    default: '',
    required: false
  },

  /** Select options */
  options: {
    type: Array,
    required: true
  },

  /** Placeholder of select */
  placeholder: {
    type: String,
    default: '',
    required: false
  }
})

const slots = defineSlots()
const hasDefaultSlot = !!slots.default
const hasOptionSlot = !!slots.option
</script>

<style scoped lang="scss">
.custom-select {
  :deep(.ant-select-selector) {
    @apply border-gray-11 rounded-0 h-12 items-center border;
  }
  :deep(span.ant-select-selection-item) {
    @apply text-gray-10 inline-flex items-center;
  }
  :deep(span.ant-select-selection-placeholder) {
    @apply text-grey-13 inline-flex items-center;
  }
  :deep(span.ant-select-arrow) {
    @apply text-grey-2;
  }
}
</style>
