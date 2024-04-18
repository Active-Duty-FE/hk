<template>
  <div class="pt-15 container-x mx-auto">
    <RTabCustom v-model="currentTab" :tabs="tabs" class="tab-cart" @change="onChangeTab" />

    <EmptyCart v-if="!cartItems.length" />

    <div v-else class="cart-list-empty container mx-auto items-center">
      <div class="py-4.5 flex justify-between px-5">
        <template v-if="showCheckAll">
          <CartCheckBox v-model:checked="pageState.isCheckedAll" @checked-change="onSelectAll">
            <template #content>
              <span class="font-475 text-gray-10 pl-[10px] text-[16px] leading-[22px]">
                Select All
              </span>
            </template>
          </CartCheckBox>
        </template>
        <span v-else class="font-475 text-gray-10 pl-[10px] text-[16px] leading-[22px]">
          Select All
        </span>

        <DeleteIcon
          class="cursor-pointer"
          :class="{ 'cursor-not-allowed opacity-40': !hasCheckedItem() }"
          @click="preDeleteAll"
        />
      </div>

      <div class="mb-5 px-5">
        <a-divider class="bg-gray-10 !my-0" />
      </div>

      <CartListItem
        v-for="cartItem in cartItems"
        :key="cartItem.cartId"
        :cart-item="cartItem"
        :min-quantity="cartItem?.minQuantity"
        :max-quantity="cartItem?.maxQuantity"
        @checked="onCheckChildItem(cartItem)"
        @quantity="onChangeQuantity"
        @delete="onPreDeleteCartItem(cartItem.cartId)"
        @blur="onBlurQuantity"
      />
      <div class="px-5">
        <div>
          <a-divider class="bg-gray-10 !-mt-[25px] !mb-0" />
        </div>
        <div class="flex justify-between pt-[23px]">
          <span class="font-550 text-base leading-5">Subtotal</span>
          <span class="font-550 text-xl leading-[26px]">
            {{ currencyForSubTotal }}
            {{ convertNumber(subTotal) }}
          </span>
        </div>
        <div v-if="isShowTotalPoint" class="flex justify-between pt-[18px]">
          <span class="text-[14px] font-normal">Total {{ genBeautyPoint() }}</span>
          <span class="font-475 text-[14px]">
            {{ convertNumber(totalBP) }} {{ genBeautyPoint() }}
          </span>
        </div>
      </div>
      <div class="px-5 pb-[120px]">
        <div>
          <a-divider class="bg-gray-10 my-5" />
        </div>
        <div>
          <div
            v-for="notice in notices"
            :key="notice"
            class="relative flex items-center pb-[15px] text-[14px] font-normal"
          >
            <ListIcon class="absolute top-2 mr-2" />
            <span class="pl-2">{{ notice }}</span>
          </div>
        </div>
      </div>
      <div class="hidden pb-8 md:block">
        <RButton
          class-title="text-white"
          title="Proceed to Checkout"
          height="54px"
          class="!bg-navy-1 disabled:(!bg-navy-4 border-1 !border-navy-4) !mx-auto w-[300px]"
          :disabled="!pageState.isDisabledCheckout"
          @click="checkValidateCartList"
        />
      </div>
    </div>
    <div
      v-if="cartItems.length"
      class="bottom-area-checkout fixed bottom-0 left-0 z-[19] block w-full bg-white p-5 md:hidden"
    >
      <RButton
        class-title="text-white"
        title="Proceed to Checkout"
        height="54px"
        class="!bg-navy-1 disabled:(!bg-navy-4 border-1 !border-navy-4) !mx-auto w-full"
        :disabled="!pageState.isDisabledCheckout"
        @click="checkValidateCartList"
      />
    </div>
    <RModalConfirm
      v-model:visible="pageState.showModalDeleteCart"
      description="Are you sure you want to remove this product?"
      text-ok="Remove"
      text-cancel="Cancel"
      :width="270"
      description-class=""
      @ok="removeItemInCart"
      @cancel="cancelRemoveCart"
    />
    <ExceededPurchasePopup
      :is-show-modal="isShowExceededPurchasePopup"
      :exceeded-product-list="exceededProductList"
      :checked-cart-list="checkedCartList"
      @set-is-show-modal="setIsShowExceededPurchasePopup"
      @create-sale-order="createSaleOrder"
    />
    <not-for-resale-popup
      :is-show-modal="isShowNotForResalePopup"
      :checked-cart-list="checkedCartList"
      @set-is-show-modal="setIsShowNotForResalePopup"
      @create-sale-order="createSaleOrder"
    />
    <ProductAddChangeDrawer
      v-model:visible="pageState.isShowChangeAddProductDrawer"
      :immediate-change="true"
      @change="confirmChangeProduct(StatusChangeProductAutoShipEnum.CHANGE)"
      @add="confirmChangeProduct(StatusChangeProductAutoShipEnum.ADD)"
    />
    <!-- Notice sold out popup -->
    <AlertNoticeSoldOut
      v-model="soldOutState.showNoticeSoldOut"
      :is-single="false"
      :sold-out-items="soldOutState.products"
      @continue="handleContinueWithSoldOut"
    />
  </div>
