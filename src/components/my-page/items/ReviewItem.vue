<template>
  <div class="review">
    <p class="review__status">{{ review.approvedYn ? 'Approved' : 'Waiting for approval' }}</p>
    <p class="review__title">{{ review.title }}</p>
    <RRate class="review__rate" :value="review.rate" disabled />
    <p ref="reviewContentRef" class="review__content" :class="{ close: !isShowMore }">
      {{ review.content }}
    </p>

    <p v-if="hasShowMore" class="review__readMore" @click="isShowMore = !isShowMore">
      {{ isShowMore ? 'Less' : 'Read more' }}
    </p>

    <div class="flex items-center justify-between">
      <span class="review__createdDatetime">{{
        formatDateTime(review.createdDatetime, FORMAT_USER_DISPLAY)
      }}</span>

      <img
        src="@/assets/svgs/icon-remove.svg?url"
        alt=""
        class="cursor-pointer"
        @click="onDeleteReview"
      />
    </div>

    <div v-if="isShowFiles" class="file__wrap no-scrollbar mt-5">
      <template v-if="review.imageUrl">
        <img v-for="url in review.imageUrl" :key="url" :src="url" alt="" class="file__item" />
      </template>
      <template v-if="review.mediaUrl">
        <video
          v-for="url in review.mediaUrl"
          :key="url"
          class="file__item"
          playsinline
          controls
          loop
        >
          <source :src="url" />
          <track src="" label="" kind="captions" default />
        </video>
      </template>
    </div>
  </div>
</template>

<script setup>
import { formatDateTime } from '@/utils/datetime'
import { FORMAT_USER_DISPLAY } from '@/helpers/constant'
import { computed, ref, toRefs } from 'vue'
import { useReadMore } from '@/composables/readMore'
import apiService from '@/http/api'
import { useAlertConfirm } from '@/composables/alert'
import { useNotification } from '@/composables/notification'
import { useGlobalLoadingStore } from '@/stores/modules/loading'

const { showGlobalLoading } = useGlobalLoadingStore()
const { showNotification } = useNotification()

const props = defineProps({
  review: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['delete'])

const reviewContentRef = ref()

const isShowFiles = computed(() => props.review.imageUrl?.length || props.review.mediaUrl?.length)

const { hasShowMore, isShowMore } = toRefs(useReadMore(reviewContentRef, 54))

const onDeleteReview = async () => {
  const confirm = await useAlertConfirm({
    content: 'Do you want to delete?',
    okText: 'Remove',
    cancelText: 'Cancel'
  })
  if (!confirm) return
  showGlobalLoading(true)
  const { success, message } = await apiService.myPageService.deleteReview({
    ids: [props.review.id]
  })
  showGlobalLoading(false)
  showNotification({
    type: success ? 'success' : 'error',
    message: success ? 'Delete review successfully' : message
  })

  emit('delete')
}
</script>

<style lang="scss" scoped>
.review {
  @apply py-10;

  &:not(:last-of-type) {
    @apply border-b-1 border-b-solid border-gray-10;
  }

  &:first-of-type {
    @apply pt-0;
  }

  &:last-of-type {
    @apply pb-0;
  }

  &__status {
    @apply font-475 leading-base text-navy-6 mb-2 text-xs;
  }

  &__title {
    @apply font-550 text-gray-10 mb-1 text-base leading-[22px];
  }

  &__rate {
    @apply mb-3 text-base;
  }

  &__content {
    @apply leading-base font-475 mb-4 whitespace-pre-line break-words text-sm;

    &.close {
      @apply line-clamp-5;
    }
  }

  &__readMore {
    @apply font-550 leading-base text-gray-10 mb-4 text-sm underline;
  }

  &__createdDatetime {
    @apply leading-base text-gray-14 text-sm font-normal;
  }
}

.file {
  &__wrap {
    @apply flex gap-2.5 overflow-x-auto;
  }

  &__item {
    @apply max-w-25 aspect-square h-full w-full object-cover;
  }
}
</style>
