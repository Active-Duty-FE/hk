<template>
  <RDrawerBottom title="Receipt" :height="'90%'">
    <div class="text-black-50">
      <div id="elementToPrint">
        <a-divider class="bg-black-50" />
        <p class="font-475 text-base">Order Information</p>
        <a-row class="row-info">
          <a-col :span="8">Name</a-col>
          <a-col :span="16" class="col-custom">
            {{ data?.delivery?.receiverFirstName }} {{ data?.delivery?.receiverLastName }}
          </a-col>
        </a-row>
        <a-row class="row-info !hidden">
          <a-col :span="8">Membership Number</a-col>
          <a-col :span="16" class="col-custom"> </a-col>
        </a-row>
        <a-row class="row-info">
          <a-col :span="8">Order Number</a-col>
          <a-col :span="16" class="col-custom">
            {{ data?.orderInfo?.salesOrderNumber }}
          </a-col>
        </a-row>

        <a-row class="row-info">
          <a-col :span="8">Order Date</a-col>
          <a-col :span="16" class="col-custom">
            {{ formatDateTime(data?.orderInfo?.orderDatetime, FORMAT_DATETIME) }}
          </a-col>
        </a-row>
        <a-row class="row-info">
          <a-col :span="8">Product</a-col>
          <a-col :span="16" class="col-custom">
            <div v-for="item in data?.productList" :key="item.productId">
              <div>{{ item?.productName }}</div>
              <div>{{ item?.quantity }} PCS</div>
            </div>
          </a-col>
        </a-row>
        <a-divider class="bg-black-50" />
        <p class="font-475 text-base">Shipping Information</p>
        <a-row class="row-info">
          <a-col :span="8">Shipping Method</a-col>
          <a-col :span="16" class="col-custom"> Customer Order </a-col>
        </a-row>
        <a-row class="row-info">
          <a-col :span="8">Recipient</a-col>
          <a-col :span="16" class="col-custom">
            {{ data?.delivery?.receiverFirstName }} {{ data?.delivery?.receiverLastName }}
          </a-col>
        </a-row>
        <a-row class="row-info">
          <a-col :span="8">Cell Phone</a-col>
          <a-col :span="16" class="col-custom">
            {{ data?.delivery?.receiverPhoneNumber }}
          </a-col>
        </a-row>
        <a-row class="row-info">
          <a-col :span="8">Address</a-col>
          <a-col :span="16" class="col-custom">
            {{ shippingAddressDescription(data?.delivery) }}
          </a-col>
        </a-row>
        <a-divider class="bg-black-50" />
        <p class="font-475 text-base">Payment Information</p>
        <div class="text-sm">
          <a-row class="row-info">
            <a-col :span="8">Subtotal</a-col>
            <a-col :span="16" class="text-end">
              {{ renderCurrency(data?.payment?.currency?.code) }}
              {{ convertNumber(data?.payment?.totalAmountAfterDiscount) }}
            </a-col>
          </a-row>
        </div>
        <div class="text-sm">
          <a-row class="row-info">
            <a-col :span="8">Applied Coupons</a-col>
            <a-col :span="16" class="text-end">
              - {{ renderCurrency(data?.payment?.currency?.code) }}
              {{ data?.payment?.totalCouponDiscountAmount }}
            </a-col>
          </a-row>
          <a-row v-if="data?.payment?.membershipDiscount" class="row-info">
            <a-col :span="8">{{ textFollowRank }} Discount</a-col>
            <a-col :span="16" class="text-end">
              - {{ renderCurrency(data?.payment?.currency?.code) }}
              {{ data?.payment?.membershipDiscount }}</a-col
            >
          </a-row>

          <a-row class="row-info">
            <a-col :span="8">Applied Points</a-col>
            <a-col :span="16" class="text-end">
              - {{ renderCurrency(data?.payment?.currency?.code) }} {{ data?.payment?.totalPoint }}
            </a-col>
          </a-row>

          <a-row class="row-info">
            <a-col :span="8">Sales Tax</a-col>
            <a-col :span="16" class="text-end">
              {{ renderCurrency(data?.payment?.currency?.code) }} {{ data?.payment?.taxAmount }}
            </a-col>
          </a-row>
          <a-row class="row-info">
            <a-col :span="8">Shipping</a-col>
            <a-col :span="16" class="text-end">
              {{ renderCurrency(data?.payment?.currency?.code) }}
              {{ data?.payment?.deliveryFeeAmount }}
            </a-col>
          </a-row>
          <a-row class="row-info !font-475 !text-base">
            <a-col :span="8">Total</a-col>
            <a-col :span="16" class="text-end">
              {{ renderCurrency(data?.payment?.currency?.code) }}
              {{ convertNumber(data?.payment?.totalAmount) }}
            </a-col>
          </a-row>
          <a-row class="row-info">
            <a-col :span="8">Points earned on this order</a-col>
            <a-col :span="16" class="font-475 text-end">
              + {{ data?.orderPoint?.plusPoint }} P
            </a-col>
          </a-row>
        </div>
        <a-divider class="bg-black-50" />
        <p class="font-475 text-base">RIMAN, INC.</p>
        <p class="text-sm">3435 Wilshire Blvd ste. 2080, Los Angeles, CA 90010</p>
        <p class="text-sm">cs@riman.com</p>
        <p class="mb-20 text-sm">+1 (213)988-6050</p>
      </div>

      <div class="fixed bottom-0 right-0 w-full bg-white md:hidden">
        <div class="px-5 pb-5">
          <div class="mt-[30px] flex items-center justify-center gap-2">
            <RButton title="Close" class="!border-navy-6 !text-navy-6 w-full" @click="closeModal" />
            <RButton
              title="Print"
              type="primary"
              class="!bg-navy-6 w-full !text-white"
              @click="handlePrint"
            />
          </div>
        </div>
      </div>
      <div class="hidden w-full bg-white md:block">
        <div class="px-5 pb-5">
          <div class="mt-[30px] flex items-center justify-center gap-2">
            <RButton title="Close" class="!border-navy-6 !text-navy-6 w-full" @click="closeModal" />
            <RButton
              title="Print"
              type="primary"
              class="!bg-navy-6 w-full !text-white"
              @click="handlePrint"
            />
          </div>
        </div>
      </div>
    </div>
  </RDrawerBottom>
</template>
<script setup>
import { shippingAddressDescription } from '@/utils/common'
import { convertNumber, renderCurrency } from '@/utils/currency'
import { formatDateTime } from '@/utils/datetime'
import { FORMAT_DATETIME } from '@/helpers/constant'
import { textFollowRank } from '@/utils/role'

defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  closeModal: {
    type: Function,
    default: () => {}
  }
})

const handlePrint = () => {
  // TODO:  handle print only element
  window.print()
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
