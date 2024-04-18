<template>
  <div class="notice-wrap">
    <div class="flex justify-between">
      <p class="notice-type">{{ item.displayCategory?.text }}</p>
      <img v-if="item.fixed" src="@/assets/svgs/icon-pin.svg?url" alt="" />
    </div>

    <p class="notice-title" @click="gotoDetail">{{ item.displayTitle }}</p>

    <p class="notice-date">{{ formatDateTime(item.createdDatetime, FORMAT_FULL_YEAR_USE_DOT) }}</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { formatDateTime } from '@/utils/datetime'
import { FORMAT_FULL_YEAR_USE_DOT } from '@/helpers/constant'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})

const router = useRouter()

const gotoDetail = () => {
  router.push({
    name: AppRoutes.myPage.notice.detail.name,
    params: {
      id: props.item.id
    }
  })
}
</script>

<style lang="scss" scoped>
.notice {
  &-wrap {
    @apply py-7.5 border-t-1 border-gray-black border-t-solid;
  }

  &-type {
    @apply font-550 text-sm -tracking-[0.28px];
  }

  &-title {
    @apply leading-5.5 line-clamp-2 w-fit max-w-full cursor-pointer break-words text-base;
  }

  &-date {
    @apply leading-base text-xs;
  }
}
</style>
