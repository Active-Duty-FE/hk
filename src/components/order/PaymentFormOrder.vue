<template>
  <a-form ref="formRef" :model="formState" :rules="rules">
    <!-- Card -->
    <a-form-item name="creditCard" class="!mb-[15px]">
      <div class="custom-radio">
        <r-radio
          v-model:value="formState.creditCard"
          :options="CARD_OPTIONS.filter((item) => item.value === PaymentMethodEnum.CREDIT_CARD)"
        />
      </div>
    </a-form-item>
    <div v-if="isMember">
      <ListCreditCard v-if="orderStore.listCards.length > 0" :data-card="orderStore.listCards" />
    </div>

    <div class="cursor-pointer" @dblclick="changeStatusChooseCard(CHOOSE_CARD.ENTER_CARD)">
      <div class="flex gap-[5px]">
        <a-form-item name="cardFirstName" class="form-item-custom">
          <r-input
            v-model:value="formState.cardFirstName"
            placeholder="First Name *"
            :disabled="disabledCardEnter"
          />
        </a-form-item>
        <a-form-item name="cardLastName" class="form-item-custom">
          <r-input
            v-model:value="formState.cardLastName"
            placeholder="Last Name *"
            :disabled="disabledCardEnter"
          />
        </a-form-item>
      </div>

      <a-form-item name="cardNumber" class="form-item-custom">
        <r-input
          v-model:value="formState.cardNumber"
          placeholder="Card Number *"
          :disabled="disabledCardEnter"
          :maxlength="19"
        />
      </a-form-item>

      <div class="flex gap-[5px]">
        <a-form-item name="expiredMonth" class="form-item-custom">
          <r-input
            v-model:value="formState.expiredMonth"
            :maxlength="2"
            placeholder="Expiration Date (MM) *"
            :disabled="disabledCardEnter"
          />
        </a-form-item>
        <a-form-item name="expiredYear" class="form-item-custom">
          <r-input
            v-model:value="formState.expiredYear"
            :maxlength="2"
            placeholder="Expiration Date (YY) *"
            :disabled="disabledCardEnter"
          />
        </a-form-item>
      </div>
      <span class="text-red-2 text-[10px]">{{ validateMessageExpired }}</span>
      <a-form-item name="cardCvc" class="form-item-custom">
        <r-input
          v-model:value="formState.cardCvc"
          placeholder="CVC *"
          :maxlength="lengthCvc"
          :disabled="disabledCardEnter"
        />
      </a-form-item>

      <template v-if="!disabledCardEnter && isMember">
        <a-form-item name="defaultCard" class="form-item-custom">
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
        <span class="text-red-2 ml-4 text-[10px]">{{ formState.messageRequiredSaveCard }}</span>
      </template>
    </div>
    <!-- Billing -->
    <a-divider class="bg-gray-11 !my-[30px]" />
    <r-label title="Billing Address" />
    <a-form-item name="billingType" class="!mb-[15px] !mt-5">
      <div class="custom-radio">
        <a-radio-group v-model:value="formState.billingType" :disabled="disabledCardEnter">
          <a-radio v-if="checkHasShippingDefault" :value="VALUE_BILLING.default">
            <p class="mb-[10px] text-sm font-normal">Same as shipping address</p>
            <span v-if="isMember" class="text-gray-14 whitespace-pre-line text-xs">
              {{ shippingAddressDescription(shippingDefault) }}
            </span>
            <span v-else class="text-gray-14 whitespace-pre-line text-xs">
              {{ shippingAddressDescriptionNonMember(shippingDefault) }}
            </span>
          </a-radio>
          <a-radio :value="VALUE_BILLING.enter">
            <p class="mb-[10px] text-sm font-normal">Use a different billing address</p>
          </a-radio>
        </a-radio-group>
      </div>
    </a-form-item>
    <template v-if="formState.billingType === VALUE_BILLING.enter && !disabledCardEnter">
      <a-form-item name="billCountry" class="form-item-custom">
        <r-select
          v-model:value="formState.billCountry"
          placeholder="Country *"
          :options="COUNTRY_OPTIONS"
          :disabled="disabledBillAddress"
        />
      </a-form-item>
      <div class="flex gap-2">
        <a-form-item name="billFirstName" class="form-item-custom">
          <r-input
            v-model:value="formState.billFirstName"
            placeholder="First name *"
            :disabled="disabledBillAddress"
          />
        </a-form-item>
        <a-form-item name="billLastName" class="form-item-custom">
          <r-input
            v-model:value="formState.billLastName"
            placeholder="Last name *"
            :disabled="disabledBillAddress"
          />
        </a-form-item>
      </div>
      <a-form-item name="billAddress" class="form-item-custom">
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
      <a-form-item name="billAptFloorSuite" class="form-item-custom">
        <r-input
          v-model:value="formState.billAptFloorSuite"
          placeholder="Apt/Floor/Suite"
          :disabled="disabledInputDependsCountry"
        />
      </a-form-item>
      <a-form-item name="billCity" class="form-item-custom">
        <r-input
          v-model:value="formState.billCity"
          placeholder="City *"
          :disabled="disabledInputDependsCountry"
        />
      </a-form-item>
      <a-form-item name="billState" class="form-item-custom">
        <r-select
          v-model:value="formState.billState"
          placeholder="State *"
          :options="billStateOptions"
          :disabled="disabledInputDependsCountry"
        />
      </a-form-item>
      <a-form-item name="billZipCode" class="form-item-custom">
        <r-input
          v-model:value="formState.billZipCode"
          placeholder="Zip code *"
          :disabled="disabledInputDependsCountry"
        />
      </a-form-item>

      <a-form-item name="billMobileNumber" class="form-item-custom">
        <r-input
          v-model:value="formState.billMobileNumber"
          :maxlength="14"
          placeholder="Cell phone *"
          :disabled="disabledBillAddress"
        />
      </a-form-item>

      <a-form-item name="billHomePhone" class="mb-[30px]">
        <r-input
          v-model:value="formState.billHomePhone"
          :maxlength="14"
          placeholder="Home Phone"
          :disabled="disabledBillAddress"
        />
      </a-form-item>
    </template>

    <template v-if="isMember">
      <a-divider class="bg-gray-11 !my-[30px]" />
      <a-form-item v-if="!isAutoShip" name="applePay">
        <div class="custom-radio">
          <r-radio
            v-model:value="formState.creditCard"
            :options="CARD_OPTIONS.filter((item) => item.value === PaymentMethodEnum.APPLE_PAY)"
          />
        </div>
      </a-form-item>
      <template v-if="!isMemberShipFee">
        <r-button
          title="Continue"
          :disabled="formState.chooseCard === CHOOSE_CARD.AVAILABLE_CARD"
          class="!border-navy-6 !text-navy-6 !rounded-0 disabled:(!border-navy-4 !text-navy-4) mb-4 w-full !text-base !shadow-none"
          @click="onFinishAndCreateCard"
        />
        <r-button
          v-if="!formState.agreeInfoCard && !isAutoShip"
          title="Continue as One Time Payment"
          :disabled="formState.chooseCard === CHOOSE_CARD.AVAILABLE_CARD"
          class="!border-navy-6 !text-navy-6 !rounded-0 disabled:(!border-navy-4 !text-navy-4) w-full !text-base !shadow-none"
          @click="onFinishPaymentOne"
        />
      </template>

      <r-button
        v-else-if="formState.creditCard !== PaymentMethodEnum.APPLE_PAY"
        title="Process Payment"
        :disabled="disableBtnMemberShip"
        class="!border-navy-6 !text-navy-6 !bg-navy-6 !rounded-0 disabled:(!bg-navy-4 !border-navy-4) !mb-10 w-full !text-base !text-white !shadow-none"
        @click="handlePaymentMemberShip"
      />
    </template>
    <template v-else>
      <r-button
        title="Continue"
        type="primary"
        class="!bg-navy-6 !rounded-0 disabled:(!bg-navy-4) w-full !text-base !text-white !shadow-none"
        @click="handleDataCardWhenNonMember"
      />
    </template>
  </a-form>
