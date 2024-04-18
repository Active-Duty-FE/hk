<template>
  <div class="text-black-50 -mx-5">
    <div class="px-5">
      <div class="mb-4 flex flex-col gap-1">
        <span
          class="text-link"
          @click="redirectToExternalUr('https://legacy.riman.com/myoffice/order/hist/list.do')"
        >Order</span
        >
        <span
          class="text-link"
          @click="
            redirectToExternalUr('https://legacy.riman.com/myoffice/order/hist/list.do?returntf=5')
          "
        >Cancellation and refund</span
        >
      </div>

      <r-select
        v-model:value="pageState.salesOrderType"
        :options="IS_VALID_OPTIONS"
        class="!mb-[22px] w-full"
      />
      <SearchDuration @on-search="onApplySearch" />
      <a-divider class="bg-black-50" />
      <div v-for="item in listOrderHistory" :key="item.saleOrderId" class="mb-10">
        <div class="mb-[25px] flex justify-between">
          <div
            v-if="item.saleOrderProductId === handleMergeOrderButton(item)?.firstItem"
            class="flex items-center gap-1 text-xs"
          >
            <span>{{ item.orderNumber }}</span>

            <div class="bg-gray-13 h-2 w-[1px]" />
            <span>{{ formatDateTime(item.purchaseDateTime, FORMAT_FULL_YEAR) }}</span>
          </div>
          <div class="cursor-pointer text-xs underline" @click="viewDetailOrder(item?.saleOrderId)">
            View Details
          </div>
        </div>
        <div class="mb-[10px] flex justify-between">
          <p class="text-navy-6 text-xs">
            {{ handleStatusOrder(item)?.textStatus }}
          </p>
          <div
            v-if="AUTO_SHIP_TYPE_ORDER.includes(item?.salesOrderType?.code)"
            class="font-475 text-navy-6 text-xs"
          >
            Autoship Count : {{ getRoundFollowOrder(item?.orderNumber) }}
          </div>
        </div>
        <div class="mb-[15px] flex items-center justify-between gap-5">
          <img :src="addPrefixForImage(item?.thumbnailUrl)" alt="product" class="h-25 w-25" />

          <div>
            <p class="font-550 text-sm">{{ item.productName }}</p>
            <template v-if="item?.optionValues">
              <div v-for="option in item.optionValues" :key="option.optionValue" class="mb-2">
                <div class="flex items-center gap-2">
                  {{ option.optionName }} :

                  <div v-if="option.type?.code === ProductVariantEnum.IMAGE">
                    <img
                      :src="addPrefixForImage(option.optionValue)"
                      class="w-10"
                      alt="image_option"
                    />
                  </div>
                  <div v-else>
                    {{ option.optionValue }}
                  </div>
                </div>
              </div>
            </template>
            <div class="flex justify-between gap-10">
              <span>Subtotal</span>
              <span>
                {{ renderCurrency(item?.currency?.code) }}
                {{ convertNumber(item.unitPriceAfterDiscountRank * item.purchaseQuantity) }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="checkDisplayBtn(item)">
          <ButtonStatusOrder :data-item="item" />
        </div>
        <template v-else>
          <a-divider />
        </template>
      </div>

      <div v-if="listOrderHistory.length === 0" class="mt-20 text-center text-sm">
        You have no order history.
      </div>
    </div>

    <div v-if="showLoadMore" class="mb-10 flex items-center justify-center">
      <r-button
        title="MORE"
        class="!rounded-0 w-full max-w-[390px]"
        class-title="text-lg pt-1"
        @click="loadMore"
      >
        <template #image>
          <AddIcon />
        </template>
      </r-button>
    </div>
  </div>
  <RModalAlert
    v-model:visible="pageState.showModalAlert"
    title="Alarm"
    text-btn="Confirm"
    :description="pageState.descriptionAlert"
    :width="280"
    @confirm="orderHistoryStore.handleStatusModalAlert(false, '')"
    @self-close="orderHistoryStore.handleStatusModalAlert(false, '')"
  />
</template>
<script setup>
import { FORMAT_FULL_YEAR, INVALID_DATE, AUTO_SHIP_TYPE_ORDER } from '@/helpers/constant'

import { useOrderHistory } from '@/stores/modules/order-history'
import { convertTimezone, formatDateTime } from '@/utils/datetime'
import { addPrefixForImage } from '@/utils/common'
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { IS_VALID_OPTIONS, checkStatusOrder, ACTIONS_BUTTON_ORDER } from '@/helpers/order-history'
import AddIcon from '@/assets/svgs/add.svg'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { ProductVariantEnum, OrderTypeEnum, TimeZoneEnum } from '@/helpers/enum'
import { convertNumber, renderCurrency } from '@/utils/currency'
import apiService from '@/http/api'

const router = useRouter()

const orderHistoryStore = useOrderHistory()
const { listOrderHistory, pageState } = storeToRefs(orderHistoryStore)

const listTurningTrain = ref([])

const onApplySearch = (data) => {
  const { pageNumber, pageSize, salesOrderType } = pageState.value
  const params = {
    startDate: data.startDate !== INVALID_DATE ? data.startDate : '',
    endDate: data.endDate !== INVALID_DATE ? data.endDate : '',
    pageNumber,
    pageSize,
    salesOrderType
  }

  orderHistoryStore.updatePageStateOrderHistory({
    ...pageState.value,
    ...params
  })

  orderHistoryStore.getOrderHistory({
    ...params,
    startDate: convertTimezone(`${params.startDate} ${TimeZoneEnum.START_TIME}`),
    endDate: convertTimezone(`${params.endDate} ${TimeZoneEnum.END_TIME}`)
  })
}

const handleStatusOrder = (item) => {
  const { trackingNumber, salesOrderStatus, deliveryPackageStatus } = item
  return checkStatusOrder(salesOrderStatus?.code, deliveryPackageStatus, trackingNumber)
}

const loadMore = () => {
  orderHistoryStore.updatePageStateOrderHistory({
    ...pageState.value,
    pageNumber: pageState.value.pageNumber + 1
  })
  const { pageNumber, pageSize, salesOrderType, startDate, endDate } = pageState.value

  const params = {
    pageNumber,
    pageSize,
    salesOrderType,
    startDate: convertTimezone(`${startDate} ${TimeZoneEnum.START_TIME}`),
    endDate: convertTimezone(`${endDate} ${TimeZoneEnum.END_TIME}`)
  }

  orderHistoryStore.getOrderHistory(params)
}

const redirectToExternalUr = (link) => {
  window.location.href = `${link}`
}

const showLoadMore = computed(() => {
  return listOrderHistory.value?.length < pageState.value.totalSize
})

const viewDetailOrder = (id) => {
  router.push({ name: AppRoutes.myPage.orderHistoryDetail.name, params: { id } })
}

const handleMergeOrderButton = (data) => {
  const arrMatch = listOrderHistory.value.filter(
    (item) =>
      item?.saleOrderId === data?.saleOrderId &&
      handleStatusOrder(data)?.action === handleStatusOrder(item)?.action
  )
  if (arrMatch.length > 1) {
    return {
      firstItem: arrMatch[0]?.saleOrderProductId,
      lastItem: arrMatch[arrMatch.length - 1]?.saleOrderProductId
    }
  }
  return { firstItem: data?.saleOrderProductId, lastItem: data?.saleOrderProductId }
}

const checkDisplayBtn = (item) => {
  return (
    item.trackingNumber ||
    (item.saleOrderProductId === handleMergeOrderButton(item)?.lastItem &&
      item.salesOrderType?.code !== OrderTypeEnum.BAG_ORDER &&
      handleStatusOrder(item)?.action !== ACTIONS_BUTTON_ORDER.CANCEL)
  )
}

const listSaleOrderAutoShip = computed(() => {
  const dataMatch = listOrderHistory.value
    ?.filter((item) => AUTO_SHIP_TYPE_ORDER.includes(item.salesOrderType?.code))
    ?.map((e) => e.orderNumber)
  return [...new Set(dataMatch)]
})

const getTurningTrain = async (payload) => {
  const response = await apiService.orderService.getTurningTrainBySaleOrder(payload)
  if (response.success) {
    listTurningTrain.value = response.data
  }
}

watch(
  () => listSaleOrderAutoShip.value,
  (value) => {
    if (value.length) getTurningTrain({ saleOrderNumberList: value })
  }
)

const getRoundFollowOrder = (order) => {
  return listTurningTrain.value.find((item) => item.saleOrderNumber === order)?.turningTrain
}

onBeforeUnmount(() => {
  orderHistoryStore.resetData()
})
</script>

<style lang="scss" scoped>
.text-link {
  @apply leading-base w-fit cursor-pointer text-sm font-light -tracking-[0.28px] underline;
}
</style>
