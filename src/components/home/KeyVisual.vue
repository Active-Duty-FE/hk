<template>
  <div ref="bannerContainer" class="keen-slider xs:!h-[600px] relative w-screen sm:!h-full">
    <div v-for="item in dataMainBanner" :key="item.id" class="keen-slider__slide w-screen">
      <div class="wrap">
        <video
          v-if="item?.fileTypePC?.includes('video')"
          :src="item?.imagePC"
          playsinline
          autoplay
          muted
          loop
          class="main-bg mt-[55px] hidden !h-screen min-h-[750px] w-full object-cover sm:block"
        >
          <track src="" label="" kind="captions" default />
        </video>
        <div
          v-else
          class="key-visual__image main-bg mt-[55px] hidden !h-screen min-h-[750px] object-center sm:block"
          :style="{ backgroundImage: `url(${item?.imagePC})` }"
        ></div>
        <video
          v-if="item?.fileTypeMobile?.includes('video')"
          :src="item?.imageMobile"
          playsinline
          autoplay
          muted
          loop
          class="main-bg key-visual__image block object-cover sm:hidden"
        >
          <track src="" label="" kind="captions" default />
        </video>
        <div
          v-else
          class="main-bg key-visual__image block !bg-cover !bg-center !bg-no-repeat sm:hidden"
          :style="{ background: `url(${item?.imageMobile})` }"
        ></div>
      </div>
    </div>
    <div
      class="key-visual !md:left-[calc((100vw_-_1200px)/2)] xs:w-[400px] absolute !left-0 sm:w-full"
    >
      <span class="key-visual__title">{{ itemContent.adminTitle }}</span>
      <span class="key-visual__description">{{ itemContent.title1 }}</span>
      <div class="flex gap-5">
        <div
          v-if="itemContent.addToBagYn"
          class="w-[150px] text-base font-medium uppercase not-italic leading-[normal] text-white"
        >
          <ButtonAddCart v-slot="cartButton">
            <div
              class="!bg-navy-6 flex h-full w-fit w-full cursor-pointer items-center"
              @click.stop="cartButton.phaseCheck(itemContent)"
            >
              <span
                class="font-550 leading-base xs:text-[13px] flex h-[40px] w-full items-center justify-center text-sm !text-white"
              >ADD TO BAG</span
              >
            </div>
          </ButtonAddCart>
        </div>
        <div v-if="itemContent.learnMoreYn" class="w-[150px]">
          <RButton
            title="Learn More"
            class="!w-full !shadow-none"
            class-title="text-[#063451] text-base not-italic font-medium leading-[normal] uppercase xs:text-[13px]"
            @click="onClick(itemContent)"
          />
        </div>
      </div>
      <div v-if="dotHelper.length > 1" class="xs:(mx-auto mt-5) flex gap-2 sm:ml-[500px] md:mt-5">
        <div
          v-for="(_slide, idx) in dotHelper?.slice(0, 3)"
          :key="idx"
          class="cursor-pointer py-2"
          @click="slider.moveToIdx(idx)"
        >
          <DashIcon
            :additional-class="
              current === idx
                ? ' bg-navy-6 my-auto h-[3px] w-[55px]'
                : 'bg-gray-4 my-auto h-[3px] w-[55px]'
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SliderBanner from '@/assets/svgs/slider-banner.svg'
import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useKeenSlider } from 'keen-slider/vue.es'
import { useCmsStore } from '@/stores/modules/cms'
import { storeToRefs } from 'pinia'
import DashIcon from '@/assets/icons/DashIcon.vue'

const router = useRouter()
const { mainBannerListParse } = storeToRefs(useCmsStore())

defineEmits(['click-btn'])

const current = ref(0)
const dotHelper = computed(() => [...Array(mainBannerListParse.value?.length).keys()])
const itemContent = computed(() => mainBannerListParse.value[current.value] || {})
const dataMainBanner = computed(() => mainBannerListParse.value.slice(0, 3))

const [bannerContainer, slider] = useKeenSlider(
  {
    initial: current.value,
    loop: true,
    autoplay: true,
    duration: 5000,
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

const onClick = (item) => {
  if (!item.link) return
  window.open(item.link, item.newWindow ? '' : '_self')
}
</script>

<style lang="scss" scoped>
.wrap {
  @apply relative h-[calc(100vh-80px)] w-full lg:h-screen lg:overflow-hidden;
}

.container {
  @apply relative m-auto h-full max-w-screen-xl;
}

.key-visual {
  @apply z-1 absolute bottom-[10%] left-0 flex max-w-xl flex-col items-start px-5;
  @apply xl:px-0;

  &__title {
    @apply text-gray-10 font-550 whitespace-pre-line text-start text-[22px] leading-normal;
    @apply lg:max-w-full lg:text-[50px] lg:leading-[60px];
  }

  &__description {
    letter-spacing: -0.36px;
    @apply text-gray-12 mb-5.5 mt-5 whitespace-pre-line text-start text-base leading-[22px] md:mb-10 md:mt-7;
    @apply leading-6 lg:text-lg;
  }

  &__image {
    @apply absolute bottom-0 left-0 right-0 top-0 h-full w-full;
  }
}

.main-bg {
  height: 100%;
  background-position: 50%;
  background-size: cover;
  transform: scale(1.06);
}

.btn {
  &__wrap {
    @apply text-gray-1 flex w-fit cursor-pointer items-center gap-2.5;
  }

  &__text {
    @apply font-550 text-gray-10 text-base leading-5 lg:text-lg;
  }

  &__icon {
    @apply h-5 w-5;
  }
}

:deep(.carousel__pagination) {
  @apply mt-5 p-0;
}

:deep(.carousel__pagination-button) {
  &::after {
    @apply h-2.5 w-2.5 rounded-full bg-[#A0A0A0];
  }
}

:deep(.carousel__pagination-button--active::after) {
  @apply bg-[#666666];
}
</style>
