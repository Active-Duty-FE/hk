<template>
  <BusinessInformationForm
    :default-info="pageState.corporationInfo"
    :is-register="false"
    @get-data-business="getDataBusiness"
  />
  <div class="w-full pb-8">
    <r-button
      class-title="text-white"
      title="Save"
      class="!bg-navy-1 disabled:(!bg-navy-4 border-1 !border-navy-4) mx-auto w-full md:w-[340px]"
      :disabled="pageState.isDisabledSaveBtn"
      @click="handleVerifyAddress"
    />
  </div>
  <RModalAlert
    v-model:visible="pageState.isShowAlert"
    :width="270"
    text-btn="Ok"
    :duration="3000"
    @confirm="pageState.isShowAlert = false"
    @self-close="pageState.isShowAlert = false"
  >
    <template #extraDescription>
      <div class="text-center">
        <p class="font-475 mb-[14px] text-base leading-[22px]">{{ pageState.message }}</p>
      </div>
    </template>
  </RModalAlert>
  <RModalConfirm
    v-model:visible="pageState.visibleAlert"
    :width="370"
    :text-ok="$t('auth.sign_up.agree_term_condition.use_address')"
    text-cancel="Edit Address"
    :mask-closable="false"
    @ok="handleWhenUseAddress"
    @cancel="pageState.visibleAlert = false"
  >
    <template #extraDescription>
      <span> {{ pageState.descriptionAlert }}</span>
    </template>
  </RModalConfirm>
</template>

<script setup>
import { useNotification } from '@/composables/notification'
import apiService from '@/http/api'
import { reactive, onMounted } from 'vue'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { VALIDATE_MESSAGE } from '@/helpers/validate-message'

const { showGlobalLoading } = useGlobalLoadingStore()
const pageState = reactive({
  isDisabledSaveBtn: true,
  data: {},
  corporationInfo: undefined,
  fileState: undefined,
  isShowAlert: false,
  message: '',
  visibleAlert: false,
  descriptionAlert: '',
  type: ''
})

const getDataBusiness = (val) => {
  pageState.isDisabledSaveBtn = val?.disabled
  pageState.data = val?.data
  pageState.fileState = val?.fileState
}

const getReleaseDate = (data) => {
  if (!data?.releaseYear || !data?.releaseDay || !data?.releaseMonth) return undefined
  return `${data?.releaseYear}-${data?.releaseMonth}-${data?.releaseDay} 00:00:00`
}

const authAddress = async (data, type) => {
  try {
    showGlobalLoading(true)
    pageState
    const payload = {
      geocode: 'true',
      addresses: [data]
    }
    pageState.type = type
    const response = await apiService.authService.authAddress(payload)
    if (response?.data?.isValidAddress) {
      if (!type) return true
      onSubmit()
    } else {
      pageState.visibleAlert = true
      pageState.descriptionAlert = VALIDATE_MESSAGE.invalidAddress
    }
  } finally {
    showGlobalLoading(false)
  }
}

const handleVerifyAddress = async () => {
  const {
    principalAddress,
    principalAptFloorSuite,
    principalState,
    principalCity,
    principalZipCode,
    principalCountry,
    mailingAddress,
    mailingAptFloorSuite,
    mailingCity,
    mailingState,
    mailingZipCode,
    mailingCountry
  } = pageState.data
  const payloadCompany = {
    address: `${principalAddress || ''} ${principalAptFloorSuite || ''} ${principalCity || ''} ${
      principalState || ''
    } ${principalZipCode || ''}`,
    country: principalCountry
  }
  const payloadMail = {
    address: `${mailingAddress || ''} ${mailingAptFloorSuite || ''} ${mailingCity || ''} ${
      mailingState || ''
    } ${mailingZipCode || ''}`,
    country: mailingCountry
  }
  const responseCompany = await authAddress(payloadCompany)
  if (responseCompany) await authAddress(payloadMail, 'mail')
}

const handleWhenUseAddress = () => {
  pageState.visibleAlert = false

  if (pageState.type) onSubmit()
  else {
    const {
      mailingAddress,
      mailingAptFloorSuite,
      mailingCity,
      mailingState,
      mailingZipCode,
      mailingCountry
    } = pageState.data

    const payloadMail = {
      address: `${mailingAddress || ''} ${mailingAptFloorSuite || ''} ${mailingCity || ''} ${
        mailingState || ''
      } ${mailingZipCode || ''}`,
      country: mailingCountry
    }
    authAddress(payloadMail, 'mail')
  }
}

const onSubmit = async () => {
  showGlobalLoading(true)
  const payload = {
    ...pageState.fileState,
    ...pageState.data,
    establishedDate: `${pageState.data.establishedYear}-${pageState.data.establishedMonth}-${pageState.data.establishedDay}`
  }
  if (getReleaseDate(pageState.data)) {
    payload.resaleCertificationDate = getReleaseDate(pageState.data)
  }
  delete payload.isFillMailingAddress
  delete payload.isFillPrincipalAddress
  delete payload.lastName
  delete payload.firstName
  delete payload.principalAddressOptions
  delete payload.mailingAddressOptions
  delete payload.releaseMonth
  delete payload.releaseDay
  delete payload.releaseYear
  delete payload.defaultCeoFile
  delete payload.defaultResaleCertificationFile
  delete payload.defaultTaxIdentificationDocFile
  delete payload.defaultEntityDocFile
  if (!pageState.data.businessType) delete payload.businessType
  if (!pageState.data.federalTaxId) delete payload.federalTaxId
  if (!payload.hasUploadSignatureCeoFile) delete payload.signatureCeoFile
  if (!payload.hasUploadEntityDocFile) delete payload.entityDocFile
  if (!payload.hasUploadTaxIdentificationDocFile) delete payload.taxIdentificationDocFile
  if (!payload.hasUploadResaleCertificationFile) delete payload.resaleCertificationFile
  if (!payload.principalAptFloorSuite) delete payload.principalAptFloorSuite
  if (!payload.mailingAptFloorSuite) delete payload.mailingAptFloorSuite

  const submitData = new FormData()
  for (const key in payload) {
    submitData.append(key, payload[key])
  }

  const { message, success } = await apiService.myPageService.saveCorporationInfo(submitData)
  if (success) {
    pageState.message = 'Save data successfully'
  } else {
    pageState.message = message || 'Something went wrong'
  }
  pageState.isShowAlert = true
  showGlobalLoading(false)
  getInfoData()
}

const getInfoData = async () => {
  showGlobalLoading(true)
  const { data, success, message } = await apiService.myPageService.getCorporationInfo()
  if (success) {
    pageState.corporationInfo = data
  } else {
    useNotification().showNotification({
      message: message || 'Something went wrong'
    })
  }
  showGlobalLoading(false)
}

onMounted(() => {
  getInfoData()
})
</script>
