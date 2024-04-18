<template>
  <div class="info__wrap">
    <span class="info__label">{{ label }}</span>
    <span v-clean-html="value" class="info__value" />
  </div>
</template>

<script setup>
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'

defineProps({
  label: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number],
    default: ''
  }
})

const vCleanHtml = buildVueDompurifyHTMLDirective()
</script>

<style lang="scss" scoped>
.info {
  &__wrap {
    @apply flex w-full items-start justify-between gap-2;
  }

  &__label {
    @apply leading-base whitespace-nowrap text-sm -tracking-[0.28px];
  }

  &__value {
    @apply leading-base min-h-4.5 block flex-1 whitespace-pre-wrap break-all text-right text-xs;
  }
}
</style>
