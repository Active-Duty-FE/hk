<template>
  <div>
    <div class="relative mb-[65px]">
      <img class="bag__banner" :src="state.bagBannerUrl" alt="" loading="lazy" />
      <img class="bag__profile" loading="lazy" alt="" :src="state.bagProfileUrl" />
    </div>

    <div class="mx-auto max-w-[1240px] px-5">
      <p class="bag__title">{{ state.title }}</p>
      <p class="bag__subTitle">{{ state.subTitle }}</p>
      <a-divider class="bg-gray-10 !mb-10 !mt-0" />

      <div v-if="state.productBag?.length" class="flex flex-col gap-5">
        <BagPreviewProductItem
          v-for="item in state.productBag"
          :key="item.productId"
          v-model="item.productQuantity"
          :item="item"
          :disabled="isPreview"
        />
      </div>

      <div v-else class="text-center">No Data</div>

      <a-divider class="bg-gray-10 !mb-7.5 !mt-10" />
      <div class="flex items-center justify-between">
        <span class="font-550 text-gray-15 text-base leading-5">Subtotal</span>
        <span class="font-550 leading-6.5 text-gray-15 text-xl">
          {{ renderCurrency(state.productBag[0]?.currencyPrice) }} {{ convertNumber(subTotal) }}
        </span>
      </div>

      <div class="my-10 flex justify-center pb-5">
        <RButton
          title="Proceed to checkout"
          class="!border-navy-6 !bg-navy-6 disabled:(!bg-navy-4 !border-navy-4) w-full max-w-sm"
          class-title="text-white"
          :disabled="isPreview"
          @click="onCheckout"
        />
      </div>
    </div>

    <NoticeSoldOutPopup
      v-model="state.isShowNoticeSoldOutPopup"
      :products="productSoldOutList"
      :is-sold-out="state.isSoldOut"
      @confirm="onCheckoutFromPopup"
    />
    <FormLoginWhenOrderBag
      :visible-modal="state.visibleModalLogin"
      :create-sheet-order="handleCreateSheetOrderInModal"
      :close-modal="() => (state.visibleModalLogin = false)"
      :list-products="state.productForModal"
    />
  </div>
</template>

