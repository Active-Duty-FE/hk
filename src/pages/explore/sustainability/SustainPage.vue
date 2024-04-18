<template>
  <RWheelScroll>
    <div class="keen-slider__slide !xl:mx-[32px] relative w-full">
      <div class="hidden overflow-hidden md:block md:h-screen">
        <video
          v-if="sustainabilityTitle.imageUrlType?.includes('video')"
          class="banner__background"
          playsinline
          autoplay
          loop
          muted
        >
          <source :src="addPrefixForImage(sustainabilityTitle.imageUrl)" type="video/mp4" />
          <track src="" label="" kind="captions" default />
        </video>
        <img
          v-else
          :src="addPrefixForImage(sustainabilityTitle.imageUrl)"
          alt=""
          class="h-full w-full object-cover"
        />
      </div>
      <div class="block overflow-hidden md:hidden">
        <video
          v-if="sustainabilityTitle.imageUrlMobileType?.includes('video')"
          class="banner__background max-h-[400px] min-h-[250px] w-full object-fill"
          playsinline
          autoplay
          loop
          muted
        >
          <source :src="addPrefixForImage(sustainabilityTitle.imageUrlMobile)" type="video/mp4" />
          <track src="" label="" kind="captions" default />
        </video>
        <img
          v-else
          :src="addPrefixForImage(sustainabilityTitle.imageUrlMobile)"
          alt=""
          class="h-full min-h-[250px] w-full object-cover"
        />
      </div>
      <div
        class="xl:left-90 lg:(block left-10) absolute top-1/2 hidden -translate-y-1/2 text-white"
      >
        <p class="font-475 mb-[26px] text-xl leading-normal">SUSTAINABILITY</p>
        <p
          class="font-550 mb-[30px] whitespace-pre-line text-[50px] leading-[60px]"
          :class="handleStyleFontColor(sustainabilityTitle.fontColor)"
        >
          {{ sustainabilityTitle.titlePc }}
        </p>
        <p
          class="mb-0 w-[608px] text-lg font-normal leading-normal"
          :class="handleStyleFontColor(sustainabilityTitle.fontColor)"
        >
          {{ sustainabilityTitle.subTitlePc }}
        </p>
      </div>
    </div>
    <div class="md:(hidden) text-black-50 mx-5 my-[90px]">
      <p class="font-550 mb-5 text-xs leading-normal">SUSTAINABILITY</p>
      <p class="font-550 mb-10 whitespace-pre-line text-[32px] leading-[36px]">
        {{ sustainabilityTitle.titleMobile }}
      </p>
      <p class="mb-0 text-base font-normal leading-[22px]">
        {{ sustainabilityTitle.subTitleMobile }}
      </p>
    </div>

    <div
      v-for="(item, index) in sustainabilityContent"
      :key="item.id"
      class="keen-slider__slide md:(flex-row mx-0) md:(gap-0 mb-0) mx-5 mb-[90px] flex flex-col items-center justify-center gap-10"
      :class="{ 'md:flex-row-reverse': index % 2 }"
    >
      <RTransition
        class="md:(h-[992px] w-1/2) h-[376px] w-full"
        :direction="index % 2 ? 'right' : 'left'"
      >
        <img
          :src="addPrefixForImage(item.imageUrl)"
          alt="sustain_2"
          class="md:(h-[992px]) h-[376px] w-full object-cover"
        />
      </RTransition>
      <div class="flex w-full items-center justify-center md:w-1/2">
        <div class="text-black-50">
          <p
            class="font-550 md:(text-[50px] mb-10) mb-[25px] text-[28px] leading-[28px] md:leading-[50px]"
          >
            {{ item.displayTitle }}
          </p>
          <p
            class="md:(w-[600px] leading-[28px]) mb-0 w-full whitespace-pre-line text-base font-normal leading-[22px] md:text-lg"
          >
            {{ item.subCopy }}
          </p>
        </div>
      </div>
    </div>
  </RWheelScroll>

  <div class="mb-[90px] flex justify-center md:my-[180px] md:h-full md:items-center">
    <div class="md:(h-[350px]) relative h-fit w-full">
      <img
        :src="addPrefixForImage(sustainabilityBanner.imageUrl)"
        alt="sustain_4"
        class="hidden h-full w-full object-cover md:block"
      />
      <img
        :src="addPrefixForImage(sustainabilityBanner.imageUrlMobile)"
        alt="sustain_4"
        class="h-screen object-cover md:hidden"
      />
      <div
        class="md:(left-20 -translate-y-1/2) absolute bottom-[75px] left-5 top-1/2 h-fit text-white"
      >
        <p class="font-550 mb-[25px] text-[28px] leading-[28px]">
          {{ sustainabilityBanner.displayTitle }}
        </p>
        <p
          class="mb-0 w-[335px] whitespace-pre-line text-base font-normal leading-[22px] md:w-[533px]"
        >
          {{ sustainabilityBanner.subCopy }}
        </p>
      </div>
    </div>
  </div>

  <div class="bg-grey-4 py-[70px] md:py-[90px]">
    <div ref="relatedPageRef" class="keen-slider m-auto w-full max-w-[1240px] px-5">
      <div
        v-for="item in sustainabilityRelatedPage"
        :key="item.id"
        class="md:(flex-col gap-0) keen-slider__slide related-page__item flex flex-row items-center gap-[15px] md:items-start"
      >
        <img
          :src="addPrefixForImage(item.imageUrl)"
          alt="exp"
          class="mb-0 aspect-square w-[100px] object-cover md:mb-10 md:w-[180px] md:w-auto"
        />
        <div>
          <p class="md:(text-2xl w-full) md:[w-40] mb-[25px] w-52 text-xl leading-[26px]">
            {{ item.displayTitle }}
          </p>
          <p class="mb-0 w-fit cursor-pointer text-sm underline" @click="gotoLink(item)">
            Learn More
          </p>
        </div>
      </div>
    </div>
  </div>

  <div class="md:py-50 py-[70px] md:py-[90px]">
    <DiveIn />
  </div>
</template>

<script setup>
import RTransition from '@/components/common/RTransition.vue'
import RWheelScroll from '@/components/common/RWheelScroll.vue'
import { useCmsStore } from '@/stores/modules/cms'
import { storeToRefs } from 'pinia'
import { onBeforeMount } from 'vue'
import { addPrefixForImage, handleStyleFontColor } from '@/utils/common'
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'

const { getSnsList, getSustainability } = useCmsStore()
const {
  sustainabilityTitle,
  sustainabilityContent,
  sustainabilityRelatedPage,
  sustainabilityBanner
} = storeToRefs(useCmsStore())

const [relatedPageRef] = useKeenSlider(
  {
    breakpoints: {
      '(min-width: 200px)': {
        disabled: true
      },
      '(min-width: 1023px)': {
        slides: { perView: 3, spacing: 20 }
      }
    }
  },
  [
    (slider) => {
      slider.on('created', () => {
        observer.observe(slider.container)
      })

      const observer = new ResizeObserver(function () {
        slider.update()
      })

      slider.on('destroyed', () => {
        observer.unobserve(slider.container)
      })
    }
  ]
)

const gotoLink = (item) => {
  if (!item.link) return
  window.open(item.link, item?.openInNewWindow ? '' : '_self')
}

onBeforeMount(() => {
  getSnsList()
  getSustainability()
})
</script>

<style scoped lang="scss">
@media screen and (max-width: 1023px) {
  .related-page__item {
    &:not(:first-child) {
      margin-top: 30px;
    }

    &:nth-child(n + 4) {
      display: none;
    }
  }
}
</style>
