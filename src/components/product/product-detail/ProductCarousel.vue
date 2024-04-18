<template>
  <div class="md:(justify-between flex-row) flex flex-col gap-3">
    <div class="keep-scrolling hidden h-[450px] md:block">
      <div
        v-for="(slide, index) in props.images"
        :key="slide"
        class="border-1 mb-3 cursor-pointer border-solid border-transparent transition-all"
        :class="{ 'active-slide-image': pageState.currentSlideImage === index }"
        @click="changeToSlide(index)"
      >
        <img
          alt="image slide"
          class="aspect-square w-[84px] object-cover"
          :src="addPrefixForImage(slide)"
          @mouseenter="showHoverSlide(index)"
          @mouseleave="returnHoverSlide(index)"
        />
      </div>
    </div>
    <div class="flex-grow">
      <img
        alt="image slide"
        class="w-full md:max-w-[460px]"
        :src="addPrefixForImage(props.images[pageState.currentSlideImage])"
      />
    </div>
    <div
      class="hide-scrollbar mt-3 flex gap-1 overflow-x-auto overflow-y-hidden overscroll-x-none px-5 md:hidden md:px-0"
    >
      <div
        v-for="(slide, index) in props.images"
        :key="slide"
        class="h-[86px] w-[86px] cursor-pointer"
        :class="{ 'active-slide-image': pageState.currentSlideImage === index }"
        @click="changeToSlide(index)"
      >
        <img
          alt="image slide"
          class="h-[84px] w-[84px]"
          :src="addPrefixForImage(slide)"
          @mouseenter="showHoverSlide(index)"
          @mouseleave="returnHoverSlide(index)"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import { addPrefixForImage } from '@/utils/common'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
})

const pageState = reactive({
  currentSlideImage: 0,
  currentClickImage: 0
})

const changeToSlide = (slideNumber) => {
  pageState.currentSlideImage = slideNumber
  pageState.currentClickImage = slideNumber
}

const showHoverSlide = (slideNumber) => {
  pageState.currentSlideImage = slideNumber
}

const returnHoverSlide = (slideNumber) => {
  pageState.currentSlideImage = pageState.currentClickImage
}
</script>
<style lang="scss" scoped>
.active-slide-image {
  @apply border-1 border-gray-10 border-solid;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
