<template>
  <div class="text-black-50">
    <div class="mb-[30px] flex justify-between text-xs">
      <span>
        {{ detailOrderHistory?.orderInfo?.salesOrderNumber }}
      </span>
      <span>{{
        formatDateTime(
          detailOrderHistory?.purchaseDateTime || detailOrderHistory?.orderInfo?.orderDatetime,
          FORMAT_FULL_YEAR
        )
      }}</span>
    </div>
    <div v-if="AUTO_SHIP_TYPE_ORDER.includes(detailOrderHistory?.orderInfo?.salesOrderType?.code)">
      <a-divider />
      <div class="text-sm">Autoship Count : {{ detailState.turningTrain }}</div>
      <a-divider class="bg-black-50" />
    </div>

    <p class="font-475 mb-10 text-base leading-[22px]">Order Product</p>

    <div v-for="(item, index) in detailOrderHistory?.productList" :key="item.productId">
      <div class="mb-[10px] mb-[15px] flex items-center justify-between gap-5">
        <div>
          <p class="font-475 text-sm">
            {{
              checkStatusOrder(
                detailOrderHistory?.orderInfo?.salesOrderStatus?.code,
                item?.deliveryPackageStatus,
                item?.trackingNumber
              )?.textStatus
            }}
          </p>

          <img :src="addPrefixForImage(item?.thumbnailUrl)" alt="product" class="h-25 w-25" />
        </div>
        <div>
          <p class="font-550 text-sm">{{ item?.productName }}</p>

          <template v-if="item?.optionValues">
            <div v-for="option in item.optionValues" :key="option.optionValue" class="mb-2">
              <div class="flex items-center gap-2">
                {{ option.optionName }} :

                <div v-if="option.type?.code === ProductVariantEnum?.IMAGE">
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
              {{ renderCurrency(detailOrderHistory?.payment?.currency?.code) }}
              {{ convertNumber(item?.purchaseAmount * item?.quantity) }}
            </span>
          </div>
        </div>
      </div>

      <a-divider v-if="index < detailOrderHistory?.productList?.length - 1" />
    </div>

    <a-collapse v-model:activeKey="activeKey" :bordered="false">
      <a-collapse-panel
        v-for="(item, index) in ORDER_DETAIL_LISTS"
        :key="index"
        class="collapse-panel-custom"
        :show-arrow="false"
      >
        <template #header>
          <div>{{ item.title }}</div>
        </template>

        <template #extra>
          <ChevronDown v-if="activeKey.includes(String(index))" />
          <ChevronTop v-else />
        </template>

        <div v-if="item.id === ID_ORDER_DETAIL.PAYMENT">
          <PaymentInformationDetail
            :data="detailOrderHistory?.payment"
            :auto-ship-discount="detailOrderHistory?.autoShipDc"
            :member-ship-discount="detailOrderHistory?.payment?.membershipDiscount"
            :currency="detailOrderHistory?.payment?.currency?.code"
          />
          <div class="mb-5 flex justify-between text-sm">
            <span>Points earned on this order</span>
            <span class="font-475"> + {{ detailOrderHistory?.orderPoint?.plusPoint }} P </span>
          </div>

          <RButton
            title="Invoice Inquiry"
            class="!text-navy-6 !border-1 !border-navy-6 mb-5 w-full !border-solid"
            @click="() => (detailState.visibleReceipt = true)"
          />
        </div>
        <div v-if="item.id === ID_ORDER_DETAIL.SHIPPING">
          <ShippingInformationDetail :data="detailOrderHistory?.delivery" />
        </div>
        <div v-if="item.id === ID_ORDER_DETAIL.REFUND" class="!hidden">
          <RefundInformationDetail />
        </div>
        <div v-if="item.id === ID_ORDER_DETAIL.RETURN" class="!hidden">
          <ReturnHistoryDetail />
        </div>
      </a-collapse-panel>
    </a-collapse>

    <div
      v-if="
        (detailOrderHistory?.orderInfo?.salesOrderType !== OrderTypeEnum.BAG_ORDER ||
          dataToButtonOrder?.trackingNumber) &&
          detailOrderHistory?.orderInfo?.salesOrderStatus?.code !== ORDER_STATUS.SALES_ORDER_CANCEL
      "
      class="my-5"
    >
      <ButtonStatusOrder :data-item="dataToButtonOrder" />
    </div>
  </div>

  <ModalCancelOrder
    v-model="pageState.visibleCancelOrder"
    :data-product="pageState.itemOrderHistory"
    :is-detail="true"
  />
  <RModalAlert
    v-model:visible="pageState.showModalAlert"
    title="Alarm"
    text-btn="Confirm"
    :description="pageState.descriptionAlert"
    :width="280"
    @confirm="orderHistoryStore.handleStatusModalAlert(false, '')"
    @self-close="orderHistoryStore.handleStatusModalAlert(false, '')"
  />
  <ReceiptOrder
    v-model="detailState.visibleReceipt"
    :data="detailOrderHistory"
    :close-modal="closeReceiptOrder"
  />
