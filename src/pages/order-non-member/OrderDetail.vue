<template>
  <div>
    <div class="mb-7 flex items-center justify-between text-xs">
      <span>
        {{ pageState?.orderDetail?.orderInfo?.salesOrderNumber }} |
        {{ formatDateTime(pageState?.orderDetail?.orderInfo?.orderDatetime, FORMAT_DATETIME) }}
      </span>
      <span class="text-navy-6 font-550">Bag</span>
    </div>
    <p class="font-550 mb-10 text-lg">Order Product</p>
    <div v-for="(item, index) in pageState?.orderDetail?.productList" :key="item.productId">
      <div class="mb-[10px] mb-[15px] flex items-center justify-between gap-5">
        <div>
          <p class="font-475 text-sm">
            {{
              checkStatusOrder(
                pageState?.orderDetail?.orderInfo?.salesOrderStatus?.code,
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
            <span
            >{{ renderCurrency(pageState?.orderDetail?.payment?.currency?.code) }}
              {{ convertPrice(item) }}</span
            >
          </div>
        </div>
      </div>

      <ButtonStatusOrder
        v-if="item.trackingNumber"
        :data-item="{ ...dataToButtonOrder, ...item }"
      />

      <a-divider v-if="index < detailOrderHistory?.productList?.length - 1" />
    </div>

    <!-- List Product -->
    <a-divider class="bg-black-50" />
    <p class="font-475 mb-[30px] text-base">Non-Member Information</p>
    <a-row class="row-info">
      <a-col :span="8">Order Email</a-col>
      <a-col :span="16" class="text-end">{{ pageState?.orderDetail?.orderInfo?.email }} </a-col>
    </a-row>
    <a-row class="row-info">
      <a-col :span="8">Cell phone</a-col>
      <a-col :span="16" class="text-end">
        {{ pageState?.orderDetail?.delivery?.receiverPhoneNumber }}
      </a-col>
    </a-row>

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
            :is-member="false"
            :data="pageState?.orderDetail?.payment"
            :currency="pageState?.orderDetail?.payment?.currency?.code"
          />
        </div>
        <div v-if="item.id === ID_ORDER_DETAIL.SHIPPING">
          <ShippingInformationDetail :is-member="false" :data="pageState?.orderDetail?.delivery" />
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
  <RModalAlert
    v-model:visible="pageState.showModalAlert"
    title="Alarm"
    text-btn="Check"
    :description="pageState.descriptionAlert"
    :width="280"
    :duration="3000"
    @confirm="handleModalAlert(false, '')"
    @self-close="handleModalAlert(false, '')"
  />
</template>
<script setup>
import { ORDER_DETAIL_LISTS, ID_ORDER_DETAIL, FORMAT_DATETIME } from '@/helpers/constant'
import { ref, onMounted, reactive, computed } from 'vue'
import ChevronTop from '@/assets/svgs/menu-up-link.svg'
import ChevronDown from '@/assets/svgs/menu-down-link.svg'
import { useRoute, useRouter } from 'vue-router'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import apiService from '@/http/api'
import { addPrefixForImage } from '@/utils/common'
import { convertNumber, renderCurrency } from '@/utils/currency'
import { checkStatusOrder } from '@/helpers/order-history'
import { formatDateTime } from '@/utils/datetime'

const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading
const activeKey = ref(['0', '1'])

const route = useRoute()
const router = useRouter()
const pageState = reactive({
  orderDetail: {},
  showModalAlert: false,
  descriptionAlert: ''
})

const handleModalAlert = (status, description) => {
  pageState.showModalAlert = status
  pageState.descriptionAlert = description
}

const getDetailOrder = async () => {
  try {
    showGlobalLoading(true)
    const response = await apiService.orderService.getDetailOrderNonMember({
      email: route.query?.email,
      orderNumber: route.params?.id
    })
    if (response.success) {
      pageState.orderDetail = response?.data
    } else {
      handleModalAlert(true, response?.data)
    }
  } finally {
    showGlobalLoading(false)
  }
}
onMounted(() => {
  if (route.query?.email) {
    getDetailOrder()
  } else {
    router.back()
  }
})

const convertPrice = (item) => convertNumber(item?.quantity * item.saleAmount)

const dataToButtonOrder = computed(() => {
  const { orderInfo, payment, delivery, cancelInfo } = pageState.orderDetail

  return {
    ...orderInfo,
    ...payment,
    ...delivery,
    ...cancelInfo
  }
})
</script>

<style lang="scss" scoped>
.row-info {
  @apply mb-5;
  .col-custom {
    @apply text-end text-xs;
  }
}
</style>

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

.collapse__description {
  @apply text-gray-10 mt-2.5 flex flex-col whitespace-pre-wrap text-xs font-normal;
}
</style>
