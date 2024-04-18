<template>
  <div class="md:(w-full h-full) xs:(w-[150px] h-[300px]) mr-2" @click="showImageProduct">
    <div class="image-wrapper xs:(text-[12px] h-[150px]) md:h-[300px]">
      <img
        :src="addPrefixForImage(dataCard?.thumbnailUrl)"
        alt="product-img"
        class="mb-6 aspect-square w-full cursor-pointer object-cover"
      />
      <img
        v-if="addPrefixForImage(dataCard?.hoverUrl)"
        :src="addPrefixForImage(dataCard?.hoverUrl)"
        alt="product-img"
        class="image-hover xs:mb-1 mb-6 aspect-square w-full cursor-pointer object-cover"
      />
    </div>
    <p class="xs:mb-1 cursor-pointer text-start text-[14px] sm:mb-1 sm:text-base">
      {{ dataCard?.mainCategory }}
    </p>
    <p
      class="font-550 xs:mb-1 xs:text-sm h-auto cursor-pointer break-words text-start leading-[30px] sm:mb-0 md:pr-4 md:text-lg"
    >
      {{ dataCard?.productEnglishName }}
    </p>
    <ProductPrice
      :product-info="dataCard"
      :show-point="showPoint"
      class-price="xs:(text-[16px] mb-0)"
      class-point="xs:(text-[13px])"
    />
    <div class="mx-0.25 mt-8">
      <ButtonAddCart v-slot="cartButton">
        <r-button
          title="ADD TO BAG"
          class="!bg-navy-1 !border-navy-1 !rounded-0 !w-full"
          class-title="sm:text-sm text-base font-550 text-white xs:text-[12px]"
          @click.stop="cartButton.phaseCheck(dataCard)"
        >
        </r-button>
      </ButtonAddCart>
    </div>
  </div>
  <ImageProductPopup v-model="isShowPopUp" :image="dataCard?.thumbnailUrl"> </ImageProductPopup>
</template>
<script setup>
import { addPrefixForImage, addPrefixForImageNew } from '@/utils/common'
import ProductPrice from '@components/product/ProductPrice.vue'
import { useRouter } from 'vue-router'
import ImageProductPopup from '../home/ImageProductPopup.vue'
import { ref } from 'vue'

const router = useRouter()
const isShowPopUp = ref(false)
defineProps({
  dataCard: {
    type: Object,
    default: () => ({})
  },
  showPoint: {
    type: Boolean,
    default: true
  }
})

const showImageProduct = () => {
  isShowPopUp.value = true
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
