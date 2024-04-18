<template>
  <div class="relative">
    <RCheckbox :checked="isSelected" class="product__checkbox" @change="onSelectItem" />
    <div class="relative">
      <img
        :src="addPrefixForImage(product.thumbnailUrl)"
        alt=""
        loading="lazy"
        class="product__image"
      />
      <span
        v-if="product?.salesStatus?.code === ProductSaleStatus.SOLD_OUT"
        class="product_soldOut"
      >
        OUT OF STOCK
      </span>
      <span v-if="product?.salesStatus?.code === ProductSaleStatus.PAUSE" class="product_soldOut">
        UNAVAILABLE
      </span>
    </div>

    <span class="product__title">{{ product.productEnglishName }}</span>
    <span
      v-if="product.priceOriginal !== product.salesAmount"
      class="leading-base text-lg line-through"
    >
      {{ renderCurrency(product?.currencyPrice?.code) }}{{ convertNumber(product.priceOriginal) }}
    </span>
    <div class="flex items-center gap-2">
      <span class="product__price">
        {{ renderCurrency(product?.currencyPrice?.code) }}{{ convertNumber(price) }}
      </span>
      <span>|</span>
      <span class="product__point text-truncate">
        {{ convertNumber(product.point) }}{{ getPointText }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { addPrefixForImage } from '@/utils/common'
import { computed } from 'vue'
import { getPointText } from '@/utils/product'
import { ProductSaleStatus } from '@/helpers/enum'
import { convertNumber, renderCurrency } from '@/utils/currency'

const props = defineProps({
  product: {
    type: Object,
    default: () => ({})
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['change'])

const price = computed(() => props.product.salesAmount ?? props.product.priceOriginal)

const onSelectItem = (event) => {
  const checked = event.target.checked
  emits('change', {
    product: props.product,
    checked
  })
}
</script>

<style lang="scss" scoped>
.product {
  &__checkbox {
    @apply z-1 absolute left-0 top-0 h-4;
  }

  &__image {
    @apply md:h-90 mb-5 h-40 w-full object-cover;
  }

  &_soldOut {
    @apply bg-navy-6 absolute bottom-0 left-0 w-fit rounded-[3px] px-2 py-1 text-xs font-light leading-none text-white;
  }

  &__title {
    @apply font-550 mb-2 line-clamp-2 text-lg leading-6;
  }

  &__price {
    @apply font-625 leading-base text-lg;
  }

  &__point {
    @apply font-475 leading-base text-lg;
  }
}
</style>
