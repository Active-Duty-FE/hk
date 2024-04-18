<template>
  <div class="hidden flex-col gap-10 md:flex">
    <div v-for="(content, indexC) in listProductsRitual" :key="indexC" class="content no-scrollbar">
      <div :id="`${content.title}`" class="content__wrap">
        <img :src="content.image" alt="" class="content__image" />
        <div class="content__container">
          <div
            v-for="tab in content.subTabs"
            :key="tab"
            class="content__subTabs-item dot dot-sub"
            @click="scrollTo(tab)"
          >
            {{ tab }}
          </div>
          <div class="dot dot-active">
            <div class="content__title">{{ content.title }}</div>
            <div
              v-clean-html="content.description"
              class="content__description whitespace-pre-line"
            />
          </div>

          <div
            v-for="tab in content.tabs"
            :key="tab"
            class="content__tabs-item dot dot-sub"
            @click="scrollTo(tab)"
          >
            {{ tab }}
          </div>
        </div>
      </div>

      <div class="step">
        <div
          v-for="(step, indexS) in content.steps"
          :key="`${indexC}-${indexS}`"
          class="step__wrap"
        >
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

          <div class="leading-base mb-6 flex items-center text-base">
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
              <span class="font-550 leading-base text-lg">ADD TO BAG</span>
            </div>
          </ButtonAddCart>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { RITUAL_CONTENT_US } from '@/mocks/ritual-page'
import CartButton from '@/assets/svgs/cart-home.svg'
import { AppRoutes } from '@/router/path'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { renderRitualTypeProduct, addPrefixForImage } from '@/utils/common'
import { renderCurrency } from '@/utils/currency'
import { ProductSaleStatus } from '@/helpers/enum'
import { getPointText } from '@/utils/product'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 992)

const props = defineProps({
  listProducts: {
    type: Array,
    default: () => []
  }
})

const vCleanHtml = buildVueDompurifyHTMLDirective()

const router = useRouter()

const isDisableAddCartButton = (item) => {
  return item?.salesStatus?.code !== ProductSaleStatus.ON_SALE
}

const listProductsRitual = computed(() => {
  return RITUAL_CONTENT_US.map((e) => {
    return {
      ...e,
      steps: renderRitualTypeProduct(props.listProducts, e.title)
    }
  })
})

const scrollTo = (id) => {
  const el = document.getElementById(`${id}`)

  if (!el) return

  el.scrollIntoView({
    behavior: 'smooth'
  })
}

const goToProductDetail = (id) => {
  router.push({ name: AppRoutes.product.detail.name, params: { productId: id } })
}

const disablePerfectScroll = (isDisable = true) => {
  const element = document.querySelector('.ps')
  if (element) {
    if (isDisable) {
      element.classList.add('ps-disable')
    } else {
      element.classList.remove('ps-disable')
    }
  }
}

watch(
  () => isMobile.value,
  (value) => {
    disablePerfectScroll(!value)
  },
  { immediate: true }
)

onMounted(() => {
  disablePerfectScroll(true)
})

onUnmounted(() => {
  disablePerfectScroll(false)
})
</script>

<style lang="scss" scoped>
.content {
  @apply relative grid grid-cols-2;

  &__wrap {
    @apply text-navy-6 sticky left-0 top-0 flex h-screen items-center justify-center;
  }

  &__container {
    @apply flex max-w-[620px] flex-col gap-20 px-5;
  }

  &__image {
    @apply -z-1 absolute bottom-0 left-0 right-0 top-0 h-full w-full;
  }

  &__subTabs {
    @apply mb-12 flex flex-col gap-7;

    &-item {
      @apply font-550 text-navy-6 leading-base w-fit cursor-pointer text-[28px];
    }
  }

  &__title {
    @apply font-550 leading-base text-[96px];
  }

  &__description {
    @apply transition-all duration-300;
  }

  &__tabs {
    @apply mt-12 flex flex-col gap-7;

    &-item {
      @apply font-550 text-navy-6 leading-base w-fit cursor-pointer text-[28px];
    }
  }
}

.step {
  @apply flex min-h-screen w-full flex-col items-center gap-5;

  &__wrap {
    @apply flex w-full max-w-[590px] flex-col justify-center px-5 py-5 md:w-[460px];
  }

  &__image {
    @apply mb-7.5 aspect-square h-full max-h-[460px] w-full max-w-[460px] object-cover;
  }

  &__subtitle {
    @apply font-325 text-gray-10 leading-base text-7 mb-2.5;
  }

  &__title {
    @apply font-550 text-gray-10 leading-base mb-5 cursor-pointer text-[42px];
    @apply md:text-wrap;
  }

  &__description {
    @apply text-gray-10 mb-5 max-w-[390px] text-base font-normal leading-6;
  }
}

.icon-menu-down {
  @apply transition-all duration-300;

  :deep(path) {
    @apply stroke-navy-6;
  }

  &.rotate {
    @apply rotate-180;
  }
}

.dot {
  list-style: none;
  @apply relative;

  &::after {
    @apply absolute -left-8 top-2.5 h-3.5 w-3.5 rounded-full bg-white content-[''];
  }

  &::before {
    height: calc(100% + 80px);
    @apply bg-navy-3 -left-8.5 absolute top-2.5 ml-2 w-[1px] content-[''];
  }

  &:last-child::before {
    @apply hidden;
  }

  &-active {
    &::after,
    &::before {
      @apply top-31.25;
    }

    &::after {
      @apply bg-navy-6 -ml-[1px] h-3.5 w-3.5;
    }

    &:not(:first-child)::before {
      @apply top-2.5;
    }

    &:last-child::before {
      @apply h-28.5 block;
    }
  }
}
</style>
