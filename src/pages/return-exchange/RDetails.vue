<script setup>
import ProductItem from '@/components/return-exchange/details/DetailProductItem.vue'
import ProductPreview from '@/components/return-exchange/details/ProductPreview.vue'
import MenuItem from '@/components/return-exchange/agreement/MenuItemCustom.vue'
import CautionNotice from '@/components/return-exchange/agreement/CautionNotice.vue'
import DetailBilling from '@/components/return-exchange/details/DetailBilling.vue'
import ListIcon from '@/assets/svgs/list.svg'
import {
  RETURN_AGREEMENT_STATE,
  RETURN_AGREEMENT_CAUTIONS,
  REFUND_AMOUNT_SAMPLE,
  POINT_INFO_SAMPLE,
  FORMAT_DATETIME,
  RETURN_EXCHANGE_TYPE
} from '@/helpers/constant'
import { computed, reactive, ref } from 'vue'
import { AppRoutes } from '@/router/path'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from 'vue-query'
import { formatDateTime } from '@/utils/datetime'

import apiService from '@/http/api'
import { addPrefixForImage } from '@/utils/common'

const router = useRouter()

const totalRefund = ref(1)

const pageState = reactive({
  currentState: RETURN_AGREEMENT_STATE.ESTIMATED_REFUND,
  isAcceptAgreement: false,
  dataReturnDetail: undefined
})

const route = useRoute()

const pointInfo = reactive(POINT_INFO_SAMPLE)

// handle fetching data
const { refetch } = useQuery({
  queryKey: [
    'load-order-details',
    {
      returnOrderNumber: route?.params?.id
    }
  ],
  queryFn: () => apiService.returnService.getReturnOrderDetails(route?.params?.id),
  onSuccess: (data) => {
    if (data?.code === '2000') pageState.dataReturnDetail = data?.data
  },
  enabled: computed(() => !!route?.params?.id).value
})

const dataReturnDetail = computed(() => pageState?.dataReturnDetail)
const returnOrderProductList = computed(() =>
  pageState?.dataReturnDetail?.returnOrderProductList.map((item) => ({
    ...item,
    thumbnailUrl: addPrefixForImage(item?.thumbnailUrl)
  }))
)
const refundAmountItems = computed(() => {
  const newArr = [
    ...REFUND_AMOUNT_SAMPLE,
    {
      label: 'ETC',
      value: 'etc'
    }
  ]
  return newArr.map((item) => ({
    ...item,
    value: pageState?.dataReturnDetail?.paymentInfo?.[item.value]
  }))
})

const cautionNotices = computed(() =>
  totalRefund.value >= 0
    ? RETURN_AGREEMENT_CAUTIONS.RETURN_AVAILABLE
    : RETURN_AGREEMENT_CAUTIONS.RETURN_UNAVAILABLE
)

const formatCardNumber = (value) => {
  if (!value) return ''
  return value.match(/.{1,4}/g).join(' ')
}

const dataButtonStatus = computed(() => {
  if (pageState.dataReturnDetail) {
    const { returnOrderBaseInfo, returnOrderProductList, requestInfo } = pageState.dataReturnDetail
    return {
      returnOrderNumber: returnOrderBaseInfo?.returnOrderNumber,
      receptionDatetime: returnOrderBaseInfo?.receptionDatetime,
      salesOrderId: returnOrderBaseInfo?.salesOrderId,
      returnOrderStatus: returnOrderBaseInfo?.returnOrderStatus?.text,
      returnOrderStatusCode: returnOrderBaseInfo?.returnOrderStatus?.code,
      returnOrderStatusCustomer: returnOrderBaseInfo?.returnOrderStatusCustomer,
      returnExchangeType: returnOrderBaseInfo?.returnExchangeType?.code,
      returnOrderRequestId: requestInfo?.returnOrderRequestId,
      productList: returnOrderProductList
    }
  } else return {}
})

const isReturn = computed(
  () =>
    pageState.dataReturnDetail?.returnOrderBaseInfo?.returnExchangeType?.code ===
    RETURN_EXCHANGE_TYPE.RETURN
)

const renderTextRE = computed(() => {
  return isReturn.value ? 'Return' : 'Exchange'
})

