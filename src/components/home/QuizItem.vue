<template>
  <div ref="marketingSlider" class="keen-slider">
    <div v-for="item in marketingData" :key="item.id" class="keen-slider__slide w-screen">
      <div class="quiz-container hidden sm:!h-[350px] md:block">
        <img
          :src="item.imagePC"
          class="quiz__image h-full w-full object-cover"
          alt="marketing image"
        />
        <div class="quiz flex items-center justify-center text-center">
          <span class="quiz__description truncate">{{ item.title2 }}</span>
          <span class="quiz__title !font-550 truncate">{{ item.title1 }}</span>
          <div class="btn__wrap btn-hover" @click="onClick">
            <span class="btn__text">{{ item.title3 }}</span>
            <ArrowRight class="btn__icon mb-1" />
          </div>
        </div>
      </div>
      <div class="quiz-container block h-[450px] md:hidden">
        <img :src="item.imageMobile" class="quiz__image object-cover" alt="marketing image" />
        <div class="quiz h-full justify-center">
          <span class="quiz__description w-[140px] !text-[16px]">{{ item.title2 }}</span>
          <span class="quiz__title !font-550">{{ item.title1 }}</span>
          <div class="btn__wrap btn-hover" @click="onClick">
            <span class="btn__text">{{ item.title3 }}</span>
            <ArrowRight class="btn__icon mb-1" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import ArrowRight from '@/assets/svgs/arrow-right.svg'
import { useCmsStore } from '@/stores/modules/cms'
import { storeToRefs } from 'pinia'
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'

const current = ref(0)
const { marketingBannerListParse } = storeToRefs(useCmsStore())

const marketingData = computed(() => marketingBannerListParse?.value?.slice(0, 5))
// const quizData = computed(() => marketingBannerListParse.value[0] || {})

const onClick = () => {
  console.log(marketingData?.value.link, 'link')
  if (!marketingData?.value.link) return
  const isNewWindow = marketingData?.value.newWindow
  window.open(marketingData?.value.link, isNewWindow ? '' : '_self')
}

const [marketingSlider, slider] = useKeenSlider(
  {
    initial: current.value,
    slideChanged: (s) => {
      current.value = s.track.details.rel
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

        const oneSlide = slider?.slides?.length === 1
        if (mouseOver || oneSlide) return
        timeout = setTimeout(() => {
          slider.next()
        }, 5000)
      }

      const observer = new ResizeObserver(function () {
        slider.update()
      })

      slider.on('created', () => {
        observer.observe(slider.container)
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

      slider.on('destroyed', () => {
        observer.unobserve(slider.container)
      })
    }
  ]
)
</script>

<style lang="scss" scoped>
.quiz-container {
  @apply relative m-auto w-full;
}

.quiz-text {
  @apply mx-auto max-w-screen-xl;
  .quiz {
    position: relative !important;
  }
}

.quiz {
  @apply z-1 md:py-17.5 relative left-0 flex flex-col px-10 py-10;

  &__description {
    @apply leading-22px text-[18px] font-light text-white;
    @apply lg:text-[24px] lg:leading-6;
  }

  &__title {
    @apply mb-10 mt-[25px] whitespace-pre-line text-[40px] font-normal leading-[50px] text-white lg:mb-9;
    @apply lg:flex lg:flex-col lg:text-[64px] lg:leading-[68px];
  }

  &__image {
    @apply z-1 absolute bottom-0 left-0 right-0 top-0 h-full w-full object-cover;
  }
}

.btn {
  &__wrap {
    @apply flex w-fit cursor-pointer items-center gap-2.5 text-white;
  }

  &__text {
    @apply text-base font-medium leading-normal text-white;
    @apply lg:(text-xl leading-[20px]);
  }

  &__icon {
    @apply h-5 w-5 opacity-100 transition-all md:-translate-x-1.5 md:opacity-0;

    :deep(path) {
      fill: #ffffff;
    }
  }
}

.btn-hover {
  position: relative;
  transition: 0.4s;

  &:hover svg {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
