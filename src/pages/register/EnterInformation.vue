<template>
  <div class="md:(flex justify-center) mx-auto items-center pb-20 pt-[115px] md:pt-20">
    <a-form
      ref="formRef"
      class="sm:(w-[600px]) md:(w-[500px]) !mx-auto bg-white"
      :model="formState"
      :rules="rules"
      @finish="onSubmit"
    >
      <r-sub-navigation
        class="z-10 w-full bg-white"
        title="Sign Up"
        :is-hide-back-icon="false"
        @click="router.back()"
      />

      <div class="p-5 md:mb-0">
        <r-heading
          class-title="text-xl !whitespace-normal"
          :title="$t('auth.sign_up.enter_information.please_enter')"
        />
        <div class="mb-10 mt-5 flex justify-end">
          <r-step
            :total-step="checkRoleAvailable([AuthUserEnum.CONSUMER]) ? 3 : 4"
            :model-value="2"
          />
        </div>

        <r-label :title="$t('common.country')" :required="true" />
        <a-form-item name="country" class="!mt-[10px] mb-[30px]">
          <r-select
            v-model:value="formState.country"
            :options="COUNTRY_OPTIONS"
            :placeholder="$t('auth.sign_up.enter_information.select_country')"
          />
        </a-form-item>
        <r-label :title="$t('common.name')" :required="true" />
        <a-form-item name="firstName" class="!mb-2 !mt-[10px]">
          <r-input
            v-model:value="formState.firstName"
            :disabled="disableFirstNameField"
            :placeholder="$t('common.first_name')"
          />
        </a-form-item>
        <a-form-item name="lastName" class="!mb-[30px]">
          <r-input
            v-model:value="formState.lastName"
            :disabled="disableLastNameField"
            :placeholder="$t('common.last_name')"
          />
        </a-form-item>
        <r-label :title="$t('common.personal_id')" :required="true" />
        <a-form-item name="personalId" class="!mb-2 !mb-4 !mt-[10px]">
          <r-input v-model:value="formState.personalId" :placeholder="$t('common.personal_id')" />
        </a-form-item>

        <!-- email -->
        <r-label :title="$t('common.email_1')" :required="true" />

        <a-form-item name="email" class="!mb-2 !mt-[10px]">
          <r-input
            v-model:value="formState.email"
            placeholder="abc@abc.abcd"
            :auto-complete="'new-email'"
            :disabled="disabledVerify"
          />
        </a-form-item>

        <!-- CellPhone -->

        <div class="mt-[30px]">
          <r-label :title="$t('common.cell_phone')" :required="true" />
          <a-form-item name="cellphone" class="form-item-custom">
            <r-input
              v-model:value="formState.cellphone"
              :maxlength="9"
              :placeholder="$t('auth.sign_up.enter_information.cell_phone_number')"
            />
          </a-form-item>
        </div>

        <!-- Password -->
        <r-label :title="$t('common.password')" :required="true" />
        <a-form-item name="password" class="!mb-2 !mt-[10px]">
          <r-input-password v-model:value="formState.password" :maxlength="16" />
        </a-form-item>
        <p v-if="REGEX_PASSWORD.test(formState.password)" class="text-blue-1100 text-[10px]">
          {{ PASSWORD_MESSAGE.passwordStrong }}
        </p>
        <p class="text-gray-13 text-[10px]">
          {{ $t('auth.sign_up.enter_information.warning_content_password') }}
        </p>
        <p class="text-gray-13 mb-[30px] text-[10px]">
          {{ $t('auth.sign_up.enter_information.warning_content') }}
        </p>

        <r-label :title="$t('auth.sign_up.enter_information.confirm_password')" :required="true" />
        <a-form-item name="passwordConfirm" class="!mb-2 !mt-[10px]">
          <r-input-password
            v-model:value="formState.passwordConfirm"
            :placeholder="$t('auth.sign_up.enter_information.re_enter_password')"
            :maxlength="16"
          />
        </a-form-item>
        <p
          v-if="formState.passwordConfirm && formState.passwordConfirm === formState.password"
          class="text-blue-1100 text-[10px]"
        >
          {{ PASSWORD_MESSAGE.bothPassMatch }}
        </p>
        <!-- Gender -->
        <div v-if="checkRoleAvailable(consumerAndPlanner)" class="mt-[30px]">
          <r-label :title="$t('common.gender')" />
          <a-form-item name="gender" class="!mb-0 !mt-[10px]">
            <div class="custom-radio">
              <r-radio v-model:value="formState.gender" :options="GENDER_OPTIONS" />
            </div>
          </a-form-item>
        </div>
        <!-- birthday -->
        <r-label :title="$t('common.birthday')" :required="true" />
        <div class="flex gap-2">
          <a-form-item class="form-item-custom !mb-0 w-[30%]" name="birthMonth">
            <r-select
              v-model:value="formState.birthMonth"
              :options="MONTH_OPTIONS"
              :placeholder="$t('common.month')"
            />
          </a-form-item>
          <a-form-item class="form-item-custom !mb-0 w-[30%]" name="birthDay">
            <r-select
              v-model:value="formState.birthDay"
              :options="populateDateDropdown(formState.birthYear, formState.birthMonth)"
              :placeholder="$t('common.day')"
            />
          </a-form-item>
          <a-form-item class="form-item-custom !mb-0 w-2/5" name="birthYear">
            <r-select
              v-model:value="formState.birthYear"
              :options="handleOptionsYear"
              :placeholder="$t('common.year')"
            />
          </a-form-item>
        </div>
        <span class="text-red-primary text-[10px]">{{ messageErrorBirthDay }}</span>

        <div class="hidden w-full pb-8 pt-10 md:block">
          <r-button
            class-title="text-white"
            :title="$t('common.next')"
            class="!bg-navy-1 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full"
            html-type="submit"
            :disabled="!isValid || !canEnableNext"
          />
        </div>
      </div>
      <div class="fixed bottom-0 left-0 w-full md:hidden">
        <div class="flex justify-center bg-white px-5 pb-3">
          <r-button
            class-title="text-white"
            title="Next"
            class="!bg-navy-6 !border-navy-6 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full"
            html-type="submit"
            :disabled="!isValid || !canEnableNext"
          />
        </div>
      </div>
    </a-form>
  </div>
  <modal-verify-mail
    :visible="statusVerify.mail"
    :on-cancel="() => (statusVerify.mail = false)"
    :main-content="statusVerify.textMailFail"
  />

  <RModalAlert
    v-model:visible="statusVerify.codeMail"
    :width="270"
    :text-btn="$t('common.check')"
    @confirm="() => (statusVerify.codeMail = false)"
  >
    <template #extraDescription>
      <div class="text-center">
        <p class="font-bold">{{ $t('common.alarm') }}</p>
        <p>{{ statusVerify.textCodeMail }}</p>
      </div>
    </template>
  </RModalAlert>
  <RModalAlert
    v-model:visible="resultVerify.isShowModalResult"
    :text-btn="$t('common.confirm')"
    :description="resultVerify.descriptionVerify"
    :width="300"
    @confirm="resultVerify.isShowModalResult = false"
  />
