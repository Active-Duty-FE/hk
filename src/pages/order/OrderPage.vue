<template>
  <div class="bg-gray-6 text-black-50 flex w-full items-center justify-center sm:py-10">
    <div class="w-full bg-white sm:max-w-[550px]">
      <div class="hidden flex-col text-center md:flex">
        <span class="py-6 text-base font-medium capitalize">
          {{ AppSubNavTitles.cart.placeOrder }}
        </span>
        <a-divider class="bg-black-50 !my-0" />
      </div>
      <div v-if="isShowBannerWelcome" class="block pt-[10px] opacity-0 md:hidden">
        {{ AppSubNavTitles.cart.placeOrder }}
      </div>

      <a-collapse v-model:activeKey="activeKey" :bordered="false">
        <a-collapse-panel
          v-for="(item, index) in ORDER_CHECKOUT_LISTS"
          :key="index"
          class="collapse-panel-custom"
          :show-arrow="false"
        >
          <template #header>
            <div v-if="item.id === ID_ORDER_CHECKOUT.SHIPPING" class="flex flex-col">
              <span>{{ item.title }}</span>
              <div
                v-if="isCloseCollapse(index) && pageState.shippingAddress?.userAddressId"
                class="collapse__description"
              >
                {{ shippingAddressDescription(pageState.shippingAddress) }}
              </div>
            </div>
            <div v-if="item.id === ID_ORDER_CHECKOUT.PAYMENT">
              {{ item.title }}
              <div v-if="isCloseCollapse(index)" class="collapse__description">
                <template v-if="!paymentByApple && getCurrentCard?.cardNumber">
                  <span>{{ getCurrentCard?.ownerName }} </span>
                  <span>
                    {{ getCurrentCard?.cardNumber }}
                  </span>
                </template>
                <template v-if="paymentByApple"> Apple Pay </template>
              </div>
            </div>
            <div v-if="item.id === ID_ORDER_CHECKOUT.COUPONS">
              {{ item.title }}
              <div v-if="isCloseCollapse(index)" class="collapse__description">
                <span v-if="pageState.cartItems[0]?.country === currentAuthUser?.nationalCode">
                  {{ orderStore?.totalPoint || 0 }}P Point
                </span>
                <span
                >{{ renderCurrency(sameCurrencyForProduct) }}
                  {{ orderStore?.amountDiscountFromCoupon }} Coupon</span
                >
              </div>
            </div>
            <div v-if="item.id === ID_ORDER_CHECKOUT.SUMMARY">
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

          <div v-if="item.id === ID_ORDER_CHECKOUT.SHIPPING">
            <ShippingAddress
              v-model:shipping-address="pageState.shippingAddress"
              :country="pageState.cartItems[0].country"
              :allow-valid="pageState.allowValid.shipping"
            />
          </div>
          <div v-if="item.id === ID_ORDER_CHECKOUT.PAYMENT">
            <PaymentFormOrder
              :shipping-default="pageState.shippingAddress"
              :close-collapse-item="() => closeCollapseItem(index)"
              :allow-valid="pageState.allowValid.payment"
            />
          </div>
          <div v-if="item.id === ID_ORDER_CHECKOUT.COUPONS">
            <PointAndCoupon
              :sub-total="financial(calculateTotal())"
              :currency="sameCurrencyForProduct"
              :country-product="pageState.cartItems[0].country"
            />
          </div>
          <div v-if="item.id === ID_ORDER_CHECKOUT.SUMMARY">
            <OrderSummary
              :carts="pageState.cartItems"
              :shipping-fee="pageState?.shippingFee"
              :point-earn="pageState.pointEarn"
              :total="pageState.totalFinalAmount"
              :total-bp="pageState.totalFinalAmountBP"
              :currency="sameCurrencyForProduct"
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
            I have read and agree to the terms and conditions relating to this purchase of the
            product.
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
          <span v-if="pageState.messageValidTerm" class="text-red-2 text-[10px]">{{
            pageState.messageValidTerm
          }}</span>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <iframe
          v-show="pageState.buttonIframe && paymentByApple && !disabledProcessPayment"
          id="nexioApplePayApmIframe"
          title="apple pay"
          :src="pageState.buttonIframe"
          class="h-10 w-[250px] !border-none"
        />
      </div>

      <div class="mx-5 mb-10">
        <r-button
          v-if="!paymentByApple"
          title="Process Payment"
          type="primary"
          class="!bg-navy-deep !border-navy-deep !rounded-0 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full text-white !shadow-none"
          @click="handleCheckMatchPinCode"
        />
        <r-button
          v-if="paymentByApple && !pageState.buttonIframe"
          title="Apple Payment"
          type="primary"
          :disabled="true"
          class="!bg-navy-deep !border-navy-deep !rounded-0 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full text-white"
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
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useNotification } from '@/composables/notification'
import {
  ORDER_CHECKOUT_LISTS,
  ID_ORDER_CHECKOUT,
  SALE_ORDER_PAYMENT,
  PAYMENT_TYPE,
  SIZE_CHECKBOX,
  FORMAT_FULL_YEAR,
  EXPONENT,
  MESSAGE_PINCODE,
  VALUE_COUNTRY,
  CURRENCY,
  URL_NEXIO,
  VALID_CODE_ADDRESS_ORDER
} from '@/helpers/constant'
import { AppRoutes, AppSubNavTitles } from '@/router/path'
import { useOrderStore } from '@/stores/modules/order'
import { shippingAddressDescription, financial } from '@/utils/common'
import { gtmCheckout } from '@/utils/gtm'
import { formatDateTime } from '@/utils/datetime'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { storeToRefs } from 'pinia'
import { useModalPinCode } from '@/stores/modules/modal-pincode'
import {
  OrderTypeEnum,
  PaymentMethodEnum,
  AppleStatusEnum,
  CountryEnum,
  NfrImportProductEnum
} from '@/helpers/enum'
import { isBeautyPlanner } from '@/utils/role'
import { useMemberBannerStore } from '@/stores/modules/member-banner'
import { VALIDATE_MESSAGE } from '@/helpers/validate-message'
import { renderCurrency } from '@/utils/currency'

