<template>
  <div class="ritual">
    <img :src="currentContent.image" alt="" class="ritual__background" />
    <div class="flex">
      <div
        v-for="(tab, index) in listProductsRitual"
        :key="tab"
        class="tab"
        :class="{ 'tab-active': index === currentTab }"
        @click="onChangeTab(index)"
      >
        <img :src="tab.icon" alt="" class="h-6 w-6" />
        <span class="font-550 text-navy-6 text-xs leading-[normal]">{{ tab.title }}</span>
      </div>
    </div>
    <div id="tab__content" ref="tabContentRef" class="tab__content" @scroll="onScroll">
      <div
        v-for="(steps, indexC) in contentTab"
        :id="getIdElement(RITUAL_CONTENT_US[indexC].title)"
        :key="indexC"
      >
        <span class="tab__description"> {{ steps?.description }} </span>
        <div v-for="step in steps.dataProduct" :key="`${indexC}-${step.id}`" class="step__wrap">
          <img :src="addPrefixForImage(step?.product?.thumbnailUrl)" alt="" class="step__image" />
          <div class="step__subtitle">{{ step?.step }}</div>
          <div class="step__title" @click="goToProductDetail(step?.product?.productId)">
            <span class="line-clamp-2">{{
              step?.product?.productEnglishName || step?.product?.productEngName
            }}</span>
          </div>
          <div class="step__description">
            <span v-clean-html="step?.product?.description" class="line-clamp-5"></span>
          </div>

          <div class="mb-6 flex items-center text-base leading-[normal]">
            <span class="text-gray-10 font-bold">
              {{ renderCurrency(step?.product?.currencyPrice?.code) }}
              {{ step?.product?.salesAmount }}
            </span>
            <a-divider type="vertical" class="!bg-navy-3" />
            <span class="font-475 text-gray-12">{{ step?.product?.point }} {{ getPointText }}</span>
          </div>

          <ButtonAddCart v-slot="cartButton">
            <div
              class="inline-flex w-fit cursor-pointer items-center gap-1"
              @click.stop="cartButton.phaseCheck(step?.product)"
            >
              <CartButton />
              <span class="font-500 text-sm leading-[normal]">ADD TO BAG</span>
            </div>
          </ButtonAddCart>
        </div>
      </div>
    </div>
    <div
      class="font-400 text-gray-10 flex items-center justify-center gap-2.5 py-6 text-xs leading-[normal]"
    >
      <ArrowDown :class="{ 'rotate-180': bottom }" />
      {{ bottom ? 'Go back to CLEANSER' : 'Scroll to see next step' }}
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import VueScrollTo from 'vue-scrollto'
import { useIntersectionObserver, useScroll, useThrottleFn } from '@vueuse/core'
import { RITUAL_CONTENT_US } from '@/mocks/ritual-page'
import CartButton from '@/assets/svgs/cart-home.svg'
import { AppRoutes } from '@/router/path'
import ArrowDown from '@/assets/svgs/arrow-down.svg'
import { renderRitualTypeProduct, addPrefixForImage } from '@/utils/common'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { renderCurrency } from '@/utils/currency'
import { ProductSaleStatus } from '@/helpers/enum'
import { getPointText } from '@/utils/product'

const props = defineProps({
  listProducts: {
    type: Array,
    default: () => []
  }
})

const vCleanHtml = buildVueDompurifyHTMLDirective()

const listProductsRitual = computed(() => {
  return RITUAL_CONTENT_US.map((e) => {
    return {
      ...e,
      steps: renderRitualTypeProduct(props.listProducts, e.title)
    }
  })
})

const HEIGHT_COLLAPSE = 20 * 3 // 20px * line
const router = useRouter()
const currentTab = ref(0)
const currentContent = computed(() => RITUAL_CONTENT_US[currentTab.value])

const contentTab = computed(() =>
  listProductsRitual.value?.map((item) => {
    return { dataProduct: item.steps, description: item?.description }
  })
)

const isDisableAddCartButton = (item) => {
  return item?.salesStatus?.code !== ProductSaleStatus.ON_SALE
}

const tabs = RITUAL_CONTENT_US.map((item) => item.title)

const tabHashMap = tabs.reduce((acc, cur, index) => ({ ...acc, [cur]: index }), {})

const openDescription = ref([])
openDescription.value.length = RITUAL_CONTENT_US.length
openDescription.value.fill(true)

const tabContentRef = ref(null)
const { arrivedState } = useScroll(tabContentRef)
const { bottom } = toRefs(arrivedState)

onMounted(() => {
  calculateOpenDescription()
})

const calculateOpenDescription = () => {
  const descriptionList = document.querySelectorAll('.tab__description')

  for (let i = 0; i < descriptionList.length; i++) {
    if (descriptionList[i].offsetHeight < HEIGHT_COLLAPSE.value) return
    openDescription.value[i] = false
  }
}

const onChangeTab = (index) => {
  const title = RITUAL_CONTENT_US[index].title

  const element = document.getElementById(getIdElement(title))
  VueScrollTo.scrollTo(element, 0, {
    container: '#tab__content',
    offset: -30
  })
}

const getIdElement = (title) => {
  return `step-${title}`
}

const goToProductDetail = (id) => {
  router.push({ name: AppRoutes.product.detail.name, params: { productId: id } })
}

const onScroll = useThrottleFn(() => {
  for (const tab of tabs) {
    const target = document.getElementById(getIdElement(tab))
    useIntersectionObserver(
      target,
      ([{ isIntersecting }]) => {
        if (!isIntersecting) return
        currentTab.value = tabHashMap[tab]
      },
      {
        root: tabContentRef.value
      }
    )
  }
}, 300)
</script>

<style lang="scss" scoped>
.ritual {
  @apply relative block px-5 pt-5 md:hidden;

  &__background {
    @apply -z-1 absolute bottom-0 left-0 right-0 top-0 h-full w-full object-cover;
  }
}

.tab {
  @apply relative flex w-full flex-col items-center gap-2.5 bg-white/40 py-4;

  &:before {
    content: '';
    @apply bg-navy-6 absolute left-0 top-0 h-[2px] w-0 transition-all duration-300;
  }

  &-active {
    @apply bg-white;

    &:before {
      @apply w-full;
    }
  }

  &__content {
    @apply flex h-[calc(100dvh-250px)] flex-col gap-10 overflow-y-auto bg-white px-5 py-[30px];
  }

  &__description {
    // Update line-clamp when update HEIGHT_COLLAPSE
    @apply text-navy-6 mb-8 block text-base font-normal leading-5 -tracking-[0.32px] transition-all duration-300;

    &.open {
      @apply block;
    }
  }

  &__collapse {
    @apply mb-7.5 cursor-pointer text-center underline;
  }
}

.step {
  @apply flex w-full flex-col items-center gap-10;

  &__wrap {
    @apply flex w-full flex-col justify-center;

    &:not(:last-child) {
      @apply mb-10;
    }
  }

  &__image {
    @apply mb-7.5 h-full max-h-[265px] w-full object-cover;
  }

  &__subtitle {
    @apply text-gray-10 mb-3.75 text-lg font-normal leading-[normal];
  }

  &__title {
    @apply font-550 text-gray-10 mb-6.25 cursor-pointer text-lg leading-[normal];
  }

  &__description {
    @apply text-gray-1 mb-7 text-sm font-normal leading-[normal];
  }
}

.icon-menu-down {
  @apply mb-7.5 transition-all duration-300;

  :deep(path) {
    @apply stroke-navy-6;
  }

  &.rotate {
    @apply rotate-180;
  }
}
</style>
