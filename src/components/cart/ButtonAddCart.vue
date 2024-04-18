<template>
  <div>
    <slot
      :add-cart="handleAddToCart"
      :phase-check="phaseCheckOption"
      :detail-checkout="handleDetailCheckout"
    />
  </div>
  <RModalConfirm
    v-model:visible="pageState.showModalError"
    :description="AUTH_REQUIRED.notAuth"
    text-ok="Login"
    text-cancel="Later"
    :width="270"
    :mask-closable="false"
    @ok="router.push(AppRoutes.login)"
    @cancel="pageState.showModalError = false"
  />
  <RModalConfirm
    v-model:visible="pageState.addToBagSuccess"
    :width="270"
    text-ok="Checkout"
    text-cancel="Keep Shopping"
    :mask-closable="false"
    @ok="onConfirm()"
    @cancel="pageState.addToBagSuccess = false"
  >
    <template #extraDescription>
      <div class="text-center">
        <CartIcon />
        <p class="font-475 mb-[14px] text-base leading-[22px]">Added to your shopping bag!</p>
      </div>
    </template>
  </RModalConfirm>
  <!-- Modal alert diff country -->
  <RModalConfirm
    v-model:visible="diffCountryState.isShowPopup"
    :width="270"
    text-ok="Yes"
    text-cancel="No"
    :mask-closable="false"
    @ok="onConfirmSwitchCountry()"
    @cancel="diffCountryState.isShowPopup = false"
  >
    <template #extraDescription>
      <div class="text-center">
        <p class="font-475 mb-[14px] text-base leading-[22px]">
          You're shopping on the {{ transformCountryName(diffCountryState.currentWebSite) }} site.
          Would you like to shop
          {{ transformCountryName(diffCountryState.userNationSite) }} products?
        </p>
      </div>
    </template>
  </RModalConfirm>
  <!-- Modal set buy period limit day notice -->
  <RModalAlert
    v-model:visible="pageState.showNoticeBuyPeriod"
    title="Notice"
    :description="`[${pageState.productDetail?.productEnglishName}] You have passed your eligible purchase period. People within ${pageState.setBuyPeriodLimitDay} days from enrollment are allowed for purchase.`"
    text-btn="Ok"
    :width="350"
    :mask-closable="false"
    @confirm="pageState.showNoticeBuyPeriod = false"
  />

  <!-- Modal sold out notice -->
  <AlertNoticeSoldOut
    v-model="pageState.showNoticeSoldOut"
    :product-info="pageState.overallProductInfo"
    :variants="pageState.selectedVariant"
    @continue="handleContinueWithSoldOut"
  />
  <!-- Modal option select -->
  <RModalAlert v-model:visible="pageState.showModalOption" :width="350" :footer="false">
    <template #extraDescription>
      <div class="-mt-4 text-left">
        <div class="-mx-5">
          <div class="relative text-center text-[16px] font-medium">
            Select Option
            <div
              class="absolute right-5 top-0 cursor-pointer"
              @click="pageState.showModalOption = false"
            >
              <CloseOutlined />
            </div>
          </div>
          <a-divider class="!mt-3" />
        </div>
        <div class="max-h-[300px] overflow-y-auto">
          <div class="line-clamp-2 pb-3 text-[16px] font-medium">
            {{ pageState.productDetail?.productName }}
          </div>
          <div v-for="item in pageState.variants" :key="item.optionName" class="mb-8">
            <p class="font-550 text-gray-10 leading-base mb-2 text-[18px] capitalize">
              {{ item.optionName }}
            </p>
            <div class="no-scrollbar flex gap-2.5 overflow-x-auto lg:flex-wrap">
              <template v-if="item.optionUi.code === ProductVariantEnum.BUTTON">
                <template v-if="item.optionType.code === ProductVariantEnum.IMAGE">
                  <div class="no-scrollbar flex gap-5 overflow-x-auto lg:flex-wrap lg:gap-2.5">
                    <div
                      v-for="itemValue in item.values"
                      :key="itemValue.productCategoryOptionDetailId"
                      :class="getClassForVariant(itemValue)"
                      class="inline-block w-[60px] min-w-[60px] cursor-pointer text-center lg:w-[80px] lg:min-w-[80px]"
                      @click="selectVariant(item, itemValue)"
                    >
                      <span>
                        <img
                          v-if="itemValue.optionValue.includes('product/')"
                          class="image-variant mb-3 rounded-full opacity-30"
                          width="60"
                          height="60"
                          :src="addPrefixForImage(itemValue.optionValue)"
                          alt="option product"
                        />
                        <span
                          v-else
                          class="border-1 mb-3 inline-block h-[60px] w-[60px] rounded-full border-solid opacity-80"
                        ></span>
                        <br />
                        <span class="leading-base font-475 text-[14px] uppercase">{{
                          itemValue.optionValue.includes('product/')
                            ? itemValue?.imageName
                            : itemValue.optionValue
                        }}</span>
                      </span>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="no-scrollbar flex gap-5 overflow-x-auto lg:flex-wrap lg:gap-2.5">
                    <span
                      v-for="itemValue in item.values"
                      :key="itemValue.productCategoryOptionDetailId"
                      class="font-475 default-variant-text flex cursor-pointer items-center px-[15px] py-[10px] text-[16px] transition-all"
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
                  class="w-full"
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
        <div class="-mx-5 text-center">
          <a-divider />
          <span
            class="text-navy-deep cursor-pointer py-3 text-center text-[14px] font-medium"
            :class="{ 'opacity-50': isDisableButton() || pageState.isDisable }"
            @click="onClickConfirm"
          >
            Confirm
          </span>
        </div>
      </div>
    </template>
  </RModalAlert>