const domain = window.location.origin

const { isShowBannerWelcome } = storeToRefs(useMemberBannerStore())

const orderStore = useOrderStore()
const userStore = useAuthUserStore()
const { currentAuthUser } = storeToRefs(userStore)

const router = useRouter()
const activeKey = ref([])
const agreeTerm = ref(false)

const modalPinCode = useModalPinCode()

const { pinCodeState } = storeToRefs(modalPinCode)

const route = useRoute()
const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading
const { showNotification } = useNotification()

const pageState = reactive({
  salesOrderNumber: '',
  cartItems: [],
  shippingAddress: {},
  shippingFee: 0,
  buttonIframe: '',
  pointEarn: 0,
  resultFromApple: {},
  infoOrderSummary: {},
  payloadSaleTax: {},
  payloadShippingFee: {},
  totalFinalAmountBP: 0,
  totalFinalAmount: 0,
  allowValid: {
    shipping: false,
    payment: false
  },
  messageValidTerm: '',
  visibleAlert: false,
  descriptionAlert: ''
})

onMounted(async () => {
  showGlobalLoading(true)
  const identification = route.params.identification
  identification && decryptSaleOrder({ identification })
  await orderStore.getAddressSavedList()
  const defaultAddress = orderStore.addressList.find((address) => address.defaultValue)
  pageState.shippingAddress = defaultAddress || {}
})

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
  () => [pageState.salesOrderNumber],
  ([valOrderNumber]) => {
    if (valOrderNumber) {
      getListProductsSheet({ salesOrderNumber: valOrderNumber })
    }
  }
)

watch(
  () => [pageState.shippingAddress, pageState.cartItems],
  ([val, valCart]) => {
    if (Object.keys(val).length && valCart.length) {
      handleDataAboutOrder(val, valCart)
    }
  }
)

