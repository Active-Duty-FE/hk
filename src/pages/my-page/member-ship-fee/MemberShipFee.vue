<template>
  <div class="text-black-50">
    <p class="font-550 mb-[15px] text-base leading-[22px]">
      Please check the<br />
      'Membership Fee' information.
    </p>
    <div class="flex flex-col gap-2.5">
      <RLineNotice
        content="The Planner membership fee is $20 per year, and if the annual payment date is exceeded, your access to commission settlements may be restricted."
        :class-content="'font-300 text-gray-14'"
      />
      <RLineNotice
        content="You can cancel your membership fee payment within 60 days from the payment date, and your membership status will be terminated upon cancellation. To cancel your membership fee payment, please contact our customer service center."
        :class-content="'font-300 text-gray-14'"
      />
    </div>
    <a-divider class="bg-gray-14 !my-[15px]" />
    <div class="mx-[5px] flex justify-between">
      <span class="text-sm">Membership Period</span>
      <span class="font-300 text-xs">
        {{
          formatDateTime(
            pageState.dataMemberShip?.membershipPeriodStartDate,
            FORMAT_FULL_YEAR_USE_DOT
          )
        }}
        ~
        {{
          formatDateTime(
            pageState.dataMemberShip?.membershipPeriodEndDate,
            FORMAT_FULL_YEAR_USE_DOT
          )
        }}</span
      >
    </div>
    <a-divider class="bg-gray-14 !my-[15px]" />
    <div class="mx-[5px] flex justify-between">
      <span class="text-sm">Membership Fee</span>
      <span class="font-300 text-xs">$ {{ pageState.dataMemberShip?.costFeeAnnual }}</span>
    </div>
    <a-divider class="bg-gray-14 !my-[15px]" />
    <div class="mx-[5px] flex justify-between">
      <span class="text-sm">Payment Status</span>
      <span class="font-300 text-xs">{{ textStatusPayment }}</span>
    </div>
  </div>
  <div class="fixed bottom-10 w-[calc(100%-40px)] max-w-[1200px]">
    <r-button
      v-if="pageState.dataMemberShip?.paymentStatus?.code === MemberShipFeeEnum.WAITING"
      title="Next"
      class="!border-navy-6 !bg-navy-6 w-full !text-white !shadow-none"
      @click="transitToPayment"
    />
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import apiService from '@/http/api'
import { onMounted, reactive, computed } from 'vue'
import { FORMAT_FULL_YEAR_USE_DOT } from '@/helpers/constant'
import { formatDateTime } from '@/utils/datetime'
import { useNotification } from '@/composables/notification'
import { MemberShipFeeEnum } from '@/helpers/enum'

const router = useRouter()
const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading

const { showNotification } = useNotification()

const pageState = reactive({
  dataMemberShip: {}
})

const transitToPayment = () => {
  router.push(AppRoutes.myPage.memberShipPayment.path)
}

const getDataMemberShip = async () => {
  showGlobalLoading(true)
  try {
    const response = await apiService.myPageService.getAnnualMemberShip()
    if (response.success) {
      pageState.dataMemberShip = response.data
    } else {
      showNotification({ type: 'error', duration: 3, message: response.message })
    }
  } finally {
    showGlobalLoading(false)
  }
}

onMounted(() => {
  getDataMemberShip()
})

const textStatusPayment = computed(() => {
  const { text, code } = pageState.dataMemberShip?.paymentStatus || {}
  if (code === MemberShipFeeEnum.FREE) return 'Payment completed'
  return text
})
</script>
