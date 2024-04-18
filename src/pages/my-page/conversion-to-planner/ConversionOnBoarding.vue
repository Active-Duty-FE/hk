<template>
  <div class="font-475 mb-[30px] text-base">
    Start your RIMAN business effortlessly at any moment and enjoy all the exciting benefits of
    becoming a Planner!
  </div>
  <r-button
    class="border-1 !text-navy-6 !border-black-50 mb-2.5 w-full !bg-white !shadow-none"
    title="Individual"
    @click="handleChooseRole(ROLES_BE.planner)"
  />
  <r-button
    class="border-1 !text-navy-6 !border-black-50 mb-[5px] w-full !bg-white !shadow-none"
    title="Company"
    @click="handleChooseRole(ROLES_BE.corporation)"
  />

  <div class="mt-6">
    <r-checkbox-outlined
      v-model:checked="pageState.checked"
      size="small"
      @checked-change="() => (pageState.checked = !pageState.checked)"
    >
      <template #content>
        <span class="text-back-50 ml-2 text-xs font-normal">
          I certify that I am at least 18 years of age.
          <span class="text-red-1000">*</span>
        </span>
      </template>
    </r-checkbox-outlined>
  </div>

  <RModalConfirm
    v-model:visible="pageState.showModalAgeError"
    :description="VALIDATE_MESSAGE.plannerAge"
    text-ok="Ok"
    text-cancel="Cancel"
    :width="350"
    :mask-closable="false"
    @ok="pageState.showModalAgeError = false"
    @cancel="pageState.showModalAgeError = false"
  />
</template>
<script setup>
import { reactive, onMounted } from 'vue'
import { VALIDATE_MESSAGE } from '@helpers/validate-message'
import {
  ROLES_BE,
  ROLE_CONVERSION,
  CONVERSION_SHIPPING,
  CONVERSION_ENTER_INFORMATION,
  STORAGE_INC_NUMBER
} from '@/helpers/constant'
import { storage } from '@/utils/storage'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'

const router = useRouter()
const pageState = reactive({
  checked: false,
  showModalAgeError: false
})

const handleChooseRole = (role) => {
  if (!pageState.checked) {
    pageState.showModalAgeError = true
    return
  }
  storage.set(ROLE_CONVERSION, role)
  router.push(AppRoutes.myPage.conversionReferral.path)
}

const resetStorage = () => {
  storage.remove(CONVERSION_SHIPPING)
  storage.remove(CONVERSION_ENTER_INFORMATION)
  storage.remove(ROLE_CONVERSION)
  storage.remove(STORAGE_INC_NUMBER)
}

onMounted(() => {
  resetStorage()
})
</script>
