<template>
  <a-form ref="formRef" :model="formState" :rules="rules" class="w-full">
    <a-form-item name="country" class="form-item-group">
      <RSelect
        v-model:value="formState.country"
        placeholder="Country*"
        :options="countryOptions"
        :disabled="formState.isFillMailingAddress"
      />
    </a-form-item>
    <a-form-item name="addressDescription" class="form-item-group">
      <RInput
        v-model:value="formState.addressDescription"
        placeholder="Address Description* (Home, Office, etc.)"
      />
    </a-form-item>

    <a-form-item name="firstName" class="form-item-group">
      <RInput v-model:value="formState.firstName" placeholder="First Name*" />
    </a-form-item>

    <a-form-item name="lastName" class="form-item-group">
      <RInput v-model:value="formState.lastName" placeholder="Last Name*" />
    </a-form-item>

    <a-form-item name="address" class="form-item-group">
      <RAutocomplete
        v-model:value="formState.address"
        placeholder="Address*"
        :options="formState.addressOptions"
        :loading="isLoadingSearchAddress"
        :disabled="isDisableAddress"
        @search="onSearchAddress"
      >
        <template #option="{ text }">
          <span class="block" @click="onSelectAddress(text)">{{ text }}</span>
        </template>
      </RAutocomplete>
    </a-form-item>

    <a-form-item name="aptFloorSuite" class="form-item-group">
      <RInput
        v-model:value="formState.aptFloorSuite"
        placeholder="Apt/Floor/Suite"
        :disabled="isDisableAddress"
      />
    </a-form-item>

    <span class="mb-5 block text-xs font-normal leading-none">
      *Please note: We do not currently ship to P.O. Boxes.
    </span>

    <a-form-item name="city" class="form-item-group">
      <RInput v-model:value="formState.city" placeholder="City*" :disabled="isDisableAddress" />
    </a-form-item>

    <a-form-item name="state" class="form-item-group">
      <RSelect
        v-model:value="formState.state"
        placeholder="State*"
        :options="stateOptions"
        :disabled="isDisableAddress"
      />
    </a-form-item>

    <a-form-item name="zipcode" class="form-item-group">
      <RInput
        v-model:value="formState.zipcode"
        placeholder="Zip code*"
        :disabled="isDisableAddress"
      />
    </a-form-item>

    <a-form-item name="deliveryMessage" class="form-item-group">
      <RInput v-model:value="formState.deliveryMessage" placeholder="Delivery Message" />
    </a-form-item>

    <a-form-item name="phoneNumber" class="form-item-group">
      <RInput v-model:value="formState.phoneNumber" placeholder="Cell Phone*" />
    </a-form-item>

    <a-form-item name="homePhone">
      <RInput v-model:value="formState.homePhone" placeholder="Home Phone" />
    </a-form-item>
  </a-form>

  <RCheckbox v-if="isMember" v-model:checked="formState.defaultValue">
    Make this my default shipping address
  </RCheckbox>

  <RButton
    v-if="isMember"
    :title="isModal ? 'Confirm' : 'Continue'"
    :class="{ '!bg-navy-6 ': isModal }"
    class="border-navy-6 mx-auto mb-8 mt-5 h-10 w-full"
    :class-title="[isModal ? 'text-white ' : 'text-navy-6 ', 'text-base font-550']"
    @click="authAddress"
  />
  <RButton
    v-else
    :title="convertToPlanner ? 'Next' : 'Continue'"
    class="!bg-navy-6 disabled:(!bg-navy-4) mb-15 mx-auto mt-5 w-full !shadow-none"
    class-title="text-white text-base font-500"
    @click="getAddressWithNonMember"
  />

  <RModalAlert
    v-model:visible="formState.isShowAlert"
    :description="formState.messageAlert"
    @confirm="formState.isShowAlert = false"
  />

  <RModalConfirm
    v-model:visible="formState.visibleAlert"
    :width="370"
    :text-ok="$t('auth.sign_up.agree_term_condition.use_address')"
    text-cancel="Edit Address"
    :mask-closable="false"
    @ok="onSaveAddress"
    @cancel="formState.visibleAlert = false"
  >
    <template #extraDescription>
      <span>{{ formState.descriptionAlert }}</span>
    </template>
  </RModalConfirm>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch, nextTick } from 'vue'
import {
  CA_STATE_OPTIONS,
  CELLPHONE_LENGTH,
  COUNTRY_OPTIONS,
  US_STATE_OPTIONS,
  VALUE_COUNTRY,
  VALID_PHONE_SUCCESS
} from '@/helpers/constant'
import { phoneRule, requiredRule } from '@/helpers/validation'
import { useDebounceFn } from '@vueuse/core'
import { useQuery } from 'vue-query'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useNotification } from '@/composables/notification'
import { useOrderStore } from '@/stores/modules/order'
import { ALPHABETS } from '@/helpers/regex'
import { formatCellphoneToSend, formatPhoneNumber } from '@/utils/common'
import useValidate from '@/composables/validate'
import { CountryEnum } from '@/helpers/enum'

