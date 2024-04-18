<template>
  <a-form ref="formRef" :model="formState" :rules="rules">
    <div :class="checkParentRouteIsCreateCard ? 'p-0' : 'p-5'">
      <r-label title="Credit Card" :required="!checkParentRouteIsCreateCard" />
      <a-form-item name="cardFirstName" class="form-item-group !mt-5">
        <r-input v-model:value="formState.cardFirstName" placeholder="First Name *" />
      </a-form-item>
      <a-form-item name="cardLastName" class="form-item-group">
        <r-input v-model:value="formState.cardLastName" placeholder="Last Name *" />
      </a-form-item>
      <a-form-item name="cardNumber" class="form-item-group">
        <r-input v-model:value="formState.cardNumber" placeholder="Card Number *" :maxlength="19" />
      </a-form-item>

      <div class="flex gap-[5px]">
        <a-form-item name="expiredMonth" class="form-item-group">
          <r-input
            v-model:value="formState.expiredMonth"
            :maxlength="2"
            placeholder="Expiration Date (MM) *"
          />
        </a-form-item>
        <a-form-item name="expiredYear" class="form-item-group">
          <r-input
            v-model:value="formState.expiredYear"
            :maxlength="2"
            placeholder="Expiration Date (YY) *"
          />
        </a-form-item>
      </div>
      <span class="text-red-2 text-[10px]">{{ validateMessageExpired }}</span>

      <a-form-item name="cardCvc" class="!mb-0">
        <r-input v-model:value="formState.cardCvc" placeholder="CVC *" :maxlength="lengthCvc" />
      </a-form-item>

      <template v-if="checkParentRouteIsCreateCard">
        <a-form-item name="defaultCard" class="form-item-custom !mt-[25px]">
          <CartCheckBox
            v-model:checked="formState.defaultCard"
            :size="SIZE_CHECKBOX.SMALL"
            @checked-change="() => (formState.defaultCard = !formState.defaultCard)"
          >
            <template #content>
              <span class="ml-2"> Make this my default Credit Card</span>
            </template>
          </CartCheckBox>
        </a-form-item>
        <a-form-item name="agreeInfoCard" class="form-item-custom">
          <CartCheckBox
            v-model:checked="formState.agreeInfoCard"
            :size="SIZE_CHECKBOX.SMALL"
            @checked-change="() => (formState.agreeInfoCard = !formState.agreeInfoCard)"
          >
            <template #content>
              <span class="ml-2"> I agree to save my card information</span>
            </template>
          </CartCheckBox>
        </a-form-item>
      </template>

      <a-divider class="bg-gray-11 my-[30px]" />
      <div :class="{ 'mb-[25px]': checkParentRouteIsCreateCard }">
        <r-label :title="'Billing Address'" />
      </div>
      <a-form-item v-if="!checkParentRouteIsCreateCard" name="billingOptions">
        <div class="custom-radio">
          <r-radio v-model:value="formState.billingOptions" :options="BILLING_OPTIONS" />
        </div>
      </a-form-item>
      <a-form-item name="billCountry" class="form-item-group">
        <r-select
          v-model:value="formState.billCountry"
          placeholder="Country *"
          :options="COUNTRY_OPTIONS"
          :disabled="disabledBillAddress"
        />
      </a-form-item>
      <a-form-item name="billFirstName" class="form-item-group">
        <r-input
          v-model:value="formState.billFirstName"
          placeholder="First name *"
          :disabled="disabledBillAddress"
        />
      </a-form-item>
      <a-form-item name="billLastName" class="form-item-group">
        <r-input
          v-model:value="formState.billLastName"
          placeholder="Last name *"
          :disabled="disabledBillAddress"
        />
      </a-form-item>
      <a-form-item name="billAddress" class="form-item-group">
        <r-autocomplete
          v-model:value="formState.billAddress"
          placeholder="Address*"
          :options="formState.billAddressOptions"
          :disabled="disabledInputDependsCountry"
          :loading="isLoadingSearchAddress"
          @search="onSearchAddress"
        >
          <template #option="{ text }">
            <span class="block" @click="onSelectAddress(text)">{{ text }}</span>
          </template>
        </r-autocomplete>
      </a-form-item>
      <a-form-item name="billAptFloorSuite" class="form-item-group">
        <r-input
          v-model:value="formState.billAptFloorSuite"
          placeholder="Apt/Floor/Suite"
          :disabled="disabledInputDependsCountry"
        />
      </a-form-item>
      <a-form-item name="billCity" class="form-item-group">
        <r-input
          v-model:value="formState.billCity"
          placeholder="City *"
          :disabled="disabledInputDependsCountry"
        />
      </a-form-item>
      <a-form-item name="billState" class="form-item-group">
        <r-select
          v-model:value="formState.billState"
          placeholder="State *"
          :options="billStateOptions"
          :disabled="disabledInputDependsCountry"
        />
      </a-form-item>
      <a-form-item name="billZipCode" class="form-item-group">
        <r-input
          v-model:value="formState.billZipCode"
          placeholder="Zip code *"
          :disabled="disabledInputDependsCountry"
        />
      </a-form-item>
      <a-form-item name="billMobileNumber" class="form-item-group">
        <r-input
          v-model:value="formState.billMobileNumber"
          placeholder="Cell phone *"
          :disabled="disabledBillAddress"
          :maxlength="14"
        />
      </a-form-item>
    </div>
  </a-form>
