<template>
  <div>
    <r-heading
      :title="'If you have any questions, please contact us through our Customer Support Ticket page.'"
      class-title="inline-block"
    />
    <RButton
      title="Write Ticket"
      class="!bg-navy-6 mx-auto my-10 w-full !border-none md:w-[335px]"
      class-title="text-white text-[14px] leading-base font-550 style-normal"
      @click="writeInquiry"
    />
    <RModalAlert
      v-model:visible="pageState.isShowModal"
      title=""
      text-btn="Ok"
      :description="pageState.descriptionModal"
      :width="280"
      @confirm="pageState.isShowModal = false"
    />
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import { CONCIERGE_MESSAGE } from '@/helpers/validate-message'

const pageState = reactive({
  isShowModal: false,
  descriptionModal: ''
})

const writeInquiry = () => {
  pageState.isShowModal = true
  pageState.descriptionModal = CONCIERGE_MESSAGE.notAllowCreateTicket

  return

  // router.push(AppRoutes.myPage.addInquiry)
}
</script>
