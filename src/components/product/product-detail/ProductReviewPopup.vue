<template>
  <a-modal
    v-bind="propsDefault"
    centered
    title="Review"
    wrap-class-name="productReviewPopup"
    :footer="false"
    :width="500"
  >
    <RCarousel
      v-slot="{ url, type }"
      v-model="currentSlide"
      wrap-around
      :options="files"
      :mouse-drag="false"
      :touch-drag="false"
    >
      <div class="h-full w-full">
        <img v-if="type === 'image'" :src="url" alt="" class="productReviewPopup__image" />
        <video v-else class="productReviewPopup__image" controls playsinline loop>
          <source :src="url" />
          <track src="" label="" kind="captions" default />
        </video>
      </div>
    </RCarousel>

    <div ref="container" class="keen-slider carousel-gallery">
      <div
        v-for="({ type, url }, index) in files"
        :key="index"
        class="keen-slider__slide"
        @click="currentSlide = index"
      >
        <img v-if="type === 'image'" :src="url" alt="" class="productReviewPopup__image" />
        <video v-else class="productReviewPopup__image" playsinline>
          <source :src="url" />
          <track src="" label="" kind="captions" default />
        </video>
      </div>
    </div>

    <h3 class="productReviewPopup__title">{{ item.title }}</h3>
    <RRate class="productReviewPopup__rate" :value="item.rate" disabled />
    <p class="productReviewPopup__review" :class="[`productReviewPopup__review-${item.id}`]">
      {{ item.content }}
    </p>

    <div class="productReviewPopup__info">
      <span class="productReviewPopup__info-date">{{
        formatDateTime(item.createdDatetime, FORMAT_USER_DISPLAY)
      }}</span>
      <span class="productReviewPopup__info-author">{{ item.fullName }}</span>
    </div>
  </a-modal>
</template>

<script setup>
import { computed, ref, toRefs, watch } from 'vue'
import { formatDateTime } from '@/utils/datetime'
import { FORMAT_USER_DISPLAY } from '@/helpers/constant'
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  imageSelectedIndex: {
    type: Number,
    default: 0
  }
})

const { item, ...propsDefault } = toRefs(props)
const currentSlide = ref(0)

const [container] = useKeenSlider({
  slides: { perView: 3, spacing: 10 }
})

watch(
  () => props,
  () => {
    currentSlide.value = props.imageSelectedIndex
  },
  {
    deep: true
  }
)

const videos = computed(() =>
  props.item.mediaUrl?.map((file, index) => ({
    url: file,
    index,
    type: 'video'
  }))
)

const images = computed(() =>
  props.item.imageUrl?.map((file, index) => ({
    url: file,
    index: videos.value.length + index,
    type: 'image'
  }))
)

const files = computed(() => [...videos.value, ...images.value])
</script>

<style lang="scss" scoped>
.productReviewPopup {
  &__image {
    @apply aspect-square h-full w-full object-cover;
  }

  &__title {
    @apply font-550 text-gray-10 break-words leading-[22px];
    @apply lg:text-xl lg:leading-6;
  }

  &__rate {
    @apply text-navy-1 mb-7 text-base leading-none;
  }

  &__review {
    @apply text-gray-10 mb-5 whitespace-pre-wrap break-words text-sm;
  }

  &__readMore {
    @apply text-gray-10 font-550 mb-5 inline-block cursor-pointer text-sm underline;
  }

  &__info {
    @apply flex justify-between text-sm font-normal text-[#666];
  }
}

.carousel-gallery {
  @apply mb-7 mt-5;
}

.productReviewPopup__slide {
  @apply h-full w-full cursor-pointer;
}
</style>

<style lang="scss">
.productReviewPopup {
  .ant-modal-header {
    @apply border-none pb-7 pt-5;
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
    @apply font-550 text-center text-2xl leading-6;
  }

  .ant-modal-body {
    @apply pb-7.5 max-h-80vh overflow-y-auto p-5 pt-0;
  }
}
</style>
