<template>
  <div
    class="coupon-item md:border-1 block gap-0 border-none md:flex md:gap-4 md:border-solid md:border-gray-200"
    :class="{ disabled }"
  >
    <div
      class="border-r-none md:border-r-1 md:border-r-solid relative max-h-[240px] w-full items-center justify-between py-5 md:max-h-[300px] md:w-1/3 md:border-r-gray-200 md:py-10"
      :class="couponInfo?.class"
    >
      <div class="relative block h-full w-full px-0 md:px-5">
        <img
          alt="image coupon"
          class="mx-0 max-h-[240px] w-full max-w-full bg-gray-50 object-cover md:max-h-full"
          :src="couponInfo.imageUrl"
        />
        <p class="rounded-9999 absolute -top-3 right-2 bg-red-600 px-2 py-3 text-[10px] text-white">
          {{ couponInfo.couponStatus }}
        </p>
      </div>
    </div>
    <div class="w-full justify-center px-0 py-5 md:w-2/3 md:px-5">
      <div class="flex flex-col justify-center">
        <div class="font-550 leading-base style-normal text-gray-10 pb-2 pt-5 text-[18px]">
          {{ couponInfo.couponName }}
        </div>
        <div class="style-normal leading-base text-[12px] font-normal">
          {{ couponInfo.publishDate }} ~
          {{ couponInfo.expiredDate.includes('9999') ? 'No expiration' : couponInfo.expiredDate }}
        </div>
        <div>
          <a-divider class="bg-gray-11 !my-[15px]" />
        </div>
        <div>
          <span v-for="description in couponInfo.description" :key="description" class="block">
            <DotIcon />
            <span class="text-gray-14 pl-[7px] text-[14px] font-normal -tracking-[0.28px]">
              {{ description }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import DotIcon from '@/assets/svgs/my-page/dot.svg'

defineProps({
  couponInfo: {
    type: Object,
    default: () => ({})
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>
<style lang="scss" scoped>
.coupon-item.disabled {
  opacity: 0.3;
}
</style>
