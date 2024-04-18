<template>
  <div>
    <p
      class="text-gray-10 font-550 mb-[25px] ml-[-15px] pt-[40px] text-[40px] leading-[45px] md:ml-0 md:pt-0"
    >
      {{ productDetail?.productEnglishName || '' }}
    </p>
    <div class="mb-2 !block">
      <span class="text-navy-6 font-475 inline-flex items-center gap-1 text-[18px]">
        <RRate :value="productDetail?.star" class="!text-navy-6" disabled />
        <span class="mt-1">({{ productDetail?.totalReviews || 0 }})</span>
      </span>
      <span
        class="text-gray-10 font-550 inline-block cursor-pointer pl-5 text-[18px] underline"
        @click="gotoReview"
      >
        Reviews
      </span>
    </div>
    <template v-if="pageState.currentItem">
      <div class="mb-2 mt-10 text-start text-[20px] text-lg line-through lg:mt-7">
        <span
          v-if="pageState.currentItem?.priceOriginal !== pageState.currentItem?.salesAmount"
          class="mr-1 line-through"
        >
          {{
            `${pageState.currentItem?.currencyPrice?.text || ''}${
              convertNumber(pageState.currentItem?.priceOriginal) || 0
            }`
          }}
        </span>
      </div>
      <div class="mb-10 flex items-center text-xl !leading-5 lg:mb-7 lg:text-2xl">
        <span>
          <span class="font-625">{{
            `${pageState.currentItem?.currencyPrice?.text || ''}${
              convertNumber(pageState.currentItem?.salesAmount) || 0
            }`
          }}</span>
        </span>
        <a-divider type="vertical" class="!bg-gray-13 !mb-1 h-[10px] w-[1px]" />
        <span v-if="pageState.currentItem?.point" class="font-475">
          {{ convertNumber(pageState.currentItem?.point) }}
          <span>{{ generateCurrencyPointUnit(pageState.currentItem.currencyPoint) || '' }}</span>
        </span>
        <span v-else class="font-475">
          {{ convertNumber(productDetail?.point) || 0 }}
          <span>{{ productDetail.currencyPoint?.text || '' }}</span>
        </span>
      </div>
    </template>
    <template v-else>
      <div class="mb-2 mt-10 text-start text-[20px] text-lg line-through lg:mt-7">
        <span
          v-if="productDetail.priceOriginal !== productDetail.salesAmount"
          class="mr-1 line-through"
        >
          {{
            `${productDetail.currencyPrice?.text || ''}${
              convertNumber(productDetail?.priceOriginal) || 0
            }`
          }}
        </span>
      </div>
      <div class="mb-10 flex items-center text-xl !leading-5 lg:mb-7 lg:text-2xl">
        <span>
          <span class="font-625">{{
            `${productDetail.currencyPrice?.text || ''}${
              convertNumber(productDetail?.salesAmount) || 0
            }`
          }}</span>
        </span>
        <a-divider type="vertical" class="!bg-gray-13 !mb-1 h-[10px] w-[1px]" />
        <span v-if="pageState.currentBp" class="font-475">
          {{ convertNumber(pageState.currentBp) }}

          <span>{{ productDetail.currencyPoint?.text || '' }}</span>
        </span>
        <span v-else class="font-475">
          {{ convertNumber(productDetail?.point) || 0 }}
          <span>{{ productDetail.currencyPoint?.text || '' }}</span>
        </span>
      </div>
    </template>
    <div>
      <a-divider class="bg-navy-3 !mb-10" />
    </div>
    <div v-if="showRitual">
      <p class="text-gray-10 font-550 text-base uppercase leading-5 md:text-lg">
        {{ productDetail?.classification?.title }}
      </p>
      <div>
        <span class="font-475 text-gray-10 inline-block pb-[12px] text-[18px]">
          STEP {{ productDetail?.classification?.step }}:
          {{ productDetail?.classification?.description }}
        </span>
        <span
          class="font-550 text-gray-10 cursor-pointer pl-5 text-[18px] underline"
          @click="gotoRitual"
        >
          Complete your ritual
        </span>
      </div>
    </div>
    <div v-if="isShowOption">
      <div v-for="item in pageState.variants" :key="item.optionName" class="mb-8">
        <p class="font-550 text-gray-10 leading-base mb-2 text-[18px] capitalize">
          {{ item.optionName }}
        </p>
        <div class="no-scrollbar flex gap-2.5 overflow-x-auto">
          <template v-if="item.optionUi.code === ProductVariantEnum.BUTTON">
            <template v-if="item.optionType.code === ProductVariantEnum.IMAGE">
              <div class="no-scrollbar flex overflow-x-auto lg:flex-wrap">
                <div
                  v-for="itemValue in item.values"
                  :key="itemValue.productCategoryOptionDetailId"
                  :class="getClassForVariant(itemValue)"
                  class="max-w-20 inline-block w-[60px] min-w-[60px] cursor-pointer overflow-hidden text-center lg:w-[80px] lg:min-w-[80px]"
                  @click="selectVariant(item, itemValue)"
                >
                  <span>
                    <img
                      v-if="itemValue.optionValue.includes('product/')"
                      class="image-variant w-12.5 md:w-15 mb-3 aspect-square opacity-30"
                      :src="addPrefixForImage(itemValue.optionValue)"
                      alt="option product"
                    />
                    <img
                      v-else
                      class="image-variant w-12.5 md:w-15 mb-3 aspect-square opacity-30"
                      :src="WhiteBg"
                      alt="option product"
                    />
                    <br />
                    <span class="leading-base font-475 text-wrap text-[14px] uppercase">{{
                      itemValue.optionValue.includes('product/')
                        ? itemValue?.imageName
                        : itemValue.optionValue
                    }}</span>
                  </span>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="no-scrollbar flex overflow-x-auto lg:flex-wrap">
                <span
                  v-for="itemValue in item.values"
                  :key="itemValue.productCategoryOptionDetailId"
                  class="font-475 default-variant-text border-gray-5 border-1 px-3.75 flex flex cursor-pointer items-center justify-center border-solid py-5 text-[16px] transition-all md:min-w-[81px]"
                  :class="getClassForVariantText(itemValue)"
                  @click="selectVariant(item, itemValue)"
                >
                  <span>
                    <img
                      v-if="itemValue.optionValue.includes('product/')"
                      class="rounded-sm"
                      width="30"
                      :src="addPrefixForImage(itemValue.optionValue)"
                      alt="option product"
                    />
                    <span class="leading-base">{{
                      itemValue.optionValue.includes('product/')
                        ? itemValue?.imageName
                        : itemValue.optionValue
                    }}</span>
                  </span>
                </span>
              </div>
            </template>
          </template>
          <template v-else>
            <a-select
              option-label-prop="children"
              :placeholder="`Select ${item.optionName}`"
              class="w-full md:w-1/2"
              size="large"
              :value="pageState.selectValue[item.optionName]"
              @change="(value) => onChangeSelectVariant(value, item)"
            >
              <a-select-option
                v-for="itemValue in item.values"
                :key="itemValue.productCategoryOptionDetailId"
                :value="itemValue.optionValue"
                :label="itemValue.optionValue"
              >
                <span role="img" :aria-label="itemValue.optionValue">
                  <img
                    v-if="itemValue.optionValue.includes('product/')"
                    class="object-fit h-[30px] w-[30px] rounded-full"
                    :src="addPrefixForImage(itemValue.optionValue)"
                    alt="option product"
                  />
                </span>
                <span class="ml-1">{{
                  itemValue.optionValue.includes('product/')
                    ? itemValue?.imageName
                    : itemValue.optionValue
                }}</span>
              </a-select-option>
            </a-select>
          </template>
        </div>
      </div>
    </div>
    <div class="quantity-input">
      <a-input v-model:value="pageState.quantity" :maxlength="3" @change="onChangeQuantity">
        <template #prefix>
          <span class="cursor-pointer px-2 text-[20px]" @click="increaseQuantity(false)"> - </span>
        </template>
        <template #suffix>
          <span class="cursor-pointer px-2 text-[20px]" @click="increaseQuantity(true)"> + </span>
        </template>
      </a-input>
    </div>
    <div class="pt-1">
      <span class="text-red-1000">{{ pageState.messageQuantity }}</span>
    </div>
    <div class="ship-option py-[12px]">
      <r-radio
        v-model:value="pageState.shipOption"
        :options="productDetail.autoShipYn ? shipOptions : [shipOptions[0]]"
      />
    </div>
    <div
      v-if="pageState.shipOption === SHIP_OPTION_ENUM.AUTO_SHIP"
      class="bg-benefit mb-8 block p-5"
    >
      <p class="font-475 text-gray-10 mb-[10px] text-[12px] leading-normal">
        Supercharge Your Shopping Experience!
      </p>
      <p class="text-gray-10 mb-[15px] text-[12px] font-normal leading-normal">
        Tired of the hassle? Subscribe to our convenient Autoship serv ice and say goodbye to order
        stress and unlock the awesome benefits:
      </p>
      <div class="mb-2 flex">
        <div>
          <CheckMarkIcon />
        </div>
        <div class="text-gray-14 pl-[6px] text-[12px] font-normal leading-normal">
          Save Time: No more manual orders <br />
          – we've got you covered!
        </div>
      </div>
      <div class="mb-2 flex">
        <div>
          <CheckMarkIcon />
        </div>
        <div class="text-gray-14 pl-[6px] text-[12px] font-normal leading-normal">
          Get Your Favorites: <br />
          Your must-haves, delivered like clockworks!
        </div>
      </div>
      <div class="mb-2 flex">
        <div>
          <img :src="SparkLesIcon" alt="product image" />
        </div>
        <div class="text-gray-14 pl-[6px] text-[12px] font-normal leading-normal">
          BONUS: Treat Yourself! Receive an exclusive gift <br />
          every 3rd consecutive month!
        </div>
      </div>
    </div>
    <div class="cart-button pb-2.5 pt-3">
      <ButtonAddCart v-slot="cartButton">
        <r-button
          class-title="text-white"
          height="60px"
          class="!bg-navy-1 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full"
          :disabled="isDisableAddCart"
          @click="
            cartButton.detailCheckout({
              productInfo: pageState.currentItem,
              quantity: +pageState.quantity,
              productOptionId: pageState.currentItem?.productOptionId,
              isAutoShip: pageState.shipOption === SHIP_OPTION_ENUM.AUTO_SHIP,
              variants: pageState.selectedVariant,
              productOriginalName: props.productDetail.productEnglishName,
              isOption: !!props.productDetail?.optionYn,
              salesStatus: props.productDetail?.salesStatus,
              productDetail: props.productDetail
            })
          "
        >
          <template #content>
            <div>
              <span class="font-bold text-white">${{ convertNumber(finalPrice || 0) }}</span>
              <a-divider type="vertical" class="bg-navy-3 h-[10px] w-[1px]" />
              <span class="font-475 text-white">ADD TO BAG</span>
            </div>
          </template>
        </r-button>
      </ButtonAddCart>
    </div>

    <div v-if="productDetail.listStyleYn" class="mt-15 mb-0 lg:mb-10">
      <div class="font-550 leading-base pb-6.25 text-base lg:text-lg">
        {{ productDetail.listStyle?.title }}
      </div>
      <div
        v-clean-html="productDetail.listStyle?.pcContent"
        class="hidden whitespace-pre-wrap md:block"
      />
      <div
        v-clean-html="productDetail.listStyle?.mobileContent"
        class="whitespace-pre-wrap md:hidden"
      />
    </div>
  </div>
