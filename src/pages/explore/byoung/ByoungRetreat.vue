<template>
  <div>
    <div class="text-black-50">
      <div class="banner-section relative mb-[70px] md:h-screen md:overflow-hidden">
        <img :src="banner" alt="retreat_1" class="h-[314px] w-full md:h-full" />
        <div
          class="2xl:left-90 lg:(block left-10) absolute bottom-[25%] hidden"
          :class="{
            'text-white': retreatBanner?.fontColor,
            'text-black-50': !retreatBanner?.fontColor
          }"
        >
          <p class="font-475 mb-[30px] text-[24px] leading-[29px]">RIMAN RETREAT</p>
          <p class="font-550 mb-[50px] text-[84px] leading-[86px]">
            {{ retreatBanner?.titlePc }}
          </p>
          <p class="mb-0 w-[650px] text-lg font-normal leading-normal -tracking-[0.36px]">
            {{ retreatBanner?.subTitlePc }}
          </p>
        </div>
      </div>
      <div
        class="mx-5 mb-[90px] lg:hidden"
        :class="{
          'text-white': retreatBanner?.fontColor,
          'text-black-50': !retreatBanner?.fontColor
        }"
      >
        <p class="font-550 mb-5 text-sm leading-normal">RIMAN RETREAT</p>
        <p class="font-550 mb-10 text-[32px] leading-[36px]">
          {{ retreatBanner?.titleMobile }}
        </p>
        <p class="mb-0 text-base font-normal leading-[22px]">
          {{ retreatBanner?.subTitleMobile }}
        </p>
      </div>
      <div
        v-if="retreatUpComingTrips?.displayStatus"
        class="second-section md:(justify-center) mb-[90px] flex flex-col items-center lg:mb-[180px] lg:pt-[180px]"
      >
        <div class="relative mx-5 w-full max-w-[1200px] text-start md:mx-0">
          <p
            class="font-550 md:(text-[32px] leading-[36px]) md:px-unset mb-5 px-5 text-xl leading-5 md:mb-10"
          >
            UPCOMING RETREAT
          </p>
        </div>
        <div class="relative mx-5 md:mx-0">
          <img
            :src="addPrefixForImage(retreatUpComingTrips?.imageUrl)"
            alt="retreat_2"
            class="hidden w-full md:block"
          />
          <img
            :src="addPrefixForImage(retreatUpComingTrips?.imageUrlMobile)"
            alt="retreat_2_mo"
            class="img_retreat_mo md:hidden"
          />
          <div class="md:(left-25 bottom-25) absolute bottom-5 left-5 text-white">
            <p class="font-550 mb-10 text-[40px] leading-[40px]">
              {{ retreatUpComingTrips?.displayTitle }}
            </p>
            <div class="flex items-center gap-5">
              <button
                class="font-550 cursor-pointer border-none bg-transparent text-base"
                @click="handleLearnMore(retreatUpComingTrips?.link)"
              >
                LEARN MORE
              </button>
              <ArrowRight class="arrow_icon" />
            </div>
          </div>
        </div>
      </div>
      <div
        class="md:(justify-center) mb-[90px] flex flex-col items-center items-center lg:mb-[180px]"
      >
        <div class="max-w-[1200px] md:w-full">
          <p
            class="font-550 md:(text-[32px] leading-[36px]) md:(mb-10 ml-0) mb-5 ml-5 text-xl leading-[20px]"
          >
            PAST RETREAT
          </p>
          <video
            v-if="retreatPastTrips?.videoUrl"
            controls
            class="mb-[10px] w-full md:mb-[25px]"
            playsinline
            loop
            muted
            autoplay
          >
            <source :src="addPrefixForImage(retreatPastTrips?.videoUrl)" type="video/mp4" />
            <track src="" label="" kind="captions" default />
          </video>
          <div v-else>
            <img
              :src="addPrefixForImage(retreatPastTrips?.imageUrl)"
              alt="retreat_3"
              class="mb-[10px] hidden w-full md:mb-[25px] lg:block"
            />
            <img
              :src="addPrefixForImage(retreatPastTrips?.imageUrlMobile)"
              alt="retreat_3"
              class="mb-[10px] w-full md:mb-[25px] lg:hidden"
            />
          </div>
        </div>
        <span class="md:(text-base leading-[22px]) text-center text-xs">
          {{ retreatPastTrips?.displayTitle }}
        </span>
      </div>
    </div>
    <div class="md:(justify-center) mb-[76px] flex items-center justify-center lg:mb-[170px]">
      <DiveIn />
    </div>
  </div>
</template>
<script setup>
import ArrowRight from '@/assets/svgs/arrow-right.svg'
import DiveIn from '@/components/home/DiveIn.vue'
import { useCmsStore } from '@/stores/modules/cms'
import { addPrefixForImage } from '@/utils/common'
import { useBreakpoints } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

const { getRetreat, getRetreatType } = useCmsStore()
const { retreatBanner, retreatUpComingTrips, retreatPastTrips } = storeToRefs(useCmsStore())

const device = useBreakpoints({
  tablet: 992
})
const isTablet = device.greater('tablet')

const banner = computed(() => {
  return addPrefixForImage(
    !isTablet.value ? retreatBanner.value?.imageUrl : retreatBanner.value?.imageUrlMobile
  )
})

const handleLearnMore = (value) => {
  window.open(value, retreatUpComingTrips.value?.openInNewWindow ? '_blank' : '_self')
}

onMounted(async () => {
  getRetreat()
  getRetreatType()
})
</script>

<style scoped lang="scss">
.arrow_icon {
  @apply h-5 w-5 cursor-pointer;
  :deep(path) {
    fill: #fff;
  }
}
.img_retreat_mo {
  width: calc(100vw - 40px);
}
</style>
