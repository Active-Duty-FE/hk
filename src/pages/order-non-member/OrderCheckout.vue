<template>
  <a-form ref="formRef" :model="formState" :rules="rules">
    <div class="px-5">
      <r-label title="E-mail" />
      <a-form-item name="email" class="!mt-2">
        <r-input v-model:value="formState.email" placeholder="abc@abc.abcd" />
      </a-form-item>

      <r-label title="Birthday" :required="true" />
      <div class="flex gap-2">
        <a-form-item class="form-item-custom !mb-0 w-[30%]" name="birthMonth">
          <r-select
            v-model:value="formState.birthMonth"
            :options="MONTH_OPTIONS"
            placeholder="Month"
          />
        </a-form-item>
        <a-form-item class="form-item-custom !mb-0 w-[30%]" name="birthDay">
          <r-select
            v-model:value="formState.birthDay"
            :options="populateDateDropdown(formState.birthYear, formState.birthMonth)"
            placeholder="Day"
          />
        </a-form-item>
        <a-form-item class="form-item-custom !mb-0 w-2/5" name="birthYear">
          <r-select
            v-model:value="formState.birthYear"
            :options="handleOptionsYear"
            placeholder="Year"
          />
        </a-form-item>
      </div>
    </div>
    <span class="text-red-primary ml-5 text-[10px]">{{ pageState.messageErrorBirthDay }}</span>

    <a-divider class="bg-black-50 !mb-0" />

    <a-collapse v-model:activeKey="activeKey" :bordered="false">
      <a-collapse-panel
        v-for="(item, index) in ORDER_CHECKOUT_NON_MEMBER_LISTS"
        :key="index"
        class="collapse-panel-custom"
        :show-arrow="false"
      >
        <template #header>
          <div v-if="item.id === ID_ORDER_CHECKOUT_NON_MEMBER.SHIPPING" class="flex flex-col">
            {{ item.title }}
            <div v-if="isCloseCollapse(index)" class="collapse__description whitespace-pre-wrap">
              {{ shippingAddressDescriptionNonMember(pageState.shippingAddress) }}
            </div>
          </div>
          <div v-if="item.id === ID_ORDER_CHECKOUT_NON_MEMBER.PAYMENT">
            {{ item.title }}
            <div v-if="isCloseCollapse(index)" class="collapse__description">
              <span>
                {{ pageState?.dataCard?.cardFirstName }}
                {{ pageState?.dataCard?.cardLastName }}
              </span>
              <span>
                {{ pageState?.dataCard?.cardNumber }}
              </span>
            </div>
          </div>

          <div v-if="item.id === ID_ORDER_CHECKOUT_NON_MEMBER.SUMMARY">
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

        <div v-if="item.id === ID_ORDER_CHECKOUT_NON_MEMBER.SHIPPING">
          <ShippingAddressForm
            ref="shippingAddressFormRef"
            :is-member="false"
            :country="pageState.cartItems[0].country"
            :close-collapse-item="() => closeCollapseItem(index)"
            :allow-valid="pageState.allowValid.shipping"
            @get-data-address="updateShippingAddress"
          />
        </div>
        <div v-if="item.id === ID_ORDER_CHECKOUT_NON_MEMBER.PAYMENT">
          <PaymentFormOrder
            :shipping-default="pageState.shippingAddress"
            :is-member="false"
            :close-collapse-item="() => closeCollapseItem(index)"
            :allow-valid="pageState.allowValid.payment"
            @handle-card-when-non-member="handleDataCardWhenNonMember"
          />
        </div>
        <div v-if="item.id === ID_ORDER_CHECKOUT_NON_MEMBER.SUMMARY">
          <OrderSummary
            :carts="pageState?.cartItems"
            :is-member="false"
            :shipping-fee="pageState?.shippingFee"
            :tax-order="pageState?.taxOrder"
            :currency="pageState?.cartItems[0]?.currency?.code"
          />
        </div>
      </a-collapse-panel>
    </a-collapse>
    <a-divider class="bg-black-50 !mt-0" />
    <div class="p-5">
      <div class="mb-5">
        <a-form-item name="agreeAllPolicies">
          <r-checkbox-outlined
            v-model:checked="formState.agreeAllPolicies"
            @checked-change="handleCheckAll"
          >
            <template #content>
              <span class="font-475 ml-2 text-sm">Agree to all policies.</span>
            </template>
          </r-checkbox-outlined>
        </a-form-item>
      </div>
      <a-form-item name="agreeTerms">
        <r-checkbox-outlined
          v-model:checked="formState.agreeTerms"
          @checked-change="() => (formState.agreeTerms = !formState.agreeTerms)"
        >
          <template #content>
            <span class="font-475 ml-2 text-sm">Agree to Terms</span>
          </template>
        </r-checkbox-outlined>
      </a-form-item>
      <div class="mb-5 ml-6">
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
      </div>
      <a-form-item name="sendEmail">
        <r-checkbox-outlined
          v-model:checked="formState.sendMail"
          @checked-change="() => (formState.sendMail = !formState.sendMail)"
        >
          <template #content>
            <span class="font-475 ml-2 text-sm">
              Send me special RIMAN offers and updates via email!
            </span>
          </template>
        </r-checkbox-outlined>
      </a-form-item>
      <r-button
        type="primary"
        class="!bg-navy-6 disabled:(!bg-navy-4) w-full !text-white !shadow-none"
        title="Payment"
        @click="authAddress"
      />
    </div>
  </a-form>
  <RModalAlert
    v-model:visible="pageState.showModalAlert"
    title="Alarm"
    text-btn="Check"
    :description="pageState.descriptionAlert"
    :width="280"
    :duration="3000"
    @confirm="handleModalAlert(false, '')"
    @self-close="handleModalAlert(false, '')"
  />

  <RModalConfirm
    v-model:visible="pageState.visibleAlert"
    :width="370"
    text-ok="PROCESS ORDER"
    text-cancel="EDIT ADDRESS"
    :mask-closable="false"
    @ok="handlePayment"
    @cancel="pageState.visibleAlert = false"
  >
    <template #extraDescription>
      <span> {{ pageState.descriptionAddressAlert }}</span>
    </template>
  </RModalConfirm>
