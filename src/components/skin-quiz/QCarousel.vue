<template>
  <RCarousel
    v-slot="item"
    ref="carouselRef"
    v-model:modelValue="modelValue"
    :options="options"
    wrap-around
  >
    <div class="wrap">
      <div class="pb-[10px] pt-[29px]">
        <img
          class="h-[165px] w-[165px] cursor-pointer"
          :src="
            addPrefixForImage(item?.thumbnailUrl) ?? addPrefixForImage(item?.hoverURl) ?? ImageOne
          "
          alt="image-step"
          @click="gotoProductDetail(item?.productId)"
        />
      </div>
      <div class="text-gray-10 leading-base style-normal font-550 text-[16px]">
        {{ item?.productEnglishName }}
      </div>
      <div class="pb-5">
        <span class="leading-base text-[16px]">
          <span> {{ item?.currencyPrice?.text || '$' }}{{ convertNumber(item?.price || 0) }} </span>
        </span>
        <a-divider type="vertical" class="bg-navy-3 h-[10px] w-[1px]" />
        <span v-if="!isBeautyPlanner" class="text-gray-12 font-475 text-[16px]">
          {{ convertNumber(item?.point || 0) }}P</span
        >
        <span v-if="isBeautyPlanner" class="text-gray-12 font-475 text-[16px]">
          {{ convertNumber(item?.point || 0) }}BP</span
        >
      </div>
      <ButtonAddCart v-slot="cartButton">
        <div
          class="mx-auto flex w-fit cursor-pointer items-center justify-center"
          @click="cartButton.phaseCheck(item)"
        >
          <CartIcon /> <span class="font-550 leading-base text-[14px]">ADD TO BAG</span>
        </div>
      </ButtonAddCart>
    </div>
  </RCarousel>
</template>
<script setup>
import CartIcon from '@/assets/svgs/skin-quiz/cart.svg'
import { ref, watch } from 'vue'
import ImageOne from '@assets/images/product-new/image-4.jpg'
import { addPrefixForImage } from '@/utils/common'
import { isBeautyPlanner } from '@/utils/role'
import { convertNumber } from '@/utils/currency'
import router from '@/router'
import { AppRoutes } from '@/router/path'
import { ProductSaleStatus } from '@/helpers/enum'

const emits = defineEmits(['currentItem'])
const props = defineProps({
  options: {
    type: Array,
    default: () => []
  }
})

const gotoProductDetail = (id) => {
  router.push({
    name: AppRoutes.product.detail.name,
    params: { productId: id },
    query: { from: 'skin-quiz' }
  })
}

const carouselRef = ref()

const modelValue = ref(0)

const next = () => carouselRef.value?.next()

const current = () => {
  return carouselRef.value?.currentSlide
}

watch(
  () => modelValue.value,
  (val) => {
    emits('currentItem', props.options[val].productId)
  }
)

defineExpose({ next, current })
</script>
