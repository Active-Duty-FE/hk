<template>
  <a-modal centered v-bind="props" wrap-class-name="full-modal">
    <slot name="form" />
  </a-modal>
</template>
<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  width: {
    type: [Number, String],
    default: 335
  },
  footer: {
    type: Boolean,
    default: false
  }
})
</script>
<style lang="scss">
.ant-modal-content {
  @apply rounded-[10px];
}
.ant-modal-header {
  @apply rounded-[10px] border-none pb-7 pt-5;
}

.ant-modal-close {
  @apply right-5 top-5;

  &-x {
    @apply h-5 w-5 leading-none;
  }
}

.ant-modal-close-icon {
  @apply h-5 w-5 text-xl;

  svg {
    fill: #212121;
  }
}

.ant-modal-title {
  @apply font-550 text-black-50 text-center text-lg;
}

.ant-modal-body {
  @apply p-5 pt-0;
}
</style>
