<template>
  <div class="text-black-50">
    <p class="font-500 mb-5 text-base">Please pay your 'Membership Fee'.</p>
    <p class="text-gray-12 font-300 mb-10 text-xs">
      In order to maintain your status as a RIMAN Planner and continue enjoying the benefits, we
      kindly request that you submit the payment for the required membership fee.
    </p>

    <r-checkbox :checked="true">
      <span class="text-base"> Beauty Planner Membership Fee</span>
    </r-checkbox>
    <p class="font-550 text-navy-6 mb-[15px] ml-[25px] text-base">${{ pageState.memberShipFee }}</p>
    <div class="bg-navy-1 rounded-2 relative ml-[25px] h-[150px] w-[271px]">
      <Logo class="absolute left-[25px] top-[25px]" />
      <div class="absolute bottom-[25px] left-[25px]">
        <p class="mb-[10px] text-[10px] text-white">Membership Fee</p>
        <p class="mb-0 text-[24px] font-semibold leading-[24px] text-white">
          ${{ pageState.memberShipFee }}
        </p>
      </div>
    </div>
    <div class="mt-[25px] flex justify-between">
      <span class="font-500 text-base">Total</span>
      <span class="font-600 text-lg">${{ pageState.memberShipFee }}</span>
    </div>
    <a-divider class="bg-black-50" />

    <p class="mb-6 text-base">Payment Method</p>

    <PaymentFormOrder
      :shipping-default="pageState.shippingAddress"
      :is-member-ship-fee="true"
      @payment-member-ship="paymentMemberShip"
      @check-first-card="isFirstCard"
    />

    <div class="mb-15 flex items-center justify-center">
      <iframe
        v-show="pageState.buttonIframe && paymentByApple"
        id="nexioApplePayApmIframe"
        title="apple pay"
        :src="pageState.buttonIframe"
        class="h-10 w-[250px] !border-none"
      />
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

  <RModalAlert
    v-model:visible="orderStore.modalAlertState.showModal"
    title="Alarm"
    text-btn="Confirm"
    :description="orderStore.modalAlertState.descriptionModal"
    :width="280"
    @confirm="orderStore.handleChangeModalAlertState(false, '')"
  />
</template>
<script setup>
import { onMounted, reactive, computed, watch } from 'vue'
import { useOrderStore } from '@/stores/modules/order'
import { storeToRefs } from 'pinia'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { useModalPinCode } from '@/stores/modules/modal-pincode'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { CURRENCY, MESSAGE_PINCODE, PAYMENT_TYPE, URL_NEXIO } from '@/helpers/constant'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import Logo from '@assets/svgs/logo-white-small.svg'
import { CardEnum, PaymentMethodEnum, AppleStatusEnum } from '@/helpers/enum'
import { formatCellphoneToSend } from '@/utils/common'

const router = useRouter()

const userStore = useAuthUserStore()

const orderStore = useOrderStore()
const { currentAuthUser } = storeToRefs(userStore)
const modalPinCode = useModalPinCode()
const { pinCodeState } = storeToRefs(modalPinCode)
const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading

const pageState = reactive({
  shippingAddress: {},
  buttonIframe: '',
  resultFromApple: {},
  memberShipFee: 0,
  firstCard: false,
  orderNumber: '',
  token: ''
})

const isFirstCard = (status) => {
  pageState.firstCard = status
}

const getMemberShipFee = async () => {
  showGlobalLoading(true)
  try {
    const response = await apiService.authService.getMemberShipFee({
      type: currentAuthUser.value?.userType.code,
      currency: CURRENCY.USD
    })
    if (response.success) pageState.memberShipFee = response.data?.amountAnnual
  } finally {
    showGlobalLoading(false)
  }
}

const generateOrderNumber = async () => {
  showGlobalLoading(true)
  try {
    const response = await apiService.myPageService.generateOrderNumber()
    if (response.success) {
      pageState.orderNumber = response.data?.order_number
      pageState.token = response.data?.token
    }
  } finally {
    showGlobalLoading(false)
  }
}

onMounted(async () => {
  getMemberShipFee()
  generateOrderNumber()
  orderStore.getListCard(currentAuthUser.value.userSeqNo, true)
  await orderStore.getAddressSavedList()
  const defaultAddress = orderStore.addressList.find((address) => address.defaultValue)
  pageState.shippingAddress = defaultAddress || {}
})

