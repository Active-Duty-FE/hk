<template>
  <div class="mb-20 md:mb-10">
    <FormPayment
      :update-data="updateDataPayment"
      :parent="AppRoutes.myPage.createCreditCard.name"
      :check-status-valid="checkStatusValidatePayment"
    />
  </div>
  <div class="mb-10 hidden md:block">
    <RButton
      title="Save"
      type="primary"
      :disabled="!passValidateFormPayment"
      class="!bg-navy-deep !border-navy-deep !rounded-0 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full text-white"
      @click="authAddress"
    />
  </div>

  <div class="fixed bottom-0 left-0 w-full md:hidden">
    <div class="flex justify-center bg-white px-5 pb-3">
      <RButton
        title="Save"
        type="primary"
        :disabled="!passValidateFormPayment"
        class="!bg-navy-deep !border-navy-deep !rounded-0 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full text-white"
        @click="onSubmit"
      />
    </div>
  </div>

  <RModalAlert
    v-model:visible="modalAlertState.showModal"
    title="Alarm"
    text-btn="Check"
    :description="modalAlertState.description"
    :width="280"
    @confirm="modalAlertState.showModal = false"
  />

  <!-- Pin code mobile -->
  <CartPinCode
    :visible="pinCodeState.showPinCodeMobile"
    :step-text="pinCodeState.stepText"
    :title="pinCodeState.titlePinCode"
    :error-validate="pinCodeState.errorValidate"
    :is-refresh="pinCodeState.isRefresh"
    class="md:hidden"
    @close="modalPinCode.closePinPopup"
    @final-pin-code="getFinalPinCode"
  />
  <!-- Pin code mobile -->
  <!-- Pin code desktop -->
  <CartPinCodeDesktop
    :visible="pinCodeState.showPinCodeDesktop"
    :step-text="pinCodeState.stepText"
    :title="pinCodeState.titlePinCode"
    :error-validate="pinCodeState.errorValidate"
    :is-refresh="pinCodeState.isRefresh"
    class="hidden md:block"
    @close="modalPinCode.closePinPopup"
    @final-pin-code="getFinalPinCode"
  />
  <!-- Pin code desktop -->

  <RModalConfirm
    v-model:visible="pageState.visibleAlert"
    :width="370"
    :text-ok="$t('auth.sign_up.agree_term_condition.use_address')"
    text-cancel="Edit Address"
    :mask-closable="false"
    @ok="onSubmit"
    @cancel="pageState.visibleAlert = false"
  >
    <template #extraDescription>
      <span> {{ pageState.descriptionAlert }}</span>
    </template>
  </RModalConfirm>
</template>
<script setup>
import { AppRoutes } from '@/router/path'
import { reactive, ref } from 'vue'
import { VALUE_COUNTRY, MESSAGE_PINCODE } from '@/helpers/constant'
import { formatCellphoneToSend } from '@/utils/common'
import { useCreditCardStore } from '@/stores/modules/credit-card'
import { storeToRefs } from 'pinia'
import { useModalPinCode } from '@/stores/modules/modal-pincode'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import apiService from '@/http/api'
import { VALIDATE_MESSAGE } from '@/helpers/validate-message'

const passValidateFormPayment = ref(false)
const formState = reactive({})

const pageState = reactive({
  visibleAlert: false,
  descriptionAlert: ''
})

const creditCardStore = useCreditCardStore()
const { modalAlertState } = storeToRefs(creditCardStore)
const modalPinCode = useModalPinCode()
const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading

const { pinCodeState } = storeToRefs(modalPinCode)

const updateDataPayment = (newVal) => {
  Object.assign(formState, newVal)
}

const checkStatusValidatePayment = (status) => {
  passValidateFormPayment.value = status
}

const getFinalPinCode = (pinCode) => {
  if (pinCodeState.value.currentSetPassStep < 2) {
    modalPinCode.handleUpdateToStepTwo(pinCode, MESSAGE_PINCODE.PASSCODE.contentSecond)
  } else {
    creditCardStore.createPassCode({ orderPassword: pinCode })
  }
}

const authAddress = async () => {
  try {
    showGlobalLoading(true)
    const { billAddress, billAptFloorSuite, billState, billCity, billZipCode, billCountry } =
      formState
    const payload = {
      geocode: 'true',
      addresses: [
        {
          address: `${billAddress || ''} ${billAptFloorSuite || ''} ${billCity || ''} ${
            billState || ''
          } ${billZipCode || ''}`,
          country: billCountry
        }
      ]
    }
    const response = await apiService.authService.authAddress(payload)
    if (response?.data?.isValidAddress) {
      onSubmit()
    } else {
      pageState.visibleAlert = true
      pageState.descriptionAlert = VALIDATE_MESSAGE.invalidAddress
    }
  } finally {
    showGlobalLoading(false)
  }
}

const onSubmit = () => {
  const payloadValidatePhone = {
    country: VALUE_COUNTRY.US,
    iso3Country: 'True',
    additionalFields: 'True',
    phone: formatCellphoneToSend(formState.billMobileNumber)
  }
  creditCardStore.validPhoneBeforeCreateCard(payloadValidatePhone, formState)
}
</script>

<style lang="scss" scoped>
.form-item-custom {
  @apply mb-[7px] w-full;
  .ant-input[disabled] {
    cursor: pointer;
  }
}

.form-item-group {
  @apply mb-2;

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
}
</style>