</template>
<script setup>
import DeleteIcon from '@/assets/svgs/delete.svg'
import ListIcon from '@/assets/svgs/list.svg'
import { useNotification } from '@/composables/notification'
import apiService from '@/http/api'
import { notices } from '@/mocks/cart'
import { AppRoutes } from '@/router/path'
import { useCartStore } from '@/stores/modules/cart'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useMutation } from 'vue-query'
import { useRouter, useRoute } from 'vue-router'
import { convertNumber, renderCurrency } from '@/utils/currency'
import { isBeautyPlanner } from '@/utils/role'
import { storeToRefs } from 'pinia'
import { getCurrentCartBadge } from '@/utils/cart'
import {
  RankUserEnum,
  NfrImportProductEnum,
  OrderTypeEnum,
  ShoppingBagTabEnum,
  StatusChangeProductAutoShipEnum,
  CountryEnum,
  ProductSaleStatus
} from '@/helpers/enum'
import ExceededPurchasePopup from '@/components/cart/ExceededPurchasePopup.vue'
import { financial, checkBuyPeriod } from '@/utils/common'
import { MESSAGE_ERROR_CART_LIST } from '@/helpers/constant'

const { showNotification } = useNotification()
const router = useRouter()
const loadingStore = useGlobalLoadingStore()
const cartStore = useCartStore()
const authUserStore = useAuthUserStore()
const { autoShipCartBadge, standardCartBadge, nfrCartBadge } = storeToRefs(cartStore)
const { currentAuthUser } = storeToRefs(authUserStore)
const { showGlobalLoading } = loadingStore

const isShowExceededPurchasePopup = ref(false)
const isShowNotForResalePopup = ref(false)
const checkedCartList = ref([])
const exceededProductList = ref([])
const route = useRoute()

const isPlannerRank = () => {
  return RankUserEnum.PLANNER === currentAuthUser.value?.rank?.code
}

const setIsShowExceededPurchasePopup = () => {
  isShowExceededPurchasePopup.value = !isShowExceededPurchasePopup.value
}
const setIsShowNotForResalePopup = () => {
  isShowNotForResalePopup.value = !isShowNotForResalePopup.value
}

const tabs = ref([])

const currentTab = ref(ShoppingBagTabEnum.STANDARD)
const cartItems = ref([])

const isAutoShipTab = computed(() => currentTab.value === ShoppingBagTabEnum.AUTOSHIP)

const isShowTotalPoint = computed(
  () => !isAutoShipTab.value || (isAutoShipTab.value && isBeautyPlanner.value)
)

const currencyForSubTotal = computed(() => {
  const data = cartItems.value.find((el) => el.checked && !el.deleted)
  return renderCurrency(data?.currency?.code)
})
const resetCartQuantity = async () => {
  await getCurrentCartBadge()
  const TABS = [
    {
      label: `Standard (${standardCartBadge.value})`,
      value: ShoppingBagTabEnum.STANDARD
    },
    {
      label: `Autoship (${autoShipCartBadge.value})`,
      value: ShoppingBagTabEnum.AUTOSHIP
    }
  ]
  if (currentAuthUser.value?.nationalCode === CountryEnum.CA.value) {
    tabs.value = [
      ...TABS,
      {
        label: `${isPlannerRank() ? NfrImportProductEnum.NFR : NfrImportProductEnum.IMPORT} (${
          nfrCartBadge.value
        })`,
        value: ShoppingBagTabEnum.NFR_IMPORT
      }
    ]
  } else {
    tabs.value = [...TABS]
  }
}