</template>
<script setup>
import { computed, reactive, watch } from 'vue'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { ALPHABETS, ESCAPE } from '@/helpers/regex'
import { convertNumber, generateCurrencyPointUnit } from '@/utils/currency'
import CheckMarkIcon from '@/assets/svgs/check-mark.svg'
import WhiteBg from '@/assets/images/products/white.png'
import SparkLesIcon from '@/assets/svgs/star-sparkles.svg?url'
import {
  ProductClassEnum,
  ProductCombineEnum,
  ProductVariantEnum,
  ProductSaleStatus
} from '@/helpers/enum'
import { addPrefixForImage } from '@/utils/common'
import { SHIP_OPTION_ENUM } from '@/helpers/constant'
import { disableAddCartButtonByCountry } from '@/utils/role'

const vCleanHtml = buildVueDompurifyHTMLDirective()

const emitEvents = defineEmits(['scrollReview', 'scrollRitual'])
const props = defineProps({
  productDetail: {
    type: Object,
    default: () => ({})
  }
})

const isDisableAddCart = computed(
  () =>
    !pageState.quantity ||
    pageState.quantity < 1 ||
    (props.productDetail?.maxQuantityLimit &&
      pageState.quantity > props.productDetail?.maxQuantityLimit) ||
    isDisableButton()
)

