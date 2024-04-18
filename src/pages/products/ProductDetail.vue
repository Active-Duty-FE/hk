<template>
  <div class="product-detail container m-auto">
    <a-row class="no-scrollbar -mx-5 pt-1 md:mx-0 md:pt-[100px]">
      <a-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12" class="px-0 sm:px-[18px] md:px-[18px]">
        <ProductCarousel
          :images="pageState.productDetail.imageUrl"
          class="sticky left-0 top-[70px]"
        />
      </a-col>

      <a-col
        :xs="24"
        :sm="24"
        :md="12"
        :lg="12"
        :xl="12"
        class="px-5 sm:px-[18px] md:px-0 md:px-[18px]"
      >
        <ProductInfo
          :product-detail="pageState.productDetail"
          @scroll-review="scrollToReview"
          @scroll-ritual="scrollToRitual"
        />
      </a-col>
    </a-row>

    <div class="mb-25 mt-15 hidden lg:block">
      <a-divider class="!bg-gray-10 !my-0" />
    </div>

    <div
      v-if="pageState.productDetail?.typographyYn && pageState.productDetail.typography"
      class="description-content mt-10 text-left md:mt-0 md:text-center"
    >
      <span
        v-if="pageState.productDetail?.typographyYn"
        v-clean-html="pageState.productDetail.typography"
        class="font-550 text-brown-1 md:mb-17.5 md:(text-[36px] leading-[45px]) mb-10 block whitespace-pre-wrap text-[28px] leading-[28px]"
      />
    </div>
    <div>
      <template v-if="pageState.productDetail?.detailYn">
        <div
          v-if="pageState.productDetail.details?.pcContent"
          v-clean-html="pageState.productDetail.details?.pcContent"
          class="hidden whitespace-pre-wrap pb-9 md:block"
        />
        <div
          v-if="pageState.productDetail.details?.mobileContent"
          v-clean-html="pageState.productDetail.details?.mobileContent"
          class="whitespace-pre-wrap pb-9 md:hidden"
        />
      </template>
    </div>

    <div v-if="contentTabs && contentTabs.length" class="tab-block hidden md:block">
      <div>
        <a-row class="mb-12.5">
          <a-col v-for="item in contentTabs" :key="item.key" :span="8">
            <div
              class="tab-block-item text-gray-13 font-400 border-b-1 border-b-gray-5 border-b-solid cursor-pointer py-[15px] text-center text-[18px]"
              :class="{ 'tab-block-item-active': getTabBlockActive(item.key) }"
              @click="pageState.currentTab = item.key"
            >
              {{ item.key }}
            </div>
          </a-col>
        </a-row>
        <a-row ref="targetDivVideo">
          <Transition name="accordion">
            <div :key="pageState.currentTab">
              <p
                v-show="
                  pageState.currentTab === ProductDescriptionTabEnum.HOW_TO &&
                    pageState.productDetail.howToYn
                "
                v-clean-html="pageState.productDetail.howTo?.pcContent"
              />
              <p
                v-show="
                  pageState.currentTab === ProductDescriptionTabEnum.INGREDIENTS &&
                    pageState.productDetail.ingredientYn
                "
                v-clean-html="pageState.productDetail.ingredient?.pcContent"
              />
              <p
                v-show="
                  pageState.currentTab === ProductDescriptionTabEnum.SUSTAINABILITY &&
                    pageState.productDetail.sustainabilityYn
                "
                v-clean-html="pageState.productDetail.sustainability?.pcContent"
              />
            </div>
          </Transition>
        </a-row>
      </div>
    </div>

    <div class="-mx-5 block md:hidden">
      <ProductGuide :product-detail="pageState.productDetail" />
    </div>

    <div v-if="pageState.rituals.length" ref="ritualRef">
      <span class="font-550 block pb-[70px] pt-[180px] text-[40px] leading-[40px]">
        Complete Your Ritual
      </span>
      <div>
        <div class="ritual__content">
          <NavigatePrev
            v-if="pageState.rituals && pageState.rituals.length > 3"
            class="ritual__navigation ritual__navigation-prev"
            @click="onPrev"
          />
          <r-carousel
            ref="carouselRef"
            v-slot="item"
            :options="pageState.rituals"
            :breakpoints="breakpoints"
            snap-align="start"
          >
            <div
              class="ipad-style mr-3 h-full max-w-full cursor-pointer text-left sm:max-w-[390px] md:mr-0"
            >
              <span class="text-gray-10 font-550 mb-[15px] inline-block text-[18px]">
                STEP {{ item.displayOrder }}
              </span>
              <div
                class="image-wrapper mb-[25px] min-h-[390px] w-full"
                @click="gotoProductDetail(item.productId)"
              >
                <img
                  class="bg-grey-3 mb-6 h-[390px] max-h-[390px] w-full max-w-[390px] object-cover sm:w-[390px]"
                  :src="addPrefixForImage(item.thumbnailUrl)"
                  alt="product"
                />
                <img
                  :src="addPrefixForImage(item.thumbnailUrl)"
                  alt="product"
                  class="image-hover bg-grey-3 mb-6 h-[390px] max-h-[390px] w-full max-w-[390px] object-cover sm:w-[390px]"
                />
              </div>
              <p class="font-550 leading-base mb-2 text-start text-[22px] uppercase sm:text-[16px]">
                {{ item.productEnglishName }}
              </p>
              <p class="text-start text-[16px] font-normal">
                {{ item.summary }}
              </p>
              <ProductPrice :product-info="item" />
              <ButtonAddCart v-slot="cartButton">
                <div class="flex cursor-pointer gap-1" @click.stop="cartButton.phaseCheck(item)">
                  <CartIcon />
                  <span class="font-550 text-[14px] sm:text-base">ADD TO BAG</span>
                </div>
              </ButtonAddCart>
            </div>
          </r-carousel>
          <NavigateNext
            v-if="pageState.rituals && pageState.rituals.length > 3"
            class="ritual__navigation ritual__navigation-next"
            @click="onNext"
          />
        </div>
      </div>
    </div>

    <div
      v-if="
        pageState.productDetail?.alsoLikeYn && pageState.alsoLikes && pageState.alsoLikes.length
      "
      ref="alsoLikeRef"
    >
      <span
        class="font-500 md:font-550 text-8 block pb-[70px] pt-[180px] leading-[40px] md:text-[40px]"
      >
        You May Also Love
      </span>
      <div>
        <div class="ritual__content">
          <NavigatePrev
            v-if="pageState.alsoLikes && pageState.alsoLikes.length > 3"
            class="ritual__navigation ritual__navigation-prev"
            @click="onPrevLike"
          />
          <r-carousel
            ref="carouselLikeRef"
            v-slot="item"
            :options="pageState.alsoLikes"
            :breakpoints="breakpoints"
            snap-align="start"
          >
            <div
              class="ipad-style mr-3 max-w-full cursor-pointer text-left sm:max-w-[390px] md:mr-0"
            >
              <div
                class="image-wrapper mb-[25px] min-h-[390px] w-full"
                @click="gotoProductDetail(item.productId)"
              >
                <img
                  class="bg-grey-3 mb-6 h-[390px] max-h-[390px] w-full max-w-[390px] object-cover sm:w-[390px]"
                  :src="addPrefixForImage(item.thumbnailUrl)"
                  alt="product"
                />
                <img
                  :src="addPrefixForImage(item.thumbnailUrl)"
                  alt="product"
                  class="image-hover bg-grey-3 mb-6 h-[390px] max-h-[390px] w-full max-w-[390px] object-cover sm:w-[390px]"
                />
              </div>
              <p class="font-550 leading-base mb-2 text-start text-[22px] uppercase sm:text-[16px]">
                {{ item.productEnglishName }}
              </p>
              <p class="text-start text-[16px] font-normal">
                {{ item.summary }}
              </p>
              <ProductPrice :product-info="item" />
              <ButtonAddCart v-slot="cartButton">
                <div class="flex cursor-pointer gap-1" @click.stop="cartButton.phaseCheck(item)">
                  <CartIcon />
                  <span class="font-550 text-[14px] sm:text-base">ADD TO BAG</span>
                </div>
              </ButtonAddCart>
            </div>
          </r-carousel>
          <NavigateNext
            v-if="pageState.alsoLikes && pageState.alsoLikes.length > 3"
            class="ritual__navigation ritual__navigation-next"
            @click="onNextLike"
          />
        </div>
      </div>
    </div>

    <div ref="reviewRef">
      <ProductReview
        :total-rate="pageState.productDetail.star"
        :is-reviewed="pageState.productDetail?.reviewedYn"
        @create-success="fetchData"
      />
    </div>

    <RModalAlert
      v-model:visible="showDialogAlertCountry"
      :width="270"
      text-btn="OK"
      @confirm="onConfirmCountry()"
    >
      <template #extraDescription>
        <div class="text-center">
          <p class="font-475 mb-[14px] text-base leading-[22px]">
            Please be sure to navigate to this product on your preferred country site before adding
            to your Bag.
          </p>
        </div>
      </template>
    </RModalAlert>
  </div>
