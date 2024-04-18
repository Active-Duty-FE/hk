<template>
  <div class="reviewItem">
    <h3 class="reviewItem__title">{{ item.title }}</h3>
    <RRate class="reviewItem__rate" :value="item.rate" disabled />
    <p
      class="reviewItem__review"
      :class="[`reviewItem__review-${item.id}`, openShowMore ? 'open' : 'close']"
    >
      {{ item.content }}
    </p>

    <span v-if="isShowMore" class="reviewItem__readMore" @click="onReadMore">
      {{ openShowMore ? 'Less' : 'Read more' }}
    </span>
    <div class="reviewItem__info">
      <span class="reviewItem__info-date">{{
        formatDateTime(item.createdDatetime, FORMAT_USER_DISPLAY)
      }}</span>
      <span class="reviewItem__info-author">{{ item.fullName || item.email }}</span>
    </div>
    <div class="files no-scrollbar">
      <template v-if="item.mediaUrl?.length">
        <div v-for="file in item.mediaUrl" :key="file" class="files__item" @click="onClickFile">
          <video class="files__item-video" controls playsinline loop>
            <source :src="file" />
            <track src="" label="" kind="captions" default />
          </video>
        </div>
      </template>

      <template v-if="item.imageUrl?.length">
        <div
          v-for="(file, index) in item.imageUrl"
          :key="file"
          class="files__item"
          @click="onClickFile(index)"
        >
          <img :src="file" alt="review image" class="files__item-image" />
        </div>
      </template>
    </div>

    <div v-if="item.reply" class="reviewItem__reply">
      <img src="@/assets/svgs/logo.svg?url" alt="" class="reviewItem__reply-image" />
      <span class="reviewItem__reply-content">{{ item.reply }}</span>
    </div>
  </div>
</template>

<script setup>
import { formatDateTime } from '@/utils/datetime'
import { FORMAT_USER_DISPLAY } from '@/helpers/constant'
import { onMounted, ref } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})

const emits = defineEmits(['click-file'])

const isShowMore = ref(false)
const openShowMore = ref(true)

onMounted(() => {
  calculateOpenDescription()
})

const onReadMore = () => {
  openShowMore.value = !openShowMore.value
}

const onClickFile = (indexImage) => {
  emits('click-file', { index: indexImage, data: props.item })
}

const calculateOpenDescription = () => {
  const descriptionList = document.querySelector(`.reviewItem__review-${props.item.id}`)
  const HEIGHT_5_LINE = 20 * 5

  if (!descriptionList) return

  if (descriptionList.offsetHeight < HEIGHT_5_LINE) return
  isShowMore.value = true
  openShowMore.value = false
}
</script>

<style lang="scss" scoped>
.reviewItem {
  @apply pb-10;

  &:first-child {
    @apply mt-0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #212121;
  }

  &__title {
    @apply font-550 text-gray-10 break-words leading-[22px];
    @apply lg:text-xl lg:leading-6;
  }

  &__rate {
    @apply text-navy-1 mb-2.5 text-base leading-none;
  }

  &__review {
    @apply text-gray-10 mb-5 whitespace-pre-wrap break-words text-sm;

    &.close {
      @apply line-clamp-5;
    }
  }

  &__readMore {
    @apply text-gray-10 font-550 cursor-pointer text-sm underline;
  }

  &__info {
    @apply mt-5 flex justify-between text-sm font-normal text-[#666];
    @apply lg:mt-8;
  }

  &__reply {
    background-color: rgba(224, 224, 224, 0.2);
    @apply mt-5 flex flex-col px-5 py-6;

    &-image {
      @apply max-w-16 mb-4;
    }

    &-content {
      @apply text-base font-normal leading-[22px];
    }
  }
}

.files {
  @apply -mx-5 mt-5 flex gap-2.5 overflow-auto px-5;
  @apply sm:mx-0 md:mt-7 md:gap-4 lg:px-0;

  &__item {
    @apply h-full cursor-pointer;

    &-image,
    &-video {
      @apply h-25 w-25 object-cover;
      @apply lg:h-[150px] lg:w-[150px];
    }
  }
}
</style>