watch(
  () => route?.query?.tab,
  (value) => {
    if (value) {
      currentTab.value = value
    }
  },
  { immediate: true }
)

const getCartList = async () => {
  let response = []
  switch (currentTab.value) {
    case ShoppingBagTabEnum.STANDARD:
      response = await apiService.cartService.getStandardCartList()
      break
    case ShoppingBagTabEnum.AUTOSHIP:
      response = await apiService.cartService.getAutoShipCartList()
      break
    case ShoppingBagTabEnum.NFR_IMPORT:
      response = await apiService.cartService.getNfrCartList()
      break
    default:
      break
  }
  return response
}

const refetchCarts = async () => {
  showGlobalLoading(true)
  const response = await getCartList()
  showGlobalLoading(false)
  if (response.success && response.data) {
    getCurrentCartBadge()

    let listItems

    if (isAutoShipTab.value) {
      listItems = convertAutoShipCartData(response.data?.list)
    } else {
      listItems = response.data
    }

    const cartEntries = []
    listItems.forEach((cart) => {
      cartEntries.push({ ...cart, checked: findCheckedStatus(cart) })
    })
    cartItems.value = cartEntries
  } else if (response.status === 401 || response.status === 403) {
    router.push(AppRoutes.login)
  } else {
    // error
  }
}

const genBeautyPoint = () => (isBeautyPlanner.value ? 'BP' : 'P')

const findCheckedStatus = (item) => {
  return cartItems.value.find((el) => el.cartId === item.cartId)?.checked || false
}

const isValidQuantity = (quantity) => {
  return quantity && quantity > 0
}

const checkAtLeastItemSelected = () => {
  const isChecked = cartItems.value.some((el) => el.checked === true)
  const validQuantity = cartItems.value.some((el) => el.checked && !isValidQuantity(el.quantity))
  return isChecked && !validQuantity
}

const pageState = reactive({
  isCheckedAll: false,
  showModalDeleteCart: false,
  currentCartItem: [],
  singleCartItem: undefined,
  isDisabledCheckout: computed(() => checkAtLeastItemSelected()),
  isShowChangeAddProductDrawer: false,
  dataAutoShipExist: {},
  arrProdValidBuySignUp: []
})
const subTotal = computed(() => calculateSubTotal())
const totalBP = computed(() => calculateTotalBP())
const getCheckedItems = () => cartItems.value.filter((el) => el.checked && !el.deleted)
const calculateSubTotal = () => {
  const checkedItems = getCheckedItems()
  return checkedItems.reduce(
    (total, current) =>
      total + current.quantity * (current?.salesAmountDiscountAfterRank || current?.salesAmount),
    0
  )
}

const calculateTotalBP = () => {
  const checkedItems = getCheckedItems()
  return checkedItems.reduce((total, current) => total + current.quantity * current?.bp, 0)
}

const onSelectAll = (isChecked) => {
  pageState.isCheckedAll = !isChecked
  getCheckedItemForAll(isChecked)
}

const getCheckedItemForAll = (isChecked) => {
  if (!isChecked) {
    cartItems.value = cartItems.value.map((el) => ({ ...el, checked: true }))
  } else {
    cartItems.value = cartItems.value.map((el) => {
      return { ...el, checked: false }
    })
  }
}

const onCheckChildItem = (child) => {
  child.checked = !child.checked
  resolveCheckAllState()
}

const resolveCheckAllState = () => {
  const unChecked = cartItems.value.some((el) => el.checked === false)
  pageState.isCheckedAll = !unChecked
}

const { mutate: updateCartQuantityMutation } = useMutation(
  async ({ cartId, quantity }) => {
    if (isAutoShipTab.value) {
      return await apiService.cartService.updateAutoShipCartQuantity(cartId, {
        quantity
      })
    }

    return await apiService.cartService.updateCartQuantity(cartId, {
      quantity
    })
  },
  {
    onSuccess: (data, variables) => {
      showGlobalLoading(false)
      if (data?.success) {
        cartItems.value[variables.index].quantity = variables.quantity
        resetCartQuantity()
      }
    },
    onError: (error) => {
      console.log(error)
    }
  }
)

