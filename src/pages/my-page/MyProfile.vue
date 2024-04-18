<template>
  <div>
    <a-form ref="formRef" :model="pageState.userInfo" :rules="rules">
      <MyProfileInformation
        v-model="pageState.userInfo"
        :message-error-birth-day="pageState.messageErrorBirthDay"
      />

      <a-divider class="!bg-gray-10 !my-10" />

      <MyProfileReferral v-if="isBeautyPlanner" :user-info="pageState.userInfo" />

      <a-divider v-if="isBeautyPlanner" class="!bg-gray-10 !my-10" />

      <div class="flex flex-col">
        <span class="leading-base font-475 mb-4 text-sm">
          Consent to provide and receive information
        </span>

        <RCheckbox
          v-model:checked="pageState.receiveAll"
          class="!mb-3"
          @change="onChangeReceiveAll"
        >
          <span class="receive__all">Consent to receive marketing communications from RIMAN</span>
        </RCheckbox>

        <RCheckbox
          v-model:checked="pageState.userInfo.isEmailMarketingAgreement"
          class="!mb-2.5"
          @change="onChangeReceiveItem"
        >
          <span class="receive__item">E-Mail</span>
        </RCheckbox>

        <RCheckbox
          v-model:checked="pageState.userInfo.isSmsMarketingAgreement"
          @change="onChangeReceiveItem"
        >
          <span class="receive__item">SMS(Message and data rates may apply)</span>
        </RCheckbox>
      </div>

      <div class="mt-7.5 mx-auto grid w-full max-w-[350px] grid-cols-2 gap-1">
        <RButton
          title="Cancel"
          class-title="font-550 text-navy-6 text-sm"
          class="!border-navy-6 w-full"
          type="reset"
        />

        <RButton
          title="Save"
          class-title="font-550 text-white text-sm"
          class="!border-navy-6 !bg-navy-6 w-full"
          @click="onUpdateProfile"
        />
      </div>
    </a-form>

    <div class="changePassword" @click="goToChangePassword">
      <span class="font-475 leading-base text-gray-10 text-lg">Change Password</span>
      <img src="@/assets/svgs/arrow-right.svg?url" alt="" class="w-4.5" />
    </div>

    <span class="withdrawal" @click="goToWithdrawal">Withdrawal</span>
  </div>
</template>

<script setup>
import MyProfileInformation from '@/pages/my-page/MyProfileInformation.vue'
import { onBeforeMount, reactive, ref, watch } from 'vue'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { useNotification } from '@/composables/notification'
import { isBeautyPlanner } from '@/utils/role'
import { VALIDATE_MESSAGE } from '@/helpers/validate-message'
import { REGEX_START_BINARY } from '@/helpers/regex'
import { formatCellphoneToSend, isValidDate, checkAgeOfUser } from '@/utils/common'
import { validateRequired } from '@/helpers/handle-validate'
import { BIRTH_CUSTOMER_YEAR, BIRTH_BEAUTY_PLANER_YEAR } from '@/helpers/constant'

const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading
const { showNotification } = useNotification()
const router = useRouter()

const pageState = reactive({
  receiveAll: false,
  receiveEmail: false,
  receiveSMS: false,
  userInfo: {},
  messageErrorBirthDay: '',
  defaultData: {}
})

const formRef = ref()

onBeforeMount(() => {
  fetchData()
})

const validateCellphone = async (_rule, value) => {
  if (isBeautyPlanner.value && !value) {
    return Promise.reject(VALIDATE_MESSAGE.cellPhoneRequired)
  }
  if (!REGEX_START_BINARY.test(formatCellphoneToSend(value)[0])) {
    return Promise.reject(VALIDATE_MESSAGE.startBinary)
  } else {
    return Promise.resolve()
  }
}

const rules = reactive({
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
  mobileNumber: [{ validator: validateCellphone, trigger: 'change' }],
  birthMonth: [
    {
      validator: validateRequired,
      trigger: 'change'
    }
  ],
  birthDay: [
    {
      validator: validateRequired,
      trigger: 'change'
    }
  ],
  birthYear: [
    {
      validator: validateRequired,
      trigger: 'change'
    }
  ]
})