</template>
<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import {
  BIRTH_BEAUTY_PLANER_YEAR,
  BIRTH_CUSTOMER_YEAR,
  CELLPHONE_LENGTH,
  COUNTRY_OPTIONS,
  GENDER_OPTIONS,
  MONTH_OPTIONS,
  NO_SNS,
  STORAGE_CURRENT_STEP,
  STORAGE_ENTER_INFORMATION,
  STORAGE_SNS_DATA,
  STORAGE_USER_TYPE
} from '@/helpers/constant'
import { AuthUserEnum, UserStatusEnum } from '@/helpers/enum'
import { populateDateDropdown, populateYearDropdown } from '@/helpers/date'
import { REGEX_CELLPHONE_HK, REGEX_NAME, REGEX_PASSWORD, REGEX_START_BINARY } from '@/helpers/regex'
import { PASSWORD_MESSAGE, VALIDATE_MESSAGE } from '@/helpers/validate-message'
import { validateInputName, validatePassword, validateRequired } from '@/helpers/handle-validate'
import { storage } from '@/utils/storage'
import {
  checkAgeOfUser,
  formatCellphoneToSend,
  formatNumberPhoneHk,
  isValidDate,
  removeCharacterString
} from '@/utils/common'
import { useRouter } from 'vue-router'
import useValidate from '@/composables/validate'
import apiService from '@/http/api'
import { useNotification } from '@/composables/notification'
import { AppRoutes } from '@/router/path'
import dayjs from 'dayjs'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useI18n } from 'vue-i18n'
import RSubNavigation from '@/components/navigation/RSubNavigation.vue'
import RHeading from '@/components/common/RHeading.vue'
import RStep from '@/components/common/RStep.vue'
import RLabel from '@/components/common/RLabel.vue'
import RSelect from '@/components/common/RSelect.vue'
import RInput from '@/components/common/RInput.vue'
import RInputPassword from '@/components/common/RInputPassword.vue'
import RRadio from '@/components/common/RRadio.vue'
import RButton from '@/components/common/RButton.vue'
import ModalVerifyMail from '@/components/app/enter-information/ModalVerifyMail.vue'
import RModalAlert from '@/components/common/RModalAlert.vue'

