<template>
  <div class="dive-in-container relative">
    <div class="container mx-auto">
      <r-heading-slide
        text-normal="DIVE"
        text-bold="IN"
        description="Let’s get to know each other! Join the BYoungPool and get personalized ritual secrets"
        class="px-5 md:px-0"
        class-normal="mr-3"
        parent-class="lg:!items-start mb-5"
      />
    </div>
    <div v-if="diveInListParse?.length" class="group relative cursor-pointer">
      <carousel
        ref="myCarousel"
        v-model="currentSlide"
        :items-to-show="1"
        :breakpoints="breakPoints"
        :wrap-around="true"
        @slide-end="handleSliding"
      >
        <slide
          v-for="(slide, index) in dataDiveIn"
          :key="slide.id + 'video-slider'"
          @click="handleSlideTo(index)"
        >
          <div
            :class="['carousel__item relative flex w-full overflow-hidden']"
            @click="handleClickVideo(slide.id)"
          >
            <video
              :key="`video-${index}`"
              :class="[`video-carousel-${index}`, 'video-dive-in']"
              loop
              :autoplay="currentSlide === index"
              muted
              :controls="currentSlide === index"
              disablePictureInPicture
              controlsList="nodownload nofullscreen noplaybackrate"
            >
              <source :src="slide?.attachmentList[0]?.url" type="video/mp4" />
            </video>
            <div class="invisible group-hover:visible">
              <div
                v-if="currentSlide === index"
                class="bottom-5% left-10% index-10 absolute flex h-[40px] w-[40px] items-center justify-center rounded-[50%] bg-[#0000004d] backdrop-blur-[2px]"
              >
                <div class="video-control-action mt-2 flex items-center justify-center !text-white">
                  <PlayCircleOutlined
                    v-if="statusPause"
                    class="cursor-pointer !text-3xl"
                    @click="handleControlVideo(`video-carousel-${index}`)"
                  />
                  <PauseCircleOutlined
                    v-else
                    class="cursor-pointer !text-3xl"
                    @click="handleControlVideo(`video-carousel-${index}`)"
                  />
                </div>
              </div>
              <div
                v-if="currentSlide === index"
                class="bottom-5% left-80% index-10 absolute flex h-[40px] w-[40px] items-center justify-center rounded-[50%] bg-[#0000004d] backdrop-blur-[2px]"
              >
                <div class="flex items-center justify-center">
                  <UnMuteVideoIcon
                    v-if="statusMute"
                    class="cursor-pointer !text-5xl"
                    @click="handleVolumnVideo(`video-carousel-${index}`)"
                  />
                  <MuteVideoIcon
                    v-else
                    class="cursor-pointer !text-5xl"
                    @click="handleVolumnVideo(`video-carousel-${index}`)"
                  />
                </div>
              </div>
            </div>
          </div>
        </slide>
        <template #addons>
          <Navigation></Navigation>
        </template>
      </carousel>
    </div>
  </div>
  <DevInDetailPopup v-model="state.isShowNoticeSoldOutPopup" :data-video="state.videoSelected">
  </DevInDetailPopup>
</template>

<script setup>
import DevInDetailPopup from '../home/DiveInDetailPopup.vue'
import MuteVideoIcon from '@/assets/svgs/mute-video.svg'
import UnMuteVideoIcon from '@/assets/svgs/unmute-video.svg'
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import { reactive, ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCmsStore } from '@/stores/modules/cms'
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons-vue'

const state = reactive({
  isShowNoticeSoldOutPopup: false,
  videoSelected: {},
  dataDiveIn: []
})

const isShowModal = ref(false)
const myCarousel = ref(null)
const statusPause = ref(false)
const statusMute = ref(false)
const currentSlide = ref(3)
const breakPoints = {
  700: {
    itemsToShow: 3.5,
    snapAlign: 'center',
    transition: 800
  },
  1024: {
    itemsToShow: 4.4,
    snapAlign: 'center',
    transition: 700
  }
}
const { diveInListParse } = storeToRefs(useCmsStore())
const dataDiveIn = computed(() => diveInListParse.value?.slice(0, 5))

const handleClickVideo = (index) => {
  state.isShowNoticeSoldOutPopup = true
  state.videoSelected = diveInListParse.value.find((item) => item.id === index)
}

