<template>
  <div class="bg-gray-6 text-black-50 flex items-center justify-center sm:py-10">
    <div class="w-full bg-white sm:max-w-[550px]">
      <div class="hidden flex-col text-center md:flex">
        <span class="py-6 text-base font-medium capitalize">
          {{ AppSubNavTitles.order.complete }}
        </span>
        <a-divider class="bg-black-50 !my-0" />
      </div>

      <p class="mt-10 text-center text-sm">Your order has been placed successfully.</p>

      <div class="px-5">
        <a-divider class="bg-black-50 !mb-[30px] !mt-10" />
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
              {{ dataComplete?.delivery && shippingAddressDescription(dataComplete?.delivery) }}
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
                    Option: {{ item?.optionName }}</span
                  >
                </p>
                <template v-if="item?.optionValues">
                  <div v-for="option in item?.optionValues" :key="option?.optionValue" class="mb-2">
                    <div class="flex items-center justify-end gap-2">
                      {{ option?.optionName }} :

                      <div v-if="option?.type?.code === ProductVariantEnum?.IMAGE">
                        <img
                          :src="addPrefixForImage(option?.optionValue)"
                          class="w-10"
                          alt="image_option"
                        />
                      </div>
                      <div v-else>
                        {{ option?.optionValue }}
                      </div>
                    </div>
                  </div>
                </template>
                <div class="flex items-center justify-end gap-[10px]">
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
              {{ renderCurrency(dataComplete?.payment?.currency?.code)
              }}{{ convertNumber(dataComplete?.payment?.totalAmountAfterDiscount) }}
            </a-col>
          </a-row>
        </div>
        <a-divider class="bg-gray-11 !my-[25px]" />
        <div class="text-sm">
          <a-row class="row-info">
            <a-col :span="8">Applied Coupons</a-col>
            <a-col :span="16" class="text-end">
              - {{ renderCurrency(dataComplete?.payment?.currency?.code) }}
              {{
                convertNumber(
                  dataComplete?.payment?.totalCouponDiscountAmount +
                    dataComplete?.payment?.deliveryCouponAmount
                )
              }}
            </a-col>
          </a-row>
          <a-row v-if="dataComplete?.payment?.membershipDiscount" class="row-info">
            <a-col :span="8">{{ textFollowRank }} Discount</a-col>
            <a-col :span="16" class="text-end">
              - {{ renderCurrency(dataComplete?.payment?.currency?.code) }}
              {{ dataComplete?.payment?.membershipDiscount }}
            </a-col>
          </a-row>
          <a-row class="row-info">
            <a-col :span="8">Applied Points</a-col>
            <a-col :span="16" class="text-end">
              - {{ dataComplete?.orderPoint?.minusPoint }} P
            </a-col>
          </a-row>

          <a-row class="row-info">
            <a-col :span="8">Sales Tax</a-col>
            <a-col :span="16" class="text-end">
              {{ renderCurrency(dataComplete?.payment?.currency?.code) }}
              {{ formatCurrency(dataComplete?.payment?.taxAmount) }}
            </a-col>
          </a-row>
          <a-row class="row-info">
            <a-col :span="8">Shipping</a-col>
            <a-col :span="16" class="text-end">
              {{ renderCurrency(dataComplete?.payment?.currency?.code) }}
              {{ convertNumber(dataComplete?.payment?.deliveryFeeAmount) }}
            </a-col>
          </a-row>
          <a-row class="row-info">
            <a-col :span="16">Payment Method</a-col>
            <a-col :span="8" class="font-475 text-end">
              {{ dataComplete?.payment?.paymentType?.text }}
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
        <a-row class="row-info !hidden">
          <a-col :span="8" class="font-475 text-base">Total BP</a-col>
          <a-col :span="16" class="font-625 text-end text-lg"> </a-col>
        </a-row>
        <a-divider class="bg-black-50 !my-[25px]" />
        <div class="pb-20 text-sm">
          <a-row class="row-info">
            <a-col :span="20">Points earned on this order</a-col>
            <a-col :span="4" class="text-end">
              + {{ convertNumber(dataComplete?.orderPoint?.plusPoint) }} P</a-col
            >
          </a-row>
        </div>

        <div class="mb-10 flex gap-[5px]">
          <r-button
            title="Order History"
            class="!border-navy-deep !rounded-0 !h-10 w-full !shadow-none"
            class-title="text-sm text-navy-deep font-550"
            @click="transitPage(AppRoutes.myPage.orderHistory.path)"
          />
          <r-button
            title="Keep Shopping"
            class="!border-navy-deep !bg-navy-deep !rounded-0 !h-10 w-full !shadow-none"
            class-title="text-sm text-white font-550"
            @click="transitPage(AppRoutes.home.path)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { AppRoutes, AppSubNavTitles } from '@/router/path'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useNotification } from '@/composables/notification'
import { shippingAddressDescription, addPrefixForImage } from '@/utils/common'
import { gtmPurchase } from '@/utils/gtm'
import { convertNumber, formatCurrency, renderCurrency } from '@/utils/currency'
import { ProductVariantEnum } from '@/helpers/enum'
import { formatDateTime } from '@/utils/datetime'
import { textFollowRank } from '@/utils/role'
import { FORMAT_DATETIME } from '@/helpers/constant'

const router = useRouter()
const route = useRoute()

const storeLoading = useGlobalLoadingStore()
const { showGlobalLoading } = storeLoading
const { showNotification } = useNotification()

const dataComplete = reactive({})

const getCompleteData = async () => {
  showGlobalLoading(true)
  try {
    const response = await apiService.orderService.getOrderComplete(route.params.id)
    if (response.success) {
      Object.assign(dataComplete, response.data)
      gtmPurchase({
        productList: dataComplete?.productList,
        salesOrderNumber: dataComplete?.orderInfo?.salesOrderNumber,
        deliveryFeeAmount: dataComplete?.payment?.deliveryFeeAmount,
        totalAmount: dataComplete?.payment?.totalAmount
      })
    } else {
      showNotification({ type: 'error', message: response.message })
    }
  } finally {
    showGlobalLoading(false)
  }
}

onMounted(() => {
  getCompleteData()
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
