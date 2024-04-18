<template>
  <div class="md:(flex h-full) md:py-auto mx-auto min-h-screen items-center pt-[115px]">
    <div class="sm:(w-[600px] h-auto) md:(w-[500px] h-auto) mx-auto mb-10 bg-white pb-20">
      <r-sub-navigation
        class="z-10 w-full bg-white"
        title="Sign Up"
        :is-hide-back-icon="false"
        @click="backStep"
      />
      <div class="w-full p-5">
        <div class="w-full">
          <r-heading
            :title="$t('auth.sign_up.selectRecommend.referring')"
            class-title="text-xl font-semibold"
          />

          <div class="mb-10 mt-5 flex justify-end">
            <RStep v-model="pageState.step" :total-step="pageState.totalStep" />
          </div>
          <div>
            <a-space direction="vertical" class="custom-collapse w-full">
              <a-collapse v-model:activeKey="activeKey" collapsible="header" @change="onChange">
                <a-collapse-panel
                  key="1"
                  :show-arrow="false"
                  :header="$t('auth.buttonFormText.haveCode')"
                >
                  <FormReferralName
                    :has-referrer="pageState.hasReferrer"
                    :update-disabled="updateDisabled"
                    :change-status-error="changeStatusError"
                    :clear="pageState.hasReferrer ? 'clear' : activeKey"
                  />
                </a-collapse-panel>
              </a-collapse>
              <div v-if="!checkRoleAvailable([AuthUserEnum.CONSUMER])" class="wrap-checkbox pt-5">
                <r-checkbox-outlined
                  v-model:checked="pageState.showGlobalOption"
                  @checked-change="() => (pageState.showGlobalOption = !pageState.showGlobalOption)"
                >
                  <template #content>
                    <span class="text-gray-14 ml-2 text-sm font-normal">
                      {{ $t('auth.sign_up.selectRecommend.applicable') }}
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
          <div v-if="checkRoleAvailable([AuthUserEnum.CONSUMER])" class="mt-6">
            <span
              :class="[
                'text-black-100  font-normal',
                pageState.typeRef === TYPE_REF.NO_REF ? 'opacity-100' : 'opacity-50'
              ]"
            >{{ $t('auth.sign_up.selectRecommend.dont_ref') }}</span
            >
            <div
              :class="[
                'flex h-[50px] cursor-pointer items-center justify-center border border-solid',
                pageState.typeRef === TYPE_REF.NO_REF
                  ? 'border-navy-6 text-navy-6'
                  : 'border-navy-3 text-navy-3'
              ]"
              @click="handleSelectTypeRef(TYPE_REF.NO_REF)"
            >
              <span class="text-[11px] font-medium">{{
                $t('auth.buttonFormText.notHaveRecommender')
              }}</span>
            </div>
          </div>
        </div>
        <div class="hidden w-full pb-8 pt-10 md:block">
          <r-button
            class-title="text-white"
            :title="$t('auth.buttonFormText.buttonAgree')"
            class="!bg-navy-6 !border-navy-6 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full"
            :disabled="pageState.isDisabled"
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
              :disabled="pageState.isDisabled"
              @click="gotoFillInformation"
            >
            </r-button>
          </div>
        </div>
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
import { onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storage } from '@/utils/storage'
import {
  STORAGE_USER_TYPE,
  STORAGE_CURRENT_STEP,
  STORAGE_INC_NUMBER,
  STORAGE_REFERRAL_CODE
} from '@helpers/constant'
import { AuthUserEnum } from '@helpers/enum'
import { AppRoutes } from '@/router/path'
import { getRegisterStep } from '@/utils/authenticate'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import RSubNavigation from '@/components/navigation/RSubNavigation.vue'
import RModalAlert from '@/components/common/RModalAlert.vue'
import RButton from '@/components/common/RButton.vue'
import FormGlobalReferral from '@/components/app/referral/FormGlobalReferral.vue'
import RCheckboxOutlined from '@/components/common/RCheckboxOutlined.vue'
import FormReferralName from '@/components/app/referral/FormReferralName.vue'
import RStep from '@/components/common/RStep.vue'
import RHeading from '@/components/common/RHeading.vue'

const TYPE_REF = {
  NO_REF: 'no_ref',
  HAVE_REF: 'have_ref'
}

const router = useRouter()
const authStore = useAuthUserStore()
const dataUserType = storage.get(STORAGE_USER_TYPE)
const checkRoleAvailable = (listRoles) => {
  return listRoles.includes(dataUserType?.userType)
}
const pageState = reactive({
  step: 1,
  typeRef: '',
  totalStep: getRegisterStep(storage.get(STORAGE_USER_TYPE)?.userType),
  type: undefined,
  isSelected: false,
  isDisabled: true,
  hasReferrer: false,
  showGlobalOption: false,
  globalRefererUserNumber: '',
  globalRefererRegionCode: '',
  kStoreReferrerCode: '',
  showModalError: false,
  messageError: ''
})
const activeKey = ref('')

const backStep = () => {
  router.back()
}

const onChange = (e) => {
  activeKey.value = e.pop()
  if (activeKey.value) {
    pageState.typeRef = TYPE_REF.HAVE_REF
  } else {
    pageState.typeRef = ''
  }
  pageState.isSelected = false
  if (!pageState.hasReferrer) pageState.isDisabled = true
}

const handleSelectTypeRef = (type) => {
  pageState.typeRef = type
  activeKey.value = ''
}

const gotoFillInformation = () => {
  storage.set(STORAGE_CURRENT_STEP, [
    ...storage.get(STORAGE_CURRENT_STEP),
    `${AppRoutes.register.path}/${AppRoutes.register.enterInformation.path}`
  ])
  if (pageState.typeRef === TYPE_REF.NO_REF) {
    storage.set(STORAGE_REFERRAL_CODE, '')
  }
  const { globalRefererRegionCode, globalRefererUserNumber, kStoreReferrerCode } = pageState
  const dataInc = {
    globalRefererRegionCode,
    globalRefererUserNumber
  }
  if (kStoreReferrerCode) dataInc.kStoreReferrerCode = kStoreReferrerCode
  globalRefererRegionCode && globalRefererUserNumber && storage.set(STORAGE_INC_NUMBER, dataInc)
  router.push(AppRoutes.register.enterInformation)
}

const updateDisabled = (data) => {
  const { status, globalRefererUserNumber, globalRefererRegionCode } = data
  pageState.isDisabled = status
  pageState.globalRefererRegionCode = globalRefererRegionCode
  pageState.globalRefererUserNumber = globalRefererUserNumber
}

const updateGlobalReferralCode = (data) => {
  pageState.kStoreReferrerCode = data.kStoreReferrerCode
}

const changeStatusError = (data) => {
  pageState.showModalError = data.status
  pageState.messageError = data.message
}

onMounted(() => {
  if (authStore.referrerCode) {
    pageState.hasReferrer = true
    activeKey.value = '1'
  }
})

watch(
  () => pageState.typeRef,
  () => {
    if (pageState.typeRef === TYPE_REF.NO_REF) {
      pageState.isDisabled = false
    }
  }
)
</script>

<style lang="scss" scoped>
.custom-collapse {
  @apply mb-[10px];

  :deep(.ant-collapse-header) {
    @apply text-navy-3 font-550 h-[50px] justify-center border-white bg-white text-center text-[11px] leading-[28px] shadow-none md:text-base;
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
      @apply rounded-0 border-1 border-b-solid border-navy-6 text-navy-6;
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
