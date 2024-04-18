<template>
  <a-form ref="formRef" :model="formState" :rules="rules" class="h-full">
    <r-label title="Cell phone" :required="true" />

    <div class="flex h-full flex-col">
      <div class="pt-[8px]">
        <a-form-item name="cellphone" class="!mb-2 w-full">
          <r-input
            v-model:value="formState.cellphone"
            :maxlength="14"
            placeholder="Cell Phone Number"
          />
        </a-form-item>
        <r-button
          :title="$t('auth.find_account.send_certify')"
          type="primary"
          :loading="orderStore.loadingCellphone"
          :disabled="isDisableButtonSendPhone"
          class="!bg-navy-1 !border-navy-1 disabled:(opacity-[0.2] !text-white) w-full !min-w-[121px]"
          @click="sendData"
        />
      </div>
      <p class="text-gray-16 mt-2 text-xs">
        We will send you a text message containing a unique verification nu mber. Message and data
        rates may apply.
      </p>
      <div class="pt-2" :class="'mb-[45px]'">
        <a-form-item name="code" class="!mb-2 w-full">
          <r-input v-model:value="formState.code" placeholder="Enter Verification Number" />
        </a-form-item>
        <r-button
          title="Certification"
          type="primary"
          :loading="orderStore.loadingVerifyCodePhone"
          :disabled="isDisableButtonVerifyCode"
          class="!text-gray-10 !border-gray-10 disabled:(!border-1 !border-gray-10 !bg-white) disabled:(opacity-[0.2]) w-full !border-solid !bg-white opacity-[1]"
          @click="verifyCode"
        />
      </div>
      <r-button
        title="Confirm"
        html-type="submit"
        type="primary"
        :disabled="!orderStore.matchPhone"
        class="!bg-navy-1 !border-navy-1 disabled:(!bg-navy-4 border-1 !border-navy-4) !h-15 w-full cursor-pointer !text-white"
        @click="onSubmit"
      />
    </div>
  </a-form>
</template>
<script setup>
import { ALPHABETS, ESCAPE, ONLY_NUMBER, REGEX_START_BINARY } from '@/helpers/regex'
import { formatCellphoneToSend, formatPhoneNumber } from '@/utils/common'
import { reactive, ref, watch } from 'vue'
import { FIND_ACCOUNT, VALIDATE_MESSAGE } from '@/helpers/validate-message'
import { CELLPHONE_LENGTH } from '@/helpers/constant'
import { useOrderStore } from '@/stores/modules/order'
import { getFullName } from '@/utils/auth'
import RButton from '@/components/common/RButton.vue'
const emits = defineEmits(['handle-data'])

const formState = reactive({
  cellphone: '',
  code: '',
  userId: '',
  isShowModalAlarm: false,
  descriptionModal: '',
  isSendPhoneSuccess: false,
  isVerifySuccess: false
})
const formRef = ref()

const orderStore = useOrderStore()

const isDisableButtonVerifyCode = ref(true)
const isDisableButtonSendPhone = ref(true)

const validatePhoneNumber = async (_rule, value) => {
  if (!value) {
    isDisableButtonSendPhone.value = true
    return Promise.reject(FIND_ACCOUNT.cellPhoneEmpty)
  } else if (!REGEX_START_BINARY.test(formatCellphoneToSend(value)[0])) {
    isDisableButtonSendPhone.value = true
    return Promise.reject(VALIDATE_MESSAGE.startBinary)
  } else if (formatCellphoneToSend(value).length < CELLPHONE_LENGTH) {
    isDisableButtonSendPhone.value = true
  } else {
    isDisableButtonSendPhone.value = false
    return Promise.resolve()
  }
}

const validateCode = (_, value) => {
  if (!value) {
    isDisableButtonVerifyCode.value = true
    return Promise.reject(FIND_ACCOUNT.codeEmpty)
  } else {
    if (!ONLY_NUMBER.test(value)) {
      isDisableButtonVerifyCode.value = true
      return Promise.reject(FIND_ACCOUNT.codeInvalid)
    } else {
      isDisableButtonVerifyCode.value = false
      return Promise.resolve()
    }
  }
}

const rules = reactive({
  cellphone: [{ validator: validatePhoneNumber, trigger: 'change' }],
  code: [{ validator: validateCode, trigger: 'change' }]
})

const onSubmit = () => {
  emits('handle-data', {
    token: orderStore.tokenPhone,
    code: formState.code,
    phoneNumber: formatCellphoneToSend(formState.cellphone)
  })
}

const sendData = () => {
  orderStore.sendPhoneCardAuth({
    phoneNumber: formatCellphoneToSend(formState.cellphone),
    userName: getFullName.value
  })
}

const verifyCode = () => {
  orderStore.verifyCodePhoneCardAuth({
    phoneNumber: formatCellphoneToSend(formState.cellphone),
    code: formState.code,
    token: orderStore.tokenPhone
  })
}

watch(
  () => formState.cellphone,
  (newVal) => {
    formState.cellphone = formatPhoneNumber(
      String(newVal).replace(ALPHABETS, '').replace(ESCAPE, '')
    )
  }
)
</script>
