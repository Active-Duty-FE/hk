<template>
  <p class="font-475 text-base">This is a guide to canceling autoship subscription.</p>
  <a-divider class="bg-gray-14" />
  <a-row class="row-info">
    <a-col :span="16">Round</a-col>
    <a-col class="col-custom"></a-col>
    <a-col :span="7" class="col-result">{{ pageState.dataDetail?.turningTrain }} </a-col>
  </a-row>
  <a-divider class="bg-gray-14" />
  <a-row class="row-info">
    <a-col :span="16">Accumulated Discount Amount</a-col>
    <a-col class="col-custom"></a-col>
    <a-col :span="7" class="col-result">$ {{ pageState.dataDetail?.discountAmount }} </a-col>
  </a-row>
  <a-divider class="bg-gray-14" />
  <a-row class="row-info">
    <a-col :span="16">Skip</a-col>
    <a-col class="col-custom"></a-col>
    <a-col :span="7" class="col-result">
      {{ pageState.dataDetail?.skipCount }}
    </a-col>
  </a-row>
  <a-divider class="bg-gray-14" />
  <a-row class="row-info">
    <a-col :span="16">Free Gift</a-col>
    <a-col class="col-custom"></a-col>
    <a-col :span="7" class="col-result"> {{ pageState.dataDetail?.turningTrain || 0 }} / 3 </a-col>
  </a-row>
  <a-divider class="bg-gray-14" />
  <p class="mb-15 text-xs">If you order ‘N’ more times, you will receive a Free Gift.</p>
  <div class="flex items-center justify-center">
    <p class="max-w-[235px] text-center text-sm">
      Do you want to change the autoship subscription payment date?
    </p>
  </div>

  <div class="fixed bottom-10 w-[calc(100%-40px)] max-w-[1200px]">
    <div class="flex w-full gap-[5px]">
      <r-button
        title="Cancel"
        class="!text-navy-6 w-full"
        @click="transitPage(AppRoutes.myPage.autoshipManagement.path)"
      />
      <r-button type="primary" title="Confirm" class="!bg-navy-6 w-full" @click="cancelOrder" />
    </div>
  </div>

  <RModalAlert
    v-model:visible="pageState.showModal"
    title="Alarm"
    text-btn="Confirm"
    :description="pageState.descriptionModal"
    :width="280"
    @confirm="() => (pageState.showModal = false)"
  />
</template>
<script setup>
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { reactive, onMounted } from 'vue'

const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading
const router = useRouter()

const pageState = reactive({
  showModal: false,
  descriptionModal: '',
  dataDetail: {}
})

const transitPage = (path) => {
  router.push(path)
}

const cancelOrder = async () => {
  showGlobalLoading(true)
  try {
    const response = await apiService.myPageService.cancelAutoShip(
      pageState.dataDetail?.subscriptionId
    )
    if (response.success) {
      router.push(AppRoutes.myPage.cancelAutoShipComplete.path)
    } else {
      pageState.showModal = true
      pageState.descriptionModal = response?.message
    }
  } finally {
    showGlobalLoading(false)
  }
}

const getDataAutoShipDetail = async () => {
  try {
    showGlobalLoading(true)

    const response = await apiService.myPageService.getAutoShipSubscribeDetail()
    if (response.success) {
      pageState.dataDetail = response?.data
    }
  } finally {
    showGlobalLoading(false)
  }
}

onMounted(() => {
  getDataAutoShipDetail()
})
</script>
<style scoped lang="scss">
.row-info {
  @apply text-black-50 mx-5 flex  items-center text-sm;
  .col-custom {
    @apply border-1 border-l-solid border-gray-14 h-[10px];
  }
  .col-result {
    @apply flex items-center justify-center;
  }
}
</style>
