<template>
  <div>
    <a-divider class="!bg-gray-10 !my-0" />
    <div class="notice-wrap">
      <div class="flex justify-between"></div>
      <div
        class="notice-description line-clamp-2 max-w-full cursor-pointer break-words"
        @click="viewDetail(item)"
      >
        {{ item.displayTitle }}
      </div>
      <div class="notice-date text-black">
        {{ formatDateTime(item.createdDatetime, FORMAT_FULL_YEAR_USE_DOT) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

import { formatDateTime } from '@/utils/datetime'
import { FORMAT_FULL_YEAR_USE_DOT } from '@/helpers/constant'
const router = useRouter()
defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  count: {
    type: Number,
    default: 0
  }
})

const viewDetail = (item) => {
  router.push(`/my-page/archive/${item.id}`)
}
</script>

<style lang="scss" scoped>
.notice {
  &-wrap {
    @apply py-7.5 border-t-1 border-gray-black border-b-1;
  }

  &-title {
    @apply font-550 text-sm -tracking-[0.28px];
  }

  &-description {
    @apply leading-5.5 mb-5 text-base;
  }

  &-date {
    @apply leading-base text-xs;
  }
}
</style>