const pageState = reactive({
  quantity: 1,
  shipOption: SHIP_OPTION_ENUM.ONE_TIME,
  selectedVariant: {},
  messageQuantity: '',
  variants: [],
  isCombination: false,
  currentPrice: undefined,
  currentItem: undefined,
  originOptions: [],
  currentBp: undefined,
  selectValue: {},
  checkStatusSoldOut: false
})

const shipOptions = [
  {
    label: 'One-Time Purchase',
    value: SHIP_OPTION_ENUM.ONE_TIME
  },
  {
    label: 'Autoship Subscription',
    value: SHIP_OPTION_ENUM.AUTO_SHIP
  }
]

const getProductVariant = () => {
  if (!props.productDetail?.optionYn) return
  const listOptions = props.productDetail?.option
  const productItemOptions = listOptions?.items || []
  pageState.originOptions = productItemOptions
  const itemCombination = listOptions?.productOptionType.code === ProductCombineEnum.INDIVIDUAL
  pageState.isCombination = !itemCombination
  const resultArray = []
  const optionMap = {}

  productItemOptions.forEach((item) => {
    item.values.forEach((value) => {
      const optionName = value.optionName

      if (!optionMap[optionName]) {
        optionMap[optionName] = {
          optionName,
          optionType: value.optionType,
          optionUi: value.optionUi,
          values: []
        }
      }

      const findItem = optionMap[optionName]?.values?.find(
        (el) => el.optionValue === value.optionValue
      )

      !findItem && optionMap[optionName].values.push(value)
    })
  })

  for (const optionName in optionMap) {
    resultArray.push(optionMap[optionName])
  }

  return resultArray
}

