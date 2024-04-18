<template>
  <div class="container">
    <div class="diveIn">
      <RHeadingSlide
        text-normal="DIVE"
        text-bold="IN"
        description="Let’s get to know each other! Join the BYoungPool and get personalized ritual secrets"
        class="mb-11.5 !lg:items-start mx-[-10px] mb-6 md:mx-[-20px] lg:mb-[50px]"
        class-normal="mr-3"
      />
      <div class="diveIn__content">
        <NavigatePrev class="diveIn__navigation diveIn__navigation-prev" @click="onPrev" />
        <div ref="snsSlider" class="keen-slider">
          <div
            v-for="(item, index) in snsListParse"
            :key="index"
            class="carousel__wrap keen-slider__slide"
            @click="handleTransitInstagram(item?.link)"
          >
            `
            <img :src="item?.imageUrl" alt="" class="carousel__image" />
            <img class="carousel__badge cursor-pointer" :src="IconInstagram" alt="" />
          </div>
        </div>
        <NavigateNext class="diveIn__navigation diveIn__navigation-next" @click="onNext" />
      </div>

      <div class="lg:mt-15 mx-5 mt-10 flex justify-center">
        <RButton
          title="Follow us on Instagram"
          class="text-black-50 hover:(!bg-navy-6 !text-white) w-full max-w-[335px] !rounded-[0px] !border-none capitalize"
          class-title="text-base font-550"
          height="40px"
          @click="followUsInstagram"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'

import NavigatePrev from '@/assets/svgs/navigate-prev.svg'
import NavigateNext from '@/assets/svgs/navigate-next.svg'
import IconInstagram from '@/assets/svgs/instagram.svg?url'

const ResizePlugin = (slider) => {
  const observer = new ResizeObserver(function () {
    slider.update()
  })

  slider.on('created', () => {
    observer.observe(slider.container)
  })
  slider.on('destroyed', () => {
    observer.unobserve(slider.container)
  })
}

import { useCmsStore } from '@/stores/modules/cms'

const { snsListParse } = storeToRefs(useCmsStore())

const [snsSlider, slider] = useKeenSlider(
  {
    initial: 1,
    mode: 'free',
    loop: true,
    breakpoints: {
      '(max-width: 640px)': {
        slides: { perView: 2.3 }
      },
      '(min-width: 640px) and (max-width: 1024px)': {
        slides: { perView: 4 }
      },
      '(min-width: 1025px)': {
        slides: { perView: 5 }
      }
    }
  },
  [
    (slider) => {
      let timeout
      let mouseOver = false
      function clearNextTimeout() {
        clearTimeout(timeout)
      }
      function nextTimeout() {
        clearTimeout(timeout)
        if (mouseOver) return
        timeout = setTimeout(() => {
          slider.next()
        }, 2000)
      }
      slider.on('created', () => {
        slider.container.addEventListener('mouseover', () => {
          mouseOver = true
          clearNextTimeout()
        })
        slider.container.addEventListener('mouseout', () => {
          mouseOver = false
          nextTimeout()
        })
        nextTimeout()
      })
      slider.on('dragStarted', clearNextTimeout)
      slider.on('animationEnded', nextTimeout)
      slider.on('updated', nextTimeout)
    },
    ResizePlugin
  ]
)

const onPrev = () => {
  slider.value?.prev()
}

const onNext = () => {
  slider.value?.next()
}
const handleTransitInstagram = (url) => {
  window.open(url)
}

const followUsInstagram = () => {
  window.open('https://www.instagram.com/weareriman/', 'WindowName', 'noopener')
}
</script>

<style lang="scss" scoped>
.container {
  @apply relative m-auto max-w-screen-xl;
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
  &__wrap {
    @apply relative h-full cursor-pointer;
  }

  &__image {
    @apply aspect-square w-full object-cover;
  }

  &__badge {
    @apply absolute right-2.5 top-2.5 h-5 w-5;
    @apply lg: right-4 lg:top-4 lg:h-[30px] lg:w-[30px];
  }
}

@media (max-width: 1330px) {
  .diveIn__navigation {
    @apply hidden;
  }
}
</style>
