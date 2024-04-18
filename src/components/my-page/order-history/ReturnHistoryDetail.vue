<template>
  <a-divider class="bg-gray-11 !mb-[25px] !mt-0" />
  <p class="text-navy-6 font-475 mb-[10px] text-xs">Receipt of Returns</p>

  <div class="mb-[10px] mb-[15px] flex items-center justify-between gap-5">
    <img :src="ImgProduct" alt="product" class="h-25 w-25" />
    <div>
      <p class="font-550 text-sm">DERMATOLOGY FIRST PACKAGE EX</p>
      <p class="text-sm">0.68 oz.</p>
    </div>
  </div>
  <RButton
    title="View Details"
    class="!text-navy-6 !border-1 !border-navy-6 mb-5 w-full !border-solid"
  />
</template>
<script setup>
import ImgProduct from '@/assets/images/key-visual-1.webp'
</script>
