<template>
  <a-divider class="bg-gray-11 !mb-[25px] !mt-0" />
  <div class="mb-5 flex justify-between text-sm">
    <span>Subtotal</span>
    <span class="font-475">
      {{ renderCurrency(currency) }} {{ convertNumber(data?.totalAmountAfterDiscount) }}
    </span>
  </div>
  <div class="mb-5 flex justify-between text-sm">
    <span>Applied Coupons</span>
    <span class="font-475">
      - {{ renderCurrency(currency) }} {{ data?.totalCouponDiscountAmount }}
    </span>
  </div>
  <div v-if="autoShipDiscount" class="mb-5 flex justify-between text-sm">
    <span>Autoship Discount</span>
    <span class="font-475">
      - {{ renderCurrency(currency) }} {{ convertNumber(autoShipDiscount) }}
    </span>
  </div>
  <div v-if="memberShipDiscount" class="mb-5 flex justify-between text-sm">
    <span>{{ textFollowRank }} Discount</span>
    <span class="font-475">
      -{{ renderCurrency(currency) }} {{ convertNumber(memberShipDiscount) }}
    </span>
  </div>
  <div class="mb-5 flex justify-between text-sm">
    <span>Applied Points</span>
    <span class="font-475">- {{ data?.totalPoint }} P</span>
  </div>

  <div class="mb-5 flex justify-between text-sm">
    <span>Sales Tax</span>
    <span class="font-475">{{ renderCurrency(currency) }} {{ data?.taxAmount }}</span>
  </div>
  <div class="mb-5 flex justify-between text-sm">
    <span>Shipping</span>
    <span class="font-475">
      {{ renderCurrency(currency) }} {{ convertNumber(data?.deliveryFeeAmount) }}
    </span>
  </div>
  <div class="flex justify-between text-sm">
    <span>Payment Method</span>
    <span class="font-475">{{ data?.paymentType?.text }}</span>
  </div>
  <a-divider class="bg-black-50 !mb-[25px] !mt-10" />
  <div v-if="isMember" class="mb-5 flex justify-between">
    <span class="font-475 text-base">Total</span>
    <span class="font-625 text-lg">
      {{ renderCurrency(currency) }} {{ convertNumber(data?.totalAmount) }}
    </span>
  </div>
  <div v-else>
    <span class="font-475 mb-[25px] text-base">Total</span>
    <p class="text-lg">
      <span class="font-625">
        {{ renderCurrency(currency) }} {{ convertNumber(data?.totalAmount) }}
      </span>
    </p>
  </div>
</template>
<script setup>
import { convertNumber, renderCurrency } from '@/utils/currency'
import { CURRENCY } from '@/helpers/constant'
import { textFollowRank } from '@/utils/role'

defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  isMember: {
    type: Boolean,
    default: true
  },
  currency: {
    type: String,
    default: CURRENCY.USD
  },
  autoShipDiscount: {
    type: [Number, String],
    default: 0
  },
  memberShipDiscount: {
    type: [Number, String],
    default: 0
  }
})
</script>
