<template>
  <div class="-mt-12.5">
    <div class="flex justify-between py-5">
      <span>Autoship Created Date</span>
      <span>{{ state.subscriptionDetail?.orderDateTime }}</span>
    </div>

    <MyPageMenu title="Purchase Status" class="mb-4" />
    <PurchaseStatus :info="state.subscriptionDetail" />

    <a-divider class="!bg-gray-10 !my-10" />

    <MyPageMenu
      title="Autoship Status"
      class="mb-4"
      icon="menu"
      @click="state.isShowAutoshipStatusDrawer = true"
    />
    <AutoshipStatus
      :items="autoshipStatusMain"
      :subscription-id="state.subscriptionDetail?.subscriptionId"
      @skip="getSubscriptionDetail"
    />
    <AutoshipStatusDrawer
      v-model:visible="state.isShowAutoshipStatusDrawer"
      :items="autoshipStatusDetail"
      :subscription-id="state.subscriptionDetail?.subscriptionId"
      @skip="getSubscriptionDetail"
    />

    <a-divider class="!bg-gray-10 !my-10" />

    <MyPageMenu
      title="Autoship Billing Date"
      class="mb-4"
      icon="edit"
      @click="state.isShowChangeBillingDateDrawer = true"
    />
    <div class="grid gap-2.5">
      <AutoshipInformationItem label="Billing Date (Monthly)" :value="paymentDayText" />
      <AutoshipInformationItem
        label="Next Billing Date (YYYY-MM-DD)"
        :value="state.subscriptionDetail?.nextPaymentDay"
      />
    </div>
    <ChangeBillingDateDrawer
      v-model:visible="state.isShowChangeBillingDateDrawer"
      v-model:date="state.subscriptionDetail.paymentDay"
      @update:date="onChangeBillingDate"
    />

    <a-divider class="!bg-gray-10 !my-10" />

    <MyPageMenu
      title="Shipping Address"
      class="mb-4"
      icon="edit"
      @click="state.visibleModalShippingManagement = true"
    />
    <div class="flex flex-col gap-2.5">
      <AutoshipInformationItem
        label="Name"
        :value="state.subscriptionDetail?.shippingInfo?.addressee"
      />
      <AutoshipInformationItem label="Address" :value="address" />
      <AutoshipInformationItem label="Cell Phone" :value="addressCellPhone" />
    </div>

    <a-divider class="!bg-gray-10 !my-10" />

    <MyPageMenu
      title="Payment Method"
      class="mb-4"
      icon="edit"
      @click="state.visibleModalPaymentMethod = true"
    />
    <AutoshipInformationItem label="Credit Card" :value="creditCard" />

    <a-divider class="!bg-gray-10 !my-10" />

    <MyPageMenu title="Purchase Product" class="mb-4" />
    <div class="mb-5 grid grid-cols-1">
      <AutoshipProductViewItem
        v-for="product in state.subscriptionDetail.productList || []"
        :key="product.productId"
        :product="product"
      />
    </div>

    <div class="information__row mb-4">
      <span>Payment Amount</span>
      <span>
        {{ currencyProduct }}
        {{ convertNumber(state.subscriptionDetail?.totalSaleAmount) }}</span
      >
    </div>
    <div class="information__row">
      <span>Total Points</span>
      <span>{{ convertNumber(state.subscriptionDetail?.pointsEarned) }} {{ getPointText }}</span>
    </div>

    <div class="mt-7.5 mb-10 flex flex-col items-center justify-center gap-4">
      <RButton
        title="Change Product"
        class-title="text-navy-6"
        class="!border-navy-6 w-full"
        @click="state.isShowChangeProduct = true"
      />

      <span class="leading-base cursor-pointer text-xs underline" @click="onCancelSubscription">
        Cancel Subscription
      </span>
    </div>
  </div>
  <ChangeProductDrawer
    v-model:visible="state.isShowChangeProduct"
    :products="state.subscriptionDetail?.productList"
    @confirm="onChangeProduct"
  />

  <ModalPaymentMethod
    v-model="state.visibleModalPaymentMethod"
    :open-modal="state.visibleModalPaymentMethod"
    :subscription-id="state.subscriptionDetail?.subscriptionId"
    :default-card="state.subscriptionDetail?.userPaymentId"
    @load-detail-again="getSubscriptionDetail()"
    @close-modal="() => (state.visibleModalPaymentMethod = false)"
  />

  <ModalShippingManagement
    v-model="state.visibleModalShippingManagement"
    :open-modal="state.visibleModalShippingManagement"
    :default-shipping="state.subscriptionDetail?.shippingInfo?.userAddressId"
    :subscription-id="state.subscriptionDetail?.subscriptionId"
    @load-detail-again="getSubscriptionDetail()"
    @open-modal-add="handleStatusModalAddress(false, true)"
    @close-modal="() => (state.visibleModalShippingManagement = false)"
  />
  <ModalAddShippingAddress
    v-model="state.visibleAddShippingAddress"
    @close-modal="handleStatusModalAddress(true, false)"
  />
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import cloneDeep from 'lodash/cloneDeep'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useNotification } from '@/composables/notification'
import { formatPhoneNumber } from '@/utils/common'
import { convertNumber, renderCurrency } from '@/utils/currency'
import { AppRoutes } from '@/router/path'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { OrderTypeEnum } from '@/helpers/enum'
import { FORMAT_FULL_YEAR, CURRENCY } from '@/helpers/constant'
import { getPointText } from '@/utils/product'