const { mutate: deleteSingleCartMutation } = useMutation(
  async (payload) => {
    if (isAutoShipTab.value) {
      return await apiService.cartService.deleteSingleAutoShipCartQuantity(payload)
    }
    return await apiService.cartService.deleteSingleCartQuantity(payload)
  },
  {
    onSuccess: (data) => {
      showGlobalLoading(false)
      if (data?.success) {
        refetchCarts()
        resetCartQuantity()
      }
    },
    onError: (error) => {
      console.log(error)
    }
  }
)

const { mutate: deleteMultipleCartMutation } = useMutation(
  async (payload) => {
    if (isAutoShipTab.value) {
      return await apiService.cartService.deleteMultipleAutoShipCartQuantity(payload)
    }
    return await apiService.cartService.deleteMultipleCartQuantity(payload)
  },
  {
    onSuccess: (data) => {
      showGlobalLoading(false)
      if (data?.success) {
        refetchCarts()
        resetCartQuantity()
      }
    },
    onError: (error) => {
      console.log(error)
    }
  }
)

const { mutate: createSaleOrderMutation } = useMutation(
  async (payload) => {
    if (isAutoShipTab.value) {
      return await apiService.orderService.createSheetCheckoutAutoShip(payload)
    }
    return await apiService.orderService.createSaleOrder(payload)
  },
  {
    onSuccess: (data) => {
      showGlobalLoading(false)
      if (data?.success) {
        if (isAutoShipTab.value) {
          if (data.message === MESSAGE_ERROR_CART_LIST) {
            pageState.dataAutoShipExist = data.data
            pageState.isShowChangeAddProductDrawer = true
          } else {
            router.push({
              name: AppRoutes.autoShip.autoShipCheckout.name,
              params: {
                identification: data?.data?.subscriptionId
              }
            })
          }
        } else {
          router.push({
            name: AppRoutes.cart.placeOrder.name,
            params: {
              identification: data?.data?.identification
            }
          })
        }
      } else {
        showNotification({
          type: 'error',
          description: data.message ?? 'Create order failed',
          duration: 3
        })
      }
    },
    onError: (error) => {
      console.log(error)
    }
  }
)

const getValidateCheckedItem = async (list) => {
  const results = list.map((item) => {
    const newItem = {
      productId: item.productId,
      quantity: item.quantity,
      productOptionId: item.productOptionId
    }
    return newItem
  })
  const { data: exceededList } = await apiService.orderService.validateQuantityPurchased(results)
  return exceededList || []
}

const soldOutState = reactive({
  products: [],
  showNoticeSoldOut: false
})

const getProductSoldOut = () => {
  const products = checkedCartList.value.filter(
    (el) =>
      el?.salesStatus?.code === ProductSaleStatus.SOLD_OUT ||
      el?.optionSalesStatus?.code === ProductSaleStatus.SOLD_OUT
  )
  soldOutState.products = products
}
const checkBuyPeriodArr = (data) => {
  const arr = []
  const arrError = []
  data.map((item) => {
    const resValidBuy = checkBuyPeriod(item)
    if (!resValidBuy) arr.push(item)
    else arrError.push(item)
  })

  pageState.arrProdValidBuySignUp = arrError

  return arr.length === data.length
}

