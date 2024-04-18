<template>
  <a-checkbox v-bind="props">
    <slot />
  </a-checkbox>
</template>

<script setup>
const props = defineProps({})
</script>

<style lang="scss" scoped>
.ant-checkbox-wrapper {
  @apply inline-flex w-fit items-center;

  &:hover .ant-checkbox-inner {
    border-color: #212121 !important;
  }
}

:deep(.ant-checkbox) {
  @apply top-0;
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

:deep(.ant-checkbox + span) {
  @apply leading-base;
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
