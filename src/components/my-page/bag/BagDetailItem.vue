<template>
  <div class="bag">
    <img :src="addPrefixForImage(item.thumbnailUrl)" alt="" class="bag__image" />
    <div class="bag__content">
      <span v-if="statusBag" class="bag__status">{{ statusBag }}</span>

      <span class="bag__title">{{ item.englishName }}</span>

      <span
        v-if="item.optionCode"
        class="leading-base whitespace-pre-line text-sm -tracking-[0.28px]"
      >
        {{ item.optionCode }}
      </span>

      <div class="bag__quantity">
        <span class="font-550 tracking-normal">{{ item.productQuantity }}</span> PCS
      </div>

      <div class="flex items-center gap-2 text-base leading-[22px]">
        <span v-if="item?.salesAmount !== item?.purchaseAmount" class="line-through">
          {{ renderCurrency(item?.currencyPrice) }}{{ convertNumber(item?.salesAmount) }}
        </span>
        <span class="font-625">
          {{ renderCurrency(item?.currencyPrice) }} {{ convertNumber(item.purchaseAmount) }}
        </span>
        <span class="text-gray-14">|</span>
        <span class="font-475 text-truncate">
          {{ convertNumber(item?.bp ?? item?.point) || 0 }} {{ getPointText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { PRODUCT_STATUS } from '@/helpers/enum'
import { addPrefixForImage } from '@/utils/common'
import { convertNumber, renderCurrency } from '@/utils/currency'
import { getPointText } from '@/utils/product'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})

const statusBag = computed(() => PRODUCT_STATUS[props.item.salesStatus?.code])
</script>

<style lang="scss" scoped>
.bag {
  @apply flex w-full items-center gap-3;

  &__status {
    @apply bg-navy-6 w-fit rounded-[3px] p-1 text-xs font-light leading-none text-white;
  }

  &__content {
    @apply flex w-full max-w-[calc(100%-120px)] flex-col gap-2;
  }

  &__image {
    @apply w-25 aspect-square object-cover;
  }

  &__title {
    @apply text-truncate leading-base font-550 text-sm;
  }

  &__quantity {
    @apply leading-base text-sm -tracking-[0.28px];
  }
}
</style>
