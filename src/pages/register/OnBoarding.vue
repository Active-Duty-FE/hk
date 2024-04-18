<template>
  <div class="lg:(flex h-screen) container-onboard md:(pb-0 pt-0) mx-auto items-center pt-[65px]">
    <div class="sm:(w-[600px] mx-auto) md:(w-[500px]) m-5 bg-white">
      <div class="pt-15 mb-[50px] px-[17px] text-center">
        <h1 class="font-550 mb-[30px] text-lg leading-[18px]">
          {{ TITLE_HEAD_REGISTER }}
        </h1>
        <span class="text-sm font-normal" v-html="$t('auth.sign_up.onboarding.your_journey')">
        </span>
      </div>

      <div>
        <r-tabs
          v-model:activeKey="activeAuthenticationTab"
          centered
          size="large"
          class="authenticate-tabs w-full"
          @change="onChangeTab"
        >
          <r-tab-panel
            :key="AuthenticateTabEnum.CONSUMER"
            class="custom-tab-panel px-[20px]"
            tab="Customer"
          >
            <div class="mb-25 flex flex-col gap-2">
              <button-social-group
                :user-type="activeAuthenticationTab"
                :check-age="pageState.checked"
                @next-step="gotoNextStep"
                @sns-process="snsProcessData"
                @open-modal-certify="showAgeErrorModal"
              />
              <r-checkbox-outlined
                v-model:checked="pageState.checked"
                size="small"
                @checked-change="() => (pageState.checked = !pageState.checked)"
              >
                <template #content>
                  <span class="text-back-50 ml-2 text-xs font-normal">
                    {{ $t('auth.sign_up.onboarding.certify_number') }}
                    <span class="text-red-1000">*</span>
                  </span>
                </template>
              </r-checkbox-outlined>
            </div>
          </r-tab-panel>
          <r-tab-panel
            :key="AuthenticateTabEnum.PLANNER"
            class="custom-tab-panel px-[20px]"
            tab="Planner"
          >
            <div v-if="!showRegisterOption" class="pb-3">
              <r-button
                class-title="text-black-50 font-625 text-sm leading-[14px]"
                title="Individual"
                class="border-1 !border-black-50 mb-[5px] w-full !bg-white"
                @click="doShowRegisterOption"
              >
                <template #image>
                  <IndividualIcon />
                </template>
              </r-button>
              <r-button
                class-title="text-black-50 font-625 text-sm leading-[14px]"
                title="Company"
                class="border-1 !border-black-50 mb-2 w-full !bg-white"
                @click="showOnlyEmailForCorporation"
              >
                <template #image>
                  <CorporationIcon />
                </template>
              </r-button>
              <div class="mb-[122px]">
                <r-checkbox-outlined
                  v-model:checked="pageState.checked"
                  size="small"
                  @checked-change="() => (pageState.checked = !pageState.checked)"
                >
                  <template #content>
                    <span class="text-back-50 ml-2 text-xs font-normal">
                      {{ $t('auth.sign_up.onboarding.certify_number') }}
                      <span class="text-red-1000">*</span>
                    </span>
                  </template>
                </r-checkbox-outlined>
              </div>
            </div>
            <button-social-group
              v-if="showRegisterOption"
              class="mb-25"
              :check-age="pageState.checked"
              :user-type="activeAuthenticationTab"
              :is-corporation="onlyEmailForCorporation"
              @next-step="gotoNextStep"
              @sns-process="snsProcessData"
            />
          </r-tab-panel>
        </r-tabs>
      </div>
    </div>
    <RModalConfirm
      v-model:visible="pageState.showModalAccountExist"
      :description="$t('auth.sign_up.onboarding.login_like')"
      :text-ok="$t('auth.sign_up.onboarding.will_login')"
      :text-cancel="$t('common.no')"
      :width="350"
      :mask-closable="false"
      description-class="!font-medium !text-base"
      @ok="goToLogin"
      @cancel="pageState.showModalAccountExist = false"
    >
      <template #extraTitle>
        <p class="mb-0">{{ $t('auth.sign_up.onboarding.already') }}</p>
        <span class="flex items-center justify-center">
          (<component :is="pageState.methodRegisterIcon" />
          <span class="pl-1">{{ pageState.registeredEmail }})</span>
        </span>
      </template>
    </RModalConfirm>
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
    <RModalAlert
      v-model:visible="pageState.showModalWithdrawError"
      :description="VALIDATE_MESSAGE.withdrawal"
      text-btn="Ok"
      :width="350"
      :mask-closable="false"
      @confirm="pageState.showModalWithdrawError = false"
    />
  </div>
