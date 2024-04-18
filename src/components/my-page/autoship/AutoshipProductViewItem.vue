<template>
  <div class="product__wrap">
    <img :src="addPrefixForImage(product?.thumbnailUrl)" alt="" class="product__image" />
    <div class="grid flex-1 gap-1 md:gap-2">
      <span
        v-if="
          product?.salesStatus?.code &&
            [ProductSaleStatus.SOLD_OUT, ProductSaleStatus.PAUSE].includes(product?.salesStatus?.code)
        "
        class="bg-navy-1 inline w-fit rounded-sm px-1 text-[12px] uppercase text-white"
      >
        {{ ProductSaleStatusText[product?.salesStatus?.code] }}
      </span>
      <span class="text-truncate">{{ product?.englishName }}</span>
      <span v-if="product?.productOptionName" class="product__optionName">{{
        product?.productOptionName
      }}</span>
      <span v-if="product?.optionCode" class="product__option">{{ product?.optionCode }}</span>
      <div class="product__info">
        <span>Quantity</span>
        <span>{{ product?.quantity }}</span>
      </div>
      <div class="product__info">
        <span>Subtotal</span>
        <span>
          {{ renderCurrency(product?.currency?.code) }}
          {{ convertNumber(product?.salesAmountDiscountAfterRank) }}
        </span>
      </div>
      <div class="product__info">
        <span>Total</span>
        <span>{{ renderCurrency(product?.currency?.code) }} {{ convertNumber(total) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { addPrefixForImage } from '@/utils/common'
import { ProductSaleStatus, ProductSaleStatusText } from '@/helpers/enum'
import { convertNumber, renderCurrency } from '@/utils/currency'

const props = defineProps({
  product: {
    type: Object,
    default: () => ({})
  }
})

const total = computed(() => {
  const { quantity = 1, salesAmountDiscountAfterRank = 0 } = props.product || {}

  return +quantity * +salesAmountDiscountAfterRank
})
</script>

<style lang="scss" scoped>
.product {
  &__wrap {
    @apply border-b-solid border-b-1 border-b-gray-11 flex items-center gap-4 py-10;
  }

  &__image {
    @apply md:h-30 md:w-30 h-20 w-20 object-cover;
  }

  &__info {
    @apply flex items-center justify-between;
  }

  &__optionName {
    @apply text-truncate text-[14px] opacity-75;
  }

  &__option {
    @apply leading-base whitespace-pre-line text-sm -tracking-[0.28px];
  }
}
</style>
