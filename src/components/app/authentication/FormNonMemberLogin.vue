<template>
  <p class="mb-0 mt-[30px] text-center text-xs">
    Click
    <span class="font-625 cursor-pointer hover:underline" @click="visible = true">here</span> to
    track your order as a guest.
  </p>
  <a-divider class="bg-gray-11" />
  <r-form-modal v-model:visible="visible" title="Non-Member Order">
    <template #form>
      <a-form :model="formState" :rules="rules" class="modal-custom" @submit="handleSubmit">
        <a-form-item name="email" class="!mb-2">
          <r-input v-model:value="formState.email" placeholder="Enter your Email" />
        </a-form-item>
        <a-form-item name="orderNumber">
          <r-input v-model:value="formState.orderNumber" placeholder="Enter your Order Number" />
        </a-form-item>
        <r-button title="Continue" type="primary" class="!bg-navy-6 w-full" html-type="submit" />
      </a-form>
    </template>
  </r-form-modal>
  <RModalAlert
    v-model:visible="modalAlertState.showModalAlert"
    title="Alarm"
    text-btn="Check"
    :description="modalAlertState.descriptionAlert"
    :width="280"
    :duration="3000"
    @confirm="handleModalAlert(false, '')"
    @self-close="handleModalAlert(false, '')"
  />
</template>
<script setup>
import { ref, reactive } from 'vue'
import { VALIDATE_MESSAGE } from '@/helpers/validate-message'
import { validateRequired } from '@/helpers/handle-validate'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'

const visible = ref(false)
const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading
const router = useRouter()

const formState = reactive({
  email: '',
  orderNumber: ''
})

const modalAlertState = reactive({
  showModalAlert: false,
  descriptionAlert: ''
})

const handleModalAlert = (status, description) => {
  modalAlertState.showModalAlert = status
  modalAlertState.descriptionAlert = description
}

const rules = {
  email: [
    {
      validator: validateRequired,
      trigger: 'change'
    },
    {
      type: 'email',
      message: VALIDATE_MESSAGE.availableEmail
    }
  ],
  orderNumber: [{ validator: validateRequired, trigger: 'change' }]
}

const handleSubmit = async () => {
  try {
    showGlobalLoading(true)
    const response = await apiService.orderService.getDetailOrderNonMember(formState)
    if (response.success) {
      router.push({
        name: AppRoutes.orderNonMember.orderDetail.name,
        params: { id: response?.data?.orderInfo?.salesOrderNumber },
        query: { email: formState?.email }
      })
    } else {
      handleModalAlert(true, response?.message)
    }
  } finally {
    showGlobalLoading(false)
  }
}
</script>