</template>
<script setup>
import { useNotification } from '@/composables/notification'
import { SNSEnum, AuthenticateTabEnum, UserStatusEnum } from '@/helpers/enum'
import { AppRoutes } from '@/router/path'
import { checkSnsToken } from '@/utils/authenticate'
import { storage } from '@/utils/storage'
import FacebookIcon from '@assets/svgs/colored-facebook.svg'
import GoogleIcon from '@assets/svgs/colored-google.svg'
import EmailIcon from '@assets/svgs/email.svg'
import CorporationIcon from '@assets/svgs/corporation-black.svg'
import IndividualIcon from '@assets/svgs/individual-black.svg'
import {
  STORAGE_SNS_DATA,
  STORAGE_USER_TYPE,
  STORAGE_ENTER_INFORMATION,
  STORAGE_ENTER_SHIPPING_DATA,
  STORAGE_CURRENT_STEP,
  STORAGE_INC_NUMBER
} from '@helpers/constant'
import { VALIDATE_MESSAGE } from '@helpers/validate-message'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TITLE_HEAD_REGISTER } from '@/helpers/constant'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { storeToRefs } from 'pinia'
import RModalAlert from '@/components/common/RModalAlert.vue'
import RModalConfirm from '@/components/common/RModalConfirm.vue'
import ButtonSocialGroup from '@/components/app/authentication/ButtonSocialGroup.vue'
import RCheckboxOutlined from '@/components/common/RCheckboxOutlined.vue'
import RButton from '@/components/common/RButton.vue'
import RTabPanel from '@/components/common/RTabPanel.vue'
import RTabs from '@/components/common/RTabs.vue'

const router = useRouter()
const route = useRoute()

const authStore = useAuthUserStore()
const { activeAuthenticationTab } = storeToRefs(authStore)

const { showNotification } = useNotification()

const showRegisterOption = ref(false)
const onlyEmailForCorporation = ref(false)
const pageState = reactive({
  checked: false,
  showModalAccountExist: false,
  registeredEmail: '',
  errorContent: '',
  showModalAgeError: false,
  methodRegisterIcon: ''
})

const showAgeErrorModal = () => {
  pageState.showModalAgeError = true
}

const setShowRegisterOption = (value) => {
  showRegisterOption.value = value
}

const handlePushCurrentStep = () => {
  storage.set(STORAGE_CURRENT_STEP, [
    ...storage.get(STORAGE_CURRENT_STEP),
    `${AppRoutes.register.path}/${AppRoutes.register.selectRecommender.path}`
  ])
}
const gotoNextStep = (data) => {
  if (data?.path) {
    router.push(data.path)
    handlePushCurrentStep()
  }
}

const snsProcessData = async (snsData) => {
  const response = await checkSnsToken(snsData.snsToken, snsData.snsType, snsData?.snsUser?.email)
  if (!response.success) {
    showNotification({ type: 'error', message: response.message })
  } else {
    const { data } = response
    if (data?.duplicate) {
      if (data?.userStatus?.code === UserStatusEnum.WITHDRAWAL) {
        pageState.showModalWithdrawError = true
      } else {
        pageState.methodRegisterIcon = showRegisterMethodIcon(data?.socialService)
        pageState.registeredEmail = data?.email
        pageState.showModalAccountExist = true
      }
    } else {
      storage.set('sns-data', snsData)
      handlePushCurrentStep()
      router.push(snsData.path)
    }
  }
}

