<template>
  <div class="max-w-[1200px]">
    <div class="lg:mb-12.5 mb-10 w-screen px-5 md:px-0">
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
    </div>
    <div
      class="shop-best-seller-wrap xs:w-[450px] relative mx-auto w-full max-w-[1240px] px-5 sm:w-full"
    >
      <div ref="cardRef" class="keen-slider">
        <CardBestSeller
          v-for="item in shopBestSellerList"
          :key="item.productId"
          :show-point="showPoint"
          :data-card="item"
          class="keen-slider__slide"
        />
      </div>
      <div class="navigation">
        <NavigatePrev class="navigation__btn" @click="slider.prev()" />
        <NavigateNext class="navigation__btn" @click="slider.next()" />
      </div>
      <div v-if="showMore" class="mt-12.5 flex items-center justify-center px-5">
        <r-button
          title="See All"
          class="!border-black-50 text-black-50 hover:(!bg-navy-6 !text-white) w-full max-w-[390px] !rounded-[0px] !shadow-none"
          class-title="text-base font-550"
          height="40px"
          @click="seeAll"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { watch, computed } from 'vue'
import { TypeCategoryEnum } from '@/helpers/enum'
import CardBestSeller from '@/components/home/CardBestSeller.vue'
import { useCmsStore } from '@/stores/modules/cms'
import { storeToRefs } from 'pinia'
import NavigatePrev from '@/assets/svgs/navigate-prev.svg'
import NavigateNext from '@/assets/svgs/navigate-next.svg'

const { shopBestSellerListParse } = storeToRefs(useCmsStore())
const { whatNewListParse } = storeToRefs(useCmsStore())
const shopBestSellerList = computed(() =>
  props.type === TypeCategoryEnum.UPPER
    ? shopBestSellerListParse.value?.productDetailResponseList
    : whatNewListParse.value?.productDetailResponseList
)

const props = defineProps({
  showHeading: {
    type: Boolean,
    default: true
  },
  showMore: {
    type: Boolean,
    default: true
  },
  showPoint: {
    type: Boolean,
    default: true
  },
  categoryId: {
    type: Number,
    default: null
  },
  upperSlug: {
    type: String,
    default: undefined
  },
  lowerSlug: {
    type: String,
    default: undefined
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

const router = useRouter()

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
        slides: { perView: 1 }
      },
      '(min-width: 600px)': {
        slides: { perView: 2 }
      },
      '(min-width: 992px)': {
        slides: { perView: 3 }
      },
      '(min-width: 1300px)': {
        slides: { perView: 4 }
      }
    }
  },
  [ResizePlugin]
)

const seeAll = () => {
  if (TypeCategoryEnum.LOWER && props.lowerSlug) {
    router.push({
      name: AppRoutes.product.productCategory.name,
      params: { category: props.lowerSlug }
    })
  } else if (TypeCategoryEnum.UPPER && props.upperSlug) {
    router.push({
      name: AppRoutes.product.productCategory.name,
      params: { category: props.upperSlug }
    })
  }
}
</script>

<style lang="scss" scoped>
.shop-best-seller-wrap {
  :deep(.carousel__slide--visible:not(:last-child)) {
    @apply mr-0;
  }

  :deep(.carousel__track) {
    align-items: flex-start;
  }
}
.navigation {
  transform: translateY(-50%);
  @apply -left-15 absolute top-1/2 flex w-[calc(100%+120px)] justify-between;

  &__btn {
    @apply cursor-pointer;
  }
}
</style>
