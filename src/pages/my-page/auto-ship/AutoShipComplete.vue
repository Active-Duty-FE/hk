<template>
  <div class="bg-gray-6 text-black-50 flex items-center justify-center sm:py-10">
    <div class="w-full bg-white sm:max-w-[550px]">
      <div class="hidden flex-col text-center md:flex">
        <span class="py-6 text-base font-medium capitalize">
          {{ AppTitle.autoShip.autoShipComplete }}
        </span>
        <a-divider class="bg-black-50 !my-0" />
      </div>

      <p class="mt-10 text-center text-sm">
        Your Autoship Subsciption order<br />
        has been successfully completed.
      </p>

      <div class="px-5">
        <a-divider class="bg-black-50 !mb-[30px] !mt-10" />
        <p class="font-475 mb-[30px] text-base">Autoship Subscription Information</p>
        <div class="text-sm">
          <a-row class="row-info">
            <a-col :span="8">Autoship Round</a-col>
            <a-col :span="16" class="col-custom"> {{ dataComplete?.turningTrain }}R </a-col>
          </a-row>
          <a-row class="row-info">
            <a-col :span="8">Billing Date (Monthly)</a-col>
            <a-col :span="16" class="col-custom">
              Monthly {{ dayjs(dataComplete?.paymentScheduleDate).format(FORMAT_SHORT_DAY) }}
            </a-col>
          </a-row>
        </div>
        <a-divider class="bg-gray-11 !mb-[30px] !mt-10" />

        <p class="font-475 mb-[30px] text-base">Shipping Information</p>
        <div class="text-sm">
          <a-row class="row-info">
            <a-col :span="8">Order Number</a-col>
            <a-col :span="16" class="col-custom">
              {{ dataComplete?.orderNumber }}
            </a-col>
          </a-row>
          <a-row class="row-info">
            <a-col :span="8">Order Date</a-col>
            <a-col :span="16" class="col-custom">
              {{ dataComplete?.orderDateTime }}
            </a-col>
          </a-row>
          <a-row class="row-info">
            <a-col :span="8">Name</a-col>
            <a-col :span="16" class="col-custom">
              {{ dataComplete?.shippingInfo?.address?.firstName }}
              {{ dataComplete?.shippingInfo?.address?.lastName }}
            </a-col>
          </a-row>
          <a-row class="row-info">
            <a-col :span="8">Address</a-col>
            <a-col :span="16" class="col-custom whitespace-pre-wrap">
              {{
                dataComplete?.shippingInfo &&
                  shippingAddressDescription(dataComplete?.shippingInfo?.address)
              }}
            </a-col>
          </a-row>
          <a-row class="row-info">
            <a-col :span="8">Cell Phone</a-col>
            <a-col :span="16" class="col-custom">
              {{ dataComplete?.shippingInfo?.address?.addresseeMobileNo }}
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
              {{ dataComplete?.shippingInfo?.address?.deliveryMessage }}
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
                <p class="font-550 mb-2">{{ item?.englishName }}</p>
                <p>
                  <span v-if="item?.optionName" class="text-[14px] opacity-75">
                    Option: {{ item?.optionName }}
                  </span>
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
              {{ currencyForOrder }}
              {{ convertNumber(dataComplete?.paymentInfo?.subTotal) }}
            </a-col>
          </a-row>
        </div>
        <a-divider class="bg-gray-11 !my-[25px]" />
        <div class="text-sm">
          <a-row class="row-info">
            <a-col :span="8">Applied Coupons</a-col>
            <a-col :span="16" class="text-end">
              -
              {{ currencyForOrder }}
              {{ dataComplete?.paymentInfo?.applyCoupon || 0 }}
            </a-col>
          </a-row>

          <a-row v-if="!isBeautyPlanner" class="row-info">
            <a-col :span="8">Autoship Discount</a-col>
            <a-col :span="16" class="text-end">
              - {{ currencyForOrder }} {{ dataComplete?.autoShipDiscount || 0 }}
            </a-col>
          </a-row>
          <a-row class="row-info !hidden">
            <a-col :span="8">{{ textFollowRank }} Discount</a-col>
            <a-col :span="16" class="text-end">
              - {{ currencyForOrder }} {{ dataComplete?.autoShipDiscount || 0 }}
            </a-col>
          </a-row>

          <a-row class="row-info">
            <a-col :span="8">Applied Points</a-col>
            <a-col :span="16" class="text-end">
              - {{ dataComplete?.paymentInfo?.applyPoint || 0 }} P
            </a-col>
          </a-row>

          <a-row class="row-info">
            <a-col :span="8">Sales Tax</a-col>
            <a-col :span="16" class="text-end">
              {{ currencyForOrder }} {{ formatCurrency(dataComplete?.paymentInfo?.saleTax) }}
            </a-col>
          </a-row>
          <a-row class="row-info">
            <a-col :span="8">Shipping</a-col>
            <a-col :span="16" class="text-end">
              {{ currencyForOrder }} {{ convertNumber(dataComplete?.paymentInfo?.shippingFee) }}
            </a-col>
          </a-row>
        </div>
        <a-divider class="bg-black-50 !my-[25px]" />
        <a-row class="row-info">
          <a-col :span="8" class="font-475 text-base">Total</a-col>
          <a-col :span="16" class="font-625 text-end text-lg">
            {{ currencyForOrder }} {{ convertNumber(dataComplete?.totalSaleAmount) }}
          </a-col>
        </a-row>
        <a-row class="row-info">
          <a-col :span="8" class="font-475 text-base">Total BP</a-col>
          <a-col :span="16" class="font-625 text-end text-lg">
            {{ convertNumber(dataComplete?.totalBp) }} {{ getPointText }}
          </a-col>
        </a-row>
        <a-divider class="bg-black-50 !my-[25px]" />
        <div class="mb-20 text-sm">
          <a-row class="row-info">
            <a-col :span="16">Payment Method</a-col>
            <a-col :span="8" class="font-475 text-end">
              {{ dataComplete?.paymentMethod }}
            </a-col>
          </a-row>

          <a-row class="row-info">
            <a-col :span="20">Autoship Points earned on this order</a-col>
            <a-col :span="4" class="text-end">
              +{{ dataComplete?.paymentInfo?.pointEarn || 0 }} P</a-col
            >
          </a-row>
        </div>
        <div class="mb-10 flex flex-col gap-2">
          <r-button
            title="Autoship Subscription Management"
            class="!border-navy-deep !rounded-0 !h-10 w-full !shadow-none"
            class-title="text-sm text-navy-deep font-550"
            @click="
              redirectPage({
                name: AppRoutes.myPage.autoshipManagement.name,
                params: { id: dataComplete?.turningTrain }
              })
            "
          />

          <r-button
            title="Keep Shopping"
            class="!border-navy-deep !bg-navy-deep !rounded-0 !h-10 w-full !shadow-none"
            class-title="text-sm text-white font-550"
            @click="redirectPage(AppRoutes.home.path)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { AppRoutes, AppTitle } from '@/router/path'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useNotification } from '@/composables/notification'
