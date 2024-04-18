<template>
  <div class="autoship__wrap">
    <span class="autoship__label">{{ label }}</span>
    <slot>
      <span class="autoship__value">{{ value }}</span>
    </slot>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number],
    default: undefined
  }
})
</script>

<style lang="scss" scoped>
.autoship {
  &__wrap {
    background: rgba(224, 224, 224, 0.2);
    @apply flex flex-col items-center justify-center gap-2.5 py-4;
  }

  &__label {
    @apply leading-base text-xs;
  }

  &__value {
    @apply font-475 leading-5.5 text-base;
  }
}
</style>
