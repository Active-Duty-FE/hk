<template>
  <div>
    <a-modal v-model:visible="visible" centered width="800" :footer="null">
      <div class="divein-body flex">
        <div class="divein-body__videos group relative cursor-pointer">
          <video
            ref="videoRef"
            :key="dataVideo.id"
            autoplay
            loop
            muted
            class="md:(w-[300px] h-[500px]) xs:(w-[150px] h-[350px])"
            controls
            disablePictureInPicture
            controlsList="nodownload nofullscreen noplaybackrate"
          >
            <source :src="dataVideo?.attachmentList?.[0]?.url" type="video/mp4" />
          </video>
          <div class="invisible group-hover:visible">
            <div
              v-if="currentSlide === index"
              class="top-85% left-10% index-10 absolute flex h-[40px] w-[40px] items-center justify-center rounded-[50%] bg-[#0000004d] backdrop-blur-[2px]"
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
              class="top-85% left-80% index-10 absolute flex h-[40px] w-[40px] items-center justify-center rounded-[50%] bg-[#0000004d] backdrop-blur-[2px]"
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
        <div
          v-if="dataVideo?.productDetailResponseList?.length"
          class="divein-body__products xs:overflow-hidden xs:w-[250px] ml-2 h-full"
          :class="
            dataVideo?.productDetailResponseList?.length === 1 ? 'md:w-[400px]' : 'md:w-[500px]'
          "
        >
          <div class="font-550 mb-1">
            Item List {{ dataVideo?.productDetailResponseList?.length }}
          </div>
          <Carousel :breakpoints="breakPoints">
            <Slide v-for="item in dataVideo?.productDetailResponseList" :key="item.id">
              <CardDiveInProducts :key="item.productId" :data-card="item" class="" />
            </Slide>
            <template #addons>
              <div class="xs:hidden">
                <Pagination></Pagination>
              </div>
            </template>
          </Carousel>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import { useRouter } from 'vue-router'
import CardDiveInProducts from '@/components/home/CardDiveInProducts.vue'
import { Carousel, Slide, Pagination } from 'vue3-carousel'
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons-vue'
import MuteVideoIcon from '@/assets/svgs/mute-video.svg'
import UnMuteVideoIcon from '@/assets/svgs/unmute-video.svg'
import { reactive, ref, computed, onMounted } from 'vue'
import { addPrefixForImage, addPrefixForImageNew } from '@/utils/common'

const videoRef = ref()
const statusPause = ref(false)
const statusMute = ref(false)

const router = useRouter()
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  dataVideo: {
    type: Object,
    default: () => {}
  }
})

const breakPoints = {
  300: {
    itemsToShow: 1,
    snapAlign: 'center',
    transition: 700
  },
  700: {
    itemsToShow: 2,
    snapAlign: 'center',
    transition: 800
  },
  1024: {
    itemsToShow: 2,
    snapAlign: 'center',
    transition: 700
  }
}

const handleVolumnVideo = (id) => {
  if (videoRef.value.muted) {
    videoRef.value.muted = false
  } else {
    videoRef.value.muted = true
  }
  statusMute.value = !statusMute.value
}
const handleControlVideo = (id) => {
  if (videoRef.value.paused) {
    videoRef.value.play()
  } else {
    videoRef.value.pause()
  }
  statusPause.value = !statusPause.value
}
const visible = useVModel(props, 'modelValue')
</script>
<style lang="scss" scoped>
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
</style>