const finalPrice = computed(() => {
  return pageState.quantity * +pageState.currentItem?.salesAmount
})

const showRitual = computed(
  () =>
    props.productDetail?.classification &&
    props.productDetail?.classification?.name?.code === ProductClassEnum.RITUAL
)

const isShowOption = computed(() => props.productDetail?.optionYn || false)

watch(
  () => props.productDetail,
  () => {
    pageState.variants = getProductVariant()
    pageState.currentItem = props.productDetail
    if (props.productDetail.setYn && props.productDetail?.set) {
      pageState.currentPrice = props.productDetail.set.salesAmount
      pageState.currentBp = props.productDetail.set.bp
      pageState.currentItem = {
        ...pageState.currentItem,
        currencyPoint: props.productDetail.set?.currencyPoint || props.productDetail?.currencyPoint,
        currencyPrice: props.productDetail.set?.currencyPrice || props.productDetail?.currencyPrice,
        point:
          props.productDetail.set?.bp ||
          props.productDetail.set?.point ||
          props.productDetail?.point,
        priceOriginal:
          props.productDetail.set?.priceOriginal || props.productDetail.set?.salesAmount,
        salesAmount: props.productDetail.set?.salesAmount,
        salesStatus: props.productDetail?.salesStatus,
        country: props.productDetail?.country
      }
    }
    pageState.checkStatusSoldOut =
      pageState.currentItem?.salesStatus?.code !== ProductSaleStatus.ON_SALE
  }
)

