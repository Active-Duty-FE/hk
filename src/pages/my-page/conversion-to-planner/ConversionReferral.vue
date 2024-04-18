<template>
  <div class="w-full">
    <r-heading :title="'Please enter the necessary information when converting to a planner'" />

    <div class="mb-10 mt-5 flex justify-end">
      <RStep v-model="pageState.step" :total-step="4" />
    </div>

    <div>
      <a-space direction="vertical" class="custom-collapse w-full">
        <a-collapse v-model:activeKey="activeKey" collapsible="header" @change="onChange">
          <a-collapse-panel
            key="1"
            :show-arrow="false"
            :header="$t('auth.buttonFormText.haveRecommender')"
          >
            <div v-if="infoUserToConvert?.globalRefererUserNumber" class="text-sm">
              <p class="font-475 mb-[15px]">Sponsor information</p>
              <span>
                {{ infoUserToConvert?.globalRefererRegionCode }}
                {{ infoUserToConvert.globalRefererUserNumber }}
                {{ infoUserToConvert?.globalRefererUserFullName }}
              </span>
            </div>
            <FormReferralName
              v-else
              :has-referrer="pageState.hasReferrer"
              :update-disabled="updateDisabled"
              :change-status-error="changeStatusError"
              :clear="pageState.hasReferrer ? 'clear' : activeKey"
            />
          </a-collapse-panel>
        </a-collapse>

        <span class="text-red-2 text-[10px]">{{ pageState.messageValidRefer }}</span>
        <div v-if="infoUserToConvert.kStoreReferrerCode">
          <span class="text-gray-14 ml-2 text-sm font-normal">
            *(If applicable) I also have a Korean Sponsor Code
          </span>
          <div class="mb-5 text-sm">
            <p class="font-475 mb-[15px]">Sponsor information</p>
            <span>INC {{ infoUserToConvert.kStoreReferrerCode }} </span>
          </div>
        </div>

        <div v-else class="wrap-checkbox pt-5">
          <r-checkbox-outlined
            v-model:checked="pageState.showGlobalOption"
            @checked-change="() => (pageState.showGlobalOption = !pageState.showGlobalOption)"
          >
            <template #content>
              <span class="text-gray-14 ml-2 text-sm font-normal">
                *(If applicable) I also have a Korean Sponsor Code
              </span>
            </template>
          </r-checkbox-outlined>
          <FormGlobalReferral
            v-if="pageState.showGlobalOption"
            :update-disabled="updateGlobalReferralCode"
            :change-status-error="changeStatusError"
          />
        </div>
      </a-space>
    </div>
    <div class="hidden w-full pb-8 pt-10 md:block">
      <r-button
        class-title="text-white"
        :title="$t('auth.buttonFormText.buttonAgree')"
        class="!bg-navy-6 !border-navy-6 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full"
        @click="gotoFillInformation"
      >
      </r-button>
    </div>
    <div class="fixed bottom-0 left-0 w-full md:hidden">
      <div class="flex justify-center bg-white px-5 pb-3">
        <r-button
          class-title="text-white"
          :title="$t('auth.buttonFormText.buttonAgree')"
          class="!bg-navy-6 !border-navy-6 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full"
          @click="gotoFillInformation"
        >
        </r-button>
      </div>
    </div>
  </div>
  <RModalAlert
    v-model:visible="pageState.showModalError"
    :width="270"
    text-btn="check"
    @confirm="() => (pageState.showModalError = false)"
  >
    <template #extraDescription>
      <div class="text-center">{{ pageState.messageError }}</div>
    </template>
  </RModalAlert>
</template>

