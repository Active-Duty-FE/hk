<template>
  <a-input
    v-bind="props"
    ref="inputRef"
    :disabled="disabled"
    @input="$emit('update:value', $event.target.value)"
  >
    <template v-if="hasSuffixSlot" #suffix><slot name="suffix" /></template>
    <template v-if="hasPrefixSlot" #prefix><slot name="prefix" /></template>
  </a-input>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
  value: {
    type: [String, null],
    default: '',
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  class: {
    type: String,
    default: 'h-12 border-gray-5 !rounded-0'
  },
  maxlength: {
    type: Number,
    default: 2000
  },
  type: {
    type: String,
    default: 'text'
  },
  autoComplete: {
    type: String,
    default: 'new-password'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
defineEmits(['update:value'])

const inputRef = ref()

const focus = () => {
  inputRef.value.focus()
}
defineExpose({ focus })

const slots = defineSlots()
const hasSuffixSlot = slots.suffix
const hasPrefixSlot = slots.prefix
</script>

<style lang="scss" scoped>
:deep(.ant-input) {
  @apply border-gray-11;
}
</style>
