<template>
  <div class="bg-gray-6 text-black-50 flex w-full items-center justify-center sm:py-10">
    <div class="w-full bg-white sm:max-w-[550px]">
      <div class="hidden flex-col text-center md:flex">
        <span class="py-6 text-base font-medium capitalize">
          {{ AppTitle.autoShip.autoShipCheckout }}
        </span>
        <a-divider class="bg-black-50 !my-0" />
      </div>

      <a-collapse v-model:activeKey="activeKey" :bordered="false">
        <a-collapse-panel
          v-for="(item, index) in ORDER_AUTO_SHIP_CHECKOUT_LISTS"
          :key="index"
          class="collapse-panel-custom"
          :class="{
            '!bg-navy-4 pointer-events-none !cursor-not-allowed':
              item.id === ID_AUTO_SHIP_CHECKOUT.DATE && !pageState.firstRound
          }"
          :show-arrow="false"
        >
          <template #header>
            <div v-if="item.id === ID_AUTO_SHIP_CHECKOUT.SHIPPING" class="flex flex-col">
              <span>{{ item.title }}</span>
              <div
                v-if="isCloseCollapse(index) && pageState.shippingAddress?.userAddressId"
                class="collapse__description"
              >
                {{ shippingAddressDescription(pageState.shippingAddress) }}
              </div>
            </div>

            <div v-if="item.id === ID_AUTO_SHIP_CHECKOUT.DATE">
              {{ item.title }}
              <div v-if="isCloseCollapse(index)" class="collapse__description">
                {{ pageState?.datePayment }}
              </div>
            </div>
            <div v-if="item.id === ID_AUTO_SHIP_CHECKOUT.PAYMENT">
              {{ item.title }}
              <div v-if="isCloseCollapse(index)" class="collapse__description">
                <span>{{ getCurrentCard?.ownerName }} </span>
                <span>
                  {{ getCurrentCard?.cardNumber }}
                </span>
              </div>
            </div>
            <div v-if="item.id === ID_AUTO_SHIP_CHECKOUT.COUPONS">
              {{ item.title }}
              <div v-if="isCloseCollapse(index)" class="collapse__description">
                <span v-if="pageState.cartItems[0]?.country === currentAuthUser?.nationalCode">
                  {{ orderStore?.totalPoint || 0 }} P Point
                </span>
                <span>
                  {{ renderCurrency(pageState.cartItems[0].currency?.code) }}
                  {{ orderStore?.amountDiscountFromCoupon }} Coupon</span
                >
              </div>
            </div>
            <div v-if="item.id === ID_AUTO_SHIP_CHECKOUT.SUMMARY">
              {{ item.title }}
            </div>
          </template>

          <template #extra>
            <div class="mr-7">
              <div class="icon absolute h-[15px] w-[1px] rotate-90"></div>
              <div
                :class="[
                  { open: activeKey.includes(String(index)) },
                  'icon h-[15px] w-[1px]  duration-500'
                ]"
              ></div>
            </div>
          </template>

          <div v-if="item.id === ID_AUTO_SHIP_CHECKOUT.SHIPPING">
            <ShippingAddress
              v-model:shipping-address="pageState.shippingAddress"
              :country="pageState.cartItems[0].country"
              :allow-valid="pageState.allowValid.shipping"
            />
          </div>

          <div v-if="item.id === ID_AUTO_SHIP_CHECKOUT.DATE">
            <div class="mb-5">
              <PaymentDate v-model="pageState.datePayment" @get-date-payment="handleDatePayment" />
            </div>

            <span v-if="pageState.messageValidDatePayment" class="text-red-2 text-[10px]">{{
              pageState.messageValidDatePayment
            }}</span>
            <r-line-notice content="Payment date takes effect from the second month" />
            <r-line-notice>
              <span class="text-xs">
                You can change the payment date through
                <span class="underline"> My page > Autoship</span> Subscription Management.
              </span>
            </r-line-notice>
            <r-line-notice
              content="Your first order will be charged today. The date you choose above will be charged next month"
            />
          </div>
          <div v-if="item.id === ID_AUTO_SHIP_CHECKOUT.PAYMENT">
            <PaymentFormOrder
              :shipping-default="pageState.shippingAddress"
              :close-collapse-item="() => closeCollapseItem(index)"
              :is-auto-ship="true"
              :allow-valid="pageState.allowValid.payment"
            />
          </div>
          <div v-if="item.id === ID_AUTO_SHIP_CHECKOUT.COUPONS">
            <PointAndCoupon
              :sub-total="
                financial(calculateTotal() - +pageState.infoOrderSummary?.autoshipDiscount)
              "
              :currency="pageState.cartItems[0].currency?.code"
              :country-product="pageState.cartItems[0].country"
            />
          </div>
          <div v-if="item.id === ID_AUTO_SHIP_CHECKOUT.SUMMARY">
            <OrderSummary
              :carts="pageState.cartItems"
              :shipping-fee="pageState?.shippingFee"
              :is-auto-ship="true"
              :point-earn="pageState.pointEarn"
              :auto-ship-discount="pageState.infoOrderSummary?.autoshipDiscount"
              :total="pageState.infoOrderSummary?.totalFinalAmount"
              :total-bp="pageState.infoOrderSummary?.totalFinalAmountBP"
              :currency="pageState.cartItems[0].currency?.code"
              :membership-rank-discount="pageState?.infoOrderSummary?.membershipRankDiscount"
            />
          </div>
        </a-collapse-panel>
      </a-collapse>
      <div class="mb-[82px] p-5">
        <CartCheckBox
          v-model:checked="agreeTerm"
          :size="SIZE_CHECKBOX.SMALL"
          @checked-change="() => (agreeTerm = !agreeTerm)"
        >
          <template #content>
            <span class="font-475 ml-2 text-sm"> Agree to Terms </span>
          </template>
        </CartCheckBox>
        <div class="ml-6">
          <p class="mb-[15px] text-sm">
            I agree to the Autoship subscription terms and conditions (benefits, collection upon
            withdrawal, collection upon return, delivery, etc.)
          </p>
          <div
            class="font-550 text-black-50 cursor-pointer cursor-pointer py-2.5 text-xs underline"
            @click="viewReturnTerms"
          >
            View Return Terms
          </div>
          <div
            class="font-550 text-black-50 cursor-pointer cursor-pointer py-2.5 text-xs underline"
            @click="viewShippingTerms"
          >
            View Shipping Terms
          </div>
          <span v-if="pageState.messageValidTerm" class="text-red-2 text-[10px]">
            {{ pageState.messageValidTerm }}
          </span>
        </div>
      </div>
      <div class="mx-5 mb-10">
        <r-button
          title="Process Payment"
          type="primary"
          class="!bg-navy-deep !border-navy-deep !rounded-0 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full text-white"
          @click="handleCheckMatchPinCode"
        />
      </div>
    </div>
  </div>
  <!-- Pin code mobile -->
  <CartPinCode
    :visible="pinCodeState.showPinCodeMobile"
    :step-text="pinCodeState.stepText"
    :title="pinCodeState.titlePinCode"
    :error-validate="pinCodeState.errorValidate"
    :is-refresh="pinCodeState.isRefresh"
    :fail-count="pinCodeState.failCount"
    class="md:hidden"
    @close="modalPinCode.closePinPopup()"
    @final-pin-code="getFinalPinCode"
  />
  <!-- Pin code mobile -->
  <!-- Pin code desktop -->
  <CartPinCodeDesktop
    :visible="pinCodeState.showPinCodeDesktop"
    :step-text="pinCodeState.stepText"
    :title="pinCodeState.titlePinCode"
    :error-validate="pinCodeState.errorValidate"
    :is-refresh="pinCodeState.isRefresh"
    :fail-count="pinCodeState.failCount"
    class="hidden md:block"
    @close="modalPinCode.closePinPopup()"
    @final-pin-code="getFinalPinCode"
  />
  <!-- Pin code desktop -->

  <RModalAlert
    v-model:visible="orderStore.modalAlertState.showModal"
    title="Alarm"
    text-btn="Confirm"
    :description="orderStore.modalAlertState.descriptionModal"
    :width="280"
    @confirm="handleConfirmAlert"
  />

  <ModalAuthenticateAccount
    :visible="orderStore.visibleAuthCard"
    :on-cancel="orderStore.closeModalAuthRemove"
  />
  <ModalUnAuthCard v-model:visible="orderStore.visibleModalUnAuthCard" />
  <RModalConfirm
    v-model:visible="pageState.visibleAlert"
    :width="370"
    text-ok="PROCESS ORDER"
    text-cancel="EDIT ADDRESS"
    :mask-closable="false"
    @ok="handlePaymentOrder"
    @cancel="pageState.visibleAlert = false"
  >
    <template #extraDescription>
      <span> {{ pageState.descriptionAlert }}</span>
    </template>
  </RModalConfirm>
