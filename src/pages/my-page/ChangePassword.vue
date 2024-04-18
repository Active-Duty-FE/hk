<template>
  <div class="changePassword">
    <a-form ref="formRef" :rules="rules" :model="formState" class="flex flex-1 flex-col">
      <a-form-item name="currentPassword" class="form-item-group">
        <RLabel title="Current Password" required />
        <RInputPassword
          v-model:value="formState.currentPassword"
          placeholder="Please enter your current password"
        />
      </a-form-item>

      <a-form-item name="changedPassword" class="form-item-custom">
        <RLabel title="Change Password" required />
        <RInputPassword
          v-model:value="formState.changedPassword"
          placeholder="Please enter your change password"
        />
      </a-form-item>
      <p class="text-gray-14 text-[10px] font-normal leading-[10px]">
        8 to 16 letters in uppercase letters, lowercase letters, numbers, and special characters
      </p>
      <p class="text-gray-14 mb-7 text-[10px] font-normal leading-[10px]">
        {{ `<!>This password is used when you log in with your member number.` }}
      </p>

      <a-form-item name="confirmPassword" class="form-item-group">
        <RLabel title="Confirm Change Password" required />
        <RInputPassword
          v-model:value="formState.confirmPassword"
          placeholder="Please enter your change password again"
        />
      </a-form-item>
    </a-form>

    <div class="mx-auto grid w-full max-w-[350px] grid-cols-2 gap-1">
      <RButton
        title="Cancel"
        class-title="font-550 text-navy-6 text-sm"
        class="!border-navy-6 w-full"
        @click="onCancel"
      />

      <RButton
        title="Confirm"
        class-title="font-550 text-white text-sm"
        class="!border-navy-6 !bg-navy-6 w-full"
        @click="onConfirm"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, toRef, watch } from 'vue'
import { useRouter } from 'vue-router'
import { confirmPasswordRule, passwordRule, requiredRule } from '@/helpers/validation'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useNotification } from '@/composables/notification'

const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading
const { showNotification } = useNotification()

const formRef = ref()
const router = useRouter()
const formState = reactive({
  currentPassword: '',
  changedPassword: '',
  confirmPassword: ''
})

const rules = reactive({
  currentPassword: [requiredRule('Current Password'), passwordRule('Current Password')],
  changedPassword: [requiredRule('Change Password'), passwordRule('Change Password')],
  confirmPassword: [
    requiredRule('Confirm Change Password'),
    confirmPasswordRule('Confirm Change Password', toRef(formState, 'changedPassword'))
  ]
})

watch(
  () => formState.changedPassword,
  (value) => {
    if (value && formState.confirmPassword) {
      formRef.value.validateFields('confirmPassword')
    }
  }
)

const onCancel = () => {
  router.go(-1)
}

const onConfirm = async () => {
  try {
    showGlobalLoading(true)
    await formRef.value.validate()
    const { success, message } = await apiService.myPageService.changePassword(formState)
    showGlobalLoading(false)

    if (success) {
      showNotification({ type: 'success', message: 'Password has changed' })
      onCancel()
    } else {
      showNotification({ type: 'error', message })
    }
  } catch {
    showGlobalLoading(false)
  }
}
</script>

<style lang="scss" scoped>
.changePassword {
  height: calc(100dvh - 65px - 61px - 50px - 40px);
  @apply flex flex-col;
}

.ant-form-item {
  @apply mb-7.5;
}

.ant-form-item-has-error {
  @apply mb-1.5;
}

.form-item-custom {
  @apply mb-2;

  &.ant-form-item-has-error {
    @apply mb-0;
  }
}
</style>
