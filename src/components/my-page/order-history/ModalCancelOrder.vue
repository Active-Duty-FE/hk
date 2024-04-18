<template>
  <RDrawerBottom title="Cancel Order">
    <div class="text-black-50">
      <a-divider class="bg-black-50" />
      <p class="font-550 text-base">{{ dataProduct?.productName }}</p>
      <span>And 1 others</span>
      <a-divider class="bg-gray-11" />
      <div class="mb-5 flex justify-between text-sm">
        <span>Payment Amount</span>
        <span>$ {{ convertNumber(dataProduct?.totalPrice || dataProduct?.totalAmount) }}</span>
      </div>
      <div class="mb-5 flex justify-between text-sm">
        <span>Payment Method</span>
        <span>{{ dataProduct?.paymentType?.text }}</span>
      </div>
      <div class="flex justify-between text-sm">
        <span>Payment Points</span>
        <span>{{ dataProduct?.totalBP || dataProduct?.totalPoint }} P</span>
      </div>
      <a-divider class="bg-black-50" />
      <div class="font-475 mb-5 text-base">Reason for Cancellation</div>

      <RSelect
        v-model:value="formState.cancelReasonType"
        class="w-full"
        :options="REASON_CANCEL_OPTIONS"
      />
      <div class="absolute bottom-4 right-0 w-full bg-white">
        <div class="px-5">
          <CartCheckBox
            v-model:checked="formState.isAddToCart"
            :size="SIZE_CHECKBOX.SMALL"
            @checked-change="() => (formState.isAddToCart = !formState.isAddToCart)"
          >
            <template #content>
              <span class="ml-2"> Add items back to bag after cancellation.</span>
            </template>
          </CartCheckBox>
          <div class="mt-[30px] flex items-center justify-center gap-2">
            <RButton
              title="Close"
              class="!border-navy-6 !text-navy-6 w-full"
              @click="orderHistoryStore.closeCancelOrder"
            />
            <RButton
              title="Confirm Cancel"
              type="primary"
              class="!bg-navy-6 w-full !text-white"
              @click="cancelOrder"
            />
          </div>
        </div>
      </div>
    </div>
  </RDrawerBottom>
</template>
<script setup>
import { REASON_CANCEL_OPTIONS } from '@/helpers/order-history'
import { reactive } from 'vue'
import { SIZE_CHECKBOX } from '@/helpers/constant'
import { useOrderHistory } from '@/stores/modules/order-history'
import { convertNumber } from '@/utils/currency'
import { OrderTypeEnum } from '@/helpers/enum'

const props = defineProps({
  dataProduct: {
    type: Object,
    default: () => {}
  },
  isDetail: {
    type: Boolean,
    default: false
  }
})

const orderHistoryStore = useOrderHistory()

const formState = reactive({
  cancelReasonType: 'SIMPLE_CHANGE_MIND',
  isAddToCart: true
})

const cancelOrder = () => {
  if (props.dataProduct?.salesOrderType?.code === OrderTypeEnum.SUBSCRIBE_ORDER) {
    orderHistoryStore.cancelOrderAutoShipHistory(
      props.dataProduct?.saleOrderId || props.dataProduct?.salesOrderId,
      props.isDetail
    )
  } else {
    orderHistoryStore.cancelOrderHistory(
      props.dataProduct?.saleOrderId || props.dataProduct?.salesOrderId,
      formState,
      props.isDetail
    )
  }
}
</script>
