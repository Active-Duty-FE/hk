<template>
  <a-rate v-bind="props" allow-half>
    <template #character>
      <StarFilled />
    </template>
  </a-rate>
</template>

<script setup>
import { StarFilled } from '@ant-design/icons-vue'

const props = defineProps({})
</script>

<style lang="scss" scoped>
:deep(.ant-rate-star:not(:last-child)) {
  margin-right: 2px;
}

.ant-rate {
  @apply text-navy-6;
}
</style>