</template>
<script setup>
import { reactive, ref, computed, onMounted, watch } from 'vue'
import {
  shippingAddressDescriptionNonMember,
  financial,
  formatCellphoneToSend,
  isValidDate,
  checkAgeOfUser
} from '@/utils/common'
import {
  ORDER_CHECKOUT_NON_MEMBER_LISTS,
  ID_ORDER_CHECKOUT_NON_MEMBER,
  FORMAT_FULL_YEAR,
  VALUE_COUNTRY,
  CURRENCY,
  EXPONENT,
  PAYMENT_TYPE,
  BIRTH_CUSTOMER_YEAR,
  MONTH_OPTIONS
} from '@/helpers/constant'
import { VALIDATE_MESSAGE } from '@/helpers/validate-message'
import { validateRequired } from '@/helpers/handle-validate'
import useValidate from '@/composables/validate'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useRoute, useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { formatDateTime } from '@/utils/datetime'
import { CardEnum, OrderTypeEnum } from '@/helpers/enum'
import { populateYearDropdown, populateDateDropdown } from '@/helpers/date'
import dayjs from 'dayjs'
import { useNotification } from '@/composables/notification'

const domain = window.location.origin

const activeKey = ref([])
const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading

const { showNotification } = useNotification()

const route = useRoute()
const router = useRouter()
const formState = reactive({
  agreeAllPolicies: false,
  agreeTerms: false,
  sendMail: false,
  email: '',
  birthDay: null,
  birthMonth: null,
  birthYear: null
})

const formRef = ref()
const shippingAddressFormRef = ref(null)

const pageState = reactive({
  salesOrderNumber: '',
  shippingAddress: {},
  dataCard: {},
  shippingFee: 0,
  taxOrder: 0,
  cartItems: [],
  showModalAlert: false,
  descriptionAlert: '',
  canEnableNext: true,
  messageErrorBirthDay: '',
  allowValid: {
    shipping: false,
    payment: false
  },
  visibleAlert: false,
  descriptionAddressAlert: ''
})