<script setup>
import { computed, onBeforeMount, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { AppRoutes } from '@/router/path'
import { convertNumber, renderCurrency } from '@/utils/currency'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { storeToRefs } from 'pinia'
import { OrderTypeEnum, PRODUCT_STATUS_ENUM } from '@/helpers/enum'
import { useNotification } from '@/composables/notification'

const route = useRoute()
const router = useRouter()

const authUserStore = useAuthUserStore()
const { currentAuthUser } = storeToRefs(authUserStore)

const { showGlobalLoading } = useGlobalLoadingStore()
const { showNotification } = useNotification()

const state = reactive({
  isShowNoticeSoldOutPopup: false,
  isTempSoldOut: false,
  isSoldOut: false,
  tempSoldOutList: [],
  soldOutList: [],
  visibleModalLogin: false,
  productBag: [],
  ignoreSoldOutPopup: false,
  arrProdValidBuySignUp: [],
  productForModal: []
})

onBeforeMount(async () => {
  await getBag()
  const hasSoldOut = checkStatusBag()
  hasSoldOut && (state.isShowNoticeSoldOutPopup = true)
})

const isPreview = computed(() => route.name === AppRoutes.bag.preview.name)

const subTotal = computed(() => {
  return state.productBag?.reduce((total, item) => {
    total += (item.purchaseAmount ?? item.salesAmount) * item.productQuantity
    return total
  }, 0)
})

const productSoldOutList = computed(() => {
  if (state.isSoldOut) return state.soldOutList
  if (state.isTempSoldOut) return state.tempSoldOutList
  return []
})

const getBag = async () => {
  const bagId = route.params.id
  showGlobalLoading(true)
  const { data, success } = await (currentAuthUser?.value
    ? apiService.bagService.getBagDetail(bagId)
    : apiService.bagService.getBagDetailPublic(bagId))
  showGlobalLoading(false)
  Object.assign(state, success ? data : {})

  if (!state.productBag) state.productBag = []
}

const checkSoldOut = (item) =>
  item.salesStatus?.code === PRODUCT_STATUS_ENUM.SOLD_OUT ||
  item.optionSalesStatus?.code === PRODUCT_STATUS_ENUM.SOLD_OUT

const checkPause = (item) =>
  item.salesStatus?.code === PRODUCT_STATUS_ENUM.PAUSE ||
  item.optionSalesStatus?.code === PRODUCT_STATUS_ENUM.PAUSE

const checkStatusBag = () => {
  const tempSoldOutList = []
  const soldOutList = []
  state.productBag.forEach((p) => {
    if (checkSoldOut(p)) {
      tempSoldOutList.push(p)
      return
    }

    if (checkPause(p)) {
      soldOutList.push(p)
    }
  })

  if (tempSoldOutList.length) state.isTempSoldOut = true
  if (soldOutList.length) state.isSoldOut = true

  state.tempSoldOutList = tempSoldOutList
  state.soldOutList = soldOutList

  return state.isSoldOut || state.isTempSoldOut
}

const createSheetOrderForm = async (products) => {
  showGlobalLoading(true)
  try {
    const productList = products.map((el) => ({
      productId: el.productId,
      quantity: el.productQuantity,
      productOptionId: el?.productOptionId
    }))
    const payload = {
      productList,
      salesOrderType: OrderTypeEnum.GENERAL_ORDER
    }
    const payloadNonMember = {
      productList,
      bagUserInfoRequest: {
        plannerBagId: state?.bagId
      }
    }
    const response = currentAuthUser?.value
      ? await apiService.orderService.createSaleOrder(payload)
      : await apiService.orderService.createSalesOrderPublic(payloadNonMember)
    if (response.success) {
      router.push({
        name: currentAuthUser?.value
          ? AppRoutes.cart.placeOrder.name
          : AppRoutes.orderNonMember.orderCheckout.name,
        params: { identification: response?.data?.identification },
        query: currentAuthUser?.value ? {} : { plannerBagId: state?.bagId }
      })
    } else {
      showNotification({ type: 'error', duration: 3, message: response.message })
    }
  } finally {
    showGlobalLoading(false)
  }
}

const onCheckoutFromPopup = async () => {
  if (!state.ignoreSoldOutPopup) return
  if (!currentAuthUser.value) {
    state.visibleModalLogin = true
    return
  }
  handleCreateSheetOrderInModal()
}

const onCheckout = async () => {
  const products = state.productBag.filter((p) => p.productQuantity)
  state.productForModal = products
  if (!products.length) {
    showNotification({
      type: 'error',
      message: 'Please select at least 1 product.'
    })
    return
  }

  state.ignoreSoldOutPopup = true
  await getBag()
  const hasSoldOut = checkStatusBag()
  if (hasSoldOut) {
    state.isShowNoticeSoldOutPopup = true
    return
  }

  if (!currentAuthUser.value) {
    state.visibleModalLogin = true
    return
  }

  await createSheetOrderForm(products)
}

const handleCreateSheetOrderInModal = () => {
  const products = state.productBag.filter((p) => p.productQuantity)

  if (products.length) createSheetOrderForm(products)
}
</script>

<style lang="scss" scoped>
.bag {
  &__banner {
    @apply h-80vh w-full object-cover;
  }

  &__profile {
    @apply w-22.5 h-22.5 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-pointer rounded-full bg-white object-cover;
    @apply border-1 border-gray-11 border-solid;
  }

  &__title {
    @apply leading-7.5 mb-7 break-words text-center text-[28px] font-medium;
  }

  &__subTitle {
    @apply leading-5.5 mb-10 whitespace-pre-line break-words text-center text-base font-light;
  }

  &__product-item:not(:last-child) {
    @apply border-b-solid border-b-gray-11 border-b-1;
  }
}
</style>
