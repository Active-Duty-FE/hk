<template>
  <div class="flex flex-col gap-5">
    <div class="info__row">
      <span class="info__label">Name</span>
      <span class="info__value">{{ userInfo.userName }}</span>
    </div>
    <div class="info__row">
      <span class="info__label">Email</span>
      <div class="inline-flex items-center gap-2">
        <a-form-item v-if="showEdit.email" name="email" class="!mb-0">
          <r-input v-model:value="userInfo.email" class="!h-8" />
        </a-form-item>
        <span v-else class="info__value">{{ userInfo.email }}</span>
        <img
          src="@/assets/svgs/icon-edit.svg?url"
          alt="edit-email"
          class="w-2.5 cursor-pointer"
          @click="() => (showEdit.email = true)"
        />
      </div>
    </div>
    <div class="info__row">
      <span class="info__label">Cell Phone</span>
      <div class="inline-flex items-center gap-2">
        <a-form-item v-if="showEdit.cellphone" name="mobileNumber" class="!mb-0">
          <r-input v-model:value="userInfo.mobileNumber" :maxlength="14" class="!h-8" />
        </a-form-item>

        <span v-else class="info__value">{{ formatPhoneNumber(userInfo.mobileNumber) }}</span>
        <img
          src="@/assets/svgs/icon-edit.svg?url"
          alt="edit-phone"
          class="w-2.5"
          @click="() => (showEdit.cellphone = true)"
        />
      </div>
    </div>
    <div class="info__col">
      <span class="info__label">Gender</span>
      <a-form-item name="gender" class="!mb-0 !mt-[10px]">
        <div class="custom-radio">
          <r-radio v-model:value="userInfo.gender" :options="GENDER_OPTIONS" />
        </div>
      </a-form-item>
    </div>
    <div class="info__col">
      <span class="info__label mb-2">Birthday</span>

      <div class="grid grid-cols-3 gap-2">
        <a-form-item class="form-item-custom !mb-0 w-[30%]" name="birthMonth">
          <r-select
            v-model:value="userInfo.birthMonth"
            :options="MONTH_OPTIONS"
            placeholder="Month"
          />
        </a-form-item>
        <a-form-item class="form-item-custom !mb-0 w-[30%]" name="birthDay">
          <r-select
            v-model:value="userInfo.birthDay"
            :options="populateDateDropdown(userInfo.birthYear, userInfo.birthMonth)"
            placeholder="Day"
          />
        </a-form-item>
        <a-form-item class="form-item-custom !mb-0 w-2/5" name="birthYear">
          <r-select
            v-model:value="userInfo.birthYear"
            :options="handleOptionsYear"
            placeholder="Year"
          />
        </a-form-item>
      </div>
      <span class="text-red-primary mt-2 text-[10px]">{{ messageErrorBirthDay }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import dayjs from 'dayjs'
import {
  BIRTH_BEAUTY_PLANER_YEAR,
  BIRTH_CUSTOMER_YEAR,
  GENDER_OPTIONS,
  MONTH_OPTIONS,
  CELLPHONE_LENGTH
} from '@/helpers/constant'
import { populateDateDropdown, populateYearDropdown } from '@/helpers/date'
import { isBeautyPlanner } from '@/utils/role'
import { useVModel } from '@vueuse/core'
import { formatPhoneNumber } from '@/utils/common'
import { REGEX_CELLPHONE } from '@/helpers/regex'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  messageErrorBirthDay: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['update:modelValue'])

const userInfo = useVModel(props, 'modelValue', emits)

const showEdit = reactive({
  email: false,
  cellphone: false
})

const handleOptionsYear = computed(() => {
  if (!isBeautyPlanner.value) {
    return populateYearDropdown(1900, dayjs().year() - BIRTH_CUSTOMER_YEAR)
  } else {
    return populateYearDropdown(1900, dayjs().year() - BIRTH_BEAUTY_PLANER_YEAR)
  }
})

watch([() => userInfo.value.mobileNumber], ([newVal]) => {
  if (!REGEX_CELLPHONE.test(newVal) && newVal.length === CELLPHONE_LENGTH) {
    userInfo.value.mobileNumber = formatPhoneNumber(newVal)
  }
})
</script>

<style lang="scss" scoped>
.info {
  &__row {
    @apply flex items-center justify-between;
  }

  &__col {
    @apply flex flex-col;

    > .info__label {
      @apply min-h-5 inline-flex items-center;
    }
  }

  &__label {
    @apply leading-base font-475 text-sm;
  }

  &__value {
    @apply leading-base text-xs font-normal;
  }
}

.form-item-custom {
  @apply w-full;
}

:deep(.ant-radio-group) {
  @apply mt-2.5 grid grid-cols-4;
}

:deep(.ant-radio-wrapper) {
  @apply m-0 flex flex-col items-center;

  &:after {
    @apply hidden;
  }
}

:deep(.ant-radio-inner) {
  border-color: #212121 !important;
  box-shadow: none !important;

  &::after {
    background-color: #04263f !important;
  }
}

:deep(span.ant-radio) {
  @apply mb-2.5;

  & + span {
    @apply leading-base px-0 text-xs font-normal;
  }

  &::after {
    border-color: #212121 !important;
  }
}
</style>