</template>
<script setup>
// NEED ENHANCE AFTER
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import CartIcon from '@assets/svgs/cart.svg'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useCartStore } from '@/stores/modules/cart'
import { addProductToCart } from '@/utils/cart'
import { storeToRefs } from 'pinia'
import { useNotification } from '@/composables/notification'
import { AUTH_REQUIRED } from '@/helpers/validate-message'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { gtmAddToCart } from '@/utils/gtm'
import { reactive } from 'vue'
import apiService from '@/http/api'
import { addPrefixForImage, countryLocalStorage } from '@/utils/common'
import { CloseOutlined } from '@ant-design/icons-vue'
import {
  ProductCombineEnum,
  ProductVariantEnum,
  ProductSaleStatus,
  NfrImportProductEnum,
  CartTypeEnum,
  ShoppingBagTabEnum,
  CountryEnum
} from '@/helpers/enum'
import { disableAddCartButtonByCountry } from '@/utils/role'
import storage from '@/utils/storage'
import { STORAGE_IP_ADDRESS, FORMAT_HOUR_MINUTE_SECOND } from '@/helpers/constant'
import dayjs from 'dayjs'

const authUserStore = useAuthUserStore()
const storeLoading = useGlobalLoadingStore()
const cartStore = useCartStore()
const { setStandardCartBadge, setAutoShipCartBadge, setNfrCartBadge } = cartStore
const { showGlobalLoading } = storeLoading
const { standardCartBadge, autoShipCartBadge, nfrCartBadge } = storeToRefs(cartStore)
const { currentAuthUser } = storeToRefs(authUserStore)
const { showNotification } = useNotification()
const router = useRouter()

const pageState = reactive({
  showModalError: false,
  addToBagSuccess: false,
  productDetail: undefined,
  showModalOption: false,
  variants: [],
  originOptions: [],
  selectValue: {},
  isCombination: false,
  currentItem: undefined,
  selectedVariant: {},
  isDisable: false,
  isAutoShip: false,
  country: '',
  overallProductInfo: undefined,
  showNoticeSoldOut: false,
  showNoticeBuyPeriod: false,
  setBuyPeriodLimitDay: 0
})

const diffCountryState = reactive({
  isShowPopup: false,
  userNationSite: '',
  currentWebSite: ''
})

const onConfirm = () => {
  let tabNumber = ShoppingBagTabEnum.STANDARD
  if (pageState.isAutoShip) {
    tabNumber = ShoppingBagTabEnum.AUTOSHIP
  } else if (pageState.country === NfrImportProductEnum.NFR) {
    tabNumber = ShoppingBagTabEnum.NFR_IMPORT
  }
  router.push({ name: AppRoutes.cart.list.name, query: { tab: tabNumber } })
}