</template>
<script setup>
import { onMounted, ref, computed, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderHistory } from '@/stores/modules/order-history'
import { storeToRefs } from 'pinia'
import { formatDateTime } from '@/utils/datetime'
import { addPrefixForImage } from '@/utils/common'
import {
  FORMAT_FULL_YEAR,
  ORDER_DETAIL_LISTS,
  ID_ORDER_DETAIL,
  AUTO_SHIP_TYPE_ORDER
} from '@/helpers/constant'
import ChevronTop from '@/assets/svgs/menu-up-link.svg'
import ChevronDown from '@/assets/svgs/menu-down-link.svg'
import { ProductVariantEnum, OrderTypeEnum } from '@/helpers/enum'
import { convertNumber, renderCurrency } from '@/utils/currency'
import { checkStatusOrder, ORDER_STATUS } from '@/helpers/order-history'
import apiService from '@/http/api'

const route = useRoute()
const orderHistoryStore = useOrderHistory()
const { detailOrderHistory, pageState } = storeToRefs(orderHistoryStore)
const activeKey = ref(['0', '1', '2', '3'])
const detailState = reactive({
  visibleReceipt: false,
  turningTrain: ''
})

onMounted(() => {
  if (route.params.id) {
    orderHistoryStore.getOrderHistoryDetail(route.params.id)
  }
})

const closeReceiptOrder = () => {
  detailState.visibleReceipt = false
}

const dataToButtonOrder = computed(() => {
  const { orderInfo, payment, delivery, cancelInfo, productList } = detailOrderHistory.value

  const listProduct = productList?.find((item) => item.trackingNumber) || []
  return {
    ...orderInfo,
    ...payment,
    ...delivery,
    ...cancelInfo,
    ...listProduct
  }
})

const getTurningTrain = async (payload) => {
  const response = await apiService.orderService.getTurningTrainBySaleOrder(payload)
  if (response.success) {
    detailState.turningTrain = response.data[0]?.turningTrain
  }
}

watch(
  () => detailOrderHistory.value,
  (value) => {
    if (value?.orderInfo?.salesOrderNumber) {
      getTurningTrain({ saleOrderNumberList: [value?.orderInfo?.salesOrderNumber] })
    }
  }
)
</script>
<style scoped lang="scss">
.collapse-panel-custom {
  @apply bg-white;

  :deep(.ant-collapse-header) {
    @apply font-475 border-black-50 border-1 border-t-solid flex py-[25px] pr-0 text-sm;
    padding-left: 0px !important;
  }
}

:deep(.ant-collapse-content-box) {
  @apply px-0;
}

.ant-collapse-item:last-child {
  @apply border-black-50;
}
.custom-radio {
  :deep(.ant-radio-wrapper) > span {
    @apply font-475 text-base leading-5;
  }
  :deep(.ant-radio-checked) {
    .ant-radio-inner {
      @apply border-navy-deep;
    }
    .ant-radio-inner:after {
      @apply bg-navy-deep;
    }
  }
}

.collapse__description {
  @apply text-gray-10 mt-2.5 flex flex-col whitespace-pre-wrap text-xs font-normal;
}
</style>
