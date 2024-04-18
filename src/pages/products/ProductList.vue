<template>
  <div class="flex flex-col items-center justify-center">
    <div class="w-full xl:max-w-[1200px]">
      <div class="mb-[70px] md:mb-[140px]">
        <IntroduceProduct />
      </div>
      <div class="p-5 xl:p-0">
        <div class="mb-[15px] sm:mb-[50px]">
          <p class="font-550 lg:(text-[40px] leading-[55px]) text-[32px] leading-9">Shop All</p>
          <DrawerFilter @apply-filter="fakeLoadData(false)" />
        </div>
        <ListProducts
          :data-products="dataProducts"
          :can-load-more="canLoadMore"
          @load-more="loadMore()"
        />
      </div>
      <div class="sm:mb-50 mb-[70px] md:mb-10">
        <QuizItem />
      </div>
      <div class="sm:mb-50 mb-[70px] hidden md:block">
        <BlogProduct />
      </div>
      <div class="mb-[70px] md:hidden">
        <BlogMobile />
      </div>
    </div>
  </div>
</template>
<script setup>
import pool from '@/assets/images/pool-sun.png'
import poolTwo from '@/assets/images/product-pool-2.webp'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { onMounted, ref } from 'vue'
import { productLists, moreProducts } from '@/mocks/products'
import BlogMobile from '@/components/blog/BlogMobile.vue'
import BlogProduct from '@/components/home/BlogProduct.vue'

const storeLoading = useGlobalLoadingStore()

const { showGlobalLoading } = storeLoading
const dataProducts = ref([
  {
    id: 1,
    images: [pool],
    isThumbnail: true,
    category: 'Summer Deals',
    productName: 'Beat the heat with our scorching summer promotions'
  },
  ...productLists,
  {
    id: 6,
    images: [poolTwo],
    isThumbnail: true,
    category: 'Spectacular Beauty',
    productName: 'Illuminate your beauty with our shimmering cosmetics promotion'
  }
])
const canLoadMore = ref(true)

const fakeLoadData = (isLoadMore) => {
  showGlobalLoading(true)
  setTimeout(() => {
    if (isLoadMore) {
      dataProducts.value = [...dataProducts.value, ...moreProducts]
      canLoadMore.value = false
    }
    showGlobalLoading(false)
  }, 1500)
}

const loadMore = () => {
  fakeLoadData(true)
}

onMounted(() => {
  fakeLoadData(false)
})
</script>