const { t } = useI18n()
const router = useRouter()
const consumerAndPlanner = [AuthUserEnum.CONSUMER, AuthUserEnum.PLANNER]
const dataSns = storage.get(STORAGE_SNS_DATA)
const dataEnterInfoStorage = storage.get(STORAGE_ENTER_INFORMATION)
const dataUserType = storage.get(STORAGE_USER_TYPE)
const formRef = ref()

const { showNotification } = useNotification()
const loadingStore = useGlobalLoadingStore()
const { showGlobalLoading } = loadingStore

const statusVerify = reactive({
  mail: false,
  codeMail: false,
  textMailFail: '',
  textCodeMail: ''
})

const resultVerify = reactive({
  isShowModalResult: false,
  descriptionVerify: '',
  validateStatusSsn: ''
})

const formState = reactive({
  country: null,
  personalId: '',
  firstName: '',
  lastName: '',
  companyName: '',
  email: '',
  code: '',
  cellphone: '',
  password: '',
  passwordConfirm: '',
  gender: 'MALE',
  birthDay: null,
  birthMonth: null,
  birthYear: null,
  ssn: '',
  match: true,
  certifyNumber: false,
  token: ''
})
const messageErrorSsn = ref('')
const messageErrorBirthDay = ref('')

watch(
  () => formState.cellphone,
  () => {
    formState.cellphone = removeCharacterString(formState.cellphone)
    if (
      !REGEX_CELLPHONE_HK.test(formState.cellphone) &&
      formState.cellphone.length === CELLPHONE_LENGTH
    ) {
      formState.cellphone = formatNumberPhoneHk(formState.cellphone)
    }
  }
)