</template>

<script setup>
import { computed, reactive, ref, watch, nextTick } from 'vue'
import {
  BILLING_OPTIONS,
  CA_STATE_OPTIONS,
  COUNTRY_OPTIONS,
  STORAGE_ENTER_SHIPPING_DATA,
  US_STATE_OPTIONS,
  VALUE_BILLING,
  VALUE_COUNTRY,
  SIZE_CHECKBOX,
  CONVERSION_SHIPPING
} from '@/helpers/constant'
import { VALIDATE_MESSAGE } from '@/helpers/validate-message'
import { storage } from '@/utils/storage'
import useValidate from '@/composables/validate'
import { useQuery } from 'vue-query'
import apiService from '@/http/api'
import debounce from 'lodash/debounce'
import { BILL_VALIDATE } from '@/helpers/bill'
import {
  formatPhoneNumber,
  formatCardNumber,
  renderMessageErrorDateExpired,
  formatCellphoneToSend
} from '@/utils/common'
import { phoneRule } from '@/helpers/validation'
import { AppRoutes } from '@/router/path'
import { AMEX } from '@/helpers/regex'

const dataEnterShipping =
  storage.get(STORAGE_ENTER_SHIPPING_DATA) || storage.get(CONVERSION_SHIPPING)

const formRef = ref()
const validateMessageExpired = ref('')

const formState = reactive({
  cardFirstName: '',
  cardLastName: '',
  cardNumber: '',
  expiredMonth: null,
  expiredYear: null,
  cardCvc: '',
  billFirstName: '',
  billLastName: '',
  billAddress: '',
  billAptFloorSuite: '',
  billCity: '',
  billState: null,
  billZipCode: '',
  billCountry: null,
  billMobileNumber: '',
  billingOptions: VALUE_BILLING.enter,
  billAddressOptions: [],
  defaultCard: false,
  agreeInfoCard: false
})

const props = defineProps({
  updateData: {
    type: Function,
    default: () => {}
  },
  checkStatusValid: {
    type: Function,
    default: () => {}
  },
  parent: {
    type: String,
    default: AppRoutes.register.agreeTerm.name
  },
  allowValid: {
    type: Boolean,
    default: false
  }
})

watch(
  () => props.allowValid,
  (value) => {
    if (value) {
      nextTick(() => {
        formRef.value?.validateFields()
      })
    }
  },
  {
    immediate: true
  }
)

watch([() => formState.cardNumber], ([newVal]) => {
  formState.cardNumber = formatCardNumber(newVal)
})

watch([() => formState.expiredMonth, () => formState.expiredYear], ([newMonth, newYear]) => {
  validateMessageExpired.value = renderMessageErrorDateExpired(newYear, newMonth)
})

watch([() => formState.billingOptions], ([newVal]) => {
  if (dataEnterShipping && newVal === VALUE_BILLING.default) {
    const {
      firstName,
      lastName,
      address,
      country,
      phoneNumber,
      zipCode,
      zipcode,
      aptFloorSuite,
      city,
      state
    } = dataEnterShipping.shipping || dataEnterShipping
    Object.assign(formState, {
      billAddress: address,
      billFirstName: firstName,
      billLastName: lastName,
      billAptFloorSuite: aptFloorSuite,
      billCity: city,
      billState: state,
      billZipCode: zipCode || zipcode,
      billCountry: country,
      billMobileNumber: phoneNumber
    })
    formRef.value.clearValidate([
      'billAddress',
      'billFirstName',
      'billLastName',
      'billAptFloorSuite',
      'billCity',
      'billState',
      'billZipCode',
      'billCountry',
      'billMobileNumber'
    ])
  }
  if (newVal === VALUE_BILLING.enter) {
    Object.assign(formState, {
      billAddress: '',
      billFirstName: '',
      billLastName: '',
      billAptFloorSuite: '',
      billCity: '',
      billState: null,
      billZipCode: '',
      billCountry: null,
      billMobileNumber: ''
    })
  }
})

