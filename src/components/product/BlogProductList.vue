<template>
  <div class="text-black-50 container mx-auto">
    <p class="font-625 text-[40px]">Blog</p>

    <div class="diveIn__content">
      <NavigatePrev class="diveIn__navigation diveIn__navigation-prev" @click="onPrev" />
      <RCarousel
        v-slot="item"
        ref="carouselRef"
        :options="blogs"
        :items-to-show="itemsToShow"
        snap-align="start"
      >
        <div class="max-w-[289px]">
          <blog-item-product :blog-info="item" />
        </div>
      </RCarousel>
      <NavigateNext class="diveIn__navigation diveIn__navigation-next" @click="onNext" />
    </div>
  </div>
</template>
<script setup>
import NavigatePrev from '@/assets/svgs/navigate-prev.svg'
import NavigateNext from '@/assets/svgs/navigate-next.svg'
import { useBreakpoints } from '@vueuse/core'
import { computed, ref } from 'vue'

defineProps({
  blogs: {
    type: Array,
    default: () => []
  }
})

const carouselRef = ref()

const device = useBreakpoints({
  mobile: 640,
  tablet: 1024
})

const tablet = device.smaller('tablet')

const itemsToShow = computed(() => {
  if (tablet.value) return 3
  return 4
})

const onPrev = () => {
  carouselRef.value?.prev()
}

const onNext = () => {
  carouselRef.value?.next()
}
</script>
<style lang="scss">
@media (max-width: 767px) {
  .blog-list {
    margin: 0 !important;
    @apply px-3 lg:px-0;
  }

  .container {
    @apply max-w-3xl;
  }
}

.diveIn {
  @apply px-5;

  &__content {
    @apply relative -mx-5;
  }

  &__navigation {
    @apply z-1 absolute top-1/2 cursor-pointer;

    &-prev {
      transform: translate(-100%, -50%);
      @apply -left-5;
    }

    &-next {
      transform: translate(100%, -50%);
      @apply -right-5;
    }
  }
}
.carousel {
  &__slide {
    @apply md:items-start;
  }
  &__image {
    @apply h-full w-full object-cover;
  }

  &__badge {
    @apply absolute right-2.5 top-2.5 h-5 w-5;
    @apply lg:right-4 lg:top-4 lg:h-[30px] lg:w-[30px];
  }
}

@media (max-width: 1330px) {
  .diveIn__navigation {
    @apply hidden;
  }
}
</style>
