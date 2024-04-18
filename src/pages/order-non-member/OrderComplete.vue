<template>
  <div>
    <div class="w-full bg-white">
      <p class="mb-0 mt-10 text-center text-sm">Thank you! Your order has been completed.</p>

      <div class="px-5">
        <a-divider class="bg-black-50 !my-10" />
        <p class="font-475 mb-[30px] text-base">Non-Member Order Information</p>
        <a-row class="row-info">
          <a-col :span="8">Order Email</a-col>
          <a-col :span="16" class="col-custom"> {{ dataComplete?.orderInfo?.email }}</a-col>
        </a-row>
        <a-row class="row-info">
          <a-col :span="8">Order Number</a-col>
          <a-col :span="16" class="col-custom">
            {{ dataComplete?.orderInfo?.salesOrderNumber }}
          </a-col>
        </a-row>
        <span class="text-red-1000 text-xs">
          In order to search Bag order, the email you entered when placing your order and the order
          number below are absolutely necessary.
        </span>

        <a-divider class="bg-black-50 !my-10" />

        <p class="font-475 mb-[30px] text-base">Shipping Information</p>
        <div class="text-sm">
          <a-row class="row-info">
            <a-col :span="8">Order Number</a-col>
            <a-col :span="16" class="col-custom">
              {{ dataComplete?.orderInfo?.salesOrderNumber }}
            </a-col>
          </a-row>
          <a-row class="row-info">
            <a-col :span="8">Order Date</a-col>
            <a-col :span="16" class="col-custom">
              {{ formatDateTime(dataComplete?.orderInfo?.orderDatetime, FORMAT_DATETIME) }}
            </a-col>
          </a-row>
          <a-row class="row-info">
            <a-col :span="8">Name</a-col>
            <a-col :span="16" class="col-custom">
              {{
                `${dataComplete?.delivery?.receiverFirstName} ${dataComplete?.delivery?.receiverLastName}`
              }}
            </a-col>
          </a-row>
          <a-row class="row-info">
            <a-col :span="8">Address</a-col>
            <a-col :span="16" class="col-custom whitespace-pre-wrap">
              {{
                dataComplete?.delivery &&
                  shippingAddressDescriptionNonMember(dataComplete?.delivery)
              }}
            </a-col>
          </a-row>
          <a-row class="row-info">
            <a-col :span="8">Cell Phone</a-col>
            <a-col :span="16" class="col-custom">
              {{ dataComplete?.delivery?.receiverPhoneNumber }}
            </a-col>
          </a-row>
          <a-row class="row-info">
            <a-col :span="8">Home Phone</a-col>
            <a-col :span="16" class="col-custom">
              {{ dataComplete?.delivery?.receiverHomePhoneNumber }}
            </a-col>
          </a-row>
          <a-row class="row-info">
            <a-col :span="8">Message</a-col>
            <a-col :span="16" class="col-custom">
              {{ dataComplete?.delivery?.deliveryRequest }}
            </a-col>
          </a-row>
        </div>

        <a-divider class="bg-black-50 !my-[30px]" />
        <p class="font-475 mb-[30px] text-base">Order Information</p>
        <div class="text-sm">
          <a-row class="row-info">
            <a-col :span="8">Product</a-col>
            <a-col :span="16" class="col-custom">
              <div v-for="item in dataComplete.productList" :key="item.productId" class="mb-3">
                <p class="font-550 mb-2">{{ item?.productName }}</p>
                <p>
                  <span v-if="item?.optionName" class="text-[14px] opacity-75">
                    Option: {{ item?.optionName }}
                  </span>
                </p>
                <div class="flex items-center justify-end gap-[10px]">
                  <span>{{ sizes[0] }}.</span>
                  <div class="bg-gray-14 h-[10px] w-[1px]" />
                  <span>{{ item.quantity }} PCS</span>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
        <a-divider class="bg-black-50 !my-[25px]" />
        <div class="text-sm">
          <a-row class="row-info">
            <a-col :span="8">Subtotal</a-col>
            <a-col :span="16" class="text-end">
              {{ renderCurrency(dataComplete?.payment?.currency?.code) }}
              {{ convertNumber(dataComplete?.payment?.totalPurchaseAmountAfterRank) }}
            </a-col>
          </a-row>
        </div>
        <div class="text-sm">
          <a-row class="row-info">
            <a-col :span="8">Sales Tax</a-col>
            <a-col :span="16" class="text-end">
              {{ renderCurrency(dataComplete?.payment?.currency?.code) }}
              {{ convertNumber(dataComplete?.payment?.taxAmount) }}
            </a-col>
          </a-row>
          <a-row class="row-info">
            <a-col :span="8">Shipping</a-col>
            <a-col :span="16" class="text-end">
              {{ renderCurrency(dataComplete?.payment?.currency?.code) }}
              {{ convertNumber(dataComplete?.payment?.deliveryFeeAmount) }}
            </a-col>
          </a-row>
        </div>
        <a-divider class="bg-black-50 !my-[25px]" />
        <a-row class="row-info">
          <a-col :span="8" class="font-475 text-base">Total</a-col>
          <a-col :span="16" class="font-625 text-end text-lg">
            {{ renderCurrency(dataComplete?.payment?.currency?.code) }}
            {{ convertNumber(dataComplete?.payment?.totalAmount) }}
          </a-col>
        </a-row>
        <a-divider class="bg-black-50 !my-[25px]" />
        <a-row class="row-info">
          <a-col :span="8">Payment Method</a-col>
          <a-col :span="16" class="text-end">
            {{ dataComplete?.payment?.paymentType?.text }}
          </a-col>
        </a-row>
        <a-divider class="bg-black-50 !my-[25px]" />

        <div class="mb-10 flex gap-[5px]">
          <r-button
            title="Order Details"
            class="!border-navy-deep !rounded-0 !h-10 w-full"
            class-title="text-sm text-navy-deep font-550"
            @click="
              transitPage({
                name: AppRoutes.orderNonMember.orderDetail.name,
                params: { id: route.params?.id },
                query: { email: route.query?.email }
              })
            "
          />
          <r-button
            title="Keep Shopping"
            type="primary"
            class="!border-navy-deep !bg-navy-deep !rounded-0 !h-10 w-full"
            class-title="text-sm text-white font-550"
            @click="transitPage(AppRoutes.home.path)"
          />
        </div>
      </div>
    </div>
  </div>
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
</template>
<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { shippingAddressDescriptionNonMember } from '@/utils/common'
import { sizes } from '@/mocks/products'
import { convertNumber, renderCurrency } from '@/utils/currency'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { formatDateTime } from '@/utils/datetime'
import { FORMAT_DATETIME } from '@/helpers/constant'

const router = useRouter()
const route = useRoute()
const storeLoading = useGlobalLoadingStore()
const { showGlobalLoading } = storeLoading
const dataComplete = reactive({})
const pageState = reactive({
  showModalAlert: false,
  descriptionAlert: ''
})

const handleModalAlert = (status, description) => {
  pageState.showModalAlert = status
  pageState.descriptionAlert = description
}

const getCompleteData = async () => {
  showGlobalLoading(true)
  try {
    const response = await apiService.orderService.getOrderCompleteNonMember({
      orderNumber: route.params.id,
      email: route.query?.email
    })
    if (response.success) {
      Object.assign(dataComplete, response.data)
    } else {
      handleModalAlert(true, response?.message)
    }
  } finally {
    showGlobalLoading(false)
  }
}

onMounted(() => {
  if (route.query?.email) {
    getCompleteData()
  } else {
    router.back()
  }
})
const transitPage = (url) => {
  router.push(url)
}
</script>
<style lang="scss" scoped>
.row-info {
  @apply mb-5;
  .col-custom {
    @apply text-end text-xs;
  }
}
</style>