import { shippingAddressDescription, addPrefixForImage } from '@/utils/common'
import { convertNumber, formatCurrency, renderCurrency } from '@/utils/currency'
import { ProductVariantEnum } from '@/helpers/enum'
import { FORMAT_SHORT_DAY, CURRENCY } from '@/helpers/constant'
import { isBeautyPlanner, textFollowRank } from '@/utils/role'
import dayjs from 'dayjs'
import { getPointText } from '@/utils/product'

const router = useRouter()

const storeLoading = useGlobalLoadingStore()
const { showGlobalLoading } = storeLoading

const { showNotification } = useNotification()

const dataComplete = reactive({})

const currencyForOrder = computed(() => {
  return renderCurrency(
    dataComplete?.productList?.length ? dataComplete?.productList[0]?.currency?.code : CURRENCY.USD
  )
})

const getAutoShipComplete = async () => {
  showGlobalLoading(true)
  try {
    const response = await apiService.orderService.detailOrderAutoShip()
    if (response.success) {
      Object.assign(dataComplete, response.data)
    } else {
      showNotification({ type: 'error', message: response.message })
    }
  } finally {
    showGlobalLoading(false)
  }
}

const redirectPage = (url) => {
  router.push(url)
}

onMounted(() => {
  getAutoShipComplete()
})
</script>
<style lang="scss" scoped>
.row-info {
  @apply mb-5;
  .col-custom {
    @apply text-end text-xs;
  }
}
</style>