</template>

<script setup>
import { reactive, ref, onMounted, computed, watch, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMutation } from 'vue-query'
import apiService from '@/http/api'
import {
  ORDER_AUTO_SHIP_CHECKOUT_LISTS,
  ID_AUTO_SHIP_CHECKOUT,
  SIZE_CHECKBOX,
  FORMAT_FULL_YEAR,
  MESSAGE_PINCODE,
  VALUE_COUNTRY,
  CURRENCY,
  SHIP_OPTION_ENUM
} from '@/helpers/constant'
import { AppRoutes, AppTitle } from '@/router/path'
import { shippingAddressDescription, financial } from '@/utils/common'
import { formatDateTime } from '@/utils/datetime'
import { useOrderStore } from '@/stores/modules/order'
import { useModalPinCode } from '@/stores/modules/modal-pincode'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useNotification } from '@/composables/notification'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { storeToRefs } from 'pinia'
import { OrderTypeEnum, NfrImportProductEnum } from '@/helpers/enum'
import { VALIDATE_MESSAGE } from '@/helpers/validate-message'
import { renderCurrency } from '@/utils/currency'

const domain = window.location.origin

const router = useRouter()
const route = useRoute()

const activeKey = ref([])
const agreeTerm = ref(false)

const orderStore = useOrderStore()