watch(formState, (newVal) => {
  props.updateData(newVal)
})
watch([() => formState.billMobileNumber], ([value]) => {
  formState.billMobileNumber = formatPhoneNumber(value)
})

const billStateOptions = computed(() =>
  formState.billCountry === VALUE_COUNTRY.US ? US_STATE_OPTIONS : CA_STATE_OPTIONS
)

const disabledBillAddress = computed(() => formState.billingOptions === VALUE_BILLING.default)
const checkParentRouteIsCreateCard = computed(
  () => props.parent === AppRoutes.myPage.createCreditCard.name
)

const validateCardNumber = async (_rule, value) => {
  if (value) {
    if (formState.cardCvc.length > 3) formRef.value.validateFields('cardCvc')
  } else return Promise.resolve()
}

const disabledInputDependsCountry = computed(() => {
  if (formState.billingOptions === VALUE_BILLING.default) return true
  return !formState.billCountry
})

const validateCvc = async (_rule, value) => {
  if (!AMEX.test(formatCellphoneToSend(formState.cardNumber)) && value.length > 3) {
    return Promise.reject(VALIDATE_MESSAGE.amexValid)
  } else return Promise.resolve()
}

const validateAgreeInfoCard = async (_rule, value) => {
  if (checkParentRouteIsCreateCard.value && !value) {
    return Promise.reject(VALIDATE_MESSAGE.agreeInfoCard)
  } else return Promise.resolve()
}

const rules = reactive({
  ...BILL_VALIDATE,
  cardNumber: [...BILL_VALIDATE.cardNumber, { validator: validateCardNumber, trigger: 'change' }],
  billMobileNumber: [
    phoneRule('Cell phone'),
    { required: 'true', message: VALIDATE_MESSAGE.cellPhoneRequired }
  ],
  cardCvc: [...BILL_VALIDATE.cardCvc, { validator: validateCvc, trigger: 'change' }],
  agreeInfoCard: [{ validator: validateAgreeInfoCard, trigger: 'change' }]
})

const isValid = useValidate(formState, rules)

watch(isValid, (newVal) => {
  props.checkStatusValid(newVal)
})

const { isFetching: isLoadingSearchAddress, refetch: searchAddress } = useQuery({
  queryKey: [
    'search-address',
    {
      keyword: formState.billAddress,
      country: formState.billCountry
    }
  ],
  queryFn: () =>
    apiService.authService.searchAddress({
      keyword: formState.billAddress,
      country: formState.billCountry
    }),
  enabled: false,
  keepPreviousData: true
})

const { refetch: verifyAddress } = useQuery({
  queryKey: [
    'verify-address',
    {
      address: formState.billAddress,
      country: formState.billCountry
    }
  ],
  queryFn: () =>
    apiService.authService.verifyAddress({
      address: formState.billAddress,
      country: formState.billCountry
    }),
  enabled: false
})

const onSearchAddress = debounce(async () => {
  const { data: response } = await searchAddress.value()
  formState.billAddressOptions = response.success ? response?.data : []
}, 300)

const onSelectAddress = async (text) => {
  formState.billAddress = text
  const { data: response } = await verifyAddress.value()
  const { address, aptFloorSuite, city, state, zipCode } = response?.data?.[0] || {}

  Object.assign(formState, {
    billAddress: address,
    billAptFloorSuite: aptFloorSuite,
    billCity: city,
    billState: state?.[0],
    billZipCode: zipCode
  })
}

const lengthCvc = computed(() => {
  return AMEX.test(formatCellphoneToSend(formState.cardNumber)) ? 4 : 3
})
</script>
<style scoped lang="scss">
.form-item-group {
  @apply mb-2 w-full;

  &.ant-form-item-has-error {
    @apply mb-0;
  }
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
    @apply flex flex-col gap-[10px];
  }
  :deep(.ant-radio-wrapper) {
    span {
      @apply text-xs font-normal;
    }
  }
}
</style>