const selectVariant = (parentItem, childItem) => {
  if (!pageState.isCombination) {
    pageState.selectedVariant = {}
    pageState.selectedVariant[parentItem.optionName] = childItem.optionValue
    pageState.currentPrice = childItem.price
    pageState.currentItem = {
      ...childItem,
      productOptionId: childItem?.productId,
      productId: props.productDetail?.productId,
      currencyPoint: childItem?.currencyPoint,
      currencyPrice: childItem?.currencyPrice,
      point: childItem?.point,
      priceOriginal: childItem?.priceOriginal,
      salesAmount: childItem?.salesAmount,
      country: props.productDetail?.country
    }
    pageState.selectValue = {}
    pageState.checkStatusSoldOut =
      pageState.currentItem?.salesStatus?.code !== ProductSaleStatus.ON_SALE
  } else {
    pageState.selectedVariant[parentItem.optionName] = childItem.optionValue
    findItemCombine(parentItem.optionName)
  }
}

const findItemCombine = (optionVariant) => {
  if (Object.keys(pageState.selectedVariant).length === pageState.variants.length) {
    const matchingItem = pageState.originOptions.filter((item) => {
      return Object.keys(pageState.selectedVariant).every((key) => {
        return item.values.some((value) => {
          return value.optionName === key && value.optionValue === pageState.selectedVariant[key]
        })
      })
    })

    if (matchingItem.length) {
      const productOptionId = matchingItem[0].productId
      pageState.currentItem = {
        ...matchingItem[0],
        productId: props.productDetail?.productId,
        productOptionId,
        currencyPoint: matchingItem[0]?.values[0]?.currencyPoint,
        currencyPrice: matchingItem[0]?.values[0]?.currencyPrice,
        point: matchingItem[0]?.values[0]?.point,
        priceOriginal: matchingItem[0]?.values[0]?.priceOriginal,
        salesAmount: matchingItem[0]?.values[0]?.salesAmount,
        salesStatus: matchingItem[0]?.values[0]?.salesStatus,
        country: props.productDetail?.country
      }
      pageState.currentPrice = matchingItem[0].values[0].price
      pageState.checkStatusSoldOut =
        pageState.currentItem?.salesStatus?.code !== ProductSaleStatus.ON_SALE
    } else {
      delete pageState.selectedVariant[optionVariant]
    }
  }
}

const getClassForVariant = (item) => {
  return item.optionValue !== pageState.selectedVariant[item.optionName]
    ? 'text-gray-11 border-gray-11'
    : 'selected-variant'
}

const getClassForVariantText = (item) => {
  return item.optionValue !== pageState.selectedVariant[item.optionName]
    ? ''
    : 'selected-variant-text'
}

const onChangeSelectVariant = (childItem, parentItem) => {
  if (!pageState.isCombination) {
    pageState.selectedVariant = {}
    pageState.selectedVariant[parentItem.optionName] = childItem
    pageState.currentPrice = parentItem.values.find((el) => el.optionValue === childItem)?.price

    const dataCurrentItem = parentItem.values.find((el) => el.optionValue === childItem)
    pageState.currentItem = {
      ...dataCurrentItem,
      productOptionId: dataCurrentItem?.productId,
      productId: props.productDetail?.productId,
      currencyPoint: dataCurrentItem?.currencyPoint,
      currencyPrice: dataCurrentItem?.currencyPrice,
      point: dataCurrentItem?.point,
      priceOriginal: dataCurrentItem?.priceOriginal,
      salesAmount: dataCurrentItem?.salesAmount,
      country: props.productDetail?.country
    }
    pageState.selectValue = {}
    pageState.selectValue[parentItem.optionName] = childItem
    pageState.checkStatusSoldOut =
      pageState.currentItem?.salesStatus?.code !== ProductSaleStatus.ON_SALE
  } else {
    pageState.selectedVariant[parentItem.optionName] = childItem
    findItemCombine(parentItem.optionName)
  }
}

