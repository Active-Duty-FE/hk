<template>
  <div class="mb-[30px] flex cursor-pointer flex-col items-center justify-center sm:mb-0">
    <div class="image-wrapper h-auto w-full md:h-[300px]">
      <img
        v-if="item?.thumbnailUrl"
        :src="addPrefixForImage(item?.thumbnailUrl)"
        alt="product"
        class="h-[300px] w-full object-cover"
        @click="gotoProductDetail(item?.productId)"
      />
      <img
        v-if="item?.hoverUrl"
        :src="addPrefixForImage(item?.hoverUrl)"
        alt="product"
        class="image-hover h-[300px] w-full object-cover"
        @click="gotoProductDetail(item?.productId)"
      />
    </div>
    <div class="mt-[21px] flex w-full flex-col items-start justify-start sm:mt-[30px]">
      <p class="sm:(text-base leading-4) leading-sm mb-[15px] text-sm">
        {{ item?.mainCategory }}
      </p>
      <p
        class="font-550 sm:(text-[22px] leading-[30px]) mb-4 line-clamp-2 h-auto text-start text-lg leading-6 md:h-[60px]"
        @click="gotoProductDetail(item?.productId)"
      >
        {{ item?.productEnglishName }}
      </p>
      <ProductPrice :product-info="item" />
      <div class="mb-[15px] w-full">
        <ButtonAddCart v-slot="cartButton">
          <r-button
            title="ADD TO BAG"
            type="primary"
            class="btn-card-hover !bg-navy-1 !border-navy-1 !rounded-0 w-full disabled:!text-white"
            class-title="text-[14px] font-550 leading-base style-normal"
            @click.stop="cartButton.phaseCheck(item)"
          >
            <template #image>
              <CardIcon />
            </template>
          </r-button>
        </ButtonAddCart>
      </div>
    </div>
    <ButtonAddCart v-if="item?.autoShipYn" v-slot="cartButton">
      <div
        class="border-b-solid border-1 border-color-gray-14 flex items-center justify-center gap-1"
        @click="cartButton.phaseCheck({ ...item, isAutoShip: true })"
      >
        <AutoShip />
        <span class="font-550 text-gray-14 text-sm sm:text-base">Autoship</span>
      </div>
    </ButtonAddCart>
  </div>
</template>
<script setup>
import CardIcon from '@/assets/svgs/cart-product.svg'
import AutoShip from '@/assets/svgs/autoship.svg'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { addPrefixForImage } from '@/utils/common'

defineProps({
  item: {
    type: Object,
    default: undefined
  }
})

const router = useRouter()

const gotoProductDetail = (id) => {
  router.push({ name: AppRoutes.product.detail.name, params: { productId: id } })
}
</script>
<style lang="scss" scoped>
.card-product {
  width: calc(50vw - 27.5px);
  @apply sm:w-[300px] md:w-[360px];
}
.image-wrapper {
  position: relative;
  width: -webkit-fill-available;
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
.btn-card-hover {
  &:hover {
    :deep(path) {
      fill: #4d4e4d;
    }
    :deep(.title) {
      color: #4d4e4d !important;
    }
  }
}
</style>
