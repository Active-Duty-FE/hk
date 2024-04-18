<template>
  <a-radio-group v-bind="propsDefault" size="large">
    <a-radio
      v-for="item in optionsCustom"
      :key="item.value"
      :value="item.value"
      :style="{ color: 'green' }"
    >
      <slot v-bind="item" />
    </a-radio>
  </a-radio-group>
</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  optionsCustom: {
    type: Array,
    default: () => []
  }
})

const { optionsCustom, ...propsDefault } = toRefs(props)
</script>

<style lang="scss" scoped>
:deep(span.ant-radio + span) {
  color: #212221;
  @apply text-sm font-medium;
}

.ant-radio-checked .ant-radio-inner {
  border-color: red !important ;
}

.ant-radio-checked .ant-radio-inner:after {
  background-color: red;
}

.ant-radio:hover .ant-radio-inner {
  border-color: red;
}
</style>