const userStore = useAuthUserStore()
const { currentAuthUser } = storeToRefs(userStore)

const modalPinCode = useModalPinCode()
const { pinCodeState } = storeToRefs(modalPinCode)

const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading

const { showNotification } = useNotification()

const pageState = reactive({
  salesOrderNumber: '',
  cartItems: [],
  shippingAddress: {},
  shippingFee: 0,
  datePayment: null,
  pointEarn: 0,
  infoOrderSummary: {},
  firstRound: true,
  payloadSaleTax: {},
  payloadShippingFee: {},
  allowValid: {
    shipping: false,
    payment: false
  },
  messageValidTerm: '',
  messageValidDatePayment: '',
  visibleAlert: false,
  descriptionAlert: ''
})

const viewReturnTerms = () => window.open(`${domain}${AppRoutes.policy.path}`, '_blank')
const viewShippingTerms = () => window.open(`${domain}${AppRoutes.shipping.path}`, '_blank')

watch(
  () => currentAuthUser.value,
  async (value) => {
    const userId = value?.userSeqNo
    if (userId) {
      await orderStore.getListCard(userId, true)
      await orderStore.getPointOrder(userId)
    }
  },
  { immediate: true }
)
const getSaleTax = async (payload) => {
  await orderStore.calculateTaxOrder(payload)
}

watch(
  () => [pageState.shippingAddress, pageState.cartItems],
  ([val, valCart]) => {
    if (Object.keys(val).length > 0 && valCart.length) {
      handleDataOrderAutoShip(val, valCart)
    }
  }
)

const handleConfirmAlert = () => {
  if (!pageState.shippingFee && Object.keys(pageState.shippingAddress).length) {
    router.push({ name: AppRoutes.cart.list.name, query: { tab: 1 } })
  }
  orderStore.handleChangeModalAlertState(false, '')
}

const handleCheckAddressAvailable = () => {
  const productCountry = pageState.cartItems[0]?.country
  if (pageState.shippingAddress?.country === VALUE_COUNTRY.CA) {
    return [NfrImportProductEnum.NFR, VALUE_COUNTRY.CA].includes(productCountry)
  } else {
    return productCountry === VALUE_COUNTRY.US
  }
}