const paymentMemberShip = async (data, dataCardAfterSave) => {
  showGlobalLoading(true)
  const payload = {
    token: pageState.token,
    paymentMethod: PAYMENT_TYPE.CREDIT_CARD
  }

  const checkCardId =
    orderStore.cardForPayment?.userFavoriteCardsId || dataCardAfterSave?.userFavoriteCardsId
  if (checkCardId) {
    payload.creditCard = {
      cardId: checkCardId
    }
  } else {
    const {
      cardNumber,
      cardCvc,
      cardFirstName,
      cardLastName,
      expiredMonth,
      expiredYear,
      billFirstName,
      billLastName,
      billAddress,
      agreeInfoCard,
      defaultCard,
      billAptFloorSuite,
      billCity,
      billState,
      billZipCode,
      billCountry,
      billMobileNumber
    } = data
    payload.creditCard = {
      cardType: CardEnum.PLANNER,
      cardNumber: formatCellphoneToSend(cardNumber),
      expiredMonth,
      expiredYear,
      cardCvc,
      cardFirstName,
      cardLastName,
      defaultYn: defaultCard,
      agreeSaveYn: agreeInfoCard,
      billFirstName,
      billLastName,
      billAddress,
      billAptFloorSuite,
      billCity,
      billState,
      billZipCode,
      billCountry,
      billMobileNumber: formatCellphoneToSend(billMobileNumber)
    }
  }

  if (paymentByApple.value) {
    payload.applePay = {
      paymentInfo: pageState.resultFromApple?.id
    }
    payload.creditCard = {
      cardType: pageState.resultFromApple?.card?.cardType,
      cardNumber: pageState.resultFromApple?.card?.cardNumber
    }
    payload.paymentMethod = PAYMENT_TYPE.APPLE_PAY
  }
  try {
    const response = await apiService.myPageService.paymentMemberShip(payload)
    if (response.success) {
      router.push(AppRoutes.myPage)
    } else {
      orderStore.handleChangeModalAlertState(true, response.message)
    }
  } finally {
    showGlobalLoading(false)
  }
}

const checkMatchPinCode = async (payload) => {
  try {
    showGlobalLoading(true)
    const response = await apiService.creditCardService.checkMatchPinCode(
      payload,
      currentAuthUser.value.userSeqNo
    )

    if (response.success) {
      const { match, lock, failCount } = response.data
      if (match) {
        paymentMemberShip()
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
        }
      }
    }
  } finally {
    showGlobalLoading(false)
  }
}
const getFinalPinCode = (pinCode) => {
  if (pinCodeState.value.currentSetPassStep < 2) {
    if (!pageState.firstCard) {
      checkMatchPinCode({ orderPassword: pinCode })
    } else {
      modalPinCode.handleUpdateToStepTwo(pinCode, MESSAGE_PINCODE.PASSCODE.contentSecond)
    }
  } else {
    orderStore.updateStatusConditionPinCode({ create: true, match: false, pinCode })
  }
}

const loadScript = (scriptUrl) => {
  const script = document.createElement('script')
  script.src = scriptUrl
  script.async = true

  document.head.appendChild(script)
}

const getIframeApple = async (payload) => {
  try {
    showGlobalLoading(true)
    const response = await apiService.orderService.getScriptApplePay(payload)
    if (response.success) {
      loadScript(response?.data.scriptUrl)
      pageState.buttonIframe = response.data?.buttonIFrameUrls?.find(
        (item) => item?.paymentMethod === PaymentMethodEnum.APPLE_PAY
      )?.url
    }
  } finally {
    showGlobalLoading(false)
  }
}

const handleShowMessage = (data) => {
  const { event } = data
  if (event === AppleStatusEnum.LOADED) {
    showGlobalLoading(false)
  }
  if (event === AppleStatusEnum.CANCEL) {
    orderStore.handleChangeModalAlertState(true, 'Apple Pay failed!')
  }
  if (event === AppleStatusEnum.SUCCESS) {
    pageState.resultFromApple = data.data
    paymentMemberShip()
  }
}

onMounted(() => {
  window.addEventListener('message', function (event) {
    if (event.origin !== URL_NEXIO) {
      return
    }
    handleShowMessage(event.data)
  })
})

const paymentByApple = computed(() => {
  return orderStore?.dataPayment?.creditCard === PaymentMethodEnum.APPLE_PAY
})

watch(
  () => paymentByApple.value,
  (value) => {
    if (value) {
      getIframeApple({
        isAuthOnly: false,
        data: {
          paymentMethod: PaymentMethodEnum.APPLE_PAY,
          applePayDomain: 'mall.dev.riman.com',
          currency: CURRENCY.USD,
          customer: {
            orderNumber: pageState.orderNumber,
            firstName: currentAuthUser.value.firstName,
            lastName: currentAuthUser.value.lastName,
            email: currentAuthUser.value.email,
            customerRef: currentAuthUser.value.userSeqNo
          },
          amount: pageState.memberShipFee,
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
</script>

<style lang="scss" scoped>
:deep(.ant-checkbox-checked) {
  .ant-checkbox-inner::after {
    @apply border-1  border-white;
  }
  .ant-checkbox-inner {
    @apply bg-navy-6;
  }
}
</style>
