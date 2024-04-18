<template>
  <div class="flex cursor-pointer flex-col items-center justify-center">
    <div class="image-wrapper w-full">
      <img
        class="w-full"
        :src="addPrefixForImage(productInfo.images[0])"
        alt="product"
        @click="gotoProductDetail(productInfo.id)"
      />
      <img
        :src="addPrefixForImage(productInfo.images[4])"
        alt="product"
        class="image-hover w-full"
        @click="gotoProductDetail(productInfo.id)"
      />
    </div>
    <div class="mt-[21px] flex w-full flex-col items-start justify-start sm:mt-[30px]">
      <p class="leading-base text-gray-10 mb-[15px] text-[14px] font-normal">
        {{ productInfo.category }}
      </p>
      <p
        class="font-550 text-gray-10 mb-3 line-clamp-2 h-auto text-start text-[18px] leading-6 md:h-[50px]"
        @click="gotoProductDetail(productInfo.id)"
      >
        {{ productInfo.productName }}
      </p>
      <ProductPrice :product-info="productInfo" />
      <div class="mb-[15px] w-full">
        <ButtonAddCart v-slot="cartButton">
          <r-button
            type="primary"
            class="!bg-navy-1 !border-navy-1 !rounded-0 !w-full"
            class-title="sm:text-lg text-base font-550"
            :disabled="disableAddCartButtonByCountry(productInfo?.country)"
            @click="cartButton.addCart(itemAddCart)"
          >
            <template #content>
              <div class="flex items-center justify-center">
                <CardIcon /> <span class="text-[14px font-550] mt-1 pl-[5px]">ADD TO BAG</span>
              </div>
            </template>
          </r-button>
        </ButtonAddCart>
      </div>
    </div>
    <div
      class="border-b-solid border-1 border-color-gray-14 flex items-center justify-center gap-1"
      :class="disableAddCartButtonByCountry(productInfo?.country) ? 'cursor-not-allowed' : ''"
    >
      <AutoShip />
      <span class="font-550 text-gray-14 text-sm sm:text-base">Autoship + 5P</span>
    </div>
  </div>
</template>
<script setup>
import CardIcon from '@/assets/svgs/small-cart.svg'
import AutoShip from '@/assets/svgs/autoship.svg'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { addPrefixForImage } from '@/utils/common'
import ProductPrice from './ProductPrice.vue'
import { disableAddCartButtonByCountry } from '@/utils/role'

const props = defineProps({
  productInfo: {
    type: Object,
    default: undefined
  }
})

const itemAddCart = {
  productInfo: props.productInfo,
  country: undefined,
  quantity: 1,
  productOptionId: undefined,
  isAutoShip: false
}

const router = useRouter()

const gotoProductDetail = (id) => {
  router.push({ name: AppRoutes.product.detail.name, params: { productId: id } })
}
</script>
<style scoped lang="scss">
.image-wrapper {
  position: relative;
}
.image-hover {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.6s ease-out;
}
.image-hover:hover {
  opacity: 1;
}
</style>
