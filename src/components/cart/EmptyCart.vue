<template>
  <div class="cart-list-empty container mx-auto items-center">
    <div class="mx-auto bg-white">
      <div class="mt-[40px] text-center">
        <p class="font-550 mb-[15px] text-[14px]">Your shopping bag is currently empty.</p>
        <p class="mx-auto max-w-[300px] text-[14px] font-normal -tracking-[0.28px]">
          Explore our categories below to find the RIMAN product perfect for you! Browse through our
          categories for inspiration
        </p>
      </div>
      <div class="text-center">
        <div class="mx-auto max-w-[324px]">
          <div class="grid grid-cols-2">
            <div
              v-for="category in cartCategories"
              :key="category.name"
              class="cursor-pointer px-3 pb-8"
              @click="gotoProductByCate(category.path)"
            >
              <img alt="image category" class="h-[150px] w-full" :src="category.image" />
              <p class="text-gray-10 font-475 mb-0 mt-[10px] text-[14px]">
                {{ category.title }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { cartCategories } from '@/mocks/cart'
import { AppRoutes } from '@/router/path'
import { useRouter } from 'vue-router'

const router = useRouter()
const gotoProductByCate = (path) => {
  router.push({
    name: AppRoutes.product.productCategory.name,
    params: { category: path }
  })
}
</script>
<style lang="scss" scoped>
@media (max-width: 767px) {
  .cart-list-empty {
    margin: 0 !important;
    @apply px-5 lg:px-0;
  }

  .container {
    @apply max-w-3xl;
  }
}
</style>
