<template>
  <div>
    <div
      class="mb-[15px] flex h-[65px] cursor-pointer items-center gap-[10px] md:h-[85px] md:gap-5"
    >
      <div>
        <div
          class="flex h-[65px] w-[65px] items-center justify-center rounded-full bg-white md:h-[85px] md:w-[85px]"
          :class="{ 'bg-yellow-1': isSelected }"
        >
          <img :src="itemInfo?.icon" alt="icon step" class="w-[35px] md:w-12" />
        </div>
      </div>
      <div class="text-left">
        <p
          class="font-550 mb-[10px] text-[14px] leading-none text-white md:mb-[15px] md:text-[18px]"
        >
          {{ itemInfo?.title }}
        </p>
        <p
          class="leading-base mb-0 text-[12px] font-normal leading-none text-white opacity-[0.6] md:text-[16px]"
        >
          {{ itemInfo?.content }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  itemInfo: {
    type: Object,
    default: undefined,
    require: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
})
</script>
