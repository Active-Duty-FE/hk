<template>
  <div>
    <div class="md:(h-screen items-center) flex justify-center">
      <div class="hidden w-full pl-[180px] md:block md:w-1/2">
        <p class="text-gray-10 font-550 mb-0 max-w-[558px] pb-[70px] text-[64px] leading-[72px]">
          {{ data?.categoryTitle?.title1 }} <br />
          {{ data?.categoryTitle?.title2 }}
        </p>
        <p class="text-gray-10 font-550 mb-0 pb-[25px] text-[20px] leading-normal">RIMAN RITUAL</p>
        <p class="text-gray-10 max-w-[324px] text-[18px] font-normal leading-[24px]">
          {{ data?.categoryTitle?.subtitle }}
        </p>
      </div>
      <div class="ritual-one bg-image-content h-full w-full overflow-hidden md:w-1/2">
        <video
          v-if="CONTENT_TYPE_VIDEO.includes(data?.categoryTitle?.pcImageContentType)"
          loop
          muted
          autoplay
          playsinline
        >
          <source :src="addPrefixForImage(data?.categoryTitle?.pcImageUrl)" type="video/mp4" />
          <track src="" label="" kind="captions" default />
        </video>
        <img
          v-else
          :src="addPrefixForImage(data?.categoryTitle?.pcImageUrl)"
          alt=""
          class="h-full object-cover"
        />
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
          class="style-normal text-gray-10 mx-auto w-[288px] text-[18px] font-normal leading-[24px]"
        >
          {{ data?.categoryTitle?.subtitle }}
        </p>
      </div>
    </div>
    <div class="flex w-full flex-col items-center justify-center gap-[180px] px-[180px] py-[150px]">
      <div
        v-for="(item, index1s) in data.categoryContent1s"
        :key="item.title"
        class="flex w-full items-center justify-center"
        :class="{ 'h-[780px]': item?.products.length }"
      >
        <template v-if="item?.products.length">
          <template v-if="index1s % 2 === 0">
            <div class="relative h-full w-1/2">
              <RTransition>
                <img
                  :src="addPrefixForImage(item?.pcImageUrl)"
                  alt="advanced image"
                  class="h-[780px] w-full max-w-[585px] object-cover"
                />
              </RTransition>
              <div class="absolute right-0 top-1/2 -translate-y-1/2">
                <RTransition direction="right">
                  <img
                    :src="addPrefixForImage(item?.products[0]?.thumbnailUrl)"
                    alt="advanced image"
                    class="h-[550px] w-full max-w-[435px]"
                  />
                </RTransition>
              </div>
            </div>
            <div class="w-1/2">
              <div class="ml-auto max-w-[390px]">
                <p
                  class="text-gray-10 font-550 mb-7.5 text-[45px] leading-[54px]"
                  @click="openProductDetail(item?.products[0]?.productId)"
                >
                  {{ item?.products[0]?.productEnglishName }}
                </p>

                <div>
                  <p
                    class="text-gray-10 font-300 mb-0 text-[18px] leading-[28px]"
                    @click="openProductDetail(item?.products[0]?.productId)"
                  >
                    {{ item?.products[0]?.description }}
                  </p>
                  <div class="pt-12.5 flex items-center justify-start pb-4">
                    <span class="text-base font-bold leading-normal">
                      {{ renderCurrency(item.products[0]?.currencyPrice?.code) }}
                      {{ item?.products[0]?.salesAmount }}
                    </span>
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
                      class="!bg-navy-1 !border-navy-1 !rounded-0 btn-card-hover !w-full"
                      class-title="text-[18px] font-550 text-white"
                      height="60px"
                      :disabled="disableAddCartButtonByCountry(item?.products[0]?.country)"
                      @click.stop="
                        cartButton.phaseCheck({ productId: item?.products[0]?.productId })
                      "
                    >
                      <template #image>
                        <CardIcon />
                      </template>
                    </r-button>
                  </ButtonAddCart>
                  <ButtonAddCart v-if="item?.products[0]?.autoShipYn" v-slot="cartButton">
                    <div
                      class="border-b-solid border-1 border-color-gray-14 mx-auto mt-[15px] flex w-fit max-w-[130px] items-center justify-center gap-1"
                      :disable="disableAddCartButtonByCountry(item?.products[0]?.country)"
                      @click.stop="
                        cartButton.phaseCheck({
                          productId: item?.products[0]?.productId,
                          isAutoShip: true
                        })
                      "
                    >
                      <AutoShip />
                      <span class="font-550 text-gray-14 text-[14px]">Autoship</span>
                    </div>
                  </ButtonAddCart>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="w-1/2">
              <div class="mr-auto max-w-[390px]">
                <p
                  class="text-gray-10 font-550 mb-7.5 text-[45px] leading-[54px]"
                  @click="openProductDetail(item?.products[0]?.productId)"
                >
                  {{ item?.products[0]?.productEnglishName }}
                </p>
                <div>
                  <p
                    class="text-gray-10 font-300 mb-0 max-w-[272px] text-[18px] leading-[28px]"
                    @click="openProductDetail(item?.products[0]?.productId)"
                  >
                    {{ item?.products[0]?.description }}
                  </p>
                  <div class="flex items-center justify-start py-[25px]">
                    <span class="text-base font-bold leading-normal">
                      {{ renderCurrency(item.products[0]?.currencyPrice?.code) }}
                      {{ item?.products[0]?.salesAmount }}
                    </span>
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
                      class="!bg-navy-1 !border-navy-1 !rounded-0 btn-card-hover !w-full"
                      class-title="text-[18px] font-550 text-white"
                      height="60px"
                      :class="
                        isDisableAddCartButton(item?.products[0]) ? '!cursor-not-allowed' : ''
                      "
                      :disabled="isDisableAddCartButton(item?.products[0])"
                      @click.stop="cartButton.phaseCheck(item?.products[0])"
                    >
                      <template #image>
                        <CardIcon />
                      </template>
                    </r-button>
                  </ButtonAddCart>
                  <ButtonAddCart v-if="item?.products[0]?.autoShipYn" v-slot="cartButton">
                    <div
                      class="border-b-solid border-1 border-color-gray-14 mx-auto mt-[15px] flex w-fit max-w-[130px] items-center justify-center gap-1"
                      :class="
                        isDisableAddCartButton(item?.products[0]) ? '!cursor-not-allowed' : ''
                      "
                      @click.stop="
                        cartButton.phaseCheck({ ...item?.products[0], isAutoShip: true })
                      "
                    >
                      <AutoShip />
                      <span class="font-550 text-gray-14 text-[14px]">Autoship</span>
                    </div>
                  </ButtonAddCart>
                </div>
              </div>
            </div>
            <div class="relative h-full w-1/2">
              <RTransition direction="right">
                <img
                  :src="addPrefixForImage(item?.pcImageUrl)"
                  alt="signature-1 image"
                  class="absolute bottom-0 right-0 h-[780px] max-h-[90%] w-full max-w-[527px] object-cover"
                />
              </RTransition>

              <div class="absolute top-0">
                <RTransition direction="left">
                  <img
                    :src="addPrefixForImage(item?.products[0]?.thumbnailUrl)"
                    alt="signature-2 image"
                    class="h-[550px] w-[435px]"
                  />
                </RTransition>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>

    <div class="bg-ritual-content">
      <div
        v-for="(item, index2s) in data?.categoryContent2s"
        :key="item"
        class="container m-auto"
        :class="{ 'pt-50': !index2s }"
      >
        <div class="flex">
          <div class="ritual-five bg-image-content w-1/2">
            <video
              v-if="CONTENT_TYPE_VIDEO.includes(item?.pcImageContentType)"
              loop
              muted
              autoplay
              playsinline
              class="h-[600px] max-w-[600px] object-cover"
            >
              <source :src="addPrefixForImage(item?.pcImageUrl)" type="video/mp4" />
              <track src="" label="" kind="captions" default />
            </video>
            <img
              v-else
              alt="image product ritual"
              :src="addPrefixForImage(item?.pcImageUrl)"
              class="max-h-[636px] w-full object-cover"
            />
            <p
              class="font-550 absolute bottom-[53px] left-[53px] mb-0 text-[50px] leading-[34px] text-white"
            >
              {{ item?.title }}
            </p>
          </div>
          <div class="w-1/2 pl-[110px]">
            <p class="text-gray-10 font-550 mb-[25px] text-[24px] leading-8">
              {{ item?.subtitle }}
            </p>
            <p class="text-gray-10 mb-[50px] text-[18px] font-normal leading-[28px]">
              {{ item?.content }}
            </p>
            <img
              alt="image product ritual"
              :src="addPrefixForImage(item?.pcImageUrl2)"
              class="max-h-[301px] w-[405px] object-cover"
            />
          </div>
        </div>
        <div
          :class="[
            index2s === data?.categoryContent2s?.length - 1 ? 'pb-50' : 'pb-[70px]',
            'mt-10'
          ]"
        >
          <ShopProductRituals :data-lists="item?.products" />
        </div>
        <a-divider
          v-if="index2s < data?.categoryContent2s?.length - 1"
          class="bg-gray-10 !mb-[99px] h-[1px]"
        />
      </div>
    </div>
    <div class="py-[193px]">
      <QuizItem />
    </div>
  </div>
