<template>
  <div class="pb-10">
    <a-form ref="formRef" :model="pageState" :rules="rules" class="w-full">
      <a-form-item name="country" class="form-item-group">
        <RSelect
          v-model:value="pageState.country"
          placeholder="Country*"
          :options="COUNTRY_OPTIONS"
          :disabled="pageState.isFillMailingAddress"
        />
      </a-form-item>
      <a-form-item name="addressDescription" class="form-item-group">
        <RInput
          v-model:value="pageState.addressDescription"
          placeholder="Address Description* (Home, Office, etc.)"
        />
      </a-form-item>

      <div class="grid grid-cols-2 gap-x-2">
        <a-form-item name="firstName" class="form-item-group">
          <RInput v-model:value="pageState.firstName" placeholder="First Name*" />
        </a-form-item>

        <a-form-item name="lastName" class="form-item-group">
          <RInput v-model:value="pageState.lastName" placeholder="Last Name*" />
        </a-form-item>
      </div>

      <a-form-item name="address" class="form-item-group">
        <RAutocomplete
          v-model:value="pageState.address"
          placeholder="Address*"
          :options="pageState.addressOptions"
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
          v-model:value="pageState.aptFloorSuite"
          placeholder="Apt/Floor/Suite"
          :disabled="isDisableAddress"
        />
      </a-form-item>

      <span class="mb-5 block text-xs font-normal leading-none">
        *Please note: We do not currently ship to P.O. Boxes.
      </span>

      <a-form-item name="city" class="form-item-group">
        <RInput v-model:value="pageState.city" placeholder="City*" :disabled="isDisableAddress" />
      </a-form-item>

      <a-form-item name="state" class="form-item-group">
        <RSelect
          v-model:value="pageState.state"
          placeholder="State*"
          :options="stateOptions"
          :disabled="isDisableAddress"
        />
      </a-form-item>

      <a-form-item name="zipcode" class="form-item-group">
        <RInput
          v-model:value="pageState.zipcode"
          placeholder="Zip code*"
          :disabled="isDisableAddress"
        />
      </a-form-item>

      <a-form-item name="deliveryMessage" class="form-item-group">
        <RInput v-model:value="pageState.deliveryMessage" placeholder="Delivery Message" />
      </a-form-item>

      <a-form-item name="phoneNumber" class="form-item-group">
        <RInput v-model:value="pageState.phoneNumber" placeholder="Cell Phone*" />
      </a-form-item>

      <a-form-item name="homePhone">
        <RInput v-model:value="pageState.homePhone" placeholder="Home Phone" />
      </a-form-item>
    </a-form>

    <RCheckbox v-model:checked="pageState.defaultValue">
      Make this my default shipping address
    </RCheckbox>

    <div class="mx-auto mt-5 w-full max-w-[350px]">
      <RButton
        title="Continue"
        class="!border-navy-6 !bg-navy-6 h-10 w-full"
        class-title="text-white text-base font-550"
        @click="authAddress"
      />
    </div>

    <RModalAlert
      v-model:visible="pageState.isShowAlert"
      :description="`Up to 5 shipping addresses can be registered.\nPlease try again after deleting it.`"
      @confirm="pageState.isShowAlert = false"
    />
    <RModalConfirm
      v-model:visible="pageState.visibleAlert"
      :width="370"
      :text-ok="$t('auth.sign_up.agree_term_condition.use_address')"
      text-cancel="Edit Address"
      :mask-closable="false"
      @ok="onSaveAddress"
      @cancel="pageState.visibleAlert = false"
    >
      <template #extraDescription>
        <span> {{ pageState.descriptionAlert }}</span>
      </template>
    </RModalConfirm>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed, onBeforeMount, reactive, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { useQuery } from 'vue-query'
import {
  CA_STATE_OPTIONS,
  CELLPHONE_LENGTH,
  COUNTRY_OPTIONS,
  US_STATE_OPTIONS,
  VALUE_COUNTRY
} from '@/helpers/constant'
import { maxRule, phoneRule, requiredRule } from '@/helpers/validation'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useNotification } from '@/composables/notification'
import { ALPHABETS } from '@/helpers/regex'
import { formatPhoneNumber } from '@/utils/common'
import apiService from '@/http/api'
import { convertDataAddress, getAddressList, setShippingAddress } from '@/utils/address'
import { AppRoutes } from '@/router/path'

const route = useRoute()
const router = useRouter()
const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading
const { showNotification } = useNotification()

