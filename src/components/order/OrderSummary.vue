<template>
  <div>
    <OrderSummaryItem v-for="(item, index) in carts" :key="index" :item="item" />
    <div class="subtotal" @click="isShowDetail = !isShowDetail">
      <div class="flex items-center gap-2.5 py-6">
        <span class="leading-none">Payment Information</span>
      </div>
      <ChevronTop class="mb-1" />
    </div>

    <div v-if="isShowDetail" class="collapse">
      <div class="subtotal__row">
        <span class="subtotal__row-left">Subtotal</span>
        <span class="subtotal__row-right">
          {{ renderCurrency(currency) }} {{ convertNumber(calculateTotal()) }}</span
        >
      </div>

      <template v-if="isMember">
        <div class="subtotal__row">
          <span class="subtotal__row-left">Applied Coupons</span>
          <span class="subtotal__row-right">
            - {{ renderCurrency(currency) }} {{ orderStore?.amountDiscountFromCoupon }}
          </span>
        </div>
        <div class="subtotal__row">
          <span class="subtotal__row-left">Applied Points</span>
          <span class="subtotal__row-right"> - {{ orderStore?.totalPoint || 0 }} P </span>
        </div>
        <div v-if="isAutoShip && !isBeautyPlanner" class="subtotal__row">
          <span class="subtotal__row-left">Autoship Discount</span>
          <span class="subtotal__row-right">
            - {{ renderCurrency(currency) }} {{ autoShipDiscount || 0 }}
          </span>
        </div>
        <div v-if="membershipRankDiscount" class="subtotal__row">
          <span class="subtotal__row-left">{{ textFollowRank }} Discount</span>
          <span class="subtotal__row-right">
            - {{ renderCurrency(currency) }} {{ membershipRankDiscount }}
          </span>
        </div>
        <div class="subtotal__row">
          <span class="subtotal__row-left">Sales Tax</span>
          <span v-if="isMember" class="subtotal__row-right">
            {{ renderCurrency(currency) }} {{ formatCurrency(orderStore.saleTaxOrder) }}
          </span>
          <span v-else class="subtotal__row-right">
            {{ renderCurrency(currency) }} {{ formatCurrency(taxOrder) }}
          </span>
        </div>
        <div class="subtotal__row">
          <span class="subtotal__row-left">Shipping</span>
          <span class="subtotal__row-right">
            {{ renderCurrency(currency) }} {{ formatCurrency(shippingFee) }}
          </span>
        </div>
        <a-divider class="!bg-gray-10 !my-1" />
        <div v-if="isAutoShip" class="subtotal__row">
          <span class="subtotal__row-left">Payment Method</span>
          <span class="subtotal__row-right font-bold">Credit Card</span>
        </div>
        <div v-if="isAutoShip" class="subtotal__row">
          <span class="subtotal__row-left">Autoship Points earned on this order</span>
          <span class="subtotal__row-right">+{{ pointEarn }} P</span>
        </div>
        <div v-else class="subtotal__row">
          <span class="subtotal__row-left">Points earned on this order</span>
          <span class="subtotal__row-right">+{{ pointEarn }} P</span>
        </div>
        <a-divider class="!bg-gray-10 !my-1" />
        <div class="subtotal__row">
          <span class="subtotal__row-left subtotal__row-title">Total</span>
          <span class="subtotal__row-right subtotal__row-value">
            {{ renderCurrency(currency) }} {{ total }}
          </span>
        </div>
        <div class="subtotal__row">
          <span class="subtotal__row-left subtotal__row-title">Total BP</span>
          <span class="subtotal__row-right subtotal__row-value"> {{ totalBp }} BP </span>
        </div>
      </template>
      <template v-else>
        <div class="subtotal__row">
          <span class="subtotal__row-left">Sales Tax</span>
          <span v-if="isMember" class="subtotal__row-right">
            {{ renderCurrency(currency) }} {{ formatCurrency(orderStore.saleTaxOrder) }}
          </span>
          <span v-else class="subtotal__row-right">
            {{ renderCurrency(currency) }} {{ formatCurrency(taxOrder) }}
          </span>
        </div>
        <div class="subtotal__row">
          <span class="subtotal__row-left">Shipping</span>
          <span class="subtotal__row-right">
            {{ renderCurrency(currency) }} {{ formatCurrency(shippingFee) }}
          </span>
        </div>
        <a-divider class="bg-black-50" />
        <div class="subtotal__row font-475">
          <span class="subtotal__row-left">Total</span>
          <span class="subtotal__row-right">
            {{ renderCurrency(currency) }}
            {{ convertNumber(calculateTotal() + shippingFee + taxOrder) }}
          </span>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ChevronTop from '@/assets/svgs/chevron-top.svg'
import { convertNumber, formatCurrency, renderCurrency } from '@/utils/currency'
import { useOrderStore } from '@/stores/modules/order'
import { isBeautyPlanner, textFollowRank } from '@/utils/role'
import { CURRENCY } from '@/helpers/constant'

const props = defineProps({
  carts: {
    type: Array,
    default: () => []
  },
  isMember: {
    type: Boolean,
    default: true
  },
  shippingFee: {
    type: [String, Number],
    default: 0
  },
  taxOrder: {
    type: [String, Number],
    default: 0
  },
  isAutoShip: {
    type: Boolean,
    default: false
  },
  pointEarn: {
    type: [Number, String],
    default: 0
  },
  totalFinalAmount: {
    type: [Number, String],
    default: 0
  },
  total: {
    type: [Number, String],
    default: 0
  },
  totalBp: {
    type: Number,
    default: 0
  },
  autoShipDiscount: {
    type: Number,
    default: 0
  },
  membershipRankDiscount: {
    type: [Number, String],
    default: ''
  },
  currency: {
    type: String,
    default: CURRENCY.USD
  }
})

const orderStore = useOrderStore()

const isShowDetail = ref(true)

const calculateTotal = () => {
  const total = props.carts.reduce(
    (total, current) =>
      total +
      (current.productBaseDto?.quantity || current.quantity) *
        (current?.purchaseAmount || current.salesAmountDiscountAfterRank),
    0
  )

  return total
}
</script>

<style lang="scss" scoped>
.subtotal {
  @apply border-b-1 border-b-solid border-gray-11 flex cursor-pointer items-center justify-between;

  &__row {
    @apply flex justify-between text-sm font-normal leading-none;

    &-left {
      @apply -tracking-[0.28px];
    }

    &-title {
      @apply text-base text-[#212121];
    }

    &-value {
      @apply font-625 text-lg text-[#212121];
    }
  }
}

.collapse {
  @apply max-h-7xl mt-5 flex flex-col gap-5;
}
</style>