const fetchData = async () => {
  showGlobalLoading(true)
  const { data, success } = await apiService.myPageService.getProfile()
  if (success) {
    parseDataResponse(data)
  } else {
    pageState.userInfo = {}
  }
  showGlobalLoading(false)
}

const parseDataResponse = (data) => {
  pageState.userInfo = { ...data }
  const [birthYear, birthMonth, birthDay] = data.birthDate.split('-')
  pageState.userInfo.birthYear = birthYear
  pageState.userInfo.birthMonth = birthMonth
  pageState.userInfo.birthDay = birthDay
  onChangeReceiveItem()
}

const onChangeReceiveItem = () => {
  pageState.receiveAll =
    pageState.userInfo.isEmailMarketingAgreement || pageState.userInfo.isSmsMarketingAgreement
}

const onChangeReceiveAll = (event) => {
  const { checked } = event.target
  pageState.userInfo.isEmailMarketingAgreement = checked
  pageState.userInfo.isSmsMarketingAgreement = checked
}

watch(
  () => [pageState.userInfo.birthDay, pageState.userInfo.birthMonth, pageState.userInfo.birthYear],
  (data) => {
    const [day, month, year] = data
    if (day && month) {
      if (!isValidDate(1900, month, day)) {
        pageState.userInfo.birthDay = null
      }
    }
    if (day && month && year) {
      if (!isBeautyPlanner.value && !checkAgeOfUser(year, month, day, BIRTH_CUSTOMER_YEAR)) {
        pageState.messageErrorBirthDay = VALIDATE_MESSAGE.customerAge
      } else if (
        isBeautyPlanner.value &&
        !checkAgeOfUser(year, month, day, BIRTH_BEAUTY_PLANER_YEAR)
      ) {
        pageState.messageErrorBirthDay = VALIDATE_MESSAGE.beautyAge
      } else {
        pageState.messageErrorBirthDay = ''
      }
    }
  }
)

const onUpdateProfile = async () => {
  if (pageState.messageErrorBirthDay) return
  formRef.value.validateFields('').then(async (values) => {
    try {
      showGlobalLoading(true)
      const payload = {
        email: pageState.userInfo.email,
        birthDate: [
          Number(pageState.userInfo.birthYear),
          Number(pageState.userInfo.birthMonth),
          Number(pageState.userInfo.birthDay)
        ],
        mobileNumber: formatCellphoneToSend(pageState.userInfo.mobileNumber),
        agreements: [
          {
            termId: isBeautyPlanner.value ? 5 : 10,
            termType: 'MAKETING_INFORMATION',
            termVersion: 1.0,
            agree: pageState.userInfo.isEmailMarketingAgreement
          },
          {
            termId: isBeautyPlanner.value ? 6 : 11,
            termType: 'MAKETING_INFORMATION',
            termVersion: 1.0,
            agree: pageState.userInfo.isSmsMarketingAgreement
          }
        ],
        gender: pageState.userInfo.gender
      }

      const { success, message } = await apiService.myPageService.updateProfile(payload)
      showGlobalLoading(false)
      if (success) {
        showNotification({ type: 'success', message: 'Updated Profile successfully!' })
      } else {
        showNotification({ type: 'error', message })
      }
    } catch {
      showGlobalLoading(false)
    }
  })
}

const goToChangePassword = () => {
  router.push({ name: AppRoutes.myPage.changePassword.name })
}

const goToWithdrawal = () => {
  router.push({ name: AppRoutes.myPage.withdrawal.name })
}
</script>

<style lang="scss" scoped>
.receive {
  &__all {
    @apply text-gray-10 leading-base text-sm font-normal -tracking-[0.28px];
  }

  &__item {
    @apply leading-base text-gray-14 text-xs font-normal;
  }
}

.ant-checkbox-wrapper {
  @apply items-start;
}

.changePassword {
  @apply border-t-1 border-b-1  border-t-solid border-b-solid border-gray-14;
  @apply mt-12.5 h-15 flex cursor-pointer items-center justify-between;
}

.withdrawal {
  @apply leading-base my-6 inline-block cursor-pointer text-xs font-normal underline;
}
</style>
