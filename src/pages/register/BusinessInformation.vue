<template>
  <div class="flex items-center justify-center md:py-10">
    <div class="sm:(w-[600px]) md:(w-[500px] rounded-[10px]) w-full bg-white">
      <a-form ref="formRef" class="w-full">
        <r-sub-navigation
          class="z-10 w-full bg-white"
          title="Sign Up"
          :is-hide-back-icon="false"
          @icon-click="router.back()"
        />
        <div class="cursor-pointer pt-5 text-center">
          <span class="text-base font-medium md:text-2xl">{{
            $t('auth.sign_up.business_information.title')
          }}</span>
        </div>
        <BusinessInformationForm @get-data-business="getDataBusiness" />
        <div class="mx-5 mb-10">
          <r-button
            class-title="text-white"
            :title="$t('auth.sign_up.business_information.save_information')"
            class="!bg-navy-1 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full"
            :disabled="pageState.isDisabledSaveBtn || pageState.loading"
            :loading="pageState.loading"
            @click="handleSubmitInfoBusiness"
          />
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import apiService from '@/http/api'
import { useRouter } from 'vue-router'
import { useNotification } from '@/composables/notification'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import BusinessInformationForm from '@/components/app/authentication/BusinessInformationForm.vue'
import RButton from '@/components/common/RButton.vue'
import RSubNavigation from '@/components/navigation/RSubNavigation.vue'
import { MESSAGE, STORAGE_ID_REGISTER_SUCCESS, STORAGE_USER_NUMBER } from '@/helpers/constant'

import { storage } from '@/utils/storage'
const { showNotification } = useNotification()
const { showGlobalLoading } = useGlobalLoadingStore()

const router = useRouter()
const pageState = reactive({
  isDisabledSaveBtn: true,
  data: {},
  visibleAlert: false,
  descriptionAlert: '',
  type: '',
  loading: false
})

const getDataBusiness = (val) => {
  pageState.isDisabledSaveBtn = val?.disabled
  pageState.data = val?.data
}

const handleSubmitInfoBusiness = async () => {
  pageState.loading = true
  const payload = {
    ...pageState.data
  }
  try {
    const response = await apiService.authService.businessInformation(payload)
    if (response.message === MESSAGE.OK) {
      await router.push('/')
    } else {
      showNotification({ type: 'error', message: response.message })
    }
  } catch (e) {
    console.log(e)
  } finally {
    pageState.loading = false
  }
}
</script>

<style lang="scss" scoped>
.form-item-group {
  @apply mb-2;

  &.ant-form-item-has-error {
    @apply mb-0;
  }
}

.label--form {
  @apply text-sm;
}

:deep(.ant-select-selector) {
  @apply min-h-[50px];
}

:deep(.ant-select-selection-search-input) {
  height: 100% !important;

  &::placeholder {
    @apply text-gray-1 h-full;
  }
}

:deep(.ant-form-item) {
  @apply w-full;
}

.checkbox-custom {
  @apply mb-7 mt-[2px] leading-3;

  :deep(.ant-checkbox-inner) {
    @apply h-3.5 w-3.5;

    &::after {
      left: 18.5%;
    }
  }

  :deep(.ant-checkbox + span) {
    @apply text-xs leading-3;
  }
}
</style>