const props = defineProps({
  isMember: {
    type: Boolean,
    default: true
  },
  closeCollapseItem: {
    type: Function,
    default: () => {}
  },
  isModal: {
    type: Boolean,
    default: false
  },
  convertToPlanner: {
    type: Boolean,
    default: false
  },
  country: {
    type: String,
    default: VALUE_COUNTRY.US
  },
  allowValid: {
    type: Boolean,
    default: false
  },
  allowBothCountry: {
    type: Boolean,
    default: false
  }
})

const globalLoading = useGlobalLoadingStore()
const orderStore = useOrderStore()
const { showGlobalLoading } = globalLoading
const { showNotification } = useNotification()
const countryOptions = ref([...COUNTRY_OPTIONS])

onMounted(() => {
  if (!props.allowBothCountry) {
    countryOptions.value =
      props.country === CountryEnum.US.value ? [COUNTRY_OPTIONS[0]] : [COUNTRY_OPTIONS[1]]
  }
})

const KEY_FORM = [
  'userAddressId',
  'addressDescription',
  'firstName',
  'lastName',
  'address',
  'aptFloorSuite',
  'city',
  'state',
  'zipcode',
  'country',
  'deliveryMessage',
  'phoneNumber',
  'homePhone',
  'defaultValue'
]

const formRef = ref()
const formState = reactive({
  userAddressId: null,
  addressDescription: undefined,
  firstName: undefined,
  lastName: undefined,
  address: undefined,
  aptFloorSuite: undefined,
  city: undefined,
  state: undefined,
  zipcode: undefined,
  country: props.country ? props.country : undefined,
  deliveryMessage: undefined,
  phoneNumber: undefined,
  homePhone: undefined,
  defaultValue: false,
  addressOptions: [],
  isShowAlert: false,
  messageAlert: '',
  visibleAlert: false,
  descriptionAlert: ''
})
const rules = reactive({
  addressDescription: [requiredRule('Address Description')],
  firstName: [requiredRule('First Name')],
  lastName: [requiredRule('Last Name')],
  address: [requiredRule('Address')],
  aptFloorSuite: [],
  city: [requiredRule('City')],
  state: [requiredRule('State')],
  zipcode: [requiredRule('Zip code')],
  country: [requiredRule('Country')],
  deliveryMessage: [],
  phoneNumber: [requiredRule('Cell Phone'), phoneRule('Cell Phone')],
  homePhone: [phoneRule('Home Phone')]
})

const isDisableAddress = computed(() => !formState.country)
const isValidShipping = useValidate(formState, rules)

const setShippingAddress = (data) => {
  for (const key of KEY_FORM) {
    formState[key] = data[key]
    if (key === 'defaultValue') {
      formState[key] = !!data[key]
    }
  }

  formRef.value.clearValidate()
}

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

const emits = defineEmits(['update-success', 'get-data-address', 'update-address-selected'])

defineExpose({
  setShippingAddress
})

const stateOptions = computed(() =>
  formState.country === VALUE_COUNTRY.US ? US_STATE_OPTIONS : CA_STATE_OPTIONS
)

const handleFormatPhone = (key, value) => {
  const phone = (value || '').replace(ALPHABETS, '')

  if (phone.length === CELLPHONE_LENGTH) {
    formState[key] = formatPhoneNumber(phone)
  } else if (phone.length > CELLPHONE_LENGTH) {
    formState[key] = formState[key].slice(0, -1)
  }
}

watch(
  () => formState.phoneNumber,
  (value) => {
    handleFormatPhone('phoneNumber', value)
  }
)

watch(
  () => formState.homePhone,
  (value) => {
    handleFormatPhone('homePhone', value)
  }
)

// Search & verify address
const { isFetching: isLoadingSearchAddress, refetch: searchAddress } = useQuery({
  queryKey: [
    'search-address',
    {
      keyword: formState.address,
      country: formState.country
    }
  ],
  queryFn: () =>
    apiService.authService.searchAddress({
      keyword: formState.address,
      country: formState.country
    }),
  enabled: false,
  keepPreviousData: true
})

const onSearchAddress = useDebounceFn(async () => {
  if (!formState.address?.trim()) {
    formState.addressOptions = []
    return
  }

  const { data: response } = await searchAddress.value()
  if (!response.success) {
    formState.addressOptions = []
  } else {
    formState.addressOptions = response?.data?.filter((item) => item.id)
  }
}, 300)

