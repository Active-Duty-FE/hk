<script setup>
import CautionNotice from '@/assets/svgs/caution-notice.svg'
</script>
<template>
  <div class="flex w-full flex-col gap-3 rounded-[10px] bg-[#F6F8FD] p-5">
    <div class="item-center text-gray-10 font-550 flex gap-1 text-[14px]">
      <CautionNotice /> Caution
    </div>
    <div>
      <slot />
    </div>
  </div>
</template>
