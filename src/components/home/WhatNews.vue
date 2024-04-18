<template>
  <div class="what-news-wrap max-w-[1200px]">
    <div v-if="shopBestSellerListParse.displayTitleYn && type === TypeCategoryEnum.UPPER">
      <r-heading-slide
        :text-bold="titleUpper"
        :description="descUpper"
        class="mb-10 lg:mb-[50px]"
        parent-class="lg:!items-start"
      />
    </div>
    <div v-else-if="whatNewListParse.displayTitleYn && type === TypeCategoryEnum.LOWER">
      <r-heading-slide
        :text-bold="titleLower"
        :description="descLower"
        class="mb-10 lg:mb-[50px]"
        parent-class="lg:!items-start"
      />
    </div>
    <div class="xs:(w-[400px] h-[600px]) sm:(w-full h-full)">
      <Carousel :items-to-show="1">
        <Slide v-for="whatNew in whatNewList" :key="whatNew?.id">
          <div class="what-news-body">
            <div class="what-news-body-left">
              <img
                :src="addPrefixForImageNew(whatNew?.url)"
                alt="whatnew"
                class="aspect-[1/1] h-full w-full bg-cover bg-center bg-no-repeat"
              />
            </div>
            <div class="what-news-body-right">
              <Carousel :items-to-show="2">
                <Slide
                  v-for="item in whatNew?.productAttachmentsResponseList"
                  :key="item.productId"
                >
                  <CardBestSeller
                    :data-card="item"
                    class="keen-slider__slide"
                    :class-prop="`xs:hidden md:block`"
                  />
                </Slide>
                <template #addons>
                  <Pagination />
                </template>
              </Carousel>
            </div>
          </div>
        </Slide>
        <template #addons>
          <Pagination />
        </template>
      </Carousel>
    </div>
  </div>
</template>
<script setup>
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'
import { ref, computed } from 'vue'
import CardBestSeller from '@/components/home/CardBestSeller.vue'
import { useCmsStore } from '@/stores/modules/cms'
import { storeToRefs } from 'pinia'
import { addPrefixForImage, addPrefixForImageNew } from '@/utils/common'
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel'
import { TypeCategoryEnum } from '@/helpers/enum'
import { ITEM_SLIDE_NUMBER } from '@/helpers/constant'

const props = defineProps({
  showHeading: {
    type: Boolean,
    default: true
  },
  showMore: {
    type: Boolean,
    default: true
  },
  type: {
    type: String,
    default: ''
  },
  titleLower: {
    type: String,
    default: ''
  },
  titleUpper: {
    type: String,
    default: ''
  },
  descUpper: {
    type: String,
    default: ''
  },
  descLower: {
    type: String,
    default: ''
  }
})

const { whatNewListParse } = storeToRefs(useCmsStore())
const { shopBestSellerListParse } = storeToRefs(useCmsStore())
const whatNewList = computed(() =>
  props.type === TypeCategoryEnum.UPPER
    ? shopBestSellerListParse.value?.attachmentList?.slice(0, ITEM_SLIDE_NUMBER)
    : whatNewListParse.value?.attachmentList?.slice(0, ITEM_SLIDE_NUMBER)
)
const currentSlider = ref(0)
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

const [cardRef, slider] = useKeenSlider(
  {
    slides: { perView: 1 },
    breakpoints: {
      '(min-width: 200px)': {
        slides: { perView: 2, spacing: 10 }
      },
      '(min-width: 600px)': {
        slides: { perView: 2, spacing: 20 }
      },
      '(min-width: 992px)': {
        slides: { perView: 2, spacing: 20 }
      },
      '(min-width: 1300px)': {
        slides: { perView: 2, spacing: 20 }
      }
    },
    initial: currentSlider.value,
    loop: true,
    autoplay: true,
    duration: 5000,
    slideChanged: (s) => {
      currentSlider.value = s.track.details.rel
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
    },
    ResizePlugin
  ]
)
</script>
<style lang="scss">
.what-news-wrap {
  :deep(.carousel__slide--visible:not(:last-child)) {
    @apply mr-0;
  }

  :deep(.carousel__track) {
    align-items: flex-start;
  }
  .what-news-body {
    @apply flex w-full flex-col gap-[15px] md:grid md:h-[600px] md:grid-cols-2 md:gap-5;
    .what-news-body-right {
      @apply flex flex-col items-center gap-3 md:gap-[46px];
      &__switch {
        @apply flex h-[11px] w-full max-w-[150px] flex-row items-center justify-center gap-[14px] md:max-w-[162px];
      }
    }
  }
}
.carousel {
  .carousel__pagination-button::after {
    width: 30px !important;
  }
}
</style>