watch(
  () => pageState.cartItems,
  (value) => {
    if (value.length) {
      const paramsCoupon = {
        totalPaymentAmount: financial(calculateTotal()),
        orderType: OrderTypeEnum.STANDARD_ORDER
      }
      orderStore?.getListCoupons(paramsCoupon)
    }
  }
)

const viewReturnTerms = () => window.open(`${domain}${AppRoutes.policy.path}`, '_blank')
const viewShippingTerms = () => window.open(`${domain}${AppRoutes.shipping.path}`, '_blank')

const renderSalesOrderProduct = (data) => {
  if (data.length) {
    return data.map((item) => {
      return {
        productId: item?.productBaseDto?.productId,
        quantity: item?.productBaseDto?.quantity,
        productOptionId: item?.productBaseDto?.productOptionId
      }
    })
  }
}

const handleDataAboutOrder = async (val, valCart) => {
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

  const salesOrderProductList = renderSalesOrderProduct(valCart)

  try {
    showGlobalLoading(true)

    const payloadShip = {
      salesOrderProductList,
      userAddressId,
      couponList: orderStore.listCouponsChoose || [],
      salesOrderType: OrderTypeEnum.GENERAL_ORDER
    }
    pageState.payloadShippingFee = payloadShip
    const deliveryFeeAmount = await getShippingFeeOrder(payloadShip)
    const payload = {
      salesOrderProductList,
      userAddressId,
      deliveryFeeAmount,
      billingAddressInfo: {
        ...shippingAddress
      },
      shipToRequest: {
        ...shippingAddress
      },
      requestDate: formatDateTime(new Date(), FORMAT_FULL_YEAR),
      salesOrderNumber: pageState.salesOrderNumber,
      currencyCode: country === VALUE_COUNTRY.US ? CURRENCY.USD : CURRENCY.CAD,
      salesOrderType: OrderTypeEnum.GENERAL_ORDER,
      couponList: orderStore.listCouponsChoose || [],
      totalPoint: orderStore?.totalPoint || 0
    }
    pageState.payloadSaleTax = payload
    await getSaleTax(payload)
    getInfoOrderSummary()
  } finally {
    showGlobalLoading(false)
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
    salesOrderType: OrderTypeEnum.GENERAL_ORDER
  }

  const response = await apiService.orderService.getInfoOrderSummary(payload)
  if (response.success) {
    const { pointEarn, totalFinalAmount, totalFinalAmountBP } = response.data
    pageState.pointEarn = pointEarn
    pageState.totalFinalAmount = totalFinalAmount
    pageState.totalFinalAmountBP = totalFinalAmountBP
    pageState.infoOrderSummary = response.data
  } else {
    showNotification({ type: 'error', duration: 3, message: response?.message })
  }
}

