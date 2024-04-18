<template>
  <div class="text-black-50">
    <div class="mb-[70px] w-full">
      <p class="font-550 md:(mb-10 text-[28px]) mb-[45px] px-5 text-xl md:px-0">SHOP PRODUCTS</p>
      <r-carousel
        :options="dataProducts"
        :breakpoints="breakpoints"
        snap-align="start"
        class="px-5 md:px-0"
      >
        <template #default="item">
          <card-best-seller :key="item.productId" :show-point="true" :data-card="item" />
        </template>

        <template #addons>
          <Pagination />
        </template>
      </r-carousel>
    </div>
  </div>
</template>
<script setup>
import { Pagination } from 'vue3-carousel'

defineProps({
  showHeading: {
    type: Boolean,
    default: true
  },
  showMore: {
    type: Boolean,
    default: true
  },
  dataProducts: {
    type: Object,
    default: () => {}
  }
})

const breakpoints = {
  992: {
    itemsToShow: 3
  },
  600: {
    itemsToShow: 2
  },
  200: {
    itemsToShow: 1.7
  }
}
</script>
<style lang="scss">
.carousel__pagination-button::after {
  --vc-pgn-width: 10px;
  --vc-pgn-height: 10px;
  --vc-pgn-border-radius: 10px;
  --vc-pgn-background-color: #e0e0e0;
}
.carousel__pagination-button--active::after {
  --vc-pgn-width: 20px;
}
</style>
