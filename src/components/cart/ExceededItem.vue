<template>
  <div class="flex flex-col gap-[10px] leading-none">
    <div class="font-bold">{{ info?.engName }}</div>
    <div v-for="(item, index) in info?.optionValues" :key="index">
      <div v-if="item?.type?.code === ProductVariantEnum.TEXT">Size: {{ item?.optionValue }}</div>
      <div v-else>
        Color:
        <img
          :src="addPrefixForImage(item?.optionValue)"
          class="h-10 w-10 rounded-sm object-cover"
          alt="image_option"
        />
      </div>
    </div>
    <div>Purchase Limit: {{ info?.remainingQuantity }}</div>
    <div>Next Available for Purchase: {{ info?.maxLimitPurchaseDate }}</div>
    <hr />
  </div>
</template>
<script setup>
import { ProductVariantEnum } from '@/helpers/enum'
import { addPrefixForImage } from '@/utils/common'

defineProps({
  info: {
    type: Object,
    default: () => ({})
  }
})
</script>