dayjs.extend(isSameOrBefore)

const { currentAuthUser } = storeToRefs(useAuthUserStore())
const { showGlobalLoading } = useGlobalLoadingStore()
const { showNotification } = useNotification()

const STATUS_ITEM_PER_ROW = 4

const route = useRoute()
const router = useRouter()
const state = reactive({
  subscriptionDetail: {},
  isShowAutoshipStatusDrawer: false,
  isShowChangeBillingDateDrawer: false,
  isShowChangeProduct: false,
  visibleModalPaymentMethod: false,
  visibleModalShippingManagement: false,
  visibleAddShippingAddress: false
})

const paymentDayText = computed(() => {
  const n = ~~state.subscriptionDetail?.paymentDay
  let ord = 'th'
  const j = n % 10
  const k = n % 100

  if (j === 1 && k !== 11) {
    ord = 'st'
  }
  if (j === 2 && k !== 12) {
    ord = 'nd'
  }
  if (j === 3 && k !== 13) {
    ord = 'rd'
  }
  return `${n}<sup>${ord}</sup>`
})

const creditCard = computed(() =>
  state.subscriptionDetail?.cardNumber ? `${state.subscriptionDetail?.cardNumber} (BC)` : ''
)

const addressCellPhone = computed(() =>
  formatPhoneNumber(state.subscriptionDetail?.shippingInfo?.addresseeMobileNo)
)

const currencyProduct = computed(() => {
  return renderCurrency(
    state.subscriptionDetail?.productList
      ? state.subscriptionDetail?.productList[0]?.currency?.code
      : CURRENCY.USD
  )
})

const address = computed(() => {
  const {
    address1: address,
    address2: aptFloorSuite,
    city,
    state: stateText,
    zipCode: zipcode,
    country
  } = state.subscriptionDetail?.shippingInfo || {}

  const firstLine = []
  const secondLine = []

  if (country) firstLine.push(country)
  if (zipcode) firstLine.push(`[${zipcode}]`)

  if (aptFloorSuite) secondLine.push(aptFloorSuite)
  if (address) secondLine.push(address)
  if (city) secondLine.push(city)
  if (stateText) secondLine.push(stateText)

  const firstLineText = firstLine.join(' ')
  const secondLineText = secondLine.join(', ')

  const result = []
  if (firstLineText) result.push(firstLineText)
  if (secondLineText) result.push(secondLineText)
  return result.join('\n')
})