const handleAddToCart = async (itemAddCart) => {
  const { productInfo, country, isAutoShip, productOptionId, quantity } = itemAddCart

  if (!currentAuthUser.value) {
    pageState.showModalError = true
  } else {
    const productId = productInfo.productId
    showGlobalLoading(true)
    const payload = {
      productId,
      productOptionId,
      quantity,
      cartType:
        country === NfrImportProductEnum.NFR ? CartTypeEnum.NFR_IMPORT : CartTypeEnum.STANDARD_ORDER
    }
    pageState.country = country
    pageState.isAutoShip = isAutoShip

    const response = isAutoShip
      ? await apiService.cartService.addProductToAutoShipCart(payload)
      : await addProductToCart(payload)
    if (response.success) {
      if (isAutoShip) {
        setAutoShipCartBadge(autoShipCartBadge.value + +quantity)
      } else if (country === NfrImportProductEnum.NFR) {
        setNfrCartBadge(nfrCartBadge.value + +quantity)
      } else {
        setStandardCartBadge(standardCartBadge.value + +quantity)
      }
      pageState.addToBagSuccess = false
      pageState.showModalOption = false
      pageState.showNoticeSoldOut = false
      pageState.showNoticeBuyPeriod = false
    } else {
      showNotification({ type: 'error', message: 'Error. Please try again!', duration: 3 })
    }
    gtmAddToCart(productInfo, 1)
    showGlobalLoading(false)
  }
}

const getProductVariant = () => {
  const listOptions = pageState.productDetail?.option
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

const selectVariant = (parentItem, childItem) => {
  if (!pageState.isCombination) {
    pageState.selectedVariant = {}
    pageState.selectedVariant[parentItem.optionName] = childItem.optionValue
    pageState.currentItem = {
      ...childItem,
      productOptionId: childItem?.productId,
      productId: pageState.productDetail?.productId
    }
    pageState.selectValue = {}
    pageState.isDisable = pageState.currentItem?.salesStatus?.code !== ProductSaleStatus.ON_SALE
  } else {
    pageState.selectedVariant[parentItem.optionName] = childItem.optionValue
    findItemCombine(parentItem.optionName)
  }
}

const findItemCombine = (optionName) => {
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
        productId: pageState.productDetail?.productId,
        productOptionId,
        salesStatus: matchingItem[0]?.values[0]?.salesStatus
      }
      pageState.isDisable = pageState.currentItem?.salesStatus?.code !== ProductSaleStatus.ON_SALE
    } else {
      delete pageState.selectedVariant[optionName]
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

    const dataCurrentItem = parentItem.values.find((el) => el.optionValue === childItem)

    pageState.currentItem = {
      ...dataCurrentItem,
      productOptionId: dataCurrentItem?.productId,
      productId: pageState.productDetail?.productId
    }
    pageState.selectValue = {}
    pageState.selectValue[parentItem.optionName] = childItem
    pageState.isDisable = pageState.currentItem?.salesStatus?.code !== ProductSaleStatus.ON_SALE
  } else {
    pageState.selectedVariant[parentItem.optionName] = childItem
    findItemCombine(parentItem.optionName)
  }
}

const checkBuyPeriod = (productDetail) => {
  const joinDateTime = dayjs(new Date(currentAuthUser.value?.joinDatetime))
  const buyPeriodLimitDay = productDetail?.setBuyPeriodLimitDay

  let isShowNoticeBuyPeriod = false
  if (productDetail?.validBuySignUp) {
    return false
  }
  if (!productDetail?.validBuySignUp) {
    const currentDate = dayjs.utc(new Date())
    const targetTime = joinDateTime.add(buyPeriodLimitDay, 'day')
    if (currentDate.isSame(targetTime, 'day')) {
      return (
        dayjs(currentDate).format(FORMAT_HOUR_MINUTE_SECOND) >
        dayjs(targetTime).format(FORMAT_HOUR_MINUTE_SECOND)
      )
    }
    if (currentDate > targetTime) {
      isShowNoticeBuyPeriod = true
    }
  }

  return isShowNoticeBuyPeriod
}

const checkBuyPeriodForOption = (productDetail, currentItem) => {
  let productInfo = productDetail
  const periodProductDetail = productDetail?.setBuyPeriodLimitDay
  const periodCurrentItem = currentItem.values
    ? currentItem.values[0].setBuyPeriodLimitDay
    : currentItem?.setBuyPeriodLimitDay
  if (
    !periodCurrentItem ||
    (periodCurrentItem < periodProductDetail && periodProductDetail) ||
    !periodProductDetail
  ) {
    productInfo = currentItem.values ? currentItem.values[0] : currentItem
  }

  return productInfo
}

