<template>
  <div class="mb-[15px] flex justify-end gap-[5px] md:hidden">
    <div @click="changeStatusGrid(GRID_VALUE.ONE)">
      <GridOneIcon v-if="statusGrid !== GRID_VALUE.ONE" />
      <GridOneBlackIcon v-else />
    </div>
    <div @click="changeStatusGrid(GRID_VALUE.FOUR)">
      <GridFourWhiteIcon v-if="statusGrid !== GRID_VALUE.FOUR" />
      <GridFourIcon v-else />
    </div>
  </div>
  <div class="text-black-50 mb-[70px] flex flex-wrap gap-[15px] sm:gap-[60px]">
    <div
      v-for="(item, index) in dataProducts"
      :key="index"
      class="lg:w-[360px]"
      :class="
        statusGrid === GRID_VALUE.ONE
          ? 'full-width-mobile'
          : `${item?.isThumbnail ? 'auto-width-mobile w-full' : 'auto-width-mobile'}`
      "
    >
      <div
        v-if="item?.isThumbnail"
        class="relative"
        :class="statusGrid === GRID_VALUE.ONE ? 'full-width-mobile' : 'w-full max-w-full'"
      >
        <img :src="item?.pcImageUrl" alt="pool" class="w-full sm:w-[300px] lg:w-[360px]" />
        <div class="sm:(left-10) absolute bottom-10 left-[25px] text-white">
          <p
            class="font-550 sm:(text-[32px] leading-[32px]) mx-auto mb-4 line-clamp-2 max-w-[280px] text-[28px] leading-[28px]"
          >
            {{ item?.title }}
          </p>
          <p class="mx-auto line-clamp-3 max-w-[280px] text-base leading-[24px] sm:text-lg">
            {{ item?.subtitle }}
          </p>
        </div>
      </div>
      <div
        v-else
        class="mb-[30px] flex cursor-pointer flex-col items-center justify-center sm:mb-0"
        :class="cssForGrid"
      >
        <div class="image-wrapper h-auto w-full md:h-[360px]">
          <img
            v-if="item?.thumbnailUrl"
            :src="addPrefixForImage(item?.thumbnailUrl)"
            alt="product"
            :class="cssForGrid"
            class="max-h-[360px] w-full object-cover"
            @click="gotoProductDetail(item?.productId)"
          />
          <img
            v-if="item?.hoverUrl"
            :src="addPrefixForImage(item?.hoverUrl)"
            alt="product"
            class="image-hover max-h-[360px] w-full object-cover"
            :class="cssForGrid"
            @click="gotoProductDetail(item?.productId)"
          />
        </div>
        <div class="mt-[21px] flex w-full flex-col items-start justify-start sm:mt-[30px]">
          <p class="sm:(text-base leading-4) leading-sm mb-[15px] text-sm">
            {{ item?.mainCategory }}
          </p>
          <p
            class="font-550 sm:(text-[22px] leading-[30px]) mb-4 h-auto text-start text-lg leading-6"
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
                class="btn-add-bag !bg-navy-1 !border-navy-1 !rounded-0 hover:!text-navy-1 w-full"
                class-title="text-[14px] font-550 leading-base style-normal"
                :class="cssForGridBtn"
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
    </div>
  </div>
  <div v-if="canLoadMore" class="sm:mb-50 mb-[70px] flex items-center justify-center">
    <r-button
      title="MORE"
      class="!rounded-0 !border-color-black-50 btn-more hover:(!bg-navy-6 !text-white) w-full max-w-[390px]"
      class-title="text-lg pt-1"
      @click="loadMore"
    >
      <template #image>
        <AddIcon />
      </template>
    </r-button>
  </div>
  <RModalConfirm
    v-model:visible="showModalLogin"
    :description="AUTH_REQUIRED.notAuth"
    text-ok="Login"
    text-cancel="Later"
    :width="270"
    :mask-closable="false"
    @ok="onClickLogin()"
    @cancel="showModalLogin = false"
  />
</template>
<script setup>
import CardIcon from '@/assets/icons/CartIcon.vue'
import AddIcon from '@/assets/svgs/add.svg'
import AutoShip from '@/assets/svgs/autoship.svg'
import GridFourWhiteIcon from '@/assets/svgs/grid-four-white.svg'
import GridFourIcon from '@/assets/svgs/grid-four.svg'
import GridOneBlackIcon from '@/assets/svgs/grid-one-black.svg'
import GridOneIcon from '@/assets/svgs/grid-one.svg'
import { GRID_VALUE } from '@/helpers/constant'
import { AppRoutes } from '@/router/path'
import { addPrefixForImage } from '@/utils/common'
import { AUTH_REQUIRED } from '@/helpers/validate-message'
import { disableAddCartButtonByCountry } from '@/utils/role'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import ProductPrice from './ProductPrice.vue'

defineProps({
  dataProducts: {
    type: Array,
    default: () => []
  },
  canLoadMore: {
    type: Boolean,
    default: true
  }
})
const showModalLogin = ref(false)
const emitEvents = defineEmits(['loadMore'])
const router = useRouter()

const gotoProductDetail = (id) => {
  router.push({ name: AppRoutes.product.detail.name, params: { productId: id } })
}

const statusGrid = ref(GRID_VALUE.ONE)

const cssForGrid = computed(() => {
  return statusGrid.value === GRID_VALUE.FOUR ? 'card-product ' : 'w-full max-w-full'
})
const cssForGridBtn = computed(() => {
  return statusGrid.value === GRID_VALUE.FOUR ? 'card-product ' : 'w-[335px]'
})

const changeStatusGrid = (status) => {
  statusGrid.value = status
}

const loadMore = () => {
  emitEvents('loadMore')
}

const onClickLogin = () => {
  router.push({ name: AppRoutes.login.name, query: { redirect: '/carts/list?tab=1' } })
}
</script>
<style scoped lang="scss">
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
.btn-add-bag {
  &:disabled {
    color: #ffffff;
  }
}

.btn-more {
  svg {
    opacity: 0;
    transform: translateX(-5px);
    transition: all 0.3s ease;
    :deep(g) {
      fill: #123250 !important;
    }
  }
  &:hover {
    color: #123450;
    svg {
      opacity: 1;
      transform: translateX(0);
      :deep(g) {
        fill: #ffffff !important;
      }
    }
  }
}

@media only screen and (max-width: 991px) {
  .full-width-mobile {
    min-width: 100%;
  }

  .auto-width-mobile {
    min-width: auto;
  }
}
</style>