const canEnableNext = ref(true)
watch(
  () => formState.birthYear,
  () => {
    if (formState.birthDay === '29' && formState.birthMonth === '02') {
      formState.birthDay = null
    }
  }
)
watch(
  () => [formState.birthDay, formState.birthMonth, formState.birthYear],
  (data) => {
    const [day, month, year] = data
    if (day && month && !(day === '29' && month === '02') && !isValidDate(1900, month, day)) {
      canEnableNext.value = false
      formState.birthDay = null
      return
    }

    if (day && month && year) {
      let ageRequirement = null
      let errorMessage = ''

      if ([AuthUserEnum.CONSUMER].includes(dataUserType?.userType)) {
        ageRequirement = BIRTH_CUSTOMER_YEAR
        errorMessage = t('auth.sign_up.enter_information.registration_18')
      } else if ([AuthUserEnum.PLANNER, AuthUserEnum.CO_OPERATE].includes(dataUserType?.userType)) {
        ageRequirement = BIRTH_BEAUTY_PLANER_YEAR
        errorMessage = t('auth.sign_up.enter_information.registration_18')
      }

      if (ageRequirement && !checkAgeOfUser(year, month, day, ageRequirement)) {
        canEnableNext.value = false
        messageErrorBirthDay.value = errorMessage
      } else {
        canEnableNext.value = true
        messageErrorBirthDay.value = ''
      }
    }
  }
)
onMounted(() => {
  if (dataSns) {
    formatSnsUserInfo(dataSns.snsUser)
    if (dataSns.snsUser.email && checkRoleAvailable([AuthUserEnum.CONSUMER])) formState.match = true
  }
  if (dataEnterInfoStorage) {
    Object.assign(formState, dataEnterInfoStorage)
  }
})

const formatSnsUserInfo = (dataSnsUser) => {
  const { email, familyName, givenName, birthday, gender } = dataSnsUser
  const arrayBirth = birthday?.split('/') || []
  Object.assign(formState, {
    email,
    firstName: REGEX_NAME.test(givenName) ? givenName : '',
    lastName: REGEX_NAME.test(familyName) ? familyName : '',
    birthDay: arrayBirth[1] < 10 ? `0${+arrayBirth[1]}` : arrayBirth[1] || null,
    birthMonth: arrayBirth[0] < 10 ? `0${+arrayBirth[0]}` : arrayBirth[0] || null,
    birthYear: arrayBirth[2] || null,
    gender: gender ? gender.toUpperCase() : 'MALE'
  })
}

const disabledVerify = computed(() => {
  return !!dataSns?.snsUser?.email
})

const disableFirstNameField = computed(() => {
  return !!(dataSns?.snsUser?.givenName && REGEX_NAME.test(dataSns?.snsUser?.givenName))
})

const disableLastNameField = computed(() => {
  return !!(dataSns?.snsUser?.familyName && REGEX_NAME.test(dataSns?.snsUser?.familyName))
})

const validatePasswordConfirm = async (_rule, value) => {
  if (!value) {
    return Promise.reject(
      `${VALIDATE_MESSAGE.required} ${t('auth.sign_up.enter_information.registration_18')}`
    )
  } else if (value !== formState.password) {
    return Promise.reject(VALIDATE_MESSAGE.notPasswordMatch)
  } else {
    return Promise.resolve()
  }
}

const handleStatusSsn = (status = 'error') => {
  resultVerify.validateStatusSsn = status
}

const validatePersonalId = async (_rule, value) => {
  if (!value) {
    return Promise.reject(VALIDATE_MESSAGE.personal_required)
  }
}

const validateRequiredGender = async (_rule, value) => {
  if (!checkRoleAvailable([AuthUserEnum.CO_OPERATE])) {
    if (!value) {
      return Promise.reject(`${VALIDATE_MESSAGE.required} ${_rule.field}`)
    }
  }
  return Promise.resolve()
}

const validateCellphone = async (_rule, value) => {
  const valueFormat = removeCharacterString(value)
  if (!valueFormat) {
    return Promise.reject(VALIDATE_MESSAGE.cellPhoneRequired)
  }
  if (!REGEX_START_BINARY.test(valueFormat)) {
    return Promise.reject(VALIDATE_MESSAGE.startBinary)
  }
  if (
    valueFormat.replace(/\s/g, '').length !== CELLPHONE_LENGTH &&
    !REGEX_CELLPHONE_HK.test(valueFormat)
  ) {
    return Promise.reject(VALIDATE_MESSAGE.invalidCellPhoneHk)
  }
  return Promise.resolve()
}

