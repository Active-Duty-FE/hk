<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean
  }
})

defineOptions({
  inheritAttrs: true
})

const emits = defineEmits(['update:modelValue'])

const currentValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  }
})
</script>
<template>
  <a-switch v-model:checked="currentValue" />
</template>
<style scoped lang="scss">
.ant-switch {
  @apply bg-[#dae1e5];
}
.ant-switch-checked {
  @apply bg-[#063451];
}
</style>
