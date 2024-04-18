<script setup>
import { AppRoutes } from '@/router/path'
import { useRouter } from 'vue-router'
import { formatDateTime } from '@/utils/datetime'
import { RETURN_EXCHANGE_TYPE } from '@/helpers/constant'

const router = useRouter()

defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  loadAgain: {
    type: Function,
    default: () => {}
  }
})

const viewDetails = (id, type) => {
  router.push({
    name: AppRoutes.returnExchange.returnDetails.name,
    params: {
      id: id
    },
    query:
      type === RETURN_EXCHANGE_TYPE.EXCHANGE
        ? {
          type: RETURN_EXCHANGE_TYPE.EXCHANGE
        }
        : {}
  })
}
</script>
<template>
  <div>
    <div class="font-400 flex text-[12px]">
      <p class="mb-0">
        {{ data?.returnOrderNumber }} <span class="text-gray-13">|</span>
        {{ formatDateTime(data?.receptionDatetime, 'YYYY.MM.DD') }}
      </p>
      <p
        class="mb-0 ml-auto cursor-pointer underline"
        @click="viewDetails(data?.returnOrderNumber, data?.returnExchangeType)"
      >
        View Details
      </p>
    </div>
    <p class="mt-3.25 mb-2.5">{{ data?.returnOrderStatusCustomer }}</p>
    <DetailProductItem v-for="(item, index) in data?.productList" :key="index" :item="item">
    </DetailProductItem>
    <div class="mt-3.75">
      <ButtonStatusReturn :data="data" :load-again="loadAgain" />
    </div>
  </div>
</template>