const rules = reactive({
  firstName: [{ validator: validateInputName, trigger: 'change' }],
  lastName: [{ validator: validateInputName, trigger: 'change' }],
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
  cellphone: [{ validator: validateCellphone, trigger: 'change' }],

  password: [{ validator: validatePassword, trigger: 'change' }],
  passwordConfirm: [{ validator: validatePasswordConfirm, trigger: 'change' }],
  gender: [
    {
      validator: validateRequiredGender,
      trigger: 'change'
    }
  ],
  personalId: [
    {
      validator: validatePersonalId,
      trigger: 'change'
    }
  ],
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
  ],
  match: [
    {
      validator: validateRequired,
      trigger: 'change'
    }
  ],
  country: [{ validator: validateRequired, trigger: 'change' }]
})

const isValid = useValidate(formState, rules)

const handleOptionsYear = computed(() => {
  if ([AuthUserEnum.CONSUMER].includes(dataUserType?.userType)) {
    return populateYearDropdown(1900, dayjs().year() - BIRTH_CUSTOMER_YEAR)
  } else {
    return populateYearDropdown(1900, dayjs().year() - BIRTH_BEAUTY_PLANER_YEAR)
  }
})

const checkRoleAvailable = (listRoles) => {
  return listRoles.includes(dataUserType?.userType)
}

const rulesRoutePush = computed(() => {
  return dataUserType?.userType === AuthUserEnum.CONSUMER
    ? `${AppRoutes.register.path}/${AppRoutes.register.agreeTerm.path}`
    : `${AppRoutes.register.path}/${AppRoutes.register.enterShipping.path}`
})

const handleTransitRoute = () => {
  storage.set(STORAGE_ENTER_INFORMATION, formState)
  router.push(rulesRoutePush.value)
  storage.set(STORAGE_CURRENT_STEP, [...storage.get(STORAGE_CURRENT_STEP), rulesRoutePush.value])
}

const finallyToNextStep = (data) => {
  messageErrorSsn.value = ''
  handleStatusSsn('')
  if (!messageErrorBirthDay.value) {
    data ? handleTransitRoute() : showNotification({ type: 'error', message: t('message.error_1') })
  }
}

const handleSubmitWhenAllPass = async (data) => {
  finallyToNextStep(data)
}

const checkExistUser = async (data) => {
  try {
    showGlobalLoading(true)
    return await apiService.authService.checkExistUser(data)
  } finally {
    showGlobalLoading(false)
  }
}

const onSubmit = async (values) => {
  showGlobalLoading(true)
  const { email } = values
  try {
    const response = await checkExistUser({
      email,
      serviceType: NO_SNS,
      tokenSocial: null
    })
    if (!response?.data?.duplicate) {
      handleSubmitWhenAllPass(true)
    } else {
      if (response.data?.userStatus?.code === UserStatusEnum.WITHDRAWAL) {
        resultVerify.isShowModalResult = true
        resultVerify.descriptionVerify = VALIDATE_MESSAGE.withdrawalMess
      } else {
        statusVerify.mail = true
        statusVerify.textMailFail = t('auth.sign_up.enter_information.registered_email', {
          email: email
        })
      }
    }
  } catch (error) {
    console.log(error)
  } finally {
    showGlobalLoading(false)
  }
}
</script>
<style lang="scss" scoped>
.custom-radio {
  :deep(.ant-radio-checked) {
    .ant-radio-inner {
      @apply border-navy-deep;
    }

    .ant-radio-inner:after {
      @apply bg-navy-deep;
    }
  }

  :deep(.ant-radio-group) {
    @apply flex justify-between;
  }

  :deep(.ant-radio-wrapper) {
    @apply flex w-fit flex-col items-center justify-start gap-[10px];

    span {
      @apply text-xs font-normal;
    }
  }
}

.form-item-custom {
  @apply mb-[30px] mt-[10px];
}
</style>
