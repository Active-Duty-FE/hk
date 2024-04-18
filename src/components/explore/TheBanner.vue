<template>
  <div class="banner text-gray-10">
    <div class="overflow-hidden md:h-screen">
      <video
        v-if="Boolean(image.indexOf('.mp4') > 0)"
        class="banner__background"
        name="media"
        playsinline
        autoplay
        loop
        muted
      >
        <source :src="image" type="video/mp4" />
        <track src="" label="" kind="captions" default />
      </video>
      <img v-else alt="image" class="banner__background" :src="image" @load="loadImage" />
    </div>
    <div v-if="showContent" class="mx-auto w-full max-w-[1240px]">
      <div
        v-if="isBlog"
        class="banner__content"
        :class="`${isWhite && isDesktop ? 'text-white' : 'text-black-50'}`"
      >
        <span class="text-[24px]">BLOG</span>
        <span class="banner__title line-clamp-2">{{ content.title }}</span>
        <span class="line-clamp-3 text-lg font-normal">{{ content.subtitle }}</span>
      </div>
      <div v-else class="banner__content" :class="`${isWhite ? 'text-white' : 'text-black-50'}`">
        <span class="banner__subtitle line-clamp-2">{{ content.subtitle }}</span>
        <span class="banner__title line-clamp-3">{{ content.title }}</span>
        <span class="banner__description"> {{ content.description }} </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, computed } from 'vue'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useWindowSize } from '@vueuse/core'

const storeLoading = useGlobalLoadingStore()
const { showGlobalLoading } = storeLoading
const props = defineProps({
  content: {
    type: Object,
    default: () => ({})
  },
  image: {
    type: String,
    default: ''
  },
  isWhite: {
    type: Boolean,
    default: false
  },
  showContent: {
    type: Boolean,
    default: true
  },
  isBlog: {
    type: Boolean,
    default: false
  }
})
onBeforeMount(() => {
  props.image.indexOf('.mp4') < 0 && showGlobalLoading(true)
})

const { width } = useWindowSize()
const isDesktop = computed(() => width.value > 992)

const loadImage = () => {
  showGlobalLoading(false)
}
</script>

<style lang="scss" scoped>
.banner {
  video {
    object-fit: cover;
  }
  @apply relative flex flex-col justify-center;
  @apply md:h-screen;

  &__background {
    @apply min-h-80 max-h-80 w-full object-cover;
    @apply md:absolute md:max-h-full;
  }

  &__content {
    @apply relative mt-[70px] flex flex-col px-5;
    @apply md:max-w-1/2 md:mb-[150px] md:mt-0 md:px-0;

    &.white {
      @apply md:text-white;
    }
  }

  &__subtitle {
    @apply font-550 mb-5 text-sm leading-[normal];
    @apply md:text-7 md:mb-[26px];
  }

  &__title {
    @apply font-550 mb-[30px] whitespace-pre-wrap text-[32px] leading-9;
    @apply md:text-16 leading-base md:uppercase;
  }

  &__description {
    @apply whitespace-pre-wrap text-base font-normal leading-[22px];
    @apply md:text-lg md:leading-6;
  }
}
</style>