const showRegisterMethodIcon = (registeredType) => {
  switch (registeredType) {
    case SNSEnum.GOOGLE:
      return GoogleIcon
    case SNSEnum.FACEBOOK:
      return FacebookIcon
    default:
      return EmailIcon
  }
}

const onChangeTab = () => {
  onlyEmailForCorporation.value = false
  setShowRegisterOption(false)
  pageState.checked = false
}

const showOnlyEmailForCorporation = () => {
  if (!pageState.checked) {
    showAgeErrorModal()
  } else {
    setShowRegisterOption(true)
    onlyEmailForCorporation.value = true
  }
}

const doShowRegisterOption = () => {
  if (!pageState.checked) {
    showAgeErrorModal()
  } else {
    setShowRegisterOption(true)
  }
}

const goToLogin = () => {
  router.push(AppRoutes.login)
}

onMounted(() => {
  const referrerCode = route?.query?.referrerCode
  if (referrerCode) {
    authStore.setReferrerCode(referrerCode)
  }
  storage.remove(STORAGE_USER_TYPE)
  storage.remove(STORAGE_SNS_DATA)
  storage.remove(STORAGE_ENTER_INFORMATION)
  storage.remove(STORAGE_ENTER_SHIPPING_DATA)
  storage.remove(STORAGE_INC_NUMBER)
  storage.set(STORAGE_CURRENT_STEP, [
    `${AppRoutes.register.path}/${AppRoutes.register.onBoarding.path}`
  ])
})
</script>
<style lang="scss" scoped>
.authenticate-tabs {
  width: 100%;

  :deep(.ant-tabs-nav-wrap) {
    height: 45px;

    .ant-tabs-nav-list {
      height: 45px;
      width: 100%;
      padding: 0 20px;
      // @apply bg-gray-6;
    }
  }

  :deep(.ant-tabs-tab) {
    @apply w-full justify-center bg-white;
    margin-left: 0 !important;
    border: 1px solid #a0a0a0 !important;
    border-bottom: 1px solid #063451 !important;
    @media (max-width: 500px) {
      @apply w-[150px];
    }
    .ant-tabs-tab-btn {
      @apply text-gray-13 text-sm font-normal;
    }
  }
  :deep(.ant-tabs-nav::before) {
    border-bottom: 1px solid #063451 !important;
  }

  :deep(.ant-tabs-tab-active) {
    @apply border-1 border-navy-6 w-full border-solid bg-white;
    border: 1px solid #063451 !important;
    border-bottom: none !important;
    @media (max-width: 500px) {
      @apply w-[150px];
    }

    .ant-tabs-tab-btn {
      @apply text-navy-6 font-475 text-sm;
    }
  }
}

@screen sm {
  .authenticate-tabs {
    :deep(.ant-tabs-nav) {
      @apply px-5;
    }
  }
}

@screen lg {
  .authenticate-tabs {
    :deep(.ant-tabs-nav) {
      @apply px-0;
    }

    :deep(.ant-tabs-tab:nth-child(even)) {
      border-right: none;
    }

    :deep(.ant-tabs-tab:nth-child(odd)) {
      border-left: none;
    }
  }
}

.banner {
  background: linear-gradient(91deg, #ffe0c7 0%, #e1c1a6 59.16%, rgba(223, 193, 168, 0) 90.65%);
  @apply px-[25px];

  &__subtitle {
    @apply color-[#6C6463] mb-1 text-xs font-medium leading-3;
  }

  &__title {
    @apply color-[#322622] whitespace-pre-wrap text-lg font-bold leading-6;
  }
}

.container-onboard {
  background-image: url('@/assets/images/register-complete-bg.webp');
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100vh;
}
</style>