</template>
<script setup>
import { computed, reactive, ref, watch, nextTick } from 'vue'
import ListCreditCard from './ListCreditCard.vue'
import {
  CA_STATE_OPTIONS,
  CARD_OPTIONS,
  CHOOSE_CARD,
  COUNTRY_OPTIONS,
  SIZE_CHECKBOX,
  STATUS_PAYMENT,
  US_STATE_OPTIONS,
  VALUE_BILLING,
  VALUE_COUNTRY,
  CELLPHONE_LENGTH
} from '@/helpers/constant'
import CartCheckBox from '../cart/CartCheckBox.vue'
import useValidate from '@/composables/validate'
import { BILL_VALIDATE } from '@/helpers/bill'
import { useMutation, useQuery } from 'vue-query'
import apiService from '@/http/api'
import debounce from 'lodash/debounce'
import { handlePaymentForm } from '@/utils/handle-payment-form'
import {
  formatCardNumber,
  renderDataCardSubmit,
  renderMessageErrorDateExpired,
  shippingAddressDescription,
  shippingAddressDescriptionNonMember,
  formatCellphoneToSend,
  formatPhoneNumber
} from '@/utils/common'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { storeToRefs } from 'pinia'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useOrderStore } from '@/stores/modules/order'
import { useModalPinCode } from '@/stores/modules/modal-pincode'
import { AMEX, REGEX_CELLPHONE } from '@/helpers/regex'
import { VALIDATE_MESSAGE } from '@/helpers/validate-message'
import { PaymentMethodEnum } from '@/helpers/enum'
import { phoneRule, requiredRule } from '@/helpers/validation'