const handleSliding = (dataSlider) => {
  const videoCurrent = document.querySelectorAll(`.video-carousel-${dataSlider.currentSlideIndex}`)
  const videoSlidingTo = document.querySelectorAll(`.video-carousel-${dataSlider.prevSlideIndex}`)
  videoCurrent[1].play()
  videoSlidingTo[1].pause()
  statusPause.value = false
}
const handleVolumnVideo = (id) => {
  const videoCurrent = document.querySelectorAll(`.video-carousel-${currentSlide.value}`)
  if (videoCurrent[1].muted) {
    videoCurrent[1].muted = false
  } else {
    videoCurrent[1].muted = true
  }
  statusMute.value = !statusMute.value
}
const handleControlVideo = (id) => {
  const videoCurrent = document.querySelectorAll(`.video-carousel-${currentSlide.value}`)
  if (videoCurrent[1].paused) {
    videoCurrent[1].play()
  } else {
    videoCurrent[1].pause()
  }
  statusPause.value = !statusPause.value
}
const handleSlideTo = (index) => {
  myCarousel.value.slideTo(index)
}
</script>
<style lang="scss">
.dive-in-container {
  video::-webkit-media-controls-start-playback-button {
    display: none;
  }

  video::-webkit-media-controls-play-button {
    display: none;
  }

  video::-webkit-media-controls-play-button,
  video::-webkit-media-controls-play-button::before {
    content: none !important;
  }
  video::-webkit-media-controls-volume-slider {
    display: none;
  }

  video::-webkit-media-controls-mute-button {
    display: none;
  }
  video::-webkit-media-controls-current-time-display,
  video::-webkit-media-controls-time-remaining-display {
    display: none;
  }
  video::-webkit-media-controls-fullscreen-button {
    display: none;
  }

  video::-webkit-media-controls-overflow-menu-button {
    display: none !important;
  }
  video::-webkit-media-controls-settings-button {
    display: none !important;
  }

  video::-webkit-media-controls-play-button {
    display: none !important;
  }

  /* Hide play/pause button in Firefox */
  video::-moz-media-controls-play-button {
    display: none !important;
  }

  /* Hide play/pause button in Edge */
  video::-ms-media-controls-play-button {
    display: none !important;
  }
  .container {
    @apply max-w-3xl;
  }
  @apply w-full;
  .carousel {
    .carousel__slide {
      padding: 10px;
    }

    .carousel__viewport {
      perspective: 2000px;
      overflow: unset !important;
    }

    .carousel__track {
      transform-style: preserve-3d;
    }

    .carousel__slide--sliding {
      transition: 0.7s;
    }

    .carousel__slide {
      opacity: 0.8;
      transform: scaleX(0.9) scaleY(0.8);
    }
    .carousel__slide--prev {
      opacity: 0.8;
      transform-origin: left;
      transform: scaleX(0.9) scaleY(0.8);
    }

    .carousel__slide--next {
      opacity: 0.8;
      transform-origin: right;
      transform: scaleX(0.9) scaleY(0.8);
    }

    .carousel__slide--active {
      opacity: 1;
      padding: 0 24px;
      transform: scaleY(1);
      .carousel__item {
        box-shadow: 0px 8px 40px 0px rgba(4, 38, 63, 0.4);
      }
    }
    .carousel__prev {
      left: 35%;
    }

    .carousel__next {
      right: 35%;
    }
    .carousel__icon,
    .carousel__next,
    .carousel__prev {
      @apply w-[45px] md:w-[70px];
      color: grey;
      height: 70px;
    }

    @media screen and (max-width: 767px) {
      .carousel__prev {
        left: -3%;
      }

      .carousel__next {
        right: -3%;
      }

      .carousel__slide--active {
        opacity: 1;
        transform: scale(1);
        padding: 0 32px;
      }
    }

    .video-dive-in {
      width: 100%;
      height: 100%;
    }

    .carousel__item {
      border-radius: 16px;
      @apply relative;
      .video-control-container {
        @apply absolute bottom-0 top-0 h-full w-full;
        .video-control-action {
          @apply;
        }
      }
    }
  }
}
</style>