<script setup>
import { reactive, ref, watch, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { storage } from '@/utils/storage'
import { STORAGE_INC_NUMBER } from '@helpers/constant'
import { AppRoutes } from '@/router/path'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { storeToRefs } from 'pinia'
import apiService from '@/http/api'
import { useNotification } from '@/composables/notification'
import { VALIDATE_MESSAGE } from '@/helpers/validate-message'

const router = useRouter()
const authStore = useAuthUserStore()
const { infoUserToConvert } = storeToRefs(authStore)
const { setInfoUserToConvert } = authStore
const { showNotification } = useNotification()

const pageState = reactive({
  step: 1,
  type: undefined,
  isSelected: false,
  isDisabled: true,
  hasReferrer: false,
  showGlobalOption: false,

  kStoreReferrerCode: '',
  showModalError: false,
  messageError: '',
  messageValidRefer: ''
})
const activeKey = ref('1')

const onChange = (e) => {
  activeKey.value = e.pop()
  pageState.isSelected = false
  if (!pageState.hasReferrer) pageState.isDisabled = true
}

const updateGlobalReferralCode = (data) => {
  pageState.kStoreReferrerCode = data.kStoreReferrerCode
}

const changeStatusError = (data) => {
  pageState.showModalError = data.status
  pageState.messageError = data.message
}

watch(
  () => infoUserToConvert.value,
  (value) => {
    if (value?.globalRefererUserNumber) {
      pageState.globalRefererRegionCode = value?.globalRefererRegionCode
      pageState.globalRefererUserNumber = value?.globalRefererUserNumber
    }
    if (value?.kStoreReferrerCode) pageState.kStoreReferrerCode = value?.kStoreReferrerCode
  },
  {
    immediate: true,
    deep: true
  }
)

watch(
  () => pageState.globalRefererUserNumber,
  (value) => {
    if (value) pageState.messageValidRefer = ''
  }
)
const gotoFillInformation = () => {
  const { globalRefererRegionCode, globalRefererUserNumber, kStoreReferrerCode } = pageState
  if (!globalRefererUserNumber) {
    showNotification({
      type: 'error',
      message: VALIDATE_MESSAGE.requiredPayment
    })
    pageState.messageValidRefer = VALIDATE_MESSAGE.requiredReferral
    return
  }

  const dataInc = {
    globalRefererRegionCode,
    globalRefererUserNumber
  }
  if (kStoreReferrerCode) dataInc.kStoreReferrerCode = kStoreReferrerCode

  globalRefererRegionCode && globalRefererUserNumber && storage.set(STORAGE_INC_NUMBER, dataInc)
  router.push(AppRoutes.myPage.conversionEnterInformation)
}

const updateDisabled = (data) => {
  const { status, globalRefererUserNumber, globalRefererRegionCode } = data
  pageState.isDisabled = status
  pageState.globalRefererRegionCode = globalRefererRegionCode
  pageState.globalRefererUserNumber = globalRefererUserNumber
}

const getUserInfoConvert = async () => {
  const { data, success } = await apiService.myPageService.getInfoUserConvertPlanner()
  if (success) {
    setInfoUserToConvert(data)
  }
}

onBeforeMount(() => {
  getUserInfoConvert()
})
</script>

<style lang="scss" scoped>
.custom-collapse {
  @apply mb-[10px];
  :deep(.ant-collapse-header) {
    @apply text-navy-3 font-550 h-[50px] justify-center border-white bg-white  text-center text-[11px] leading-[28px] shadow-none  md:text-base;
  }

  :deep(.ant-collapse) {
    @apply border-1 border-navy-3 border-solid;
    .ant-collapse-item-active {
      @apply border-1 border-navy-6 border-solid;
    }
  }
  :deep(.ant-collapse-content) {
    .ant-collapse-content-box {
      @apply p-5;
    }
  }

  :deep(.ant-collapse-item-active) {
    .ant-collapse-header {
      @apply rounded-0 border-1 border-b-solid border-navy-6  text-navy-6;
    }
  }
}

.wrap-checkbox {
  :deep(.ant-checkbox-checked) {
    &::after {
      border-color: #123250 !important;
    }

    .ant-checkbox-inner {
      @apply bg-navy-1;
    }
  }

  :deep(.ant-checkbox-inner) {
    border-color: #d3d3d3 !important;
  }
}
</style>
