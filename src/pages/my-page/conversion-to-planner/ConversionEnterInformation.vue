<template>
  <a-form ref="formRef" :model="formState" :rules="rules" @finish="onSubmit">
    <r-heading :title="'Please enter the necessary information when converting to a planner'" />
    <div class="mb-10 mt-5 flex justify-end">
      <r-step v-model="pageState.step" :total-step="4" />
    </div>
    <template v-if="isCompany">
      <r-label title="Company Name" :required="true" />
      <a-form-item name="companyName">
        <r-input
          v-model:value="formState.companyName"
          placeholder="Please enter your company name"
        />
      </a-form-item>
    </template>

    <r-label title="Cell Phone" :required="true" />
    <a-form-item name="cellphone">
      <r-input
        v-model:value="formState.cellphone"
        :maxlength="14"
        placeholder="Cell Phone Number"
      />
    </a-form-item>

    <r-label :title="isCompany ? 'Birthday of CEO' : 'Birthday'" :required="true" />
    <div class="flex gap-2">
      <a-form-item class="form-item-custom !mb-0 w-[30%]" name="birthMonth">
        <r-select
          v-model:value="formState.birthMonth"
          :options="MONTH_OPTIONS"
          placeholder="Month"
        />
      </a-form-item>
      <a-form-item class="form-item-custom !mb-0 w-[30%]" name="birthDay">
        <r-select
          v-model:value="formState.birthDay"
          :options="populateDateDropdown(formState.birthYear, formState.birthMonth)"
          placeholder="Day"
        />
      </a-form-item>
      <a-form-item class="form-item-custom !mb-0 w-2/5" name="birthYear">
        <r-select
          v-model:value="formState.birthYear"
          :options="handleOptionsYear"
          placeholder="Year"
        />
      </a-form-item>
    </div>
    <span class="text-red-primary text-[10px]">{{ pageState.messageErrorBirthDay }}</span>
    <template v-if="checkShowSsn">
      <div class="mt-[30px]">
        <r-label title="SSN (US)" :required="true" />
        <span class="text-red-primary font-475 text-sm">(For Tax Purposes)</span>
      </div>
      <a-form-item
        name="ssn"
        class="form-item-custom !mb-2"
        :validate-status="pageState.validateStatusSsn"
      >
        <r-input
          v-model:value="formState.ssn"
          :maxlength="9"
          placeholder="Enter 9 digits numbers only"
        />
      </a-form-item>
      <span class="text-red-primary text-[10px]">{{ pageState.messageErrorSsn }}</span>
    </template>

    <div class="fixed bottom-0 left-0 w-full">
      <div class="flex justify-center bg-white px-5 pb-10">
        <r-button
          class-title="text-white"
          title="Next"
          class="!bg-navy-6 !border-navy-6 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full !max-w-[1200px] !shadow-none"
          html-type="submit"
          :disabled="!(isValid && !pageState.messageErrorBirthDay)"
        />
      </div>
    </div>
  </a-form>
</template>
<script setup>
import { reactive, computed, watch, onMounted } from 'vue'
import { validateRequired } from '@/helpers/handle-validate'
import { populateYearDropdown, populateDateDropdown } from '@/helpers/date'
import dayjs from 'dayjs'
import {
  MONTH_OPTIONS,
  BIRTH_BEAUTY_PLANER_YEAR,
  CELLPHONE_LENGTH,
  CONVERSION_ENTER_INFORMATION,
  VALUE_COUNTRY,
  ROLES_BE,
  ROLE_CONVERSION
} from '@/helpers/constant'
import { VALIDATE_MESSAGE } from '@/helpers/validate-message'
import { REGEX_CELLPHONE, REGEX_START_BINARY, ONLY_NUMBER } from '@/helpers/regex'
import {
  formatPhoneNumber,
  isValidDate,
  checkAgeOfUser,
  formatCellphoneToSend
} from '@/utils/common'
import useValidate from '@/composables/validate'
import { storage } from '@/utils/storage'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { storeToRefs } from 'pinia'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import apiService from '@/http/api'

const dataEnterInfoStorage = storage.get(CONVERSION_ENTER_INFORMATION)
const authUserStore = useAuthUserStore()

const { currentAuthUser, infoUserToConvert } = storeToRefs(authUserStore)
const { showGlobalLoading } = useGlobalLoadingStore()

const router = useRouter()
const pageState = reactive({
  step: 2,
  messageErrorBirthDay: '',
  messageErrorSsn: '',
  validateStatusSsn: ''
})

const formState = reactive({
  cellphone: '',
  birthDay: null,
  birthMonth: null,
  birthYear: null,
  companyName: '',
  ssn: ''
})