const checkValidateCartList = async () => {
  const checkedItem = cartItems.value.filter((el) => el.checked && !el.deleted)
  checkedCartList.value = checkedItem
  getProductSoldOut()

  const resValidBuy = await checkBuyPeriodArr(checkedItem)
  if (!resValidBuy) {
    showNotification({
      type: 'error',
      message: `[${pageState.arrProdValidBuySignUp[0]?.productNameInfo?.engName}] You have passed your eligible purchase period. People within ${pageState.arrProdValidBuySignUp[0]?.setBuyPeriodLimitDay} days from enrollment are allowed for purchase.`
    })
    return
  }

  showGlobalLoading(true)

  const exceededList = await getValidateCheckedItem(checkedItem)

  if (currentTab.value === ShoppingBagTabEnum.NFR_IMPORT) {
    if (!isPlannerRank()) {
      createSaleOrder(checkedCartList.value)
    } else {
      let isMinQuantity = false
      exceededList.forEach((item) => {
        cartItems.value = cartItems.value.map((cartItem) => {
          let cartItemNew = cartItem
          if (item.productId === cartItem.productId) {
            if (item.minQuantityLimit > cartItem.quantity) isMinQuantity = true
            cartItemNew = {
              ...cartItemNew,
              minQuantity: item.minQuantityLimit
            }
          }
          return cartItemNew
        })
      })
      if (!isMinQuantity) {
        if (exceededList.length > 0) {
          isShowExceededPurchasePopup.value = true
          exceededProductList.value = exceededList
        } else {
          isShowNotForResalePopup.value = true
        }
      }
    }
  } else {
    if (exceededList.length > 0) {
      exceededList.forEach((item) => {
        cartItems.value = cartItems.value.map((cartItem) => {
          let cartItemNew = cartItem
          if (item.productId === cartItem.productId) {
            cartItemNew = {
              ...cartItemNew,
              minQuantity: item.minQuantityLimit,
              maxQuantity: item.remainingQuantity
            }
          }
          return cartItemNew
        })
      })
    } else {
      if (soldOutState.products.length) {
        soldOutState.showNoticeSoldOut = true
      } else {
        createSaleOrder(checkedCartList.value)
      }
    }
  }
  showGlobalLoading(false)
}

const handleContinueWithSoldOut = () => {
  soldOutState.showNoticeSoldOut = false
  createSaleOrder(checkedCartList.value)
}

const createSaleOrder = (list) => {
  const payload = isAutoShipTab.value
    ? {
      subscriptionCartRequestList: list.map((el) => ({
        cartId: el.cartId,
        productId: el.productId,
        productOptionId: el?.productOptionId,
        quantity: el.quantity,
        salesAmountDiscountAfterRank: el?.salesAmount,
        bp: el.bp
      })),
      totalSalesAmountProduct: +financial(subTotal.value)
    }
    : {
      productList: list.map((el) => ({
        productId: el.productId,
        quantity: el.quantity,
        productOptionId: el?.productOptionId
      })),
      salesOrderType: OrderTypeEnum.GENERAL_ORDER
    }
  createSaleOrderMutation(payload)
}

const onChangeQuantity = (data) => {
  const itemIndex = cartItems.value.findIndex((el) => el.cartId === data.cartId)
  let quantity = 1
  const currentQuantity = Number(cartItems.value[itemIndex].quantity)
  if (!data.isIncrease) {
    quantity = cartItems.value[itemIndex].quantity > 1 ? currentQuantity - 1 : 1
  } else {
    quantity = currentQuantity + 1
  }
  showGlobalLoading(true)
  updateCartQuantityMutation({ cartId: data.cartId, quantity, index: itemIndex })
}

const onBlurQuantity = (data) => {
  const itemIndex = cartItems.value.findIndex((el) => el.cartId === data.cartId)
  updateCartQuantityMutation({
    cartId: data.cartId,
    quantity: Number(data.quantity),
    index: itemIndex
  })
}

watch(
  [() => currentAuthUser.value?.nationalCode],
  async () => {
    await resetCartQuantity()
  },
  { deep: true }
)
const showDeleteModal = (value) => {
  pageState.showModalDeleteCart = value
}

const removeItemInCart = () => {
  showGlobalLoading(true)
  showDeleteModal(false)
  if (pageState.singleCartItem) {
    deleteSingleCartMutation(pageState.singleCartItem)
  } else {
    deleteMultipleCartMutation(pageState.currentCartItem)
  }
  resetPageState()
}

const resetPageState = () => {
  pageState.singleCartItem = undefined
  pageState.currentCartItem = []
}

const cancelRemoveCart = () => {
  showDeleteModal(false)
  pageState.currentCartItem = []
  pageState.singleCartItem = undefined
}

const preDeleteAll = () => {
  pageState.currentCartItem = cartItems.value?.filter((el) => el.checked).map((el) => el.cartId)
  if (pageState.currentCartItem?.length) {
    showDeleteModal(true)
  }
}

const hasCheckedItem = () => {
  const items = cartItems.value.filter((el) => el.checked)
  return !!items.length
}

const onPreDeleteCartItem = (cartId) => {
  pageState.singleCartItem = cartId
  showDeleteModal(true)
}

onMounted(async () => {
  showGlobalLoading(true)
  await refetchCarts()
  onSelectAll(false)
  resetCartQuantity()
})