const { refetch: verifyAddress } = useQuery({
  queryKey: [
    'verify-address',
    {
      address: formState.address,
      country: formState.country
    }
  ],
  queryFn: () =>
    apiService.authService.verifyAddress({
      address: formState.address,
      country: formState.country
    }),
  enabled: false
})

const onSelectAddress = async (text) => {
  formState.address = text
  const { data: response } = await verifyAddress.value()
  const { address, aptFloorSuite, city, state, zipCode } = response?.data?.[0] || {}

  formState.address = address
  formState.aptFloorSuite = aptFloorSuite
  formState.city = city
  formState.state = state?.[0]
  formState.zipcode = zipCode
  formRef.value.clearValidate(['aptFloorSuite', 'city', 'state', 'zipcode'])
}

const authAddress = async () => {
  // Check limit address
  if (orderStore.addressList.length >= 5 && !formState.userAddressId) {
    formState.isShowAlert = true
    formState.messageAlert =
      'Up to 5 shipping addresses can be registered.\nPlease try again after deleting it.'
    return
  }

  let isValid = false
  try {
    await formRef.value.validate()
    isValid = true
  } catch {
    //
  }
  if (!isValid) return
  const { city, address, aptFloorSuite, state, zipcode, country } = formState
  const payload = {
    geocode: 'true',
    addresses: [
      {
        address: `${address || ''} ${aptFloorSuite || ''} ${city || ''} ${state || ''} ${
          zipcode || ''
        }`,
        country
      }
    ]
  }

  try {
    showGlobalLoading(true)
    const response = await apiService.authService.authAddress(payload)
    if (response?.data?.isValidAddress) {
      onSaveAddress()
    } else {
      formState.visibleAlert = true
      formState.descriptionAlert =
        'It appears this is not a valid address, do you want to use this address anyway?'
    }
  } finally {
    showGlobalLoading(false)
  }
}

const onSaveAddress = async () => {
  const { phoneNumber, homePhone } = formState

  showGlobalLoading(true)

  const payloadValidatePhone = {
    country: VALUE_COUNTRY.US,
    iso3Country: 'True',
    additionalFields: 'True'
  }

  try {
    const resCellphone = await apiService.authService.validateCellphone({
      ...payloadValidatePhone,
      phone: formatCellphoneToSend(phoneNumber)
    })
    if (resCellphone.data.isValid === VALID_PHONE_SUCCESS) {
      if (homePhone) {
        const resHomePhone = await apiService.authService.validateCellphone({
          ...payloadValidatePhone,
          phone: formatCellphoneToSend(homePhone)
        })
        if (resHomePhone.data.isValid === VALID_PHONE_SUCCESS) {
          handleSendDataAddress()
        } else {
          formState.isShowAlert = true
          formState.messageAlert = 'Please check again homePhone .'
        }
      } else {
        handleSendDataAddress()
      }
    } else {
      formState.isShowAlert = true
      formState.messageAlert = 'Please check again cellPhone .'
    }
  } finally {
    showGlobalLoading(false)
  }
}

const getAddressWithNonMember = () => {
  formRef.value.validateFields('').then(() => {
    emits('get-data-address', formState)

    props.closeCollapseItem()
  })
}

const handleSendDataAddress = async () => {
  const {
    userAddressId,
    addressDescription,
    firstName,
    lastName,
    address,
    aptFloorSuite = '',
    city,
    state,
    zipcode,
    country,
    deliveryMessage = '',
    phoneNumber,
    homePhone,
    defaultValue
  } = formState

  const payload = {
    addressDescription,
    firstNameReceiveShipping: firstName,
    lastNameReceiveShipping: lastName,
    address,
    aptFloorSuite,
    city,
    state,
    zipcode,
    country,
    deliveryMessage,
    phoneNumber: formatCellphoneToSend(phoneNumber),
    homePhone: homePhone ? formatCellphoneToSend(homePhone) : '',
    defaultValue
  }
  const response = userAddressId
    ? await apiService.addressService.updateAddressSaved({ userAddressId, payload })
    : await apiService.addressService.createAddressSaved(payload)

  if (!response.success) {
    showNotification({
      type: 'error',
      message: userAddressId ? 'Update address failed!' : 'Create address failed!'
    })
    return
  }

  showNotification({
    type: 'success',
    message: userAddressId ? 'Update address successfully!' : 'Create address successfully!'
  })

  for (const key of KEY_FORM) {
    formState[key] = undefined
    if (key === 'defaultValue') {
      formState[key] = false
    }
  }
  await orderStore.getAddressSavedList()

  if (!userAddressId) {
    emits('update-address-selected', response?.data?.userAddressId)
  }
  emits('update-success')
}
</script>

<style lang="scss" scoped>
.form-item-group {
  @apply mb-2;

  &.ant-form-item-has-error {
    @apply mb-0;
  }
}
</style>
