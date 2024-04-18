<template>
  <div v-if="statusButton?.textBtn">
    <template v-if="statusButton?.action === ACTIONS_BUTTON_ORDER.CANCEL">
      <div
        v-if="availableCancel"
        class="!text-navy-6 font-550 cursor-pointer text-base"
        @click="handleStatusOrder"
      >
        Cancel Order
      </div>
    </template>

    <RButton
      v-else
      :title="statusButton?.textBtn"
      class="!text-navy-6 !border-navy-6 !border-1 w-full !border-solid !shadow-none"
      @click="handleStatusOrder"
    />
  </div>
  <div v-if="statusButton?.actionFirst" class="flex gap-2">
    <RButton
      :title="statusButton?.textBtnFirst"
      class="!text-navy-6 !border-navy-6 !border-1 w-full !border-solid !shadow-none"
      @click="handleStatusOrder(statusButton?.actionFirst)"
    />
    <RButton
      :title="statusButton?.textBtnSecond"
      class="!text-navy-6 !border-navy-6 !border-1 w-full !border-solid !shadow-none"
      @click="handleStatusOrder(statusButton?.actionSecond)"
    />
  </div>
</template>
<script setup>
import {
  checkStatusOrder,
  ORDER_STATUS,
  VALIDATION_STATUS_ORDER_HISTORY,
  ACTIONS_BUTTON_ORDER
} from '@/helpers/order-history'
import { computed } from 'vue'
import { useOrderHistory } from '@/stores/modules/order-history'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { OrderTypeEnum } from '@/helpers/enum'
import { URL_LANDMARK, URL_OCEAN_BLUE } from '@/helpers/constant'
import dayjs from 'dayjs'

const props = defineProps({
  dataItem: {
    type: Object,
    default: () => {}
  }
})

const orderHistoryStore = useOrderHistory()
const { pageState } = storeToRefs(orderHistoryStore)
const router = useRouter()

const statusButton = computed(() => {
  const { trackingNumber, salesOrderStatus, deliveryPackageStatus } = props.dataItem
  return checkStatusOrder(salesOrderStatus?.code, deliveryPackageStatus, trackingNumber)
})

const handleStatusOrder = (actionDelivery) => {
  const action = statusButton.value?.action
  if (action === ACTIONS_BUTTON_ORDER.TRACKING) {
    const status = props.dataItem.deliveryPackageStatus?.code
    const trackingNumber = props.dataItem?.trackingNumber
    const validationStatus = props.dataItem?.warehouse
    if (status === ORDER_STATUS.IN_TRANSIT && trackingNumber) {
      if (validationStatus === VALIDATION_STATUS_ORDER_HISTORY.LANDMARK) {
        window.open(`${URL_LANDMARK}${trackingNumber}`, 'landmark', 'height=600,width=600')
      } else {
        window.open(`${URL_OCEAN_BLUE}${trackingNumber}`, 'ocean blue', 'height=600,width=600')
      }
    }
  }
  if (action === ACTIONS_BUTTON_ORDER.CANCEL) {
    orderHistoryStore.updatePageStateOrderHistory({
      ...pageState.value,
      visibleCancelOrder: true,
      itemOrderHistory: props.dataItem
    })
  }
  if (action === ACTIONS_BUTTON_ORDER.VIEW_DETAIL) {
    router.push({
      name: AppRoutes.myPage.orderHistoryDetail.name,
      params: { id: props.dataItem?.saleOrderId || props.dataItem?.salesOrderId }
    })
  }
  if (actionDelivery === ACTIONS_BUTTON_ORDER.WRITE_REVIEW) {
    router.push({
      name: AppRoutes.product.detail.name,
      params: { productId: props.dataItem?.productId }
    })
  }
  if (actionDelivery === ACTIONS_BUTTON_ORDER.RETURN_REQUEST) {
    router.push({
      name: AppRoutes.returnExchange.name,
      params: { salesOrderId: props.dataItem?.saleOrderId }
    })
  }
}

const availableCancel = computed(() => {
  if (props.dataItem?.salesOrderType?.code === OrderTypeEnum.BAG_ORDER) return false
  const createdDate = dayjs.utc(props.dataItem?.orderDatetime).tz('America/Los_Angeles')

  const currentDate = dayjs.utc(new Date()).tz('America/Los_Angeles')

  let targetTime = createdDate.add(1, 'day').hour(15).minute(0).second(0).millisecond(0)

  if (createdDate.hour() < 15) {
    targetTime = createdDate.hour(15).minute(0).second(0).millisecond(0)
  }

  return createdDate < currentDate && currentDate < targetTime
})
</script>
