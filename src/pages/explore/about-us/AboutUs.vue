<template>
  <div class="aboutUs">
    <RWheelScroll :key="wheelScrollKey">
      <div class="exploreWrap">
        <div class="!xl:mx-[32px]">
          <div class="ex_fullbg keen-slider__slide">
            <div class="bg">
              <div class="hidden overflow-hidden md:block md:h-screen">
                <video
                  v-if="aboutUsBanner.imageUrlType?.includes('video')"
                  class="banner__background h-full w-full object-fill"
                  playsinline
                  autoplay
                  loop
                  muted
                >
                  <source :src="addPrefixForImage(aboutUsBanner.imageUrl)" type="video/mp4" />
                  <track src="" label="" kind="captions" default />
                </video>
                <img
                  v-else
                  :src="addPrefixForImage(aboutUsBanner.imageUrl)"
                  alt=""
                  class="h-full w-full object-cover"
                />
              </div>
              <div class="block overflow-hidden md:hidden">
                <video
                  v-if="aboutUsBanner.imageUrlMobileType?.includes('video')"
                  class="banner__background max-h-[400px] w-full object-fill"
                  playsinline
                  autoplay
                  loop
                  muted
                >
                  <source :src="addPrefixForImage(aboutUsBanner.imageUrlMobile)" type="video/mp4" />
                  <track src="" label="" kind="captions" default />
                </video>
                <img
                  v-else
                  :src="addPrefixForImage(aboutUsBanner.imageUrlMobile)"
                  alt=""
                  class="h-full w-full object-cover"
                />
              </div>
            </div>
            <div class="txtbox">
              <div class="t01" :class="handleStyleFontColor(aboutUsBanner.fontColor)">ABOUT US</div>
              <div
                class="font-550 mb-[30px] hidden whitespace-pre-line text-[50px] leading-[60px] md:block"
                :class="handleStyleFontColor(aboutUsBanner.fontColor)"
              >
                {{ aboutUsBanner.titlePc }}
              </div>
              <div class="t02 md:hidden">{{ aboutUsBanner.titleMobile }}</div>
              <div
                class="t03 hidden whitespace-pre-line md:block"
                :class="handleStyleFontColor(aboutUsBanner.fontColor)"
              >
                {{ aboutUsBanner.subTitlePc }}
              </div>
              <div class="t03 whitespace-pre-line md:hidden">
                {{ aboutUsBanner.subTitleMobile }}
              </div>
            </div>
          </div>
        </div>

        <div class="ex_content">
          <ul class="explist">
            <li
              v-for="(item, index) in aboutUsContent"
              :key="item.id"
              class="explists keen-slider__slide"
              :class="{ 'md:flex-row-reverse': index % 2 }"
            >
              <div class="img">
                <RTransition :direction="index % 2 ? 'right' : 'left'">
                  <img alt="image" :src="addPrefixForImage(item.imageUrl)" class="object-cover" />
                </RTransition>
              </div>
              <div class="txt">
                <div class="tbox">
                  <div class="t01 whitespace-pre-line">{{ item.displayTitle }}</div>
                  <div v-if="item.subCopy" class="t02 whitespace-pre-line">{{ item.subCopy }}</div>
                  <div v-if="item.description" class="t02 !font-425 whitespace-pre-line">
                    {{ item.description }}
                  </div>
                  <a v-if="item.link" class="t03" @click="onOpenLink(item)">
                    Read More
                    <span class="blind vsanchor" />
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </RWheelScroll>

    <div class="explist2">
      <div class="inner">
        <ul ref="relatedPageRef" class="keen-slider">
          <li v-for="item in aboutUsRelatedPage" :key="item.id" class="keen-slider__slide">
            <div class="img">
              <img alt="image" :src="addPrefixForImage(item.imageUrl)" />
            </div>
            <div class="tbox">
              <div class="tbox1">{{ item.displayTitle }}</div>
              <a @click="onOpenLink(item)">Read More</a>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="md:py-50 py-[70px] md:py-[90px]">
      <DiveIn />
    </div>
  </div>
</template>

<script setup>
import { useCmsStore } from '@/stores/modules/cms'
import { onBeforeMount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { addPrefixForImage, handleStyleFontColor } from '@/utils/common'
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'
import RTransition from '@/components/common/RTransition.vue'

const wheelScrollKey = ref(Date.now())
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

const onOpenLink = (item) => {
  if (!item.link) return
  window.open(item.link, item?.openInNewWindow ? '' : '_self')
}

const { getSnsList, getAboutUs } = useCmsStore()
const { aboutUsBanner, aboutUsContent, aboutUsRelatedPage } = storeToRefs(useCmsStore())

onBeforeMount(() => {
  getSnsList()
  getAboutUs()
})

watch(aboutUsContent, () => {
  wheelScrollKey.value = Date.now()
})
</script>

<style src="@/assets/css/explore.css" scoped></style>

<style scoped>
ul {
  padding: 0;
  margin: 0;
}
</style>
