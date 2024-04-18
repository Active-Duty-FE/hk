<template>
  <div class="summaryItem">
    <div class="flex h-[100px] w-[100px] items-center justify-between">
      <img
        :src="addPrefixForImage(item?.thumbnailUrl)"
        alt=""
        class="max-w-full overflow-hidden object-cover"
      />
    </div>

    <div class="text-gray-10 flex w-[calc(100%-116px)] flex-col gap-2.5">
      <p class="text-truncate font-550 leading-base mb-2 text-sm">
        {{ item?.productNameDto?.engName || item?.name }}
      </p>
      <span
        v-if="item?.productNameDto?.optionName || item?.optionName"
        class="text-[14px] opacity-75"
      >
        Option: {{ item?.productNameDto?.optionName }}
      </span>
      <template v-if="item?.productBaseDto?.optionValues">
        <div
          v-for="option in item?.productBaseDto?.optionValues"
          :key="option.optionValue"
          class="mb-1"
        >
          <div class="flex items-center gap-2">
            {{ option.optionName }} :

            <div v-if="option.type?.code === ProductVariantEnum.IMAGE">
              <img :src="addPrefixForImage(option.optionValue)" class="w-10" alt="image_option" />
            </div>
            <div v-else>
              {{ option.optionValue }}
            </div>
          </div>
        </div>
      </template>
      <p class="mb-0 text-sm leading-none">
        <span>{{ item?.productBaseDto?.quantity || item?.quantity }}</span> PCS
      </p>
      <p class="text-truncate font-550 mb-0 text-base leading-4">
        {{ renderCurrency(item?.currency?.code) }} {{ convertPrice(item) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { convertNumber, renderCurrency } from '@/utils/currency'
import { addPrefixForImage } from '@/utils/common'
import { ProductVariantEnum } from '@/helpers/enum'

defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})

const convertPrice = (item) =>
  convertNumber(
    (item?.productBaseDto?.quantity || item?.quantity) *
      (item.purchaseAmount || item?.salesAmountDiscountAfterRank)
  )
</script>

<style lang="scss" scoped>
.summaryItem {
  @apply border-b-1 border-b-solid border-b-gray-11 flex gap-4 py-5;

  &:last-child {
    @apply border-b-gray-10;
  }
}
</style>
