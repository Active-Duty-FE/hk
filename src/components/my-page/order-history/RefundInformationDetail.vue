<template>
  <a-divider class="bg-gray-11 !mb-[25px] !mt-0" />
  <p class="text-navy-6 font-475 mb-[10px] text-xs">Order Cancelled</p>

  <div class="mb-[10px] mb-[15px] flex items-center justify-between gap-5">
    <img :src="ImgProduct" alt="product" class="h-25 w-25" />
    <div>
      <p class="font-550 text-sm">DERMATOLOGY FIRST PACKAGE EX</p>
      <p class="text-sm">0.68 oz.</p>
    </div>
  </div>
  <div class="mb-5 flex justify-between text-sm">
    <span>Reason of Cancellation</span>
    <span>Change of mind</span>
  </div>
  <div class="mb-5 flex justify-between text-sm">
    <span>Refund Method</span>
    <span class="text-xs">Credit card</span>
  </div>
  <div class="mb-5 flex justify-between text-sm">
    <span>Refund Amount</span>
    <span>$ 20</span>
  </div>
</template>
<script setup>
import ImgProduct from '@/assets/images/key-visual-1.webp'
</script>
