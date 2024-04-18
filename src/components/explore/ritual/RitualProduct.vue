<template>
  <div
    class="mt-22.5 md:mt-45 md:mb-50 no-scrollbar mb-[70px] flex gap-4 overflow-hidden overflow-y-auto px-5 md:mx-auto md:w-[1200px]"
  >
    <div
      v-for="item in listRitualProduct"
      :key="item.id"
      class="ritualProduct !md:w-[385px] !md:min-w-[385px] w-[195px]"
    >
      <img
        class="ritualProduct__image"
        :src="addPrefixForImage(item?.product?.thumbnailUrl)"
        alt=""
      />
      <div class="cursor-pointer" @click="goToProductDetail(item?.product?.productId)">
        <p class="ritualProduct__title">{{ item?.product?.productEngName }}</p>
        <p v-if="item?.product?.description" class="ritualProduct__description">
          <span v-clean-html="item.product.description" />
        </p>

        <div class="leading-base font-lg mb-6 flex items-center">
          <p class="ritualProduct__price">
            {{ renderCurrency(item?.product?.currencyPrice?.code) }}
            {{ item?.product?.salesAmount }}
          </p>
          <a-divider type="vertical" class="!bg-navy-3 !top-0 !h-2.5" />
          <p class="ritualProduct__point">{{ item?.product?.point }} {{ getPointText }}</p>
        </div>
      </div>
      <ButtonAddCart v-slot="cartButton">
        <div
          class="flex w-fit cursor-pointer items-center"
          @click.stop="cartButton.phaseCheck(item?.product)"
        >
          <CartButton />
          <span class="font-550 leading-base text-sm">ADD TO BAG</span>
        </div>
      </ButtonAddCart>
    </div>
  </div>
</template>

<script setup>
import CartButton from '@/assets/svgs/cart-home.svg'
import { AppRoutes } from '@/router/path'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { ProductRitualExploreEnum, ProductSaleStatus } from '@/helpers/enum'
import { addPrefixForImage } from '@/utils/common'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { renderCurrency } from '@/utils/currency'
import { getPointText } from '@/utils/product'

const router = useRouter()

const props = defineProps({
  listProducts: {
    type: Array,
    default: () => []
  }
})
const vCleanHtml = buildVueDompurifyHTMLDirective()

const listRitualProduct = computed(() => {
  return props.listProducts.filter((e) => e.type === ProductRitualExploreEnum.SET)
})

const isDisableAddCartButton = (item) => {
  return item?.salesStatus?.code !== ProductSaleStatus.ON_SALE
}

const goToProductDetail = (id) => {
  router.push({ name: AppRoutes.product.detail.name, params: { productId: id } })
}
</script>

<style lang="scss" scoped>
.ritualProduct {
  @apply min-w-[195px];

  &__image {
    @apply mb-6 aspect-square w-full;
  }

  &__category {
    @apply leading-base mb-4 text-sm font-normal -tracking-[0.28px];
  }

  &__title {
    @apply font-550 line-clamp-2 text-lg leading-6;
  }

  &__description {
    @apply leading-base mb-7 line-clamp-5 text-sm font-normal -tracking-[0.28px];
  }

  &__price {
    @apply mb-0 font-bold;
  }

  &__point {
    @apply font-475 mb-0;
  }
}
</style>
