<template>
  <div>
    <div class>
      <div class="hidden w-full pl-[180px] md:block md:w-1/2">
        <p class="text-gray-10 font-550 max-w-[433px] pb-[70px] text-[64px] leading-[72px]">
          {{ data?.categoryTitle?.title1 }} <br />
          {{ data?.categoryTitle?.title2 }}
        </p>
        <p class="text-gray-10 font-550 pb-[25px] text-[20px] leading-normal">RIMAN RITUAL</p>
        <p class="text-gray-10 max-w-[324px] text-[18px] font-normal leading-[24px]">
          {{ data?.categoryTitle?.subtitle }}
        </p>
      </div>
      <div class="ritual-one w-full md:w-1/2">
        <video
          v-if="CONTENT_TYPE_VIDEO.includes(data?.categoryTitle?.mobileImageContentType)"
          name="media"
          autoplay
          loop
          muted
          playsinline
        >
          <source
            :src="addPrefixForImage(data?.categoryTitle?.mobileImageUrl)"
            type="video/mp4"
            loop
          />
          <track src="" label="" kind="captions" default />
        </video>
        <img v-else :src="addPrefixForImage(data?.categoryTitle?.mobileImageUrl)" alt="img" />
      </div>
      <div class="block w-full text-center md:hidden">
        <p
          class="text-gray-10 font-550 mx-auto mb-0 w-[200px] pb-[38px] pt-[70px] text-[28px] leading-normal"
        >
          {{ data?.categoryTitle?.title1 }} <br />
          {{ data?.categoryTitle?.title2 }}
        </p>
        <p class="text-gray-10 font-550 mb-0 pb-[20px] text-[16px] leading-normal">RIMAN RITUAL</p>
        <p
          class="style-normal text-gray-10 mx-auto w-[288px] text-[16px] font-normal leading-[22px]"
        >
          {{ data?.categoryTitle?.subtitle }}
        </p>
      </div>
    </div>
    <div class="mb-10">
      <div v-for="(item, index) in data?.categoryContent1s" :key="index" class="px-5">
        <template v-if="item.products?.length">
          <div class="pt-[60px]">
            <img
              alt="image product ritual"
              class="w-full"
              :src="addPrefixForImage(item?.products[0]?.thumbnailUrl)"
            />
          </div>
          <p
            class="text-gray-10 font-550 w-[210px] pt-[40px] text-[28px] leading-normal"
            @click="openProductDetail(item?.products[0]?.productId)"
          >
            {{ item?.products[0]?.productEnglishName }}
          </p>
          <div class="">
            <div>
              <p
                class="text-gray-10 text-[16px] font-normal leading-[22px]"
                @click="openProductDetail(item?.products[0]?.productId)"
              >
                {{ item?.products[0]?.description }}
              </p>
              <div class="flex items-center justify-start py-[25px]">
                <span class="text-base font-bold leading-normal">
                  {{ renderCurrency(item.products[0]?.currencyPrice?.code) }}
                  {{ item?.products[0]?.salesAmount }}</span
                >
                <div class="bg-navy-3 mx-2 h-[15px] w-[1px]" />
                <span class="font-475 text-base leading-normal">
                  {{ item?.products[0]?.point }} {{ item?.products[0]?.currencyPoint?.text }}
                </span>
              </div>
            </div>
            <div>
              <ButtonAddCart v-slot="cartButton">
                <r-button
                  title="ADD TO BAG"
                  type="primary"
                  class="!bg-navy-1 btn-card-hover !border-navy-1 !rounded-0 !w-full"
                  class-title="text-[18px] font-550 text-white"
                  height="60px"
                  :class="isDisableAddCartButton(item?.products[0]) ? '!cursor-not-allowed' : ''"
                  :disabled="isDisableAddCartButton(item?.products[0])"
                  @click.stop="cartButton.phaseCheck(item?.products[0])"
                >
                  <template #image>
                    <CardIcon />
                  </template>
                </r-button>
              </ButtonAddCart>
              <ButtonAddCart v-slot="cartButton">
                <div
                  class="border-b-solid border-1 border-color-gray-14 mx-auto mt-[15px] flex w-fit max-w-[130px] items-center justify-center gap-1"
                  :class="isDisableAddCartButton(item?.products[0]) ? '!cursor-not-allowed' : ''"
                  @click.stop="cartButton.phaseCheck({ ...item?.products[0], isAutoShip: true })"
                >
                  <AutoShip />
                  <span class="font-550 text-gray-14 text-[14px]">Autoship</span>
                </div>
              </ButtonAddCart>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div>
      <div class="bg-ritual-content px-5 pb-5">
        <div v-for="item in data?.categoryContent2s" :key="item?.title" class="pt-[70px]">
          <div>
            <div class="relative w-full">
              <video
                v-if="CONTENT_TYPE_VIDEO.includes(item?.mobileImageContentType)"
                loop
                muted
                autoplay
                playsinline
                class="w-full"
              >
                <source :src="addPrefixForImage(item?.mobileImageUrl)" type="video/mp4" />
                <track src="" label="" kind="captions" default />
              </video>
              <img
                v-else
                alt="image product ritual"
                class="w-full"
                :src="addPrefixForImage(item?.mobileImageUrl)"
              />
              <p
                class="font-550 absolute bottom-[20px] left-[20px] mb-0 text-[40px] leading-[34px] text-white"
              >
                {{ item?.title }}
              </p>
            </div>
            <div>
              <p class="text-gray-10 font-550 mb-[25px] mt-[40px] text-[20px] leading-[26px]">
                {{ item?.subtitle }}
              </p>
              <p class="text-gray-10 mb-[50px] text-[18px] font-normal leading-[28px]">
                {{ item?.content }}
              </p>
            </div>
          </div>
          <div>
            <ShopProductRituals :data-lists="item?.products" />
          </div>
        </div>
      </div>
      <div class="py-[70px]">
        <QuizItem />
      </div>
    </div>
  </div>
</template>
<script setup>
import CardIcon from '@/assets/svgs/cart-white.svg'
import AutoShip from '@/assets/svgs/autoship.svg'
import { CONTENT_TYPE_VIDEO } from '@/helpers/constant'
import { useRouter } from 'vue-router'
import { addPrefixForImage } from '@/utils/common'
import { ProductSaleStatus } from '@/helpers/enum'
import { renderCurrency } from '@/utils/currency'
import { AppRoutes } from '@/router/path'

defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})

const router = useRouter()

const isDisableAddCartButton = (item) => {
  return item?.salesStatus?.code !== ProductSaleStatus.ON_SALE
}

const openProductDetail = (productId) => {
  router.push({
    name: AppRoutes.product.detail.name,
    params: {
      productId
    }
  })
}
</script>
<style lang="scss" scoped>
.bg-ritual-content {
  background-color: rgba(224, 224, 224, 0.4);
}

@media screen and (max-width: 991px) {
  .ritual-one {
    video {
      object-fit: fill;
      @apply max-h-[266px] w-full object-cover;
    }
    @apply md:min-h-[266px];
  }
}
.btn-card-hover {
  &:hover {
    :deep(span) {
      color: #4d4d4d !important;
    }
    :deep(path) {
      fill: #4d4e4d;
    }
    :deep(.title) {
      color: #4d4e4d !important;
    }
  }
}
</style>