const isDisableButton = () => {
  if (props.productDetail?.optionYn) {
    if (!pageState.isCombination) {
      return Object.keys(pageState.selectedVariant).length === 0
    } else {
      return Object.keys(pageState.selectedVariant).length !== pageState.variants.length
    }
  } else {
    return false
  }
}

const increaseQuantity = (isIncrease) => {
  if (!isIncrease) {
    pageState.quantity > 1 && pageState.quantity--
  } else {
    pageState.quantity++
  }
  onChangeQuantity()
}

const gotoReview = () => {
  emitEvents('scrollReview')
}

const gotoRitual = () => {
  emitEvents('scrollRitual')
}

const onChangeQuantity = () => {
  if (pageState.quantity < 1) {
    pageState.messageQuantity = 'Product quantity must be greater than 0'
  } else if (
    props.productDetail?.maxQuantityLimit &&
    pageState.quantity > props.productDetail?.maxQuantityLimit
  ) {
    pageState.messageQuantity = `Product quantity must be less than or equal to ${props.productDetail?.maxQuantityLimit}`
  } else {
    pageState.messageQuantity = ''
  }
}

watch([() => pageState.quantity], ([newVal]) => {
  pageState.quantity = String(newVal).replace(ALPHABETS, '').replace(ESCAPE, '')
})
</script>
<style lang="scss" scoped>
.quantity-input {
  width: 200px;

  :deep(.ant-input-affix-wrapper) {
    @apply py-[10px];
  }

  :deep(.ant-input) {
    @apply text-center;
  }
}

.ship-option {
  :deep(.ant-radio-wrapper) {
    @apply w-full;
  }

  :deep(.ant-radio-checked) {
    .ant-radio-inner {
      @apply border-navy-deep;
    }
    .ant-radio-inner:after {
      @apply bg-navy-deep;
    }
  }
  p {
    margin-bottom: 0;
  }
}

.tab-block {
  :deep(.tab-block-item-active) {
    @apply text-navy-6 border-navy-6;
  }
}

.overlay-video {
  @apply h-full w-full;
  background-color: #000;
  opacity: 0.4;
  top: 0;
  left: 0;
  z-index: 1;
}
.icon-play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
}

.diveIn {
  @apply mb-[110px] px-5 lg:mb-[200px];

  &__content {
    @apply relative -mx-5;
  }

  &__navigation {
    @apply z-1 absolute top-1/2 cursor-pointer;

    &-prev {
      transform: translate(-100%, -50%);
      @apply -left-5;
    }

    &-next {
      transform: translate(100%, -50%);
      @apply -right-5;
    }
  }
}

.carousel {
  &__wrap {
    @apply relative cursor-pointer;
  }

  &__image {
    @apply h-full w-full object-cover;
  }

  &__badge {
    @apply absolute right-2.5 top-2.5 h-5 w-5;
    @apply lg:right-4 lg:top-4 lg:h-[30px] lg:w-[30px];
  }
}

@media (max-width: 1330px) {
  .diveIn__navigation {
    @apply hidden;
  }
}

.disabled-variant {
  .text-variant {
    @apply text-gray-5;
  }

  .border-variant {
    @apply border-gray-5;
  }

  .overlay-variant-disabled {
    background-color: rgb(255 255 255 / 31%);
  }
}

.bg-benefit {
  background-color: rgba(224, 224, 224, 0.2);
}

.selected-variant {
  img.image-variant {
    opacity: 1;
  }
}

.default-variant-text {
  transition: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  &:hover {
    background-color: #104978;
    color: #ffffff;
  }
}

.selected-variant-text {
  background-color: #104978;
  color: #ffffff;
}
</style>