const handleDataOrderAutoShip = async (val, valCart) => {
  const {
    userAddressId,
    firstName,
    lastName,
    zipcode,
    address,
    aptFloorSuite,
    state,
    country,
    phoneNumber,
    homePhone,
    city
  } = val
  const shippingAddress = {
    firstName,
    lastName,
    address1: address,
    address2: aptFloorSuite,
    city,
    state,
    zipCode: zipcode,
    country,
    cellPhone: phoneNumber,
    homePhone
  }

  const salesOrderProductList = valCart.map((item) => {
    return {
      productId: item?.productId,
      quantity: item?.quantity,
      productOptionId: item?.productOptionId
    }
  })

  try {
    showGlobalLoading(true)

    const payloadShip = {
      salesOrderProductList,
      userAddressId,
      couponList: orderStore?.listCouponsChoose || [],
      salesOrderType: OrderTypeEnum.SUBSCRIBE_ORDER
    }
    pageState.payloadShippingFee = payloadShip

    await getShippingFeeOrder({ salesOrderProductList, userAddressId })

    const payloadTax = {
      salesOrderProductList,
      userAddressId,
      deliveryFeeAmount: pageState.shippingFee,
      billingAddressInfo: {
        ...shippingAddress
      },
      shipToRequest: {
        ...shippingAddress
      },
      requestDate: formatDateTime(new Date(), FORMAT_FULL_YEAR),
      salesOrderNumber: pageState.salesOrderNumber,
      currencyCode: country === VALUE_COUNTRY.US ? CURRENCY.USD : CURRENCY.CAD,
      salesOrderType: OrderTypeEnum.SUBSCRIBE_ORDER,
      couponList: orderStore?.listCouponsChoose || [],
      totalPoint: orderStore?.totalPoint || 0
    }
    pageState.payloadSaleTax = payloadTax
    await getSaleTax(payloadTax)

    getInfoOrderSummary()
  } finally {
    showGlobalLoading(false)
  }
}

watch(
  () => pageState.cartItems,
  (value) => {
    if (value.length) {
      const paramsCoupon = {
        totalPaymentAmount: financial(calculateTotal()),
        orderType: SHIP_OPTION_ENUM.AUTO_SHIP
      }

      orderStore?.getListCoupons(paramsCoupon)
    }
  }
)

const isCloseCollapse = (index) => {
  return !activeKey.value.includes(String(index))
}

const getShippingFeeOrder = async (data) => {
  const response = await apiService.orderService.getShippingFeeOrder({
    ...data,
    salesOrderType: OrderTypeEnum.SUBSCRIBE_ORDER
  })
  if (response.success) {
    const fee = response?.data?.deliveryFeeAmount
    pageState.shippingFee = response?.data?.deliveryFeeAmount
    return fee
  } else {
    orderStore.handleChangeModalAlertState(true, response?.message)
  }
}

const checkMatchPinCode = async (payload) => {
  try {
    showGlobalLoading(true)
    const res = await apiService.creditCardService.checkMatchPinCode(
      payload,
      currentAuthUser.value.userSeqNo
    )
    if (res.success) {
      const { match, lock, failCount } = res.data
      if (match) {
        handlePaymentOrder()
        modalPinCode.closePinPopup()
      } else {
        if (!lock) {
          modalPinCode.updateContentPinCodeWhenError(
            failCount,
            `Please re-enter the security passcode. (${failCount}/5)`,
            MESSAGE_PINCODE.PAYMENT.error
          )
        } else {
          modalPinCode.closePinPopup()
          orderStore.handleChangeVisibleAuthCard(true)
          orderStore.getListCard(currentAuthUser.value.userSeqNo)
          orderStore.changeCardForPayment({})
        }
      }
    }
  } finally {
    showGlobalLoading(false)
  }
}

const getListProductsSheet = async (id) => {
  try {
    showGlobalLoading(true)
    const response = await apiService.orderService.getListProductsAutoShip(id)
    if (response.success) {
      const { productList, identification, paymentDate } = response.data
      pageState.cartItems = productList
      pageState.salesOrderNumber = identification
      if (paymentDate) {
        pageState.datePayment = paymentDate
        pageState.firstRound = false
      }
    }
  } finally {
    showGlobalLoading(false)
  }
}

const renderSalesOrderProduct = (data) => {
  if (data.length) {
    return data.map((item) => {
      return {
        productId: item?.productId,
        quantity: item?.quantity,
        productOptionId: item?.productOptionId
      }
    })
  }
}

const getInfoOrderSummary = async () => {
  const payload = {
    totalPoint: orderStore?.totalPoint || 0,
    couponList: orderStore?.listCouponsChoose,
    salesOrderProductList: renderSalesOrderProduct(pageState.cartItems),
    userAddressId: pageState.shippingAddress?.userAddressId,
    deliveryFeeAmount: pageState.shippingFee,
    totalTaxAmount: orderStore?.saleTaxOrder,
    salesOrderType: OrderTypeEnum.SUBSCRIBE_ORDER
  }

  const response = await apiService.orderService.getInfoOrderSummary(payload)
  if (response.success) {
    const { pointEarn, totalFinalAmount, totalFinalAmountBP } = response.data
    pageState.pointEarn = pointEarn
    pageState.totalFinalAmount = totalFinalAmount
    pageState.totalFinalAmountBP = totalFinalAmountBP
    pageState.infoOrderSummary = response.data
  }
}

