<template>
  <div class="coupon-page -mx-5">
    <RTabCustom :tabs="tabs" :model-value="currentTab" @update:model-value="onUpdate" />
    <div v-if="isShowListCoupon()" class="px-5">
      <div
        class="text-gray-10 leading-base style-normal px-2 pb-[25px] pt-[10px] text-[14px] font-normal -tracking-[0.28px] opacity-0"
      ></div>
      <div class="relative">
        <CouponItem
          v-for="coupon in pageState.couponsList"
          :key="coupon.id"
          :coupon-info="coupon"
          :disabled="!!currentTab"
        />
        <p
          v-if="!!currentTab"
          class="absolute left-1/2 top-1/2 -translate-x-1/2 text-base leading-[22px]"
        >
          These coupons cannot be used.
        </p>
      </div>
      <div class="w-full pb-[30px]">
        <RButton
          v-if="hasMore"
          class="border-1 border-gray-6 mx-auto mt-10 w-[335px] max-w-[335px] !bg-white"
          @click="handleLoadMore"
        >
          <template #content>
            <div>
              <PlusIcon />
              <span class="font-550 leading-base pl-[5px] text-[16px]">MORE</span>
            </div>
          </template>
        </RButton>
      </div>
    </div>
    <div v-else class="flex items-center justify-center py-4">No Data</div>
  </div>
</template>
<script setup>
import { ref, watch, reactive, computed, onBeforeUnmount } from 'vue'
import PlusIcon from '@/assets/svgs/my-page/plus.svg'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { CouponStatusEnum, CouponPolicyDiscountEnum, OrderTypeCouponEnum } from '@/helpers/enum'
import { getBetweenDays } from '@/utils/common'
import dayjs from 'dayjs'
import { FORMAT_FULL_YEAR, SAVE_URL_IMAGE } from '@/helpers/constant'
import { formatDateTime } from '@/utils/datetime'
import { useAuthUserStore } from '@/stores/modules/auth-user'

const authUserStore = useAuthUserStore()
const nameOfReferral = ref(authUserStore.currentAuthUser.referralName ?? 'RIMAN')

const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading

const tabs = [
  { value: 0, label: 'Available' },
  { value: 1, label: 'Expired' }
]

const currentTab = ref(0)
const pageState = reactive({
  pageSize: 10,
  pageNumber: 1,
  couponsList: [],
  isLoadMore: false,
  totalPage: 0
})

const hasMore = computed(() => pageState.pageNumber < pageState.totalPage)

const isShowListCoupon = () => {
  return pageState.couponsList.length > 0
}
const onUpdate = (data) => {
  currentTab.value = data
}

const getHaveCoupon = async (currentTab) => {
  const params = {
    pageSize: pageState.pageSize,
    pageNumber: pageState.pageNumber
  }
  showGlobalLoading(true)
  const { data, success } = currentTab
    ? await apiService.myPageService.viewUsedCoupon(params)
    : await apiService.myPageService.viewHaveCoupon(params)
  showGlobalLoading(false)
  const results = mappingCouponList(data?.list)
  pageState.couponsList = success ? [...pageState.couponsList, ...results] : []
  pageState.totalPage = data?.totalPageNumber || 0
}

const mappingCouponList = (list) => {
  const couponsList = list.map((item) => {
    return {
      id: item?.couponId,
      imageUrl: `${SAVE_URL_IMAGE}/${item?.campaign.imageUrl}`,
      couponName: item?.couponName,
      couponStatus: filterCouponStatus(item),
      publishDate: item?.publishDate,
      expiredDate: item?.expiredDate,
      description: caculateDiscount(item)
    }
  })
  return couponsList
}

const descriptionFollowOrderType = (orderType) => {
  switch (orderType) {
    case OrderTypeCouponEnum.ALL:
      return 'Can be applied to Autoship or Standard orders.'
    case OrderTypeCouponEnum.AUTO_SHIP:
      return 'May only be applied to Autoship orders.'
    case OrderTypeCouponEnum.STANDARD_ORDER:
      return 'May not be applied to Autoship orders.'
    default:
      return ''
  }
}

const caculateDiscount = (item) => {
  let description = []
  let discount = ''
  if (item?.discountPolicy?.discountType.code === CouponPolicyDiscountEnum.RATE) {
    discount = `Maximum discount of $${item?.discountPolicy?.discountAmount}`
  } else if (item?.discountPolicy?.discountType.code === CouponPolicyDiscountEnum.PRICE) {
    discount = `Minimum order amount $${item?.limitPolicy?.minUseAmount}`
  }
  description = [
    discount,
    `Reissuance is ${
      item?.duplicatePolicy.isCancelDuplicatePublish ? '' : 'not'
    } possible in case of cancellation`,
    `May ${
      item?.duplicatePolicy.isDuplicateUsePossible ? '' : 'not'
    } be combined with other discounts, reward points, or offers.`,
    descriptionFollowOrderType(item?.orderType?.code)
  ]
  if (item?.discountPolicy?.discountType.code === CouponPolicyDiscountEnum.FREE) {
    description.shift()
  }
  return description
}

const filterCouponStatus = (item) => {
  const currDay = formatDateTime(dayjs(), FORMAT_FULL_YEAR)
  const numberDays = getBetweenDays(currDay, item?.expiredDate) // neu curr-ex <= 0
  const status = item?.couponStatus?.text
  if (!currentTab.value) {
    if (numberDays < 0) {
      return 'D-0'
    } else if (numberDays > 0 && numberDays <= 5) {
      return `D-${numberDays}`
    } else {
      return CouponStatusEnum.PUBLISHED
    }
  } else {
    return status
  }
}

const handleLoadMore = () => {
  pageState.pageNumber++
  getHaveCoupon(currentTab.value)
}

const resetPageState = () =>
  Object.assign(pageState, {
    pageSize: 10,
    pageNumber: 1,
    couponsList: [],
    totalPage: 0
  })

watch(
  () => currentTab.value,
  (value) => {
    resetPageState()
    getHaveCoupon(value)
  },
  { immediate: true }
)

onBeforeUnmount(() => showGlobalLoading(false))
</script>
<style lang="scss" scoped>
@screen lg {
  .coupon-page {
    .tabs {
      justify-content: flex-start;
      :deep(.tab__item) {
        width: 150px;
      }
    }
  }
}
</style>
