<template>
  <div class="guide">
    <p class="guide__title">{{ title }}</p>

    <div class="guide__content">
      <p class="guide__description">{{ description }}</p>

      <div
        v-for="(item, index) in items"
        :key="index"
        class="guide__item"
        :class="{ 'items-center': indexCenter }"
      >
        <div class="guide__item-index">{{ getIndex(index) }}</div>
        <div class="guide__item-content">
          <span class="guide__item-title">{{ item.title }}</span>
          <span v-if="item.description" class="guide__item-description">{{
            item.description
          }}</span>
        </div>
      </div>
    </div>
    <slot name="footer" />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  items: {
    type: Array,
    default: () => []
  },
  indexCenter: {
    type: Boolean,
    default: false
  }
})

const getIndex = (index) => {
  const number = index + 1
  return number < 10 ? `0${number}` : number
}
</script>

<style lang="scss" scoped>
.guide {
  @apply overflow-hidden rounded-[10px] bg-white;

  &__content {
    @apply p-5;
  }

  &__title {
    box-shadow: inset 0 -1px #e9e9e9;
    @apply border-b-gray-5 text-black-50 mb-0 px-5 py-[18px] text-sm font-medium leading-[14px];
  }

  &__description {
    @apply text-gray-2 mb-5 text-xs;
  }

  &__item {
    &:not(:last-child) {
      @apply mb-4;
    }

    @apply flex gap-[6px];

    &-content {
      @apply flex flex-col;
    }

    &-index {
      @apply bg-gray-2 min-w-5 inline-flex h-5 w-5 items-center justify-center rounded-full pt-[2px] text-[10px] font-bold text-white;
    }

    &-title {
      @apply text-gray-1 whitespace-pre-line text-sm;
    }

    &-description {
      @apply text-gray-2 mt-[5px] whitespace-pre-line text-xs;
    }
  }
}
</style>