const isCompany = computed(() => {
  return storage.get(ROLE_CONVERSION) === ROLES_BE.corporation
})

onMounted(() => {
  if (dataEnterInfoStorage) {
    Object.assign(formState, dataEnterInfoStorage)
  }
})

watch([() => formState.ssn], () => {
  pageState.messageErrorSsn = ''
})

watch(
  () => infoUserToConvert.value,
  (val) => {
    if (val?.birthDate) {
      const [birthYear, birthMonth, birthDay] = val.birthDate.split('-')
      formState.birthYear = birthYear
      formState.birthMonth = birthMonth
      formState.birthDay = birthDay
    }
    if (val?.phoneNumber) {
      if (!REGEX_CELLPHONE.test(val.phoneNumber) && val.phoneNumber.length === CELLPHONE_LENGTH) {
        formState.cellphone = formatPhoneNumber(val.phoneNumber)
      }
    }
  },
  {
    immediate: true,
    deep: true
  }
)

const handlePassValid = () => {
  handleStatusSsn('success')
  pageState.messageErrorSsn = ''
  if (!pageState.messageErrorBirthDay) {
    storage.set(CONVERSION_ENTER_INFORMATION, formState)
    router.push(AppRoutes.myPage.conversionShipping.path)
  }
}
const handleStatusSsn = (status = 'error') => {
  pageState.validateStatusSsn = status
}

const onSubmit = async () => {
  if (checkShowSsn.value) {
    try {
      showGlobalLoading(true)
      const response = await apiService.authService.checkSsnNumber({
        identityNumber: formState.ssn,
        country: currentAuthUser.value?.nationalCode
      })
      if (response.data) {
        handlePassValid()
      } else {
        handleStatusSsn()
        pageState.messageErrorSsn = VALIDATE_MESSAGE.sameSsn
      }
    } finally {
      showGlobalLoading(false)
    }
  } else {
    handlePassValid()
  }
}

watch([() => formState.cellphone], ([newVal]) => {
  if (!REGEX_CELLPHONE.test(newVal) && newVal.length === CELLPHONE_LENGTH) {
    formState.cellphone = formatPhoneNumber(newVal)
  }
})

watch(
  () => [formState.birthDay, formState.birthMonth, formState.birthYear],
  (data) => {
    const [day, month, year] = data
    if (day && month) {
      if (!isValidDate(1900, month, day)) {
        pageState.canEnableNext = false
        formState.birthDay = null
      }
    }
    if (day && month && year) {
      if (!checkAgeOfUser(year, month, day, BIRTH_BEAUTY_PLANER_YEAR)) {
        pageState.messageErrorBirthDay = VALIDATE_MESSAGE.beautyAge
      } else {
        pageState.canEnableNext = true
        pageState.messageErrorBirthDay = ''
      }
    }
  }
)

const validateCompanyName = async (_rule, value) => {
  if (isCompany.value && !value) {
    return Promise.reject(`${VALIDATE_MESSAGE.required} ${_rule.field}`)
  }
  return Promise.resolve()
}

const validateCellphone = async (_rule, value) => {
  if (!value) {
    return Promise.reject(VALIDATE_MESSAGE.cellPhoneRequired)
  } else if (!REGEX_START_BINARY.test(formatCellphoneToSend(value)[0])) {
    return Promise.reject(VALIDATE_MESSAGE.startBinary)
  } else {
    return Promise.resolve()
  }
}

const checkShowSsn = computed(() => {
  return !isCompany.value && currentAuthUser.value?.nationalCode === VALUE_COUNTRY.US
})

const validateSsn = async (_rule, value) => {
  if (checkShowSsn.value) {
    if (!value) {
      return Promise.reject(VALIDATE_MESSAGE.blankSsn)
    } else if (!ONLY_NUMBER.test(value)) {
      handleStatusSsn()

      return Promise.reject(VALIDATE_MESSAGE.onlyNumber)
    } else if (value.length < 9) {
      handleStatusSsn()
      return Promise.reject(VALIDATE_MESSAGE.equals9)
    }
    handleStatusSsn('success')
    return Promise.resolve()
  }
  handleStatusSsn('success')
  return Promise.resolve()
}

const rules = reactive({
  cellphone: [{ validator: validateCellphone, trigger: 'change' }],
  companyName: [{ validator: validateCompanyName, trigger: 'change' }],

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
  ssn: [
    {
      validator: validateSsn,
      trigger: 'change'
    }
  ]
})

const isValid = useValidate(formState, rules)

const handleOptionsYear = computed(() => {
  return populateYearDropdown(1900, dayjs().year() - BIRTH_BEAUTY_PLANER_YEAR)
})
</script>