onBeforeUnmount(() => {
  showGlobalLoading(false)
})

const showCheckAll = computed(() => {
  const dataMatch = cartItems.value?.filter((item) => item?.deleted) || []
  return cartItems.value.length !== dataMatch.length
})

const convertAutoShipCartData = (products = []) => {
  return products.map((p) => ({
    ...p,
    productNameInfo: {
      engName: p.englishName
    }
  }))
}

const onChangeTab = async () => {
  Object.assign(pageState, {
    isCheckedAll: true,
    showModalDeleteCart: false,
    currentCartItem: [],
    singleCartItem: undefined
  })
  await refetchCarts()
  onSelectAll(false)
}

const amountAndPoint = (data) => {
  return data.reduce(
    (result, p) => {
      const quantity = ~~p.quantity
      const point = +p.bp
      const amount = +p.salesAmount

      const amountItem = amount * quantity
      const pointItem = point * quantity

      result.amount += amountItem
      result.point += pointItem
      return result
    },
    {
      amount: 0,
      point: 0
    }
  )
}

const confirmChangeProduct = async (status) => {
  const currentProductList =
    pageState.dataAutoShipExist?.productList?.map((el) => ({
      productId: el.productId,
      productOptionId: el?.productOptionId,
      quantity: el.quantity,
      salesAmount: el?.salesAmount,
      bp: el.bp
    })) || []
  let newData = [...currentProductList]

  if (status === StatusChangeProductAutoShipEnum.ADD) {
    checkedCartList.value.map((item) => {
      const findExistId = currentProductList.find((e) => e.productId === item.productId)
      if (findExistId) {
        newData = newData.filter((e) => e.productId !== item.productId)
        newData.push({
          productId: item.productId,
          productOptionId: item?.productOptionId,
          quantity: item.quantity + findExistId.quantity,
          salesAmount: item?.salesAmount + findExistId.salesAmount,
          bp: item.bp || 0 + findExistId.bp || 0
        })
      } else {
        newData.push({
          productId: item.productId,
          productOptionId: item?.productOptionId,
          quantity: item.quantity,
          salesAmount: item?.salesAmount,
          bp: item.bp || 0
        })
      }
    })
  }
  if (status === StatusChangeProductAutoShipEnum.CHANGE) {
    newData = checkedCartList.value.map((item) => {
      return {
        productId: item.productId,
        productOptionId: item?.productOptionId,
        quantity: item.quantity,
        salesAmount: item?.salesAmount,
        bp: item.bp || 0
      }
    })
  }

  const orderCountry = checkedCartList.value[0]?.country

  const pointEarnPayload = {
    paymentAmountWithoutShippingFee: amountAndPoint(newData)?.amount,
    userType: currentAuthUser.value.userType?.code,
    salesOrderType: OrderTypeEnum.SUBSCRIBE_ORDER,
    userCountry: currentAuthUser.value?.nationalCode,
    orderCountry
  }
  showGlobalLoading(true)
  try {
    const { data: dataPointEarn } = await apiService.orderService.getPointEarnOrder(
      pointEarnPayload
    )

    const dataSubmit = {
      totalSalesAmount: amountAndPoint(newData)?.amount,
      changeProductDtoList: newData,
      subscriptionId: pageState.dataAutoShipExist?.subscriptionId,
      pointEarn: dataPointEarn?.pointEarn || 0
    }
    const response = await apiService.myPageService.changeProductAutoship(dataSubmit)
    if (response.success) {
      router.push({
        name: AppRoutes.myPage.name
      })
    } else {
      showNotification({
        type: 'error',
        message: response.message,
        duration: 3
      })
    }
  } finally {
    showGlobalLoading(false)
  }
}
</script>
<style lang="scss" scoped>
@media (max-width: 767px) {
  .cart-list {
    margin: 0 !important;
    @apply px-5 lg:px-0;
  }

  .container {
    @apply max-w-3xl;
  }
}

@media (min-width: 1280px) {
  .container-x {
    max-width: 1200px !important;
  }
}

.bottom-area-checkout {
  box-shadow: 0px -2px 2px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0px -2px 2px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px -2px 2px 0px rgba(0, 0, 0, 0.1);
}

.tab-cart {
  :deep(.tab__item) {
    margin: 0 !important;
  }
}
</style>
