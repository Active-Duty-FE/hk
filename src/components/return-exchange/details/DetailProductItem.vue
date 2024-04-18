<template>
  <div class="mb-2.5 flex items-center gap-[15px]">
    <img
      :src="addPrefixForImage(item?.thumbnailUrl)"
      alt=""
      class="max-w-25 max-h-25 min-w-25 min-h-25 object"
    />

    <div class="text-gray-10 gap-1.25 h-25 flex w-[calc(100%-116px)] flex-col justify-around">
      <div>
        <p class="text-wrap font-550 leading-base mb-2 text-[14px] text-sm">
          {{ item?.productName }}
        </p>
        <div class="flex items-center gap-2.5">
          <p class="mb-0 text-sm leading-none">
            <span>{{ item?.quantity }}</span> PCS
          </p>
        </div>
      </div>
      <div class="flex justify-between">
        <p class="mb-0 text-sm leading-normal">Subtotal</p>
        <p class="mb-0 text-sm leading-normal">
          {{ renderCurrency(item?.currency?.code) }} {{ item?.saleAmountAfterRank }}
        </p>
      </div>
    </div>
  </div>
  <slot name="footer" />
</template>

<script setup>
import { addPrefixForImage } from '@/utils/common'
import { renderCurrency } from '@/utils/currency'

defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})
</script>