watch(
  () => [orderStore.totalPoint],
  async ([point]) => {
    const payload = {
      ...pageState.payloadSaleTax,
      totalPoint: point
    }
    pageState.payloadSaleTax = payload

    await getSaleTax(payload)
    getInfoOrderSummary()
  }
)
watch(
  () => [orderStore.listCouponsChoose],
  async ([coupon], [oldCoupon]) => {
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

const isCloseCollapse = (index) => {
  return !activeKey.value.includes(String(index))
}

const getShippingFeeOrder = async (data) => {
  const response = await apiService.orderService.getShippingFeeOrder(data)
  if (response.success) {
    const fee = response?.data?.deliveryFeeAmount
    pageState.shippingFee = response?.data?.deliveryFeeAmount
    return fee
  } else {
    orderStore.handleChangeModalAlertState(true, response?.message)
  }
}

const handleShowMessage = (data) => {
  const { event } = data
  if (event === AppleStatusEnum.LOADED) {
    showGlobalLoading(false)
  }
  if (event === AppleStatusEnum.CANCEL) {
    showNotification({ type: 'error', duration: 3, message: 'Apple Pay failed!' })
  }
  if (event === AppleStatusEnum.SUCCESS) {
    pageState.resultFromApple = data.data
    handlePaymentOrder()
  }
}

onMounted(() => {
  window.addEventListener('message', function (event) {
    if (event.origin !== URL_NEXIO) return

    handleShowMessage(event.data)
  })
})

const { mutate: refreshSaleOrder } = useMutation(
  async (payload) => {
    return await apiService.orderService.refreshIdentify(payload)
  },
  {
    onSuccess: (data) => {
      showGlobalLoading(false)
      if (data?.success) {
        router.push({
          name: AppRoutes.cart.placeOrder.name,
          params: { identification: data?.data?.identification }
        })
        decryptSaleOrder({ identification: data?.data?.identification })
      } else {
        showNotification({ type: 'error', duration: 3, message: 'Error. Please try again!' })
      }
    }
  }
)
const { mutate: mutationCheckMatchPinCode } = useMutation(
  async (payload) => {
    showGlobalLoading(true)
    const response = await apiService.creditCardService.checkMatchPinCode(
      payload,
      currentAuthUser.value.userSeqNo
    )
    return response
  },
  {
    onSuccess: (res) => {
      showGlobalLoading(false)
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
    }
  }
)

const { mutate: decryptSaleOrder } = useMutation(
  async (payload) => {
    return await apiService.orderService.decryptSaleOrder(payload)
  },
  {
    onSuccess: (data, variables) => {
      showGlobalLoading(false)
      if (data?.success) {
        pageState.salesOrderNumber = data?.data?.salesOrderNumber
      } else {
        // return previous page if any error
        showNotification({ type: 'error', duration: 3, message: 'Error. Please try again!' })
      }
    },
    onError: (error) => {
      console.log(error)
    }
  }
)

const getListProductsSheet = async (params) => {
  try {
    showGlobalLoading(true)
    const response = await apiService.orderService.getProductSheetOrderWhenLogin(params)
    if (response.success) {
      pageState.cartItems = response?.data?.productList
    }
  } finally {
    showGlobalLoading(false)
  }
}

const { mutate: mutationPaymentOrder } = useMutation(
  async (payload) => {
    const response = await apiService.orderService.paymentOrderCreditCard(payload)
    return response
  },
  {
    onSuccess: (response) => {
      if (response.success) {
        orderStore.changeCardForPayment({})
        router.push({
          name: AppRoutes.order.complete.name,
          params: { id: response.data.salesOrderId }
        })
      } else {
        showNotification({ type: 'error', message: response.message })
        if (response?.code === VALID_CODE_ADDRESS_ORDER) {
          router.push({
            name: AppRoutes.myPage.name
          })
        } else {
          refreshSaleOrder({ identification: route.params.identification })
        }
      }
      showGlobalLoading(false)
    }
  }
)

const calculateTotal = () => {
  const total = pageState.cartItems.reduce(
    (total, current) => total + current?.productBaseDto?.quantity * current.purchaseAmountAfterRank,
    0
  )
  return total
}

const checkAddressAndProductCountry = () => {
  if (
    (pageState.cartItems[0].country !== NfrImportProductEnum.NFR &&
      pageState.cartItems[0].country !== pageState.shippingAddress.country) ||
    (pageState.cartItems[0].country === NfrImportProductEnum.NFR &&
      pageState.shippingAddress.country !== CountryEnum.CA.value)
  ) {
    showNotification({
      type: 'error',
      message: VALIDATE_MESSAGE.matchAddress
    })
    return false
  }
  return true
}

watch(
  () => agreeTerm.value,
  (val) => {
    if (val) pageState.messageValidTerm = ''
  }
)

const showValidNotification = () => {
  let message = ''
  if (disabledProcessPayment.value) {
    message = VALIDATE_MESSAGE.requiredPayment

    const newOpenCollapse = []
    if (!Object.keys(pageState?.shippingAddress)?.length) {
      newOpenCollapse.push(String(ID_ORDER_CHECKOUT.SHIPPING - 1))
      pageState.allowValid.shipping = true
    }
    if (!orderStore.passValidFormPayment) {
      newOpenCollapse.push(String(ID_ORDER_CHECKOUT.PAYMENT - 1))
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
  return Boolean(message)
}

const handleCheckMatchPinCode = async () => {
  if (showValidNotification()) return
  if (!checkAddressAndProductCountry()) return
  if (orderStore.messageTax) {
    showNotification({
      type: 'error',
      message: orderStore.messageTax
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

const sameCurrencyForProduct = computed(() => {
  return pageState.cartItems[0]?.currency?.code
})

const handlePaymentOrder = () => {
  pageState.errorValidate = ''
  showGlobalLoading(true)

  const {
    totalFinalAmount,
    pointBP,
    couponDiscountBP,
    totalFinalAmountBP,
    membershipRankDiscount
  } = pageState.infoOrderSummary

  const {
    firstName,
    lastName,
    address,
    aptFloorSuite,
    state,
    city,
    zipcode,
    country,
    phoneNumber,
    homePhone,
    deliveryMessage
  } = pageState.shippingAddress

  const billingShipInfo = {
    firstName,
    lastName,
    address1: address,
    address2: aptFloorSuite,
    city,
    state,
    zipCode: zipcode,
    country,
    cellPhone: phoneNumber,
    homePhone,
    deliveryMessage
  }

  const paymentInfoCard = getCurrentCard.value?.cardId
    ? { paymentType: PAYMENT_TYPE.AUTO_PAYMENT, cardId: getCurrentCard.value?.cardId }
    : { paymentType: PAYMENT_TYPE.CREDIT_CARD, ...getCurrentCard.value }

  const dataSubmit = {
    salesOrderNumber: pageState.salesOrderNumber,
    identification: route.params.identification,
    salesOrderProductList: renderSalesOrderProduct(pageState.cartItems),
    paymentInfo: paymentByApple.value
      ? {
        paymentType: PAYMENT_TYPE.SIMPLE_PAYMENT,
        simplePayRequestParameter: pageState.resultFromApple?.id,
        amount: totalFinalAmount,
        ...pageState.resultFromApple?.card,
        currencyCode: sameCurrencyForProduct.value
      }
      : {
        ...paymentInfoCard,
        amount: totalFinalAmount,
        currencyCode: sameCurrencyForProduct.value,
        exponent: EXPONENT,
        installment: '00'
      },
    userAddressId: pageState.shippingAddress.userAddressId,
    // current pass
    totalPoint: orderStore?.totalPoint,
    couponList: orderStore?.listCouponsChoose,
    deliveryFeeAmount: pageState?.shippingFee,
    totalPaymentAmount: totalFinalAmount,
    salesOrderType: SALE_ORDER_PAYMENT.GENERAL_ORDER,
    isPointAgree: true,
    isPurchaseAgree: true,
    isCart: true,
    billingAddressInfo: billingShipInfo,
    taxAmount: orderStore.saleTaxOrder,
    pointEarn: pageState.pointEarn
  }

  if (isBeautyPlanner.value) {
    dataSubmit.pointBP = pointBP
    dataSubmit.couponDiscountBP = couponDiscountBP
    dataSubmit.totalAmountBP = totalFinalAmountBP
  } else {
    dataSubmit.membershipRankDiscount = membershipRankDiscount
  }
  if (!aptFloorSuite) delete dataSubmit.billingAddressInfo.address2
  gtmCheckout(pageState.cartItems)
  mutationPaymentOrder(dataSubmit)
}

const disabledProcessPayment = computed(() => {
  return (
    !orderStore.passValidFormPayment ||
    !Object.keys(pageState?.shippingAddress).length ||
    !agreeTerm.value
  )
})

const getFinalPinCode = (pinCode) => {
  if (pinCodeState.value.currentSetPassStep < 2) {
    if (orderStore.statusPinCode.create) {
      modalPinCode.handleUpdateToStepTwo(pinCode, MESSAGE_PINCODE.PASSCODE.contentSecond)
    } else {
      mutationCheckMatchPinCode({ orderPassword: pinCode })
    }
  } else {
    orderStore.updateStatusConditionPinCode({ create: true, match: false, pinCode })
  }
}

const getCurrentCard = computed(() => {
  if (Object.keys(orderStore?.cardForPayment).length === 0) {
    const { cardNumber, cardCvc, cardFirstName, cardLastName, expiredMonth, expiredYear } =
      orderStore.dataPayment
    return {
      cardNumber,
      cardCvc,
      expiredMonth,
      expiredYear,
      ownerName: cardFirstName && cardLastName ? `${cardFirstName} ${cardLastName}` : ''
    }
  } else {
    const { userFavoriteCardsId, cardNum, alias } = orderStore.cardForPayment
    return {
      cardNumber: cardNum,
      cardId: userFavoriteCardsId,
      ownerName: alias
    }
  }
})
const paymentByApple = computed(() => {
  return orderStore?.dataPayment?.creditCard === PaymentMethodEnum.APPLE_PAY
})

watch(
  () => [getCurrentCard.value, paymentByApple.value],
  ([value, valueApple]) => {
    !valueApple && orderStore.updatePassValidFormPayment(Boolean(value.cardNumber))
  },
  {
    immediate: true
  }
)

const closeCollapseItem = (id) => {
  const newArr = activeKey.value.filter((item) => String(item) !== String(id))
  newArr.push(String(Number(id) + 1))

  activeKey.value = newArr
}

onBeforeUnmount(() => {
  orderStore.resetStoreOrder()
})

const loadScript = (scriptUrl) => {
  const script = document.createElement('script')
  script.src = scriptUrl
  script.async = true

  script.onload = () => {
    showGlobalLoading(true)
  }
  document.head.appendChild(script)
}

const getIframeApple = async (payload) => {
  try {
    showGlobalLoading(true)
    const response = await apiService.orderService.getScriptApplePay(payload)
    if (response.success) {
      loadScript(response?.data.scriptUrl)
      pageState.buttonIframe = response?.data?.buttonIFrameUrls?.find(
        (item) => item?.paymentMethod === PaymentMethodEnum.APPLE_PAY
      )?.url
    }
  } finally {
    showGlobalLoading(false)
  }
}

watch(
  () => [disabledProcessPayment.value, paymentByApple.value, pageState.shippingAddress],
  ([value, valuePayment, valueShip]) => {
    if (!value && valuePayment && Object.keys(valueShip).length) {
      const { zipcode, address, state, country, city } = valueShip
      getIframeApple({
        isAuthOnly: false,
        data: {
          paymentMethod: PaymentMethodEnum.APPLE_PAY,
          applePayDomain: 'mall.dev.riman.com',
          currency: CURRENCY.USD,
          customer: {
            orderNumber: pageState.salesOrderNumber,
            firstName: currentAuthUser.value.firstName,
            lastName: currentAuthUser.value.lastName,
            email: currentAuthUser.value.email,
            customerRef: currentAuthUser.value.userSeqNo,
            billToAddressOne: address,
            billToCity: city,
            billToState: state,
            billToPostal: zipcode,
            billToCountry: country
          },
          amount: pageState.infoOrderSummary?.totalFinalAmount,
          description: 'apple pay'
        },
        customerRedirectUrl: 'https://mall.dev.riman.com/',
        processingOptions: {
          doNotProcessPayment: false,
          saveRecurringToken: false
        },
        uiOptions: {
          displaySubmitButton: false
        }
      })
    }
  }
)

const handleConfirmAlert = () => {
  if (!pageState.shippingFee && Object.keys(pageState.shippingAddress).length) {
    router.push({ name: AppRoutes.cart.list.name })
  }
  orderStore.handleChangeModalAlertState(false, '')
}
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
