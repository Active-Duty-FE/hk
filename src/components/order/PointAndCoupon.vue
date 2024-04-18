<template>
  <div>
    <template v-if="checkShowApplyPoint">
      <p class="text__heading">Reward Point</p>
      <p class="text__normal">
        My Reward Points
        <span class="point">{{ convertNumber(orderStore?.pointInfo?.activePoint) }} Point</span>
      </p>
      <p class="text__normal">
        Points scheduled to expire in the current month
        <span class="point">
          {{ convertNumber(orderStore?.pointInfo?.nextExpectTerminatePoint) }} Point
        </span>
      </p>
      <p class="text__normal">
        When canceling or returning points after using them, points that have expired will not be
        returned.
      </p>

      <div class="flex items-center gap-5">
        <span>Apply</span>
        <div class="flex w-full items-center">
          <RInputNumber v-model:value="formState.point" class="input-custom !shadow-none">
            <template #addonAfter>
              <a-tooltip title="Extra information">
                <span class="mt-1 inline-block">P</span>
              </a-tooltip>
            </template>
          </RInputNumber>

          <RButton
            title="Use"
            :disabled="
              !(formState.point && !messageValidPoint) || validatePoint(Number(formState.point))
            "
            class-title="text-white"
            class="!bg-navy-6 w-25 disabled:(!bg-navy-4) !rounded-none !border-none"
            height="48px"
            @click="applyPoint"
          />
        </div>
      </div>
      <span class="text-xs text-red-500">{{ messageValidPoint }}</span>

      <div class="mt-2.5 text-right">
        <RCheckbox v-model:checked="formState.applyAllRewardPoint" class="checkbox-custom">
          <span class="text-gray-10 text-sm font-normal leading-none -tracking-[0.28px]">
            Apply All Reward Points
          </span>
        </RCheckbox>
      </div>

      <a-divider class="!border-gray-11" />
    </template>

    <div class="flex justify-between">
      <span class="text__heading">Available Coupons</span>
      <p class="text__normal !text-gray-10">
        <span class="font-625 mr-1 text-sm">{{ orderStore?.listCoupons?.length }} </span>Coupons
      </p>
    </div>
    <RSelect
      v-model:value="formState.coupon"
      :options="availableCouponsParsed"
      mode="multiple"
      class="!h-auto w-full"
      placeholder="Please select a coupon"
      :disabled="!availableCouponsParsed?.length"
      @select="handleChangeCoupon"
    >
      <template #option="option">
        <div class="pointer-events-none flex cursor-not-allowed flex-col gap-2.5">
          <span>{{ option.couponName }}</span>
          <div class="flex items-center gap-2.5">
            <span class="coupon__expirationPeriod">
              Expiration period: {{ option.expiredDate }}
            </span>
            <a-divider type="vertical" class="!border-gray-14 !top-0 !h-2.5 opacity-40" />
            <span class="text-gray-10 font-550 text-xs leading-none">{{
              option.calculateDiscountAmount
            }}</span>
          </div>
        </div>
      </template>
    </RSelect>
    <p class="mt-5 cursor-pointer text-xs underline" @click="chooseMaxCoupon">
      Automatic applications of maximum benefit coupons
    </p>

    <div class="text-gray-10 mt-5 flex justify-between">
      <span class="text-xs font-normal leading-none"> Expected amount of coupon discount </span>

      <span class="text-sm font-normal leading-none">
        {{ renderCurrency(currency) }} {{ checkAmountCoupon }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import { useOrderStore } from '@/stores/modules/order'
import { convertNumber, renderCurrency } from '@/utils/currency'
import { financial } from '@/utils/common'
import { MIN_POINT, VALUE_COUNTRY, CURRENCY } from '@/helpers/constant'
import { POINT_COUPON_MESSAGE } from '@/helpers/validate-message'
import { CouponPolicyDiscountEnum } from '@/helpers/enum'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { storeToRefs } from 'pinia'
import { useNotification } from '@/composables/notification'

const orderStore = useOrderStore()
const userStore = useAuthUserStore()
const { currentAuthUser } = storeToRefs(userStore)
const { showNotification } = useNotification()

const props = defineProps({
  subTotal: {
    type: [Number, String],
    default: 0
  },
  countryProduct: {
    type: String,
    default: VALUE_COUNTRY.US
  },
  currency: {
    type: String,
    default: CURRENCY.USD
  }
})

const availableCouponsParsed = computed(() => {
  return orderStore?.listCoupons?.map((item) => {
    return {
      ...item,
      label: item.couponName,
      value: item.couponId,
      disabled: checkCouponCanChoose(item)
    }
  })
})

const validatePoint = (value) => {
  return (
    value > convertNumber(orderStore?.pointInfo?.activePoint) ||
    value > props.subTotal - checkAmountCoupon.value
  )
}

const checkCouponCanChoose = (data) => {
  return (
    (!data?.calculateDiscountAmount || data.limitPolicy?.minUseAmount > props.subTotal) &&
    data?.discountPolicy?.discountType?.code !== CouponPolicyDiscountEnum.FREE
  )
}

const formState = reactive({
  point: '',
  coupon: [],
  applyAllRewardPoint: false,
  subTotalAfterApply: props.subTotal,
  allowUseAllPoint: true
})

const handleChangeCoupon = (e) => {
  const couponMatch = orderStore?.listCoupons?.find((item) => item?.couponId === e)

  if (
    !formState.subTotalAfterApply &&
    couponMatch?.discountPolicy?.discountType?.code !== CouponPolicyDiscountEnum.FREE
  ) {
    showNotification({
      type: 'error',
      message: POINT_COUPON_MESSAGE.balanceZero
    })
    formState.coupon = formState.coupon.filter((item) => item !== e)
    return
  }
  const isOnlyCoupon = orderStore?.listCoupons?.find(
    (item) => item?.couponId === formState.coupon[0]
  )?.duplicatePolicy?.isDuplicateUsePossible
  if (!couponMatch?.duplicatePolicy?.isDuplicateUsePossible || !isOnlyCoupon) {
    formState.coupon = [e]
  }
}

const checkAmountCoupon = computed(() => {
  const dataMatch = orderStore?.listCoupons?.filter((item) =>
    formState.coupon.includes(item?.couponId)
  )
  const totalAfterApplyPoint = props.subTotal - orderStore.totalPoint

  const total = dataMatch.reduce((total, current) => total + current?.calculateDiscountAmount, 0)
  const finalTotal = +total > +totalAfterApplyPoint ? +totalAfterApplyPoint : +total
  orderStore.changeAmountDiscountFromCoupon(finalTotal)
  const listCouponsChoose = formState.coupon?.map((item) => {
    const dataCoupon = orderStore?.listCoupons?.find((e) => e.couponId === item)

    return {
      couponId: item,
      couponDiscountAmount: dataCoupon?.calculateDiscountAmount,
      discountType: dataCoupon?.discountPolicy?.discountType?.code,
      freeSupportType: dataCoupon?.discountPolicy?.freeSupportType
    }
  })

  orderStore?.changeListCouponsChoose(listCouponsChoose)
  return finalTotal
})

watch(
  () => [checkAmountCoupon.value, orderStore.totalPoint],
  ([coupon, point]) => {
    const newTotal = +financial(+props.subTotal - +coupon - +point)

    formState.subTotalAfterApply = newTotal
  }
)

const chooseMaxCoupon = () => {
  if (!formState.subTotalAfterApply) {
    showNotification({
      type: 'error',
      message: POINT_COUPON_MESSAGE.balanceZero
    })
    return
  }
  const arrMaxCoupon = orderStore?.listCoupons?.filter((item) => item?.isMaxBenefit) || []
  formState.coupon = arrMaxCoupon?.map((item) => item.couponId)
}

const messageValidPoint = computed(() => {
  const point = formState.point

  if (point < MIN_POINT && typeof point === 'number') {
    return POINT_COUPON_MESSAGE.minPoint
  }
  if (point > orderStore?.pointInfo?.activePoint) {
    return POINT_COUPON_MESSAGE.maxPoint
  }

  return ''
})

watch(
  () => [formState.applyAllRewardPoint, formState.allowUseAllPoint],
  ([value]) => {
    const totalAfterApplyCoupon = +props.subTotal - +checkAmountCoupon.value

    if (value) {
      formState.allowUseAllPoint = true
      let pointApply = ''
      if (!formState.subTotalAfterApply) {
        showNotification({
          type: 'error',
          message: POINT_COUPON_MESSAGE.balanceZero
        })
        formState.applyAllRewardPoint = false
      } else {
        pointApply =
          orderStore?.pointInfo?.activePoint < +totalAfterApplyCoupon
            ? orderStore?.pointInfo?.activePoint
            : +totalAfterApplyCoupon

        showNotification({
          type: 'success',
          message: POINT_COUPON_MESSAGE.applyPoint
        })
      }
      formState.point = pointApply

      orderStore?.changeTotalPoint(pointApply)
    } else {
      if (formState.allowUseAllPoint) {
        formState.point = ''
        orderStore?.changeTotalPoint(0)
      }
    }
  }
)

const applyPoint = () => {
  const totalAfterApplyCoupon = +props.subTotal - +checkAmountCoupon.value
  if (!totalAfterApplyCoupon) {
    showNotification({
      type: 'error',
      message: POINT_COUPON_MESSAGE.balanceZero
    })
    return
  }
  if (formState.point > totalAfterApplyCoupon) {
    showNotification({
      type: 'error',
      message: POINT_COUPON_MESSAGE.maxPointWithSubTotal
    })
    return
  }
  if (formState.applyAllRewardPoint && +formState.point !== +totalAfterApplyCoupon) {
    formState.allowUseAllPoint = false
    formState.applyAllRewardPoint = false
  }
  showNotification({
    type: 'success',
    message: POINT_COUPON_MESSAGE.applyPoint
  })

  orderStore?.changeTotalPoint(formState.point)
}

const checkShowApplyPoint = computed(() => {
  return props.countryProduct === currentAuthUser.value?.nationalCode
})
</script>

<style lang="scss" scoped>
:deep(.ant-input-number) {
  @apply max-h-12 border-[#E0E0E0] border-r-transparent;

  &:hover {
    @apply border-[#E0E0E0] border-r-transparent;
  }
}

.input-custom {
  @apply w-full;

  :deep(.ant-input-number-input) {
    @apply text-gray-10 pr-1 text-right;
  }

  :deep(.ant-input-number-group-addon) {
    @apply bg-transparent pl-0 pr-5;
  }
}

.point {
  @apply text-gray-10;
}

.text {
  &__heading {
    @apply text-gray-10 font-475 text-sm leading-none;
  }

  &__normal {
    @apply text-gray-14 text-xs font-normal leading-none;
  }
}

.coupon__expirationPeriod {
  @apply text-gray-14 text-xs leading-none;
}

.checkbox-custom {
  :deep(.ant-checkbox-inner),
  &:after {
    @apply rounded-full;
  }
}

:deep(.ant-select-selector) {
  height: auto !important;
  min-height: 40px;
}
</style>