const { mutate: mutationPaymentOrder } = useMutation(
  async (payload) => {
    showGlobalLoading(true)
    const response = pageState.firstRound
      ? await apiService.orderService.paymentAutoShip(payload)
      : await apiService.orderService.paymentImmediateAutoShip(payload)
    return response
  },
  {
    onSuccess: (response) => {
      if (response.success) {
        orderStore.changeCardForPayment({})
        router.push({
          name: AppRoutes.autoShip.autoShipComplete.name
        })
      } else {
        showNotification({ type: 'error', message: response.message })
        router.push({
          name: AppRoutes.cart.list.name,
          query: { tab: 1 }
        })
      }
      showGlobalLoading(false)
    }
  }
)

const calculateTotal = () => {
  const total = pageState.cartItems.reduce(
    (total, current) => total + current?.quantity * current.salesAmount,
    0
  )
  return total
}

watch(
  () => orderStore.totalPoint,
  async (point) => {
    if (point) {
      const payload = {
        ...pageState.payloadSaleTax,
        totalPoint: point
      }
      pageState.payloadSaleTax = payload
      await getSaleTax(payload)
      getInfoOrderSummary()
    }
  }
)

watch(
  () => orderStore.listCouponsChoose,
  async (coupon, oldCoupon) => {
    if (coupon.length !== oldCoupon.length) {
      const payloadShip = {
        ...pageState.payloadShippingFee,
        couponList: coupon
      }
      await getShippingFeeOrder(payloadShip)
      const payload = {
        ...pageState.payloadSaleTax,
        couponList: coupon,
        deliveryFeeAmount: pageState.shippingFee
      }
      pageState.payloadSaleTax = payload

      await getSaleTax(payload)
      getInfoOrderSummary()
    }
  }
)

watch(
  () => agreeTerm.value,
  (val) => {
    if (val) pageState.messageValidTerm = ''
  }
)
watch(
  () => pageState.datePayment,
  (val) => {
    if (val) pageState.messageValidDatePayment = ''
  }
)

const showValidNotification = () => {
  let message = ''

  if (disabledProcessPayment.value) {
    message = VALIDATE_MESSAGE.requiredPayment
    const newOpenCollapse = []
    if (!Object.keys(pageState?.shippingAddress)?.length) {
      newOpenCollapse.push(String(ID_AUTO_SHIP_CHECKOUT.SHIPPING - 1))
      pageState.allowValid.shipping = true
    }
    if (!pageState.datePayment) {
      newOpenCollapse.push(String(ID_AUTO_SHIP_CHECKOUT.DATE - 1))
      pageState.messageValidDatePayment = VALIDATE_MESSAGE.requiredPaymentDate
    }
    if (!orderStore.passValidFormPayment) {
      newOpenCollapse.push(String(ID_AUTO_SHIP_CHECKOUT.PAYMENT - 1))
      pageState.allowValid.payment = true
    }
    if (!agreeTerm.value) {
      pageState.messageValidTerm = VALIDATE_MESSAGE.agreeWithTerm
    }
    activeKey.value = newOpenCollapse
  }

  if (message) {
    showNotification({
      type: 'error',
      duration: 5,
      message
    })
  }
  return message
}

const handleCheckMatchPinCode = async () => {
  const checkAddress = handleCheckAddressAvailable()
  if (showValidNotification()) return

  if (!checkAddress) {
    showNotification({
      type: 'error',
      message: VALIDATE_MESSAGE.matchAddress
    })
    return
  }

  const { address, aptFloorSuite, state, city, zipcode, country } = pageState.shippingAddress
  const payload = {
    geocode: 'true',
    addresses: [
      {
        address: `${address || ''} ${aptFloorSuite || ''} ${city || ''} ${state || ''} ${
          zipcode || ''
        }`,
        country
      }
    ]
  }

  const response = await apiService.authService.authAddress(payload)
  if (response?.data?.isValidAddress) {
    handlePaymentOrder()
  } else {
    pageState.visibleAlert = true
    pageState.descriptionAlert = VALIDATE_MESSAGE.invalidAddressOrder
  }
}

