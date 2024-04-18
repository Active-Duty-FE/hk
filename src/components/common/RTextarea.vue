<template>
  <a-textarea v-bind="props" />
</template>

<script setup>
const props = defineProps({})
</script>

<style lang="scss" scoped>
.ant-input {
  @apply min-h-[150px] rounded-none py-2.5;
}
</style>