const viewReturnTerms = () => window.open(`${domain}${AppRoutes.policy.path}`, '_blank')
const viewShippingTerms = () => window.open(`${domain}${AppRoutes.shipping.path}`, '_blank')

const handleModalAlert = (status, description) => {
  pageState.showModalAlert = status
  pageState.descriptionAlert = description
}

const rules = reactive({
  email: [
    {
      validator: validateRequired,
      trigger: 'change'
    },
    {
      type: 'email',
      message: VALIDATE_MESSAGE.availableEmail
    }
  ],
  agreeTerms: [
    { validator: validateRequired, message: VALIDATE_MESSAGE.agreeWithTerm, trigger: 'change' }
  ],
  birthMonth: [
    {
      validator: validateRequired,
      trigger: 'change'
    }
  ],
  birthDay: [
    {
      validator: validateRequired,
      trigger: 'change'
    }
  ],
  birthYear: [
    {
      validator: validateRequired,
      trigger: 'change'
    }
  ]
})

const isValid = useValidate(formState, rules)

const closeCollapseItem = (id) => {
  const newArr = activeKey.value.filter((item) => String(item) !== String(id))
  newArr.push(String(Number(id) + 1))
  activeKey.value = newArr
}

const isCloseCollapse = (index) => {
  return !activeKey.value.includes(String(index))
}

const updateShippingAddress = (data) => {
  pageState.shippingAddress = data
}

const handleDataCardWhenNonMember = (data) => {
  pageState.dataCard = data
}

const disableBtnPayment = computed(() => {
  return !(
    isValid.value &&
    Object.keys(pageState?.shippingAddress)?.length > 0 &&
    Object.keys(pageState?.dataCard)?.length > 0 &&
    pageState.canEnableNext
  )
})

const decryptSaleOrder = async (payload) => {
  try {
    showGlobalLoading(true)
    const response = await apiService.orderService.decryptSaleOrderPublic(payload)

    if (response?.success) {
      pageState.salesOrderNumber = response?.data?.salesOrderNumber
    } else {
      handleModalAlert(true, response?.message)
    }
  } finally {
    showGlobalLoading(false)
  }
}

const refreshSaleOrder = async (payload) => {
  try {
    showGlobalLoading(true)
    const response = await apiService.orderService.refreshIdentifyPublic(payload)
    if (response?.success) {
      const plannerBagId = route.query?.plannerBagId
      router.push({
        name: AppRoutes.orderNonMember.orderCheckout.name,
        params: { identification: response?.data?.identification },
        query: { plannerBagId }
      })
      decryptSaleOrder({
        identification: response?.data?.identification,
        bagUserInfoRequest: {
          plannerBagId
        }
      })
    } else {
      handleModalAlert(true, response?.message)
    }
  } finally {
    showGlobalLoading(false)
  }
}

watch(
  () => [pageState.shippingAddress, pageState.salesOrderNumber],
  ([val, valOrderNumber]) => {
    if (valOrderNumber) {
      handleDataAboutOrder(val, valOrderNumber)
    }
  }
)

const getShippingFee = async (payload) => {
  try {
    showGlobalLoading(false)
    const response = await apiService.orderService.getShippingFeePublicOrder(payload)
    if (response.success) {
      pageState.shippingFee = response?.data?.deliveryFeeAmount
    } else {
      handleModalAlert(true, response?.message)
    }
  } finally {
    showGlobalLoading(true)
  }
}

const getTax = async (payload) => {
  try {
    showGlobalLoading(true)
    const response = await apiService.orderService.calculateTaxOrder(payload)
    if (response.success) {
      pageState.taxOrder = response.data?.totalTaxAmount
    } else {
      handleModalAlert(true, response?.message)
    }
  } finally {
    showGlobalLoading(false)
  }
}

