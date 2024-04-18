<template>
  <div class="px-5 py-[30px] lg:px-0">
    <div class="list-result grid grid-cols-2 gap-[15px] gap-y-[30px] md:grid-cols-4">
      <div v-for="product in products" :key="product.productId">
        <SearchItem :item="product" />
      </div>
    </div>
  </div>
</template>
<script setup>
defineProps({
  products: {
    type: Array,
    default: () => []
  }
})
</script>
