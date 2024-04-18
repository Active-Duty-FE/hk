<template>
  <div class="video-container relative w-full">
    <div class="video-heading hidden md:absolute md:block md:text-white">
      <r-heading-slide
        text-normal="EXPERIENCE"
        text-bold="THE DIFFERENCE"
        parent-class="md:!items-start"
        description="建立联系，获取最新资讯，分享你的经验!"
        class-heading="mb-[12px]"
        class-normal="mr-3 text-white !text-[56px] font-light"
        class-bold="!text-white !text-[56px] font-semibold"
        class-description="ml-1 text-white font-medium"
      />
    </div>
    <div ref="videoContainer" class="keen-slider relative">
      <div v-for="item in videoState" :key="item" class="keen-slider__slide">
        <div class="video-list relative">
          <video id="video" ref="videoRefs" class="w-full" playsinline loop muted autoplay>
            <source :src="addPrefixForImageNew(item?.attachmentList[0]?.url)" type="video/mp4" />
            <track src="" label="" kind="captions" default />
          </video>
          <div class="background-gradient"></div>
        </div>
        <div class="video-content px-[23px] py-[40px] md:p-0">
          <div class="video-content__title">
            {{ item?.title1 }}
          </div>
          <div class="video-content__description my-[24px] w-auto">
            <div
              class="video-content__description max-w-[650px] md:text-white"
              v-html="item?.title2"
            ></div>
          </div>
        </div>
      </div>

      <div class="navigation dots md:top-85% md:left-20% xs:top-90% xs:left-10% absolute">
        <button
          v-for="(_slide, idx) in dotHelper"
          :key="idx"
          class="cursor-pointer border-0 bg-transparent py-2"
          @click="slider.moveToIdx(idx)"
        >
          <DashIcon :additional-class="current === idx ? 'bg-[#063451]' : 'bg-gray-4'" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useKeenSlider } from 'keen-slider/vue.es'
import { computed, ref, onMounted } from 'vue'
import NavigatePrev from '@/assets/svgs/left-arrow.svg'
import NavigateNext from '@/assets/svgs/right-arrow.svg'
import apiService from '@/http/api'
import { addPrefixForImage, addPrefixForImageNew } from '@/utils/common'
import DashIcon from '@/assets/icons/DashIcon.vue'

const current = ref(0)
const videoState = ref()

const [videoContainer, slider] = useKeenSlider(
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

const dotHelper = computed(() => (slider.value ? [...Array(videoState?.value?.length).keys()] : []))
const numberSilder = computed(() => videoState.value?.length)

const changeSlide = (slider, key) => {
  if (key === 'next') {
    slider.next()
  } else {
    slider.prev()
  }
}
const getVideoList = async () => {
  const { data } = await apiService.mainService.getCmsList({
    category: 'VIDEO'
  })
  videoState.value = data
}
onMounted(() => {
  getVideoList()
})
</script>

<style lang="scss" scoped>
.video-container {
  .keen-slider__slide {
    height: 690px;
  }
  .video-heading {
    @apply top-10% left-20% z-10  text-6xl;
    @apply text-[56px] font-semibold uppercase not-italic leading-[normal];
    font-family: Montserrat;
  }
  .background-gradient {
    @apply absolute bottom-0 top-0 h-full w-full;
    background: linear-gradient(
      -90deg,
      rgba(4, 38, 63, 0) 0%,
      rgba(4, 38, 63, 0.8) 72.5%,
      #04263f 100%
    );
    mix-blend-mode: multiply;
  }
  .video-content {
    @apply top-40% left-20% h-full w-[350px] w-full bg-[#F5F5F5] md:absolute md:w-[500px] md:bg-transparent;
    &__title {
      @apply not-italic leading-[normal] md:text-6xl md:font-bold md:text-white;
      @apply text-[28px] font-medium text-[#212121];
      font-family: 'Noto Sans HK';
    }
    &__description {
      @apply text-sm;
      font-family: 'Montserrat', sans-serif !important;
    }
  }
  .video-slider {
    @apply top-85% left-20% mt-2 cursor-pointer items-center text-2xl;
    .slide-number {
      @apply text-2xl capitalize not-italic leading-[normal] text-[#F2F4F6];
    }
    .navigation__btn {
      @apply h-[35px] w-[35px];
    }
  }
}
</style>