const formRef = ref()
const pageState = reactive({
  userAddressId: route.params.id,
  addressDescription: undefined,
  firstName: undefined,
  lastName: undefined,
  address: undefined,
  aptFloorSuite: undefined,
  city: undefined,
  state: undefined,
  zipcode: undefined,
  country: undefined,
  deliveryMessage: undefined,
  phoneNumber: undefined,
  homePhone: undefined,
  defaultValue: false,
  addressOptions: [],
  isShowAlert: false,
  addressList: [],
  visibleAlert: false,
  descriptionAlert: ''
})

const rules = reactive({
  addressDescription: [requiredRule('Address Description'), maxRule('Address Description')],
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

const isEdit = !!route.params.id
const isDisableAddress = computed(() => !pageState.country)

const stateOptions = computed(() =>
  pageState.country === VALUE_COUNTRY.US ? US_STATE_OPTIONS : CA_STATE_OPTIONS
)

const handleFormatPhone = (key, value) => {
  const phone = (value || '').replace(ALPHABETS, '')

  if (phone.length === CELLPHONE_LENGTH) {
    pageState[key] = formatPhoneNumber(phone)
  } else if (phone.length > CELLPHONE_LENGTH) {
    pageState[key] = pageState[key].slice(0, -1)
  }
}

watch(
  () => pageState.phoneNumber,
  (value) => {
    handleFormatPhone('phoneNumber', value)
  }
)

watch(
  () => pageState.homePhone,
  (value) => {
    handleFormatPhone('homePhone', value)
  }
)

onBeforeMount(() => {
  getAddressSavedList()

  if (isEdit) getAddressDetail()
})

// fetch data
const getAddressSavedList = async () => {
  pageState.addressList = await getAddressList()
}

const getAddressDetail = async () => {
  showGlobalLoading(true)
  const { data, success } = await apiService.addressService.getAddressDetail(
    pageState.userAddressId
  )

  if (!success || !data?.userAddressId) {
    showGlobalLoading(false)
    router.push({ name: AppRoutes.myPage.shippingAddressManagement.name })
    return
  }

  const dataParsed = convertDataAddress(data)

  setShippingAddress(pageState, dataParsed)

  showGlobalLoading(false)
}

// Search & verify address
const { isFetching: isLoadingSearchAddress, refetch: searchAddress } = useQuery({
  queryKey: [
    'search-address',
    {
      keyword: pageState.address,
      country: pageState.country
    }
  ],
  queryFn: () =>
    apiService.authService.searchAddress({
      keyword: pageState.address,
      country: pageState.country
    }),
  enabled: false,
  keepPreviousData: true
})

const onSearchAddress = useDebounceFn(async () => {
  if (!pageState.address?.trim()) {
    pageState.addressOptions = []
    return
  }

  const { data: response } = await searchAddress.value()
  if (!response.success) {
    pageState.addressOptions = []
  } else {
    pageState.addressOptions = response?.data?.filter((item) => item.id)
  }
}, 300)

const { refetch: verifyAddress } = useQuery({
  queryKey: [
    'verify-address',
    {
      address: pageState.address,
      country: pageState.country
    }
  ],
  queryFn: () =>
    apiService.authService.verifyAddress({
      address: pageState.address,
      country: pageState.country
    }),
  enabled: false
})

const onSelectAddress = async (text) => {
  pageState.address = text
  const { data: response } = await verifyAddress.value()
  const { address, aptFloorSuite, city, state, zipCode } = response?.data?.[0] || {}

  pageState.address = address
  pageState.aptFloorSuite = aptFloorSuite
  pageState.city = city
  pageState.state = state?.[0]
  pageState.zipcode = zipCode
}

const authAddress = async () => {
  if (pageState.addressList.length >= 5 && !pageState.userAddressId) {
    pageState.isShowAlert = true
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
  const { city, address, aptFloorSuite, state, zipcode, country } = pageState
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
      pageState.visibleAlert = true
      pageState.descriptionAlert =
        'It appears this is not a valid address, do you want to use this address anyway?'
    }
  } finally {
    showGlobalLoading(false)
  }
}

const onSaveAddress = async () => {
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
  } = pageState

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
    phoneNumber: (phoneNumber || '').replace(ALPHABETS, ''),
    homePhone: (homePhone || '').replace(ALPHABETS, ''),
    defaultValue
  }

  showGlobalLoading(true)

  const response = isEdit
    ? await apiService.addressService.updateAddressSaved({ userAddressId, payload })
    : await apiService.addressService.createAddressSaved(payload)
  showGlobalLoading(false)

  if (!response.success) {
    showNotification({
      type: 'error',
      message: isEdit ? 'Update address failed!' : 'Create address failed!'
    })
    return
  }

  showNotification({
    type: 'success',
    message: isEdit ? 'Update address successfully!' : 'Create address successfully!'
  })

  router.push({ name: AppRoutes.myPage.shippingAddressManagement.name })
}
</script>
