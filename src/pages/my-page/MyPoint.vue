<template>
  <div>
    <div class="flex items-center justify-between">
      <span class="text-gray-10 font-550 text-[18px] leading-[18px]">Point Summary</span>
      <span class="text-link" @click="redirectToExternalUr">Travel Point</span>
    </div>
    <a-divider class="!bg-gray-10 !my-[23px]" />
    <div class="grid grid-cols-2">
      <div v-for="item in pageState.items" :key="item.key" class="intro__item">
        <span>{{ item.label }}</span>
        <p class="mb-0 text-lg font-bold leading-[18px]">
          {{ convertNumber(item.value) }}
          <span class="leading-base font-475 text-xs">{{ item.extra }}</span>
        </p>
      </div>
    </div>
    <a-divider class="!bg-gray-10 !my-[23px]" />
    <div class="pt-1">
      <div class="flex justify-between pb-[18px]">
        <span class="leading-base text-[14px] font-normal -tracking-[0.28px]"
        >Expiring Points in 30 days:</span
        >
        <span class="font-475 text-[14px] leading-normal"
        ><span class="pl-[2px]">{{
           convertNumber(pageState?.summaryPoint?.nextExpectTerminatePoint)
         }}</span>
          <span>P</span></span
        >
      </div>
      <div class="flex justify-between">
        <span class="leading-base text-[14px] font-normal -tracking-[0.28px]"
        >Expiring Points in 7 days:</span
        >
        <span class="font-475 text-[14px] leading-normal"
        ><span class="pl-[2px]">{{
           convertNumber(pageState?.summaryPoint?.expectTerminatePoint)
         }}</span>
          <span>P</span></span
        >
      </div>
    </div>
    <a-divider class="!bg-gray-10 !my-[25px]" />
    <div class="style-normal leading-base max-w-[335px] text-[12px] font-normal md:max-w-full">
      RIMAN Points will be valid for 180 days from the order date.
    </div>
    <div class="pb-[25px] pt-[50px]">
      <span class="text-gray-10 font-550 text-[18px] leading-[18px]">Point Activity</span>
    </div>
    <div>
      <SearchDuration @on-search="onApplySearch" />
    </div>
    <div v-if="pageState.points?.length" class="py-10">
      <div v-for="(item, index) in pageState.points" :key="index">
        <PointItem :point-history="item" />
        <a-divider v-if="index + 1 < pageState.points.length" class="!bg-gray-10 !my-[25px]" />
      </div>
    </div>
    <div
      v-else
      class="py-[100px] text-center text-[14px] font-normal leading-normal -tracking-[0.28px]"
    >
      There are no points during the period.
    </div>
    <div v-if="hasMore" class="w-full pb-[30px]">
      <RButton
        class="border-1 border-gray-6 mx-auto w-[335px] max-w-[335px] !bg-white"
        @click="loadMore"
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
</template>
<script setup>
import { convertNumber } from '@/utils/currency'
import PlusIcon from '@/assets/svgs/my-page/plus.svg'
import { computed, onMounted, reactive } from 'vue'
import apiService from '@/http/api'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { storeToRefs } from 'pinia'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { TimeZoneEnum } from '@/helpers/enum'
import { convertTimezone } from '@/utils/datetime'

const { currentAuthUser } = storeToRefs(useAuthUserStore())
const { showGlobalLoading } = useGlobalLoadingStore()

const redirectToExternalUr = () => {
  window.location.href = 'https://legacy.riman.com/myoffice/order/mileage/list.do'
}

const pageState = reactive({
  points: [],
  summaryPoint: undefined,
  items: [
    {
      label: 'Pending Points',
      key: 'point',
      extra: 'P',
      value: 0
    },
    {
      label: 'Available Points',
      key: 'coupon',
      extra: 'P',
      value: 0
    }
  ],
  pageNumber: 1,
  pageSize: 10,
  totalPage: 0,
  dateRange: undefined
})

const hasMore = computed(() => pageState.pageNumber < pageState.totalPage)

const loadMore = () => {
  pageState.pageNumber += 1
  getHistoryPoint(pageState.dateRange, true)
}

const onApplySearch = (data) => {
  pageState.pageNumber = 1
  pageState.dateRange = data
  getHistoryPoint(data, false)
}

const getMyPoint = async () => {
  const { data, success } = await apiService.myPageService.getMySummaryPoint(
    currentAuthUser?.value?.userSeqNo
  )
  if (success) {
    pageState.summaryPoint = data
    pageState.items[0].value = pageState.summaryPoint?.readyPoint
    pageState.items[1].value = pageState.summaryPoint?.activePoint
  }
}

const getHistoryPoint = async (dateRange, isMore = false) => {
  showGlobalLoading(true)
  const params = {
    pageNumber: pageState.pageNumber,
    pageSize: pageState.pageSize,
    searchStartDate: convertTimezone(`${dateRange?.startDate} ${TimeZoneEnum.START_TIME}`),
    searchEndDate: convertTimezone(`${dateRange?.endDate}  ${TimeZoneEnum.END_TIME}`),
    userId: currentAuthUser?.value?.userSeqNo
  }
  const { data, success } = await apiService.myPageService.getHistoryPoint(params)
  if (success) {
    const lists = data?.list || []
    pageState.points = isMore ? [...pageState.points, ...lists] : lists
    pageState.totalPage = data?.totalPageNumber
  }
  showGlobalLoading(false)
}

onMounted(() => {
  getMyPoint()
  pageState.pageNumber = 1
})
</script>
<style lang="scss" scoped>
.intro {
  &__link {
    @apply leading-base w-fit cursor-pointer text-sm font-normal underline;
  }

  &__item {
    @apply relative flex flex-col items-center justify-center gap-2.5;

    &:not(:last-child)::after {
      @apply h-7.5 bg-gray-14 absolute right-0 top-1/2 w-[1px] -translate-y-1/2 content-[''];
    }
  }
}

.text-link {
  @apply leading-base w-fit cursor-pointer text-sm font-light -tracking-[0.28px] underline;
}
</style>
