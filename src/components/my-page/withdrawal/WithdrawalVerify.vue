<template>
  <div class="withdrawalVerify mx-auto max-w-[450px]">
    <div class="flex-1">
      <p class="text-heading">
        Membership in the official online mall of RIMAN is restricted for 30 days upon withdrawal of
        membership.
      </p>

      <RLabel title="E-mail Address" required />
      <a-form ref="formRef" :rules="rules" :model="formState" class="!mt-2">
        <a-form-item name="email" class="!mb-2">
          <RInput v-model:value="formState.email" placeholder="Enter your email address" />
        </a-form-item>
      </a-form>

      <RButton
        title="Send Verification Number"
        class-title="font-550 text-white text-sm"
        class="!border-navy-6 !bg-navy-6 w-full"
        @click="onSendVerificationNumber"
      />

      <p class="text-note">
        We will send you an email containing a unique verification number. Please be sure to check
        your spam or junk folders if you do not see the email.
      </p>

      <RInput
        v-model:value="formState.verificationNumber"
        placeholder="Enter Verification Number"
      />

      <RButton
        title="Verify"
        class-title="font-550 text-white text-sm"
        class="!border-navy-6 !bg-navy-6 mt-2 w-full"
        :disabled="!formState.verificationNumber || !extraState.isSendMailSuccess"
        :class="classDisabled(!formState.verificationNumber || !extraState.isSendMailSuccess)"
        @click="onVerify"
      />
    </div>

    <RButton
      title="Next"
      class-title="font-550 text-white text-sm"
      class="!border-navy-6 !bg-navy-6 mb-2 w-full"
      :disabled="!formState.isVerified"
      :class="classDisabled(!formState.isVerified)"
      @click="onNext"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { emailRule } from '@/helpers/validation'
import apiService from '@/http/api'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useNotification } from '@/composables/notification'
import { storeToRefs } from 'pinia'

const { currentAuthUser } = storeToRefs(useAuthUserStore())
const { showGlobalLoading } = useGlobalLoadingStore()
const { showNotification } = useNotification()
const emits = defineEmits(['verify'])
const formRef = ref()

const formState = reactive({
  email: '',
  verificationNumber: '',
  isVerified: false
})

const extraState = reactive({
  token: '',
  sender: '',
  isSendMailSuccess: false
})

const rules = reactive({
  email: [emailRule('Email address')]
})

const classDisabled = (value) => {
  if (!value) return ''
  return '!border-transparent !bg-opacity-20'
}

const onSendVerificationNumber = async () => {
  try {
    showGlobalLoading(true)
    await formRef.value.validate()
    const { success, data } = await apiService.myPageService.sendMailWithdraw(
      currentAuthUser.value.userSeqNo,
      { email: formState.email }
    )
    if (!success) return showNotification({ type: 'error', message: data })
    showNotification({ type: 'success', message: 'Send mail verification successfully' })
    extraState.isSendMailSuccess = true
    extraState.sender = data?.sender
    extraState.token = data?.token
  } catch (error) {
    console.log(error)
  } finally {
    showGlobalLoading(false)
  }
}

const onVerify = async () => {
  const payload = {
    code: formState.verificationNumber,
    token: extraState.token
  }
  const { success, data } = await apiService.myPageService.verifyCodeWithdraw(
    currentAuthUser.value.userSeqNo,
    payload
  )
  if (!success || !data?.match) {
    return showNotification({ type: 'error', message: data.message || data })
  }
  if (data && data.match) {
    showNotification({ type: 'success', message: 'Verify successfully' })
    formState.isVerified = true
  }
}

const onNext = () => {
  emits('verify')
}
</script>

<style lang="scss" scoped>
.withdrawalVerify {
  height: calc(100dvh - 65px - 61px - 50px - 40px);
  @apply flex flex-col;
}

.text-heading {
  @apply text-gray-10 font-550 mb-10 text-base leading-[22px];
}

.text-note {
  @apply leading-base text-gray-14 mb-5 mt-2 text-xs font-normal;
}
</style>
