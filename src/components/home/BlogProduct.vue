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
        wrap-around
        snap-align="start"
      >
        <div class="max-w-[289px]">
          <blog-item :blog-info="item" />
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
// const blogLists = [
//   {
//     title: 'Korean Skincare',
//     subTitle: `Unlock the flawless beauty of Korean skincare and unveil your skin's true Unlock the flawless beauty of Korean skincare and unveil your skin's true`,
//     slug: 'blog-1',
//     image: ImageBlogOne
//   },
//   {
//     title: 'RIMAN Innovation',
//     subTitle: `Experience the future of skincare with RIMAN Innovation. Our cutting Ex Experience the future of skincare with RIMAN Innovation. Our cutting Ex`,
//     slug: 'blog-2',
//     image: ImageBlogTwo
//   },
//   {
//     title: 'RIMAN Rituals',
//     subTitle: `Discover the power of innovation and embrace a new era of radiant Discover the power of innovation and embrace a new era of radiant`,
//     slug: 'blog-3',
//     image: ImageBlogThree
//   },
//   {
//     title: 'Giant BYoungPool',
//     subTitle: `Unleash the power of Giant Byungpool. Our revolution skincare ease Unleash the power of Giant Byungpool. Our revolution skincare ease`,
//     slug: 'blog-4',
//     image: ImageBlogFour
//   },
//   {
//     title: 'Korean Skincare',
//     subTitle: `Unlock the flawless beauty of Korean skincare and unveil your skin's true Unlock the flawless beauty of Korean skincare and unveil your skin's true`,
//     slug: 'blog-1',
//     image: ImageBlogOne
//   },
//   {
//     title: 'RIMAN Innovation',
//     subTitle: `Experience the future of skincare with RIMAN Innovation. Our cutting Ex Experience the future of skincare with RIMAN Innovation. Our cutting Ex`,
//     slug: 'blog-2',
//     image: ImageBlogTwo
//   },
//   {
//     title: 'RIMAN Rituals',
//     subTitle: `Discover the power of innovation and embrace a new era of radiant Discover the power of innovation and embrace a new era of radiant`,
//     slug: 'blog-3',
//     image: ImageBlogThree
//   },
//   {
//     title: 'Giant BYoungPool',
//     subTitle: `Unleash the power of Giant Byungpool. Our revolution skincare ease Unleash the power of Giant Byungpool. Our revolution skincare ease`,
//     slug: 'blog-4',
//     image: ImageBlogFour
//   }
// ]

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
<style lang="scss" scoped>
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