</template>
<script setup>
import CardIcon from '@/assets/svgs/cart-white.svg'
import AutoShip from '@/assets/svgs/autoship.svg'
import RTransition from '@/components/common/RTransition.vue'
import { disableAddCartButtonByCountry } from '@/utils/role'
import { useRouter } from 'vue-router'
import { addPrefixForImage } from '@/utils/common'
import { renderCurrency } from '@/utils/currency'
import { ProductSaleStatus } from '@/helpers/enum'
import { AppRoutes } from '@/router/path'
import { CONTENT_TYPE_VIDEO } from '@/helpers/constant'

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
.bg-image-content {
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
}
.ritual-one {
  video {
    object-fit: fill;
    @apply h-full max-h-[270px] w-full object-cover;
    @apply md:absolute md:max-h-full;
  }
  @apply md:min-h-[1080px];
}

.ritual-two {
  background-image: url('@/assets/images/ritual/ritual-2.webp');
  height: 100%;
}

.ritual-three {
  background-image: url('@/assets/images/ritual/ritual-3.webp');
  height: 100%;
}

.ritual-four {
  background-image: url('@/assets/images/ritual/ritual-4.webp');
  height: 100%;
}

.ritual-six {
  background-image: url('@/assets/images/ritual/ritual-hydrate.gif');
}

.ritual-seven {
  background-image: url('@/assets/images/ritual/ritual-protect.gif');
}

.bg-ritual-content {
  background-color: rgba(224, 224, 224, 0.4);
}

@media screen and (max-width: 991px) {
  .ritual-one {
    height: 266px;
    img {
      width: 178px;
    }
  }
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
