<template>
  <div class="mb-10">
    <SearchDuration :show-month="false" @on-search="onSearch" />

    <div v-if="!formState.totalSize" class="h-50vh flex items-center justify-center">
      There are no reviews written.
    </div>
    <div v-else class="mt-5 flex flex-col">
      <ReviewItem
        v-for="data in formState.reviewList"
        :key="data.id"
        :review="data"
        @delete="onSearch"
      />
      <RButton
        v-if="isShowMoreReview"
        title="More"
        class="!border-gray-10 mx-auto mt-10 w-full md:w-[390px]"
        class-title="text-gray-10 text-base md:text-lg font-550"
        @click="getMoreReview"
      >
        <template #content>
          <img src="@/assets/svgs/add.svg?url" alt="" class="mb-1" />
        </template>
      </RButton>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { convertTimezone } from '@/utils/datetime'
import { TimeZoneEnum } from '@/helpers/enum'

const { showGlobalLoading } = useGlobalLoadingStore()

const formState = reactive({
  pageNumber: 1,
  pageSize: 10,
  reviewList: [],
  totalSize: 0,
  filterForm: {}
})

const isShowMoreReview = computed(
  () => formState.pageNumber * formState.pageSize < formState.totalSize
)

const getParams = computed(() => ({
  fromDate: convertTimezone(`${formState.filterForm?.fromDate} ${TimeZoneEnum.START_TIME}`),
  toDate: convertTimezone(`${formState.filterForm?.toDate} ${TimeZoneEnum.END_TIME}`),
  pageSize: formState.pageSize,
  pageNumber: formState.pageNumber
}))

const onSearch = async ({ startDate, endDate }) => {
  formState.pageNumber = 1
  formState.filterForm = { fromDate: startDate, toDate: endDate }
  showGlobalLoading(true)
  const { data } = await apiService.myPageService.getReviewList(getParams.value)
  showGlobalLoading(false)
  formState.reviewList = data?.list || []
  formState.totalSize = ~~data?.totalSize
}

const getMoreReview = async () => {
  formState.pageNumber++
  showGlobalLoading(true)
  const { data } = await apiService.myPageService.getReviewList(getParams.value)
  showGlobalLoading(false)
  console.log(data?.list)
  formState.reviewList.push(...(data?.list || []))
  formState.totalSize = ~~data?.totalSize
}
</script>