const autoshipStatusList = computed(() => {
  const itemClone = cloneDeep(state.subscriptionDetail?.turningTrainDtos || [])
  const endOfMonthCurrentDate = dayjs().endOf('month').format(FORMAT_FULL_YEAR)

  return itemClone.filter((item) =>
    dayjs(item?.paymentScheduleDate).isSameOrBefore(endOfMonthCurrentDate)
  )
})

const autoshipStatusMain = computed(() => {
  const itemClone = cloneDeep(autoshipStatusList.value)
  itemClone.length = STATUS_ITEM_PER_ROW
  return itemClone
})

const autoshipStatusDetail = computed(() => {
  const itemClone = cloneDeep(autoshipStatusList.value)
  const length = itemClone.length
  itemClone.length = Math.ceil(length / STATUS_ITEM_PER_ROW) * STATUS_ITEM_PER_ROW
  return itemClone
})

onMounted(() => {
  getSubscriptionDetail()
})

const getSubscriptionDetail = async () => {
  showGlobalLoading(true)
  const { data, success } = await apiService.myPageService.getAutoShipSubscribeDetail(
    route.params?.id
  )
  showGlobalLoading(false)
  state.subscriptionDetail = success ? data : {}
  parseOptionProductList()
}

const parseOptionProductList = () => {
  const products = state.subscriptionDetail?.productList || []
  const newProducts = products.map((p) => {
    const optionCode = []
    const options = p?.optionValues || []
    options.forEach((option) => {
      optionCode.push(`${option.optionName}: ${option.optionValue}`)
    })

    return {
      ...p,
      optionCode: optionCode.join('\n')
    }
  })

  state.subscriptionDetail.productList = newProducts
}

const onCancelSubscription = () => {
  router.push(AppRoutes.myPage.cancelAutoShip.path)
}

const handleStatusModalAddress = (list, add) => {
  state.visibleModalShippingManagement = list

  state.visibleAddShippingAddress = add
}

const onChangeBillingDate = async (paymentDay) => {
  showGlobalLoading(true)
  const { success } = await apiService.myPageService.changeDeliveryDate({
    paymentDay,
    subscriptionId: state.subscriptionDetail?.subscriptionId
  })

  await getSubscriptionDetail()

  showNotification({
    type: success ? 'success' : 'error',
    message: success ? 'Subscription date has changed' : 'Change subscription date failed'
  })
  showGlobalLoading(false)
}

const onChangeProduct = async (data) => {
  showGlobalLoading(true)

  const orderCountry = state.subscriptionDetail?.productList[0]?.country

  const pointEarnPayload = {
    paymentAmountWithoutShippingFee: data.totalSalesAmount,
    userType: currentAuthUser.value.userType?.code,
    salesOrderType: OrderTypeEnum.SUBSCRIBE_ORDER,
    userCountry: currentAuthUser.value?.nationalCode,
    orderCountry
  }
  const { data: dataPointEarn } = await apiService.orderService.getPointEarnOrder(pointEarnPayload)

  const changeProductPayload = {
    ...data,
    pointEarn: dataPointEarn?.pointEarn || 0,
    subscriptionId: state.subscriptionDetail?.subscriptionId,
    turningTrain: state.subscriptionDetail?.turningTrain
  }
  const { success } = await apiService.myPageService.changeProductAutoship(changeProductPayload)
  await getSubscriptionDetail()
  state.isShowChangeProduct = false
  showGlobalLoading(false)

  showNotification({
    type: success ? 'success' : 'error',
    message: success ? 'The subscription product has changed.' : 'The subscription product failed'
  })
}
</script>

<style lang="scss" scoped>
.information__row {
  @apply flex items-center justify-between;
}
</style>
