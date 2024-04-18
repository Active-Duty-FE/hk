<template>
  <div
    class="md:(flex-row gap-[62px]) md:my-12.5 flex flex-col items-center justify-between gap-10"
  >
    <img
      v-if="categoryInfo?.categoryTitle?.pcImageUrl"
      :src="showImageByBreakPoint(categoryInfo?.categoryTitle)"
      alt="introduce"
      class="w-full md:hidden md:max-w-[663px]"
    />
    <div class="flex w-full flex-col items-center justify-center md:items-start md:justify-start">
      <p
        class="font-600 xl:(text-12.5 leading-12.5) leading-base mb-5 px-5 text-center text-[28px] uppercase md:px-0 md:text-left"
      >
        <span class="!font-200 mb-1 block">{{ categoryInfo?.categoryTitle?.title1 }}</span>
        <span class="uppercase">{{ categoryInfo?.categoryTitle?.title2 }}</span>
      </p>
      <p
        v-if="categoryInfo?.categoryTitle?.title"
        class="font-550 xl:(text-[40px] leading-[40px]) mb-[50px] text-[28px] leading-7"
      >
        {{ categoryInfo?.categoryTitle?.title }}
      </p>
      <p
        v-if="categoryInfo?.categoryDescription"
        v-clean-html="categoryInfo?.categoryDescription"
        class="xl:(text-lg leading-6) leading-5.5 font-300 max-w-[550px] whitespace-pre-wrap px-3 text-center text-base md:w-[395px] md:px-0 lg:text-start"
      ></p>
    </div>
    <img
      v-if="categoryInfo?.categoryTitle?.pcImageUrl"
      :src="addPrefixForImage(categoryInfo?.categoryTitle?.pcImageUrl)"
      alt="introduce"
      class="hidden w-full md:block md:max-w-[663px]"
    />
  </div>
</template>
<script setup>
import { addPrefixForImage } from '@/utils/common'
import { useBreakpoints } from '@vueuse/core'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
const vCleanHtml = buildVueDompurifyHTMLDirective()

defineProps({
  categoryInfo: {
    type: Object,
    default: undefined
  },
  hasChildren: {
    type: Boolean,
    default: false
  }
})

const device = useBreakpoints({
  mobile: 991
})

const mobile = device.smaller('mobile')

const showImageByBreakPoint = (item) => {
  if (!mobile.value) return addPrefixForImage(item?.pcImageUrl)
  return addPrefixForImage(item?.mobileImageUrl)
}
</script>
