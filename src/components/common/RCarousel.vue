<template>
  <Carousel
    v-bind="carouselProps"
    ref="carouselRef"
    v-model="currentSlide"
    :transition="transition"
    :autoplay="autoplay"
  >
    <Slide v-for="(item, index) in options" :key="index">
      <slot v-bind="item" />
    </Slide>
    <template #addons>
      <slot name="addons" />
    </template>
  </Carousel>
</template>

<script setup>
import { ref, toRefs } from 'vue'
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  transition: {
    type: Number,
    default: 700
  },
  autoplay: {
    type: Number,
    default: 0
  },
  carouselProps: {
    type: Object,
    default: () => {}
  }
})

const currentSlide = ref(0)
const carouselRef = ref()

const next = () => {
  carouselRef.value?.next()
}

const prev = () => {
  carouselRef.value?.prev()
}

defineExpose({
  carouselRef,
  currentSlide,
  next,
  prev
})

const { options, ...carouselProps } = toRefs(props)
</script>

<style lang="scss" scoped>
:deep(.carousel__track) {
  align-items: start;
  gap: 12px;
}
</style>
