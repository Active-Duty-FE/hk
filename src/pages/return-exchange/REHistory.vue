<script setup>
import { RETURN_EXCHANGE_OPTIONS } from '@/helpers/order-history'
import { computed, reactive, watch } from 'vue'
import MoreIcon from '@/assets/icons/MoreIcon.vue'
import RButton from '@/components/common/RButton.vue'
import apiService from '@/http/api'
import { useQuery } from 'vue-query'
import { TimeZoneEnum } from '@/helpers/enum'
import { convertTimezone } from '@/utils/datetime'

const pageState = reactive({
  salesOrderType: RETURN_EXCHANGE_OPTIONS[0].value,
  data: [],
  totalPageNumber: 0
})

const params = reactive({
  searchType: RETURN_EXCHANGE_OPTIONS[0].value,
  startDate: undefined,
  endDate: undefined,
  pageSize: 2,
  pageNumber: 1
})

const productList = computed(() =>
  pageState.data.map((item) => {
    return {
      returnOrderNumber: item?.returnOrderBaseInfo?.returnOrderNumber,
      receptionDatetime: item?.returnOrderBaseInfo?.receptionDatetime,
      salesOrderId: item?.returnOrderBaseInfo?.salesOrderId,
      returnOrderStatus: item?.returnOrderBaseInfo?.returnOrderStatus?.text,
      returnOrderStatusCode: item?.returnOrderBaseInfo?.returnOrderStatus?.code,
      returnOrderStatusCustomer: item?.returnOrderBaseInfo?.returnOrderStatusCustomer,
      productList: item?.returnOrderProductList,
      returnExchangeType: item?.returnOrderBaseInfo?.returnExchangeType?.code
    }
  })
)

const { refetch } = useQuery({
  queryKey: ['return-exchange-history', params],
  queryFn: () =>
    apiService.returnService.getReturnHistories({
      ...params,
      startDate: convertTimezone(`${params.startDate} ${TimeZoneEnum.START_TIME}`),
      endDate: convertTimezone(`${params.endDate} ${TimeZoneEnum.END_TIME}`)
    }),
  onSuccess: (response) => {
    if (response?.success) {
      pageState.data =
        params.pageNumber > 1 ? [...pageState.data, ...response.data.list] : response.data.list
      pageState.totalPageNumber = response.data.totalPageNumber
    }
  },
  enabled: computed(() => !!params?.startDate && !!params?.endDate)
})

const onSearch = (data) => {
  params.startDate = data.startDate
  params.endDate = data.endDate
  params.searchType = pageState.salesOrderType
  params.pageNumber = 1
}

const handleMore = () => {
  params.pageNumber += 1
}
</script>
<template>
  <div class="py-12.5 flex flex-col px-5">
    <r-select
      v-model:value="pageState.salesOrderType"
      :options="RETURN_EXCHANGE_OPTIONS"
      class="!mb-[22px] w-full"
    />
    <SearchDuration @on-search="onSearch" />
    <a-divider class="!bg-gray-10 !mt-7.5 !my-0" />
    <div class="mb-2.5 mt-5 flex flex-col gap-5">
      <REItem
        v-for="(item, index) in productList"
        :key="index"
        :data="item"
        :load-again="refetch"
      />
    </div>
    <div class="flex flex-col gap-10">
      <a-divider class="!bg-gray-10 !mt-7.5 !my-0" />

      <RButton
        v-if="productList.length && params.pageNumber < pageState.totalPageNumber"
        class-title="!text-gray-1 "
        title="MORE"
        height="40px"
        class="disabled:(!bg-navy-4 border-1 !border-navy-4) !mx-auto w-full"
        @click="handleMore"
      >
        <template #icon> <MoreIcon /> </template>
      </RButton>
    </div>
  </div>
</template>