const viewDetails = (id) => {
  router.push({
    name: AppRoutes.myPage.orderHistoryDetail.name,
    params: {
      id: id
    },
    query: {
      type: pageState.dataReturnDetail?.returnOrderBaseInfo?.returnExchangeType?.code
    }
  })
}
</script>
<template>
  <MenuItem class="p-5">
    <template #label>
      <span class="font-400 text-[14px]">{{
        dataReturnDetail?.returnOrderBaseInfo?.returnOrderNumber
      }}</span>
    </template>
    <template #value>
      <span class="font-400 text-[14px]">{{
        formatDateTime(dataReturnDetail?.returnOrderBaseInfo?.receptionDatetime, 'YYYY.MM.DD')
      }}</span>
    </template>
  </MenuItem>

  <div class="bg-navy-6 font-550 text-4.5 px-5 py-3.5 text-[#fff]">
    <span v-if="isReturn">
      {{ dataReturnDetail?.returnOrderBaseInfo?.returnOrderStatusCustomer }}
    </span>
    <span v-else>
      {{ dataReturnDetail?.returnOrderBaseInfo?.returnOrderStatus?.text }}
    </span>
  </div>

  <div class="e-details flex flex-col gap-[30px] p-5">
    <div>
      <p class="e-details_title !mb-5">{{ renderTextRE }} Reason Information</p>
      <MenuItem algin="vertical">
        <template #label>
          <span class="font-475 text-[14px]">Reason for {{ renderTextRE }}</span>
        </template>
        <template #value>
          <span class="font-400 text-[12px]">{{
            dataReturnDetail?.requestInfo?.returnOrderReasonType?.text
          }}</span>
        </template>
      </MenuItem>
      <a-divider class="!bg-gray-11 !my-6.25" />
      <MenuItem algin="vertical">
        <template #label>
          <span class="font-475 text-[14px]">{{ renderTextRE }} Detailed Reason</span>
        </template>
        <template #value>
          <span class="font-400 text-[12px]">{{
            dataReturnDetail?.requestInfo?.returnOrderReasonDetail
          }}</span>
        </template>
      </MenuItem>
      <a-divider class="!bg-gray-11 !my-6.25" />
      <p class="e-details_title">Image</p>
      <ProductPreview :images="dataReturnDetail?.requestInfo?.images.map((i) => i.imageFileUrl)">
      </ProductPreview>
    </div>

    <a-divider class="!bg-gray-10 !my-0" />

    <p class="e-details_title">Retrieve Address Information</p>
    <div class="flex flex-col gap-5">
      <MenuItem>
        <template #label> <span class="font-400 text-[14px]">Name</span> </template>
        <template #value>
          <span class="font-400 text-[12px]">
            {{ dataReturnDetail?.deliveryInfo?.receiverName }}
          </span>
        </template>
      </MenuItem>
      <MenuItem>
        <template #label> <span class="font-400 text-[14px]">Address </span> </template>
        <template #value>
          <p class="text-wrap font-400 text-right text-[12px]">
            {{ dataReturnDetail?.deliveryInfo?.address }}
          </p>
        </template>
      </MenuItem>
      <MenuItem>
        <template #label>
          <span class="font-400 text-[14px]">Cell Phone</span>
        </template>
        <template #value>
          <span class="font-400 text-[12px]">
            {{ dataReturnDetail?.deliveryInfo?.receiverPhoneNumber }}
          </span>
        </template>
      </MenuItem>
      <MenuItem>
        <template #label>
          <span class="font-400 text-[14px]">Home Phone</span>
        </template>
        <template #value>
          <span class="font-400 text-[12px]">
            {{ dataReturnDetail?.deliveryInfo?.receiverHomePhone }}
          </span>
        </template>
      </MenuItem>
    </div>
    <a-divider class="!bg-gray-10 !my-0" />
    <div>
      <p class="e-details_title">Product Information</p>
      <div class="font-400 mb-2.5 mt-5 flex text-[12px]">
        <p class="mb-0">
          {{ dataReturnDetail?.returnOrderBaseInfo?.salesOrderNumber }}
          <span class="text-gray-13">|</span>
          {{
            formatDateTime(
              dataReturnDetail?.returnOrderBaseInfo?.receptionDatetime,
              FORMAT_DATETIME
            )
          }}
        </p>
        <p
          class="mb-0 ml-auto cursor-pointer underline"
          @click="viewDetails(dataReturnDetail?.returnOrderBaseInfo?.salesOrderId)"
        >
          View Details
        </p>
      </div>
      <ProductItem v-for="(item, index) in returnOrderProductList" :key="index" :item="item">
        <template v-if="index < returnOrderProductList.length - 1" #footer>
          <a-divider class="!bg-gray-11 !my-5" />
        </template>
      </ProductItem>
    </div>
    <a-divider class="!bg-gray-10 !my-0" />
    <template v-if="isReturn">
      <p class="e-details_title">Estimated Refund Amount</p>
      <DetailBilling
        :total="dataReturnDetail?.paymentInfo?.total"
        :items="refundAmountItems"
        :return-methods="{
          text: dataReturnDetail?.paymentInfo?.refundMethod?.text,
          cardNumber: formatCardNumber(dataReturnDetail?.paymentInfo?.cardNumber)
        }"
      />
      <a-divider class="!bg-gray-10 !my-0" />
      <div>
        <p class="font-475 mb-[30px] text-[16px]">Points Information</p>
        <div class="mb-5 flex flex-col gap-5">
          <MenuItem v-for="item in pointInfo" :key="item">
            <template #label> {{ item.label }} </template>
            <template #value> {{ dataReturnDetail?.paymentInfo?.[item.value] }} P </template>
          </MenuItem>
        </div>
        <CautionNotice v-if="dataReturnDetail?.returnOrderBaseInfo?.isDowngrade">
          <div class="flex flex-col gap-3">
            <div>
              <div
                v-for="caution in cautionNotices"
                :key="caution"
                class="font-400 relative flex items-center text-[12px]"
              >
                <ListIcon class="absolute top-2 mr-2" />
                <span class="pl-2">{{ caution.label }}</span>
              </div>
            </div>
          </div>
        </CautionNotice>
      </div>
    </template>
    <div class="mb-10 flex flex-col gap-2.5">
      <ButtonStatusReturn :data="dataButtonStatus" :load-again="refetch" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.e-details {
  &_title {
    @apply font-475 mb-0 text-[16px];
  }
}
</style>