const props = defineProps({
  shippingDefault: {
    type: Object,
    default: () => {}
  },
  closeCollapseItem: {
    type: Function,
    default: () => {}
  },
  isMember: {
    type: Boolean,
    default: true
  },
  isAutoShip: {
    type: Boolean,
    default: false
  },
  isMemberShipFee: {
    type: Boolean,
    default: false
  },
  allowValid: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits([
  'handle-card-when-non-member',
  'payment-member-ship',
  'check-first-card'
])

const orderStore = useOrderStore()
const userStore = useAuthUserStore()

const { currentAuthUser } = storeToRefs(userStore)
const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading

const modalPinCode = useModalPinCode()

const { pinCodeState } = storeToRefs(modalPinCode)

const formRef = ref()

const formState = reactive({
  cardFirstName: '',
  cardLastName: '',
  cardNumber: '',
  creditCard: PaymentMethodEnum.CREDIT_CARD,
  expiredMonth: null,
  expiredYear: null,
  cardCvc: '',
  defaultCard: false,
  agreeInfoCard: false,
  billFirstName: '',
  billLastName: '',
  billAddress: '',
  billAptFloorSuite: '',
  billCity: '',
  billState: null,
  billZipCode: '',
  billCountry: null,
  billMobileNumber: '',
  billingType: VALUE_BILLING.enter,
  billAddressOptions: [],
  billHomePhone: '',
  chooseCard: CHOOSE_CARD.AVAILABLE_CARD,
  statusPayment: '',
  buttonIframe: '',
  messageRequiredSaveCard: ''
})
const validateMessageExpired = ref('')
const dataCardAfterSave = reactive({})

watch(
  () => orderStore,
  (value) => {
    formState.chooseCard = value.cardForPayment?.userFavoriteCardsId
      ? CHOOSE_CARD.AVAILABLE_CARD
      : CHOOSE_CARD.ENTER_CARD
  },
  {
    immediate: true,
    deep: true
  }
)
watch(
  () => formState.chooseCard,
  (value) => {
    if (value === CHOOSE_CARD.AVAILABLE_CARD) {
      formRef.value.resetFields()
    }
  }
)

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

const billStateOptions = computed(() =>
  formState.billCountry === VALUE_COUNTRY.US ? US_STATE_OPTIONS : CA_STATE_OPTIONS
)

watch([() => formState.billMobileNumber], ([newVal]) => {
  if (!REGEX_CELLPHONE.test(newVal) && newVal.length === CELLPHONE_LENGTH) {
    formState.billMobileNumber = formatPhoneNumber(newVal)
  }
})
watch([() => formState.billHomePhone], ([newVal]) => {
  if (!REGEX_CELLPHONE.test(newVal) && newVal?.length === CELLPHONE_LENGTH) {
    formState.billHomePhone = formatPhoneNumber(newVal)
  }
})
const checkHasShippingDefault = computed(() => {
  return Object.keys(props.shippingDefault).length > 0
})

const disabledBillAddress = computed(() => formState.billingType === VALUE_BILLING.default)

const disabledCardEnter = computed(
  () =>
    formState.chooseCard === CHOOSE_CARD.AVAILABLE_CARD ||
    formState.creditCard === PaymentMethodEnum.APPLE_PAY
)

const disabledInputDependsCountry = computed(() => {
  return !formState.billCountry
})

watch([() => formState.cardNumber], ([newVal]) => {
  formState.cardNumber = formatCardNumber(newVal)
})

watch([() => formState.billingType], ([newVal]) => {
  handlePaymentForm(newVal, formState, props.shippingDefault)
})

watch([() => formState.expiredMonth, () => formState.expiredYear], ([newMonth, newYear]) => {
  validateMessageExpired.value = renderMessageErrorDateExpired(newYear, newMonth)
})

const handlePushDataWhenSaveCard = (dataCard) => {
  orderStore.getListCard(currentAuthUser.value.userSeqNo)
  orderStore.updateDataPayment({ ...formState, statusPayment: STATUS_PAYMENT.CREATE_CARD }, true)
  orderStore.changeCardForPayment(dataCard)

  formRef.value.resetFields()

  props.closeCollapseItem()
}

const { mutate: mutationCreatePinCode } = useMutation(
  async (payload) => {
    showGlobalLoading(true)

    const response = await apiService.creditCardService.createPinCode(
      payload,
      currentAuthUser.value.userSeqNo
    )
    return response
  },
  {
    onSuccess: (res) => {
      showGlobalLoading(false)
      if (res.success) {
        if (props.isMemberShipFee) {
          orderStore.changeCardForPayment(dataCardAfterSave)
          orderStore.getListCard(currentAuthUser.value.userSeqNo, true)
          formRef.value.resetFields()
          emits('check-first-card', false)
        } else {
          handlePushDataWhenSaveCard(dataCardAfterSave)
        }
        modalPinCode.closePinPopup()
      } else {
        orderStore.handleChangeModalAlertState(true, res.message)
      }
    }
  }
)

const checkPinCodeMatch = () => {
  const pinCode = orderStore.statusPinCode.pinCode
  const isMatch = pinCode === pinCodeState.value.setUpPinCode
  if (isMatch) {
    // call api create pin code
    mutationCreatePinCode({ orderPassword: pinCode })
  } else {
    modalPinCode.updateTextValid('Security passcode not match')
  }
}
watch(
  () => [pinCodeState.value, orderStore.statusPinCode.pinCode],
  ([value, pinCode]) => {
    if (value.currentSetPassStep === 2 && pinCode) {
      checkPinCodeMatch()
    }
  },
  {
    deep: true
  }
)

const validateCvc = async (_rule, value) => {
  if (!AMEX.test(formatCellphoneToSend(formState.cardNumber)) && value.length > 3) {
    return Promise.reject(VALIDATE_MESSAGE.amexValid)
  } else return Promise.resolve()
}
const validateCardNumber = async (_rule, value) => {
  if (value) {
    if (formState.cardCvc.length > 3) formRef.value.validateFields('cardCvc')
  } else return Promise.resolve()
}

const rules = reactive({
  ...BILL_VALIDATE,
  cardCvc: [...BILL_VALIDATE.cardCvc, { validator: validateCvc, trigger: 'change' }],
  cardNumber: [...BILL_VALIDATE.cardNumber, { validator: validateCardNumber, trigger: 'change' }],
  billMobileNumber: [requiredRule('Cell Phone'), phoneRule('Cell Phone')],
  billHomePhone: [phoneRule('Home Phone')]
})

const changeStatusChooseCard = (status) => {
  formState.chooseCard = status
  orderStore.changeCardForPayment({})
}

const isValid = useValidate(formState, rules)
// Address
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
  formRef.value.clearValidate(['billAptFloorSuite', 'billCity', 'billState', 'billZipCode'])
}

const { mutate: mutationSaveCard } = useMutation(
  async (payload) => {
    showGlobalLoading(true)
    const response = await apiService.creditCardService.saveCard(
      payload,
      currentAuthUser.value.userSeqNo
    )
    return response
  },
  {
    onSuccess: (response) => {
      showGlobalLoading(false)
      if (response.success) {
        Object.assign(dataCardAfterSave, response.data)

        emits('check-first-card', false)

        if (props.isMemberShipFee) {
          emits('payment-member-ship', formState, dataCardAfterSave)
          orderStore.getListCard(currentAuthUser.value.userSeqNo, true)
          formRef.value.resetFields()
        } else handlePushDataWhenSaveCard(response.data)
      } else {
        orderStore.handleChangeModalAlertState(true, response.message)
      }
    }
  }
)

const handleSaveCard = () => {
  mutationSaveCard(renderDataCardSubmit(formState))
}
watch(
  () => formState.agreeInfoCard,
  (value) => {
    if (value) formState.messageRequiredSaveCard = ''
  }
)

const onFinishAndCreateCard = async () => {
  if (!validateMessageExpired.value) {
    formState.messageRequiredSaveCard = !formState.agreeInfoCard
      ? 'Please agree to save your card'
      : ''

    formRef.value.validateFields().then(() => {
      formState.agreeInfoCard && handleSaveCard()
    })
  }
}

const handlePaymentMemberShip = () => {
  if (!validateMessageExpired.value) {
    if (formState.agreeInfoCard) handleSaveCard()
    else emits('payment-member-ship', formState)
  }
}
const onFinishPaymentOne = () => {
  if (!validateMessageExpired.value) {
    const { chooseCard } = formState
    if (chooseCard === CHOOSE_CARD.AVAILABLE_CARD) {
      orderStore.updateDataPayment(
        {
          ...formState,
          cardForPayment: orderStore.cardForPayment,
          statusPayment: STATUS_PAYMENT.PAYMENT_ONE
        },
        true
      )
      props.closeCollapseItem()
    } else {
      formState.messageRequiredSaveCard = ''
      formRef.value.validateFields().then(() => {
        orderStore.updateDataPayment(
          { ...formState, statusPayment: STATUS_PAYMENT.PAYMENT_ONE },
          true
        )
        props.closeCollapseItem()
      })
    }
  }
}

const lengthCvc = computed(() => {
  return AMEX.test(formatCellphoneToSend(formState.cardNumber)) ? 4 : 3
})

const handleDataCardWhenNonMember = () => {
  formRef.value.validateFields().then(() => {
    emits('handle-card-when-non-member', formState)
    props.closeCollapseItem()
  })
}

watch(
  () => formState.creditCard,
  (value) => {
    if (value === PaymentMethodEnum.APPLE_PAY) {
      orderStore.updateDataPayment(
        {
          ...formState,
          statusPayment: STATUS_PAYMENT.PAYMENT_ONE
        },
        true
      )
      props.closeCollapseItem()
    } else {
      if (!Object.keys(orderStore.cardForPayment).length) {
        orderStore.updateDataPayment(
          {
            ...formState
          },
          false
        )
      } else {
        orderStore.updateDataPayment(
          {
            ...formState,
            statusPayment: formState.cardNumber
              ? STATUS_PAYMENT.PAYMENT_ONE
              : STATUS_PAYMENT.CREDIT_CARD
          },
          true
        )
        props.closeCollapseItem()
      }
    }
  }
)

const disableBtnMemberShip = computed(() => {
  if (Object.keys(orderStore.cardForPayment).length) return false
  else {
    return !isValid.value
  }
})
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