const handleDataAboutOrder = async (val, valOrderNumber) => {
  await getListProductsSheet({ salesOrderNumber: valOrderNumber })
  if (Object.keys(val).length > 0) {
    const {
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

    const salesOrderProductList = pageState.cartItems?.map((item) => {
      return {
        productId: item?.productBaseDto?.productId,
        quantity: item?.productBaseDto?.quantity,
        productOptionId: item?.productBaseDto?.productOptionId
      }
    })

    await getShippingFee({
      salesOrderProductList,
      billingAddressInfo: { ...shippingAddress }
    })

    const payload = {
      salesOrderProductList,
      deliveryFeeAmount: pageState?.shippingFee,
      billingAddressInfo: {
        ...shippingAddress
      },
      shipToRequest: {
        ...shippingAddress
      },
      requestDate: formatDateTime(new Date(), FORMAT_FULL_YEAR),
      currencyCode: country === VALUE_COUNTRY.US ? CURRENCY.USD : CURRENCY.CAD,
      salesOrderType: OrderTypeEnum.BAG_ORDER,
      couponList: [],
      totalPoint: 0
    }
    getTax(payload)
  }
}

onMounted(() => {
  const identification = route.params.identification
  const plannerBagId = route.query.plannerBagId
  identification &&
    plannerBagId &&
    decryptSaleOrder({
      identification,
      bagUserInfoRequest: {
        plannerBagId
      }
    })
})

const getListProductsSheet = async (params) => {
  try {
    showGlobalLoading(true)
    const response = await apiService.orderService.getListProductsSheet(params)
    if (response.success) {
      pageState.cartItems = response?.data?.productList
    }
  } finally {
    showGlobalLoading(false)
  }
}

const calculateTotal = () => {
  const total = pageState.cartItems.reduce(
    (total, current) =>
      total + current?.productBaseDto?.quantity * current?.purchaseAmountAfterRank,
    0
  )
  return total
}

const checkSameCurrency = computed(() => {
  const productCAD = pageState.cartItems?.filter((e) => e.currency?.code === CURRENCY.CAD)
  const productUSD = pageState.cartItems?.filter((e) => e.currency?.code === CURRENCY.USD)

  return {
    isSame: Boolean(!productCAD.length || !productUSD.length),
    currency: productCAD.length ? CURRENCY.CAD : CURRENCY.USD
  }
})

const getAmount = (feeShip, taxAmount) => {
  return Number(financial(calculateTotal() + feeShip + taxAmount))
}

const checkSameCountry = computed(() => {
  const productCA = pageState.cartItems?.filter((e) => e.country === VALUE_COUNTRY.CA)
  const productUS = pageState.cartItems?.filter((e) => e.country === VALUE_COUNTRY.US)

  return {
    isSame: Boolean(!productCA.length || !productUS.length),
    currency: productCA.length ? CURRENCY.CAD : CURRENCY.USD
  }
})

const showValidNotification = () => {
  let message = ''
  if (disableBtnPayment.value) {
    message = VALIDATE_MESSAGE.requiredPayment
    formRef.value.validateFields()

    const newOpenCollapse = []
    if (!Object.keys(pageState?.shippingAddress)?.length) {
      newOpenCollapse.push(String(ID_ORDER_CHECKOUT_NON_MEMBER.SHIPPING - 1))
      pageState.allowValid.shipping = true
    }
    if (!Object.keys(pageState?.dataCard)?.length) {
      newOpenCollapse.push(String(ID_ORDER_CHECKOUT_NON_MEMBER.PAYMENT - 1))
      pageState.allowValid.payment = true
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

const authAddress = async () => {
  if (showValidNotification()) return

  if (!checkSameCountry.value.isSame) {
    handleModalAlert(true, VALIDATE_MESSAGE.sameCountry)
    return
  }
  if (!checkSameCurrency.value.isSame) {
    handleModalAlert(true, VALIDATE_MESSAGE.sameCurrency)
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
    handlePayment()
  } else {
    pageState.visibleAlert = true
    pageState.descriptionAddressAlert = VALIDATE_MESSAGE.invalidAddressOrder
  }
}

const handlePayment = async () => {
  showGlobalLoading(true)
  const {
    cardFirstName,
    cardLastName,
    cardNumber,
    expiredMonth,
    expiredYear,
    cardCvc,
    billFirstName,
    billLastName,
    billAddress,
    billAptFloorSuite,
    billState,
    billCity,
    billZipCode,
    billCountry,
    billMobileNumber,
    billHomePhone
  } = pageState.dataCard

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
  const userAddressInfo = {
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

  const addressPaymentCard = {
    firstName: billFirstName,
    lastName: billLastName,
    address1: billAddress,
    address2: billAptFloorSuite,
    city: billCity,
    state: billState,
    zipCode: billZipCode,
    country: billCountry,
    cellPhone: billMobileNumber,
    homePhone: billHomePhone
  }

  const { birthDay, birthMonth, birthYear } = formState

  const dataSubmit = {
    salesOrderNumber: pageState.salesOrderNumber,
    identification: route.params.identification,
    salesOrderProductList: pageState.cartItems.map((item) => {
      return {
        productId: item?.productBaseDto?.productId,
        quantity: item?.productBaseDto?.quantity,
        productOptionId: item?.productBaseDto?.productOptionId
      }
    }),
    paymentInfo: {
      paymentType: PAYMENT_TYPE.CREDIT_CARD,
      amount: getAmount(pageState?.shippingFee, pageState?.taxOrder),
      cardType: CardEnum.PLANNER,
      cardNumber: formatCellphoneToSend(cardNumber),
      cardCvc,
      expiredMonth,
      expiredYear,
      ownerName: `${cardFirstName} ${cardLastName}`,
      currencyCode: checkSameCurrency.value.currency,
      exponent: EXPONENT,
      installment: '00'
    },
    deliveryFeeAmount: pageState?.shippingFee,
    totalPaymentAmount: getAmount(pageState?.shippingFee, pageState?.taxOrder),
    email: formState.email,
    mobileNumber: phoneNumber,
    plannerBagID: route.query?.plannerBagId,
    billingAddressInfo: addressPaymentCard,
    userAddressInfo,
    taxAmount: pageState?.taxOrder,
    birthDate: [Number(birthYear), Number(birthMonth), Number(birthDay)]
  }
  try {
    showGlobalLoading(true)
    const response = await apiService.orderService.easyPaymentOrder(dataSubmit)
    if (response.success) {
      router.push({
        name: AppRoutes.orderNonMember.orderComplete.name,
        params: { id: response?.data?.salesOrderNumber },
        query: { email: formState.email }
      })
    } else {
      handleModalAlert(true, response.message)
      refreshSaleOrder({
        identification: route.params.identification,
        bagUserInfoRequest: {
          plannerBagId: route.query.plannerBagId
        }
      })
    }
  } finally {
    showGlobalLoading(false)
  }
}

const handleCheckAll = () => {
  formState.agreeAllPolicies = !formState.agreeAllPolicies
  formState.agreeTerms = formState.agreeAllPolicies
  formState.sendMail = formState.agreeAllPolicies
}

watch(
  () => [formState.agreeTerms, formState.sendMail],
  ([valAgree, valMail]) => {
    if ((!valAgree || !valMail) && formState.agreeAllPolicies) {
      formState.agreeAllPolicies = false
    }
    valAgree && formRef.value?.clearValidate('agreeTerms')

    if (valAgree && valMail) {
      formState.agreeAllPolicies = true
    }
  }
)

watch(
  () => [formState.birthDay, formState.birthMonth, formState.birthYear],
  (data) => {
    const [day, month, year] = data
    if (day && month) {
      if (!isValidDate(1900, month, day)) {
        pageState.canEnableNext = false
        formState.birthDay = null
      }
    }
    if (day && month && year) {
      if (!checkAgeOfUser(year, month, day, BIRTH_CUSTOMER_YEAR)) {
        pageState.canEnableNext = false
        pageState.messageErrorBirthDay = 'Registration age cannot be less than 18'
      } else {
        pageState.canEnableNext = true
        pageState.messageErrorBirthDay = ''
      }
    }
  }
)

const handleOptionsYear = computed(() => {
  return populateYearDropdown(1900, dayjs().year() - BIRTH_CUSTOMER_YEAR)
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
  @apply text-gray-10 flex flex-col  pt-2.5 text-xs font-normal;
}
</style>
