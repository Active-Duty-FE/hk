<template>
  <div
    class="product-price xs:h-[30px] h-[60px]"
    :class="productInfo?.priceOriginal === productInfo?.salesAmount ? 'flex items-center' : ''"
  >
    <div class="text-start text-lg line-through sm:text-[22px] lg:text-[17px]">
      <span v-if="productInfo?.priceOriginal !== productInfo?.salesAmount">{{
        `${productInfo?.currencyPrice?.text}${convertNumber(productInfo?.priceOriginal) || 0}`
      }}</span>
    </div>
    <div
      :class="classPrice"
      class="mb-3.75 flex items-center justify-start gap-[10px] text-lg sm:mb-5 sm:text-[22px] lg:text-[17px]"
    >
      <span class="font-625">{{
        `${productInfo?.currencyPrice?.text || ''}${convertNumber(productInfo?.salesAmount) || 0}`
      }}</span>
      <div v-if="showPoint" class="bg-navy-3 h-[15px] w-[1px]" />
      <span v-if="showPoint" class="font-475 bg-navy text-base md:text-sm" :class="classPoint">
        {{ convertNumber(productInfo?.point) || 0 }}
        <span>{{ generateCurrencyPointUnit(productInfo?.currencyPoint) }}</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { convertNumber, generateCurrencyPointUnit } from '@/utils/currency'
defineProps({
  productInfo: {
    type: Object,
    default: () => {}
  },
  showPoint: {
    type: Boolean,
    default: true
  },
  classPrice: {
    type: String,
    default: ''
  },
  classPoint: {
    type: String,
    default: ''
  }
})
</script>