const getCurrentCard = computed(() => {
  const { userFavoriteCardsId, cardNum, alias } = orderStore.cardForPayment
  return {
    cardNumber: cardNum,
    cardId: userFavoriteCardsId,
    ownerName: alias
  }
})

const handlePaymentOrder = () => {
  pageState.errorValidate = ''

  const dataSubmit = {
    subscriptionId: Number(route.params?.identification),
    subscriptionProductRequestList: pageState.cartItems.map((item) => {
      return {
        subscriptionProductId: Number(route.params?.identification),
        productId: item?.productId,
        quantity: item?.quantity,
        productOptionId: item?.productOptionId,
        salesAmountDiscountAfterRank: item?.salesAmountDiscountAfterRank
      }
    }),
    paymentDay: pageState.datePayment,
    saleTax: orderStore?.saleTaxOrder,
    discountAmount: pageState.infoOrderSummary?.autoshipDiscount || 0,
    userPaymentId: getCurrentCard.value?.cardId,
    userDeliveryId: pageState.shippingAddress.userAddressId,
    couponToMoney: orderStore?.amountDiscountFromCoupon,
    pointToMoney: orderStore?.totalPoint || 0,
    pointEarn: pageState?.pointEarn,
    pointUse: orderStore?.totalPoint || 0,
    couponList: orderStore?.listCouponsChoose,
    deliveryFeeAmount: pageState?.shippingFee,
    totalSalesAmount: pageState.infoOrderSummary?.totalFinalAmount,
    totalSalesAmountProduct: Number(financial(calculateTotal()))
  }

  if (!pageState.firstRound) {
    delete dataSubmit.subscriptionProductRequestList
    delete dataSubmit.paymentDay
    delete dataSubmit.totalSalesAmountProduct
    dataSubmit.turningTrain = +route.query.turningTrain
  }

  mutationPaymentOrder(dataSubmit)
}

const disabledProcessPayment = computed(() => {
  return (
    !orderStore.passValidFormPayment ||
    Object.keys(pageState?.shippingAddress).length === 0 ||
    !agreeTerm.value ||
    !pageState.datePayment
  )
})

const getFinalPinCode = (pinCode) => {
  if (pinCodeState.value.currentSetPassStep < 2) {
    if (orderStore.statusPinCode.create) {
      modalPinCode.handleUpdateToStepTwo(pinCode, MESSAGE_PINCODE.PASSCODE.contentSecond)
    } else {
      checkMatchPinCode({ orderPassword: pinCode })
    }
  } else {
    orderStore.updateStatusConditionPinCode({ create: true, match: false, pinCode })
  }
}

watch(
  () => getCurrentCard.value,
  (value) => {
    orderStore.updatePassValidFormPayment(Boolean(value.cardNumber))
  },
  {
    immediate: true
  }
)

onBeforeUnmount(() => {
  orderStore.resetStoreOrder()
})

const closeCollapseItem = (id) => {
  const newArr = activeKey.value.filter((item) => item !== String(id))
  newArr.push(String(Number(id) + 1))

  activeKey.value = newArr
}

const handleDatePayment = (value) => {
  pageState.datePayment = value
  closeCollapseItem(ID_AUTO_SHIP_CHECKOUT.DATE - 1)
}

onMounted(async () => {
  const identification = route.params.identification
  await getListProductsSheet(identification)
  await orderStore.getAddressSavedList()

  const defaultAddress = orderStore.addressList.find((address) => address.defaultValue)
  pageState.shippingAddress = defaultAddress || {}
})
</script>

<style scoped lang="scss">
.collapse-panel-custom {
  @apply border-black-50 bg-white;

  :deep(.ant-collapse-header) {
    @apply font-475 flex py-5 pr-0 text-base;
    padding-left: 20px !important;
  }
}

:deep(.ant-collapse-content-box) {
  @apply px-5;
}

.icon {
  background: black;
}
.open {
  transform: rotate(90deg) !important;
}

.ant-collapse-item:last-child {
  border-bottom: none;
}
.custom-radio {
  :deep(.ant-radio-wrapper) > span {
    @apply font-475 text-base leading-5;
  }
  :deep(.ant-radio-checked) {
    .ant-radio-inner {
      @apply border-navy-deep;
    }
    .ant-radio-inner:after {
      @apply bg-navy-deep;
    }
  }
}

.collapse__description {
  @apply text-gray-10 mt-2.5 flex flex-col whitespace-pre-wrap text-xs font-normal;
}
</style>
