<template>
  <a-checkbox-group v-bind="propsDefault">
    <div v-for="item in optionsCustom" :key="item.value">
      <a-checkbox :class="checkBoxClass" :value="item.value">
        <slot v-bind="item" />
      </a-checkbox>
    </div>
  </a-checkbox-group>
</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  optionsCustom: {
    type: Array,
    default: () => []
  },
  checkBoxClass: {
    type: String,
    default: '',
    required: false
  }
})

const { optionsCustom, checkBoxClass, ...propsDefault } = toRefs(props)
</script>

<style lang="scss" scoped>
:deep(.ant-checkbox-wrapper) {
  @apply w-fit;

  &:hover .ant-checkbox-inner {
    border-color: #212121 !important;
  }
}

:deep(.ant-checkbox-inner) {
  border-color: #212121 !important;
  @apply rounded-0 bg-white;

  &::after {
    top: 45%;
    left: 22.5%;
    width: 5px;
    height: 10px;
  }
}

:deep(.ant-checkbox-checked) {
  &::after {
    border-color: #212121 !important;
  }

  .ant-checkbox-inner::after {
    @apply border-gray-10 border-1;
  }
}
</style>
