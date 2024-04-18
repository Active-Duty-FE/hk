<template>
  <div class="sm:!max-w-[300px]" @click="gotoProductDetail(dataCard.productId)">
    <div class="image-wrapper">
      <img
        :src="addPrefixForImage(dataCard?.thumbnailUrl)"
        alt="product-img"
        class="mb-6 aspect-square w-full cursor-pointer object-cover"
      />
      <img
        v-if="addPrefixForImage(dataCard?.hoverUrl)"
        :src="addPrefixForImage(dataCard?.hoverUrl)"
        alt="product-img"
        class="image-hover mb-6 aspect-square w-full cursor-pointer object-cover"
      />
    </div>
    <div :class="classProp">
      <p class="mb-3.5 cursor-pointer text-start text-[14px] sm:text-base">
        {{ dataCard?.mainCategory }}
      </p>
      <p
        class="font-550 mb-3.75 h-auto cursor-pointer break-words text-start text-lg leading-[30px] sm:mb-5 sm:text-[22px] md:pr-4"
      >
        {{ dataCard?.productEnglishName }}
      </p>
      <ProductPrice :product-info="dataCard" :show-point="showPoint" />
      <div class="mx-0.25 mt-8">
        <ButtonAddCart v-slot="cartButton">
          <r-button
            title="ADD TO BAG"
            class="!hover:text-[#000000] !rounded-0 text-4 btn-best-seller disabled:(!bg-white !text-[#000000]) !border-none !p-0 !shadow-none"
            height="20px"
            class-title="text-[14px] !px-0 font-550 leading-base style-normal"
            @click.stop="cartButton.phaseCheck(dataCard)"
          >
          </r-button>
        </ButtonAddCart>
      </div>
    </div>
  </div>
</template>
<script setup>
import { AppRoutes } from '@/router/path'
import { addPrefixForImage, addPrefixForImageNew } from '@/utils/common'
import ProductPrice from '@components/product/ProductPrice.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

defineProps({
  dataCard: {
    type: Object,
    default: () => ({})
  },
  showPoint: {
    type: Boolean,
    default: true
  },
  classProp: {
    type: String,
    default: ''
  }
})

const gotoProductDetail = (id) => {
  router.push({ name: AppRoutes.product.detail.name, params: { productId: id } })
}
</script>
<style lang="scss" scoped>
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

:deep(.btn-best-seller) {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 1px;
    left: 0;
    background-color: #04263f;
    transform: scaleX(0);
    transition: transform 250ms ease-in-out;
    z-index: 2;
  }
  &:hover:after {
    transform: scaleX(1);
  }
}
</style>
