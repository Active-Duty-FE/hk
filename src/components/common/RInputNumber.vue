<template>
  <a-input-number v-bind="props" :controls="controls">
    <template v-if="hasAddonAfterSlot" #addonAfter>
      <slot name="addonAfter" />
    </template>
    <template v-if="hasAddonBeforeSlot" #addonBefore>
      <slot name="addonBefore" />
    </template>
  </a-input-number>
</template>

<script setup>
const props = defineProps({
  controls: {
    type: Boolean,
    default: false
  },
  autoComplete: {
    type: String,
    default: 'new-password'
  }
})

const slots = defineSlots()
const hasAddonAfterSlot = !!slots.addonAfter
const hasAddonBeforeSlot = !!slots.addonBefore
</script>

<style lang="scss" scoped>
.ant-input-number {
  @apply rounded-0 border-gray-11 w-full;
}

.ant-input-number-group-wrapper {
  @apply h-fit;
}

:deep(.ant-input-number) {
  box-shadow: none !important;
}

:deep(.ant-input-number-input) {
  @apply min-h-12;
}

:deep(.ant-input-number-group-addon) {
  @apply select-none;
}
</style>
