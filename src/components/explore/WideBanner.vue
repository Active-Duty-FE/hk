<template>
  <div>
    <div class="block flex flex-col items-center pt-[70px] md:hidden">
      <div class="relative mx-5 max-w-[1200px]">
        <img :src="RetreatSecondMo" alt="retreat_2_mo" class="img_retreat_mo" />
        <div class="absolute bottom-5 left-5 text-white">
          <p class="mb-4 text-base leading-[22px]">Event sub copy</p>
          <p class="font-550 mb-10 max-w-[135px] text-[40px] leading-[40px]">EVENT MAIN COPY</p>
          <div class="flex items-center gap-5">
            <span class="font-550 text-base">BUTTON NAME</span>
            <ArrowRight class="arrow_icon" />
          </div>
        </div>
      </div>
    </div>

    <div
      class="mt-[70px] flex hidden w-full flex-col items-center justify-center md:mt-[180px] md:block"
    >
      <div class="relative mx-0 hidden md:block">
        <img :src="WideBanner" alt="retreat_2" class="h-[350px] w-full" />
        <div class="bottom-25 absolute left-[20%] top-[75px] max-w-[1200px] text-white">
          <div class="w-full">
            <p class="mb-4 text-2xl font-normal uppercase leading-6">Sub Copy here</p>
            <p class="font-550 mb-10 text-[64px] leading-[68px]">
              GLOBAL RIMAN
              <br />
              SITE OPEN
            </p>
            <div class="flex items-center gap-5">
              <span class="font-550 text-xl uppercase leading-6">Go to Event</span>
              <ArrowRight class="arrow_icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import ArrowRight from '@/assets/svgs/arrow-right.svg'
import RetreatSecondMo from '@/assets/images/explores/byoung/retreat_2_mo.png'
import WideBanner from '@/assets/images/explores/events/wide_banner.png'
</script>
<style scoped>
.arrow_icon {
  @apply h-5 w-5 cursor-pointer;
  :deep(path) {
    fill: #fff;
  }
}
</style>