</template>
<script setup>
import NavigateNext from '@/assets/svgs/navigate-next.svg'
import NavigatePrev from '@/assets/svgs/navigate-prev.svg'
import { STORAGE_BACK_SKIN_QUIZ, STORAGE_IP_ADDRESS } from '@/helpers/constant'
import { ProductDescriptionTabEnum } from '@/helpers/enum'
import apiService from '@/http/api'
import router from '@/router'
import { AppRoutes } from '@/router/path'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { getCurrentCountry } from '@/utils/address'
import { addPrefixForImage } from '@/utils/common'
import { gtmViewItem } from '@/utils/gtm'
import storage from '@/utils/storage'
import CartIcon from '@assets/svgs/ritual-cart.svg'
import { useElementVisibility } from '@vueuse/core'
import { computed, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { useRoute } from 'vue-router'

const vCleanHtml = buildVueDompurifyHTMLDirective()

const targetDivVideo = ref()
const showDialogAlertCountry = ref(false)

const storeLoading = useGlobalLoadingStore()
const { showGlobalLoading } = storeLoading
const route = useRoute()
const pageState = reactive({
  currentTab: ProductDescriptionTabEnum.HOW_TO,
  productDetail: {},
  rituals: [],
  alsoLikes: []
})
const reviewRef = ref(null)
const ritualRef = ref(null)
const alsoLikeRef = ref(null)

onBeforeMount(() => {
  fetchData()
})

const gotoProductDetail = (productId) => {
  router.push({ name: AppRoutes.product.detail.name, params: { productId } })
}

const targetIsVisible = useElementVisibility(targetDivVideo)

watch(
  () => targetIsVisible.value,
  (val) => {
    const videoElement = document.querySelector('video')
    if (videoElement) {
      videoElement.muted = true
      videoElement.loop = true
      if (val) {
        videoElement.play()
      } else {
        videoElement.pause()
      }
    }
  }
)

onMounted(() => {
  if (route.query?.from === 'skin-quiz') {
    storage.set(STORAGE_BACK_SKIN_QUIZ, true)
  }
})

const breakpoints = {
  1300: {
    itemsToShow: 3,
    snapAlign: 'start'
  },
  992: {
    itemsToShow: 2.5,
    snapAlign: 'start'
  },
  600: {
    itemsToShow: 2,
    snapAlign: 'start'
  },
  200: {
    itemsToShow: 1.5,
    snapAlign: 'start'
  }
}

const contentTabs = computed(() => {
  const result = []
  if (pageState.productDetail.howToYn) {
    result.push({
      key: ProductDescriptionTabEnum.HOW_TO,
      data: pageState.productDetail.howTo?.pcContent
    })
  }

  if (pageState.productDetail.ingredientYn) {
    result.push({
      key: ProductDescriptionTabEnum.INGREDIENTS,
      data: pageState.productDetail.ingredient?.pcContent
    })
  }

  if (pageState.productDetail.sustainabilityYn) {
    result.push({
      key: ProductDescriptionTabEnum.SUSTAINABILITY,
      data: pageState.productDetail.sustainability?.pcContent
    })
  }
  return result
})

const carouselRef = ref()
const carouselLikeRef = ref()

const getTabBlockActive = (tab) => {
  return tab === pageState.currentTab
}

const onPrev = () => {
  carouselRef.value?.prev()
}

const onNext = () => {
  carouselRef.value?.next()
}

const onPrevLike = () => {
  carouselLikeRef.value?.prev()
}

const onNextLike = () => {
  carouselLikeRef.value?.next()
}

const scrollToReview = () => {
  reviewRef.value?.scrollIntoView({ behavior: 'smooth' })
}

const scrollToRitual = () => {
  ritualRef.value?.scrollIntoView({ behavior: 'smooth' })
}

const parseResponse = (data = {}) => {
  return {
    ...data,
    typography: data.typography || '',
    imageUrl: data.imageUrl || [],
    listStyle: data.listStyle,
    details: data.details,
    howTo: data.howTo,
    ingredient: data.ingredient,
    sustainability: data.sustainability
  }
}

const fetchData = async () => {
  showGlobalLoading(true)
  const { data } = await apiService.productService.getProductDetail(
    pageState.productId || route.params.productId
  )
  gtmViewItem(data)
  pageState.productDetail = parseResponse(data)
  pageState.alsoLikes = pageState.productDetail?.alsoLikeYn
    ? pageState.productDetail?.alsoLike?.products
    : []
  pageState.rituals = pageState.productDetail?.ritual?.products || []
  pageState.rituals = pageState.rituals.map((el, index) => ({ ...el, displayOrder: index + 1 }))
  showGlobalLoading(false)
  if (
    getCurrentCountry() &&
    pageState.productDetail?.country &&
    getCurrentCountry() !== pageState.productDetail?.country
  ) {
    showDialogAlertCountry.value = true
  }
}

const onConfirmCountry = () => {
  showDialogAlertCountry.value = false
  storage.set(STORAGE_IP_ADDRESS, pageState.productDetail?.country || 'US', 'localStorage')
  window.location.reload()
}

watch(
  () => route.params,
  () => {
    if (route.params?.productId) {
      fetchData()
    }
  }
)
</script>

<style lang="scss" scoped>
@media (max-width: 767px) {
  .product-detail {
    margin: 0 !important;
    @apply px-5 lg:px-0;
  }

  .container {
    @apply max-w-3xl;
  }

  .ritual {
    &__content {
      margin: 0 !important;
    }
  }
}

.quantity-input {
  width: 200px;

  :deep(.ant-input-affix-wrapper) {
    @apply py-[10px];
  }

  :deep(.ant-input) {
    @apply text-center;
  }
}

.ship-option {
  :deep(.ant-radio-wrapper) {
    @apply w-full;
  }

  :deep(.ant-radio-checked) {
    .ant-radio-inner {
      @apply border-navy-deep;
    }

    .ant-radio-inner:after {
      @apply bg-navy-deep;
    }
  }
}

.tab-block {
  :deep(.tab-block-item-active) {
    @apply text-navy-6 border-navy-6;
  }
}

.ritual {
  @apply mb-[110px] px-5 lg:mb-[200px];

  &__content {
    @apply relative;
  }

  &__navigation {
    @apply z-1 absolute top-1/2 cursor-pointer;

    &-prev {
      transform: translate(-100%, -50%);
      @apply -left-0 hidden md:block;
    }

    &-next {
      transform: translate(100%, -50%);
      @apply -right-1 hidden md:block;
    }
  }
}

.carousel {
  &__wrap {
    @apply relative cursor-pointer;
  }

  &__image {
    @apply h-full w-full object-cover;
  }

  &__badge {
    @apply absolute right-2.5 top-2.5 h-5 w-5;
    @apply lg:right-4 lg:top-4 lg:h-[30px] lg:w-[30px];
  }
}

@media (max-width: 1330px) {
  .ritual__navigation {
    @apply hidden;
  }
}

.disabled-variant {
  .text-variant {
    @apply text-gray-5;
  }

  .border-variant {
    @apply border-gray-5;
  }

  .overlay-variant-disabled {
    background-color: rgb(255 255 255 / 31%);
  }
}

.image-wrapper {
  position: relative;
}
.image-hover {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.6s ease-out;
}
.image-hover:hover {
  opacity: 1;
}
.accordion-enter-active {
  max-height: 0px;
  overflow: hidden;
  transition-property: max-height;
  transition-duration: 1s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.accordion-leave-active {
  transition-property: max-height;
  transition-duration: 1s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
.accordion-enter-to {
  max-height: 70vh;
  overflow: hidden;
}
.accordion-leave-to {
  max-height: 0;
  overflow: hidden;
}
.accordion-leave-from {
  max-height: 70vh;
  overflow: hidden;
}

@media only screen and (min-width: 768px) and (max-width: 991px) {
  .ipad-style {
    margin-right: -12px !important;
  }
}
</style>