const checkBuyPeriodForSet = (productInfo) => {
  if (pageState.productDetail?.set) {
    const isShowNoticeBuyPeriod = checkBuyPeriod(productInfo)
    if (isShowNoticeBuyPeriod) {
      pageState.showNoticeBuyPeriod = true
      pageState.setBuyPeriodLimitDay = productInfo?.setBuyPeriodLimitDay
      return true
    }
  }
  return false
}

const checkBuyPeriodForPhaseCheck = (productInfo) => {
  let product = productInfo
  if (!productInfo.setBuyPeriodLimitDay) {
    product = { ...pageState.productDetail }
  }
  let isShowNoticeBuyPeriod = checkBuyPeriod(product)
  if (pageState.productDetail.optionYn) isShowNoticeBuyPeriod = false
  if (checkBuyPeriodForSet(product)) return true
  if (isShowNoticeBuyPeriod) {
    pageState.setBuyPeriodLimitDay = pageState.productDetail.setBuyPeriodLimitDay
    pageState.showNoticeBuyPeriod = true
    return true
  }
  return false
}

const checkCountry = (country) => {
  if (country) {
    const isShowPopupAlertCountry = disableAddCartButtonByCountry(country)
    if (isShowPopupAlertCountry) {
      diffCountryState.userNationSite = currentAuthUser.value?.nationalCode
      diffCountryState.currentWebSite = countryLocalStorage
      diffCountryState.isShowPopup = true
      return true
    }
  }
  return false
}

const phaseCheckOption = async (productInfo) => {
  if (!currentAuthUser.value) {
    pageState.showModalError = true
    return
  }
  if (checkCountry(productInfo?.country)) return

  try {
    showGlobalLoading(true)
    const productRes = await apiService.productService.getProductDetail(productInfo.productId)
    showGlobalLoading(false)
    if (!productRes?.success || !productRes?.data) {
      pageState.showModalError = true
      return
    }

    pageState.productDetail = productRes.data
    if (checkCountry(productRes?.data?.country) || checkBuyPeriodForPhaseCheck(productInfo)) return
    if (productRes.data.optionYn && productRes.data.option && productRes.data.option?.items) {
      pageState.isAutoShip = !!productInfo.isAutoShip
      pageState.variants = getProductVariant()
      pageState.showModalOption = true
    } else {
      if (pageState.productDetail?.salesStatus?.code !== ProductSaleStatus.ON_SALE) {
        pageState.productDetail = productRes.data
        pageState.overallProductInfo = {
          ...pageState.productDetail,
          productEnglishName: pageState?.productDetail?.optionYn
            ? pageState.productDetail?.productEnglishName
            : '',
          originalName: pageState.productDetail?.productEnglishName
        }
        pageState.isAutoShip = !!productInfo.isAutoShip
        pageState.showNoticeSoldOut = true
        return
      }
      const itemAddCart = {
        productInfo: productInfo,
        country: productRes.data.country,
        quantity: 1,
        productOptionId: undefined,
        isAutoShip: productInfo.isAutoShip
      }
      handleAddToCart(itemAddCart)
    }
  } catch (error) {
    showGlobalLoading(false)
  } finally {
    showGlobalLoading(false)
  }
}

const isDisableButton = () => {
  if (pageState.productDetail?.optionYn) {
    if (!pageState.isCombination) {
      return Object.keys(pageState.selectedVariant).length === 0
    } else {
      return Object.keys(pageState.selectedVariant).length !== pageState.variants.length
    }
  } else {
    return false
  }
}

