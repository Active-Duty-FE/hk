<template>
  <a-form ref="formRef" :model="formState" :rules="rules" class="h-full">
    <div class="flex h-full flex-col">
      <div><r-label title="E-Mail" :required="true" /></div>
      <div class="pt-[8px]">
        <a-form-item name="email" class="!mb-2 w-full">
          <r-input v-model:value="formState.email" placeholder="abc@abc.abcd" />
        </a-form-item>
        <r-button
          :title="$t('auth.find_account.send_certify')"
          class-title="text-white"
          :loading="isLoadingVerify"
          class="!bg-navy-6 !border-navy-6 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full"
          @click="sendData"
        />
      </div>
      <div class="pt-2" :class="{ 'mb-[45px]': isModal }">
        <a-form-item name="code" class="!mb-2 w-full">
          <r-input
            v-model:value="formState.code"
            :disabled="!formState.isSendMailSuccess"
            placeholder="Enter Verification Number"
          />
        </a-form-item>
        <r-button
          :title="$t('common.certification')"
          type="primary"
          :disabled="!formState.code || !formState.isSendMailSuccess"
          :loading="isLoadingVerifyCode"
          class="!text-gray-10 !border-gray-10 disabled:(!border-1 !border-gray-10 !bg-white) disabled:(opacity-[0.2]) w-full !border-solid !bg-white opacity-[1]"
          @click="verifyCode"
        />
      </div>
    </div>
  </a-form>
  <RModalAlert
    v-model:visible="formState.isShowModalAlarm"
    title="Alarm"
    text-btn="Confirm"
    :description="formState.descriptionModal"
    :width="280"
    :duration="3000"
    @confirm="confirmCertify"
    @self-close="formState.isShowModalAlarm = false"
  />
</template>
<script setup>
import { AuthUserEnum } from '@/helpers/enum'
import { ALPHABETS, ESCAPE } from '@/helpers/regex'
import apiService from '@/http/api'
import { formatPhoneNumber } from '@/utils/common'
import { reactive, ref, watch } from 'vue'
import { useMutation } from 'vue-query'
import { FIND_ACCOUNT, VALIDATE_MESSAGE } from '@/helpers/validate-message'
import { validateRequired } from '@/helpers/handle-validate'
import RInput from '@/components/common/RInput.vue'
import RButton from '@/components/common/RButton.vue'
import RLabel from '@/components/common/RLabel.vue'
import RModalAlert from '@/components/common/RModalAlert.vue'
import { STORAGE_USER_NUMBER_FIND_ACCOUNT } from '@/helpers/constant'
import { storage } from '@/utils/storage'

const props = defineProps({
  changeStatus: {
    type: Function,
    default: () => {}
  },
  userType: {
    type: String,
    default: AuthUserEnum.CONSUMER
  },
  isModal: {
    type: Boolean,
    default: false
  }
})

const formState = reactive({
  email: '',
  code: '',
  match: false,
  userId: '',
  isShowModalAlarm: false,
  descriptionModal: '',
  isSendPhoneSuccess: false,
  isSendMailSuccess: false,
  isVerifySuccess: false,
  token: ''
})
const formRef = ref()

const rules = reactive({
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
  code: [{ validator: validateRequired, trigger: 'change' }]
})

const { mutate: mutationVerify, isLoading: isLoadingVerify } = useMutation(
  async (payload) => {
    return await apiService.authService.findAccountSend(payload)
  },
  {
    onSuccess: (response) => {
      if (response.success && response.data) {
        formState.isSendPhoneSuccess = true
        formState.isSendMailSuccess = true
        formState.descriptionModal = FIND_ACCOUNT.sendPhoneSuccess
        formState.token = response.data.token
      } else {
        formState.isSendPhoneSuccess = false
        formState.isSendMailSuccess = false
        formState.descriptionModal = response.message
      }
      formState.isShowModalAlarm = true
    }
  }
)
const { mutate: mutationVerifyCode, isLoading: isLoadingVerifyCode } = useMutation(
  async (payload) => {
    return await apiService.authService.findAccountVerify(payload)
  },
  {
    onSuccess: (response) => {
      if (response.success && response?.data && response.data.match) {
        formState.isSendPhoneSuccess = true
        formState.descriptionModal = FIND_ACCOUNT.confirmSuccess
        formState.userId = response.data.userNumber
      } else {
        formState.userId = ''
        formState.isSendPhoneSuccess = false
        formState.descriptionModal = FIND_ACCOUNT.noId
      }
      formState.isShowModalAlarm = true
    }
  }
)

const onSubmit = () => {
  props.changeStatus({
    status: true,
    userId: formState.userId
  })
}

const sendData = () => {
  formRef.value.validate('email').then(() => {
    mutationVerify({
      email: formState.email
    })
  })
}

const verifyCode = () => {
  formRef.value.validate('email').then(() => {
    mutationVerifyCode({
      email: formState.email,
      code: formState.code,
      token: formState.token
    })
  })
}

const confirmCertify = () => {
  if (formState.userId) {
    const data = {
      userNumber: formState.userId,
      auto: false
    }
    storage.set(STORAGE_USER_NUMBER_FIND_ACCOUNT, data)
    onSubmit()
  } else {
    formState.isShowModalAlarm = false
  }
}

watch(
  () => formState.cellphone,
  (newVal) => {
    formState.cellphone = formatPhoneNumber(
      String(newVal).replace(ALPHABETS, '').replace(ESCAPE, '')
    )
  }
)

watch(
  () => formState.code,
  (newVal) => {
    formState.code = String(newVal).replace(ALPHABETS, '').replace(ESCAPE, '')
  }
)
</script>