const onClickConfirm = () => {
  const productCheck = checkBuyPeriodForOption(pageState.productDetail, pageState.currentItem)
  const isShowNoticeBuyPeriod = checkBuyPeriod(productCheck)
  if (isShowNoticeBuyPeriod) {
    pageState.setBuyPeriodLimitDay = productCheck.setBuyPeriodLimitDay
    pageState.showNoticeBuyPeriod = true
    return
  }
  if (!isDisableButton()) {
    if (
      pageState.currentItem?.salesStatus?.code !== ProductSaleStatus.ON_SALE ||
      pageState.productDetail?.salesStatus?.code !== ProductSaleStatus.ON_SALE
    ) {
      pageState.overallProductInfo = {
        ...pageState.currentItem,
        productEnglishName: pageState?.productDetail?.optionYn
          ? pageState.currentItem?.productName || pageState.currentItem?.productEnglishName
          : '',
        originalName: pageState.productDetail?.productEnglishName
      }
      pageState.showNoticeSoldOut = true
    } else {
      const itemAddCart = {
        productInfo: pageState.currentItem,
        country: pageState.productDetail.country,
        quantity: 1,
        productOptionId: pageState.currentItem.productOptionId,
        isAutoShip: pageState.isAutoShip
      }
      handleAddToCart(itemAddCart)
    }
  }
}

const onConfirmSwitchCountry = () => {
  storage.set(STORAGE_IP_ADDRESS, diffCountryState.userNationSite, 'localStorage')
  showGlobalLoading(true)
  setTimeout(() => {
    showGlobalLoading(false)
  }, 1000)
  window.location.reload()
}

const handleDetailCheckout = (productData) => {
  const {
    productInfo,
    quantity = 1,
    productOptionId = undefined,
    isAutoShip = false,
    variants,
    productOriginalName,
    isOption = false,
    salesStatus,
    productDetail
  } = productData
  pageState.productDetail = productInfo
  if (pageState.productDetail?.country) {
    const isShowPopupAlertCountry = disableAddCartButtonByCountry(pageState.productDetail?.country)
    if (isShowPopupAlertCountry) {
      diffCountryState.userNationSite = currentAuthUser.value?.nationalCode
      diffCountryState.currentWebSite = countryLocalStorage
      diffCountryState.isShowPopup = true
      return
    }
  }
  let productCheck = productDetail
  if (productDetail.optionYn) {
    productCheck = checkBuyPeriodForOption(productDetail, productInfo)
  }
  if (checkBuyPeriodForSet(productDetail)) {
    return
  }
  const isShowNoticeBuyPeriod = checkBuyPeriod(productCheck)

  if (isShowNoticeBuyPeriod) {
    pageState.setBuyPeriodLimitDay = productCheck.setBuyPeriodLimitDay
    pageState.showNoticeBuyPeriod = true
    pageState.productDetail = {
      ...pageState.productDetail,
      setBuyPeriodLimitDay: productDetail.setBuyPeriodLimitDay,
      productEnglishName: productDetail.productEnglishName
    }
    return
  }

  if (
    pageState.productDetail?.salesStatus?.code !== ProductSaleStatus.ON_SALE ||
    (salesStatus && salesStatus?.code && salesStatus?.code !== ProductSaleStatus.ON_SALE)
  ) {
    pageState.selectedVariant = variants
    pageState.currentItem = {
      ...productInfo,
      productOptionId,
      isAutoShip,
      quantity
    }
    pageState.overallProductInfo = {
      ...pageState.currentItem,
      productEnglishName: isOption
        ? productInfo?.productEnglishName || productInfo?.productName
        : '',
      originalName: productOriginalName
    }
    pageState.showNoticeSoldOut = true
    pageState.isAutoShip = isAutoShip
  } else {
    handleAddToCart({ productInfo, quantity, productOptionId, isAutoShip })
  }
}

const handleContinueWithSoldOut = () => {
  let itemAddCart = {}
  if (pageState.productDetail?.optionYn || pageState.productDetail?.productOptionId) {
    itemAddCart = {
      productInfo: pageState.currentItem,
      country: pageState.productDetail.country,
      quantity: 1,
      productOptionId: pageState.currentItem.productOptionId,
      isAutoShip: !!pageState.isAutoShip
    }
  } else {
    itemAddCart = {
      productInfo: pageState.productDetail,
      country: pageState.productDetail?.country,
      quantity: 1,
      productOptionId: undefined,
      isAutoShip: !!pageState.isAutoShip
    }
  }
  handleAddToCart(itemAddCart)
}

const transformCountryName = (countryCode) => {
  if (String(countryCode).toUpperCase() === CountryEnum.CA.value) return CountryEnum.CA.label
  return countryCode
}
</script>
<style lang="scss" scoped>
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
