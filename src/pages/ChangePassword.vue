<template>
  <div class="container-custom flex min-h-screen lg:h-screen lg:items-center">
    <div class="mx-auto w-[367px] bg-white md:w-[500px]">
      <div class="flex h-[530px] flex-col px-5 py-[30px] lg:h-auto">
        <div class="flex-1">
          <p class="font-550 text-gray-black mb-0 pb-[36px] text-center text-[18px] leading-normal">
            Change Password
          </p>

          <a-form ref="formRef" :rules="rules" :model="formState" class="form-wrap md:!mb-10">
            <RLabel
              title="Choose Password"
              required
              class-title="!text-[16px] !font-475 !leading-[22px] !text-gray-10"
            />
            <a-form-item name="password" class="form-item-group">
              <RInputPassword
                v-model:value="formState.password"
                placeholder="Please enter your change password"
              />
            </a-form-item>
            <p class="text-gray-14 text-[10px] font-normal">
              8 to 16 letters in uppercase letters, lowercase letters, numbers, and special
              characters
            </p>
            <p class="text-gray-14 text-[10px] font-normal">
              {{ `<!>This password is used when you log in with your member number.` }}
            </p>
            <div class="pt-[36px]"></div>
            <RLabel
              title="Password Confirm"
              required
              class-title="!text-[16px] !font-475 !leading-[22px] !text-gray-10"
            />
            <a-form-item name="passwordConfirm" class="form-item-group !mb-0">
              <RInputPassword
                v-model:value="formState.passwordConfirm"
                placeholder="Please enter password again"
              />
            </a-form-item>
            <span
              v-if="isMatchPassword"
              class="text-blue-1100 text-[10px] font-normal leading-[10px]"
            >{{ PASSWORD_MESSAGE.bothPassMatch }}</span
            >
            <span
              v-if="!isMatchPassword && formState.password && formState.passwordConfirm"
              class="text-red-1000 text-[10px] font-normal leading-[10px]"
            >{{ CHANGE_PASSWORD.passNotMatch }}</span
            >
          </a-form>
        </div>

        <div class="flex w-full gap-[5px] pt-9">
          <div class="w-1/2">
            <RButton
              title="Cancel"
              height="40px"
              class-title="text-navy-6 font-550 text-[14px]"
              class="!border-navy-6 w-full border border-solid bg-white"
              @click="onCancel"
            />
          </div>
          <div class="w-1/2">
            <RButton
              title="Change Password"
              :loading="isLoading"
              class="!bg-navy-6 w-full !border-none"
              class-title="text-white text-[14px] font-550"
              height="40px"
              @click="onConfirm"
            />
          </div>
        </div>
      </div>
      <RModalAlert
        v-model:visible="formState.isShowModalConfirm"
        :title="formState.titleModal"
        text-btn="Confirm"
        :description="formState.descriptionModal"
        :width="350"
        :after-close="gotoLoginPage"
        @confirm="gotoLoginPage"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { requiredRule, passwordRule } from '@/helpers/validation'
import { useRouter, useRoute } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { useMutation } from 'vue-query'
import apiService from '@/http/api'
import RInputPassword from '@/components/common/RInputPassword.vue'
import { CHANGE_PASSWORD, PASSWORD_MESSAGE } from '@/helpers/validate-message'
import { REGEX_PASSWORD } from '@/helpers/regex'
import RLabel from '@/components/common/RLabel.vue'
import RButton from '@/components/common/RButton.vue'
import RModalAlert from '@/components/common/RModalAlert.vue'

const router = useRouter()
const route = useRoute()

const userId = route.query.userId
const token = route.query.token
const formState = reactive({
  password: undefined,
  passwordConfirm: undefined,
  isShowModalConfirm: false,
  titleModal: 'Alarm',
  descriptionModal: '',
  isSuccess: false
})

const isMatchPassword = computed(() => checkMathPassWord())

const rules = reactive({
  password: [requiredRule('A password', 'is a required entry'), passwordRule('password')],
  passwordConfirm: [requiredRule('A password', 'is a required entry'), passwordRule('password')]
})

const formRef = ref()

const execRegex = () =>
  REGEX_PASSWORD.exec(formState.password) && REGEX_PASSWORD.exec(formState.passwordConfirm)

const checkMathPassWord = () => {
  if (formState.password && formState.passwordConfirm && execRegex()) {
    return formState.password === formState.passwordConfirm
  }

  return false
}

const onCancel = () => {
  router.push({ name: AppRoutes.login.name })
}

const gotoLoginPage = () => {
  if (formState.isSuccess) {
    router.push(AppRoutes.login)
  } else {
    formState.isShowModalConfirm = false
  }
}

const { mutate: changeUserPassMutation, isLoading } = useMutation(
  async (payload) => {
    return await apiService.authService.changeUserPassword(payload)
  },
  {
    onSuccess: (data) => {
      if (data?.success) {
        formState.isSuccess = true
        formState.descriptionModal = CHANGE_PASSWORD.changeSuccess
      } else {
        formState.isSuccess = false
        formState.descriptionModal = CHANGE_PASSWORD.systemError
      }
      formState.isShowModalConfirm = true
    },
    onError: () => {
      formState.isSuccess = false
    }
  }
)

const onConfirm = async () => {
  if (!userId) {
    formState.descriptionModal = CHANGE_PASSWORD.systemError
    formState.isShowModalConfirm = true
  }
  try {
    // get data with this value
    const formData = await formRef.value.validate()
    changeUserPassMutation({
      userId,
      token,
      password: formData.password
    })
  } catch (error) {
    //
  }
}
</script>

<style lang="scss" scoped>
.container-custom {
  background-image: url('@/assets/images/login-bg.webp');
  @apply flex min-h-full items-center justify-center p-5;
  @apply lg:min-h-screen;
}

.text {
  &__title {
    @apply text-gray-10 mt-[50px] whitespace-pre-wrap text-2xl font-medium;
    @apply lg:mt-4 lg:text-center;
  }

  &__description {
    @apply font-350 text-gray-1 mb-7 whitespace-pre-wrap text-2xl text-sm;
    @apply lg:text-center;
  }
}

.form-item-group {
  @apply mb-5 mt-3;

  &.ant-form-item-has-error {
    @apply mb-0;
  }
}

.btn {
  &__group {
    box-shadow: -5px 0 10px rgba(0, 0, 0, 0.1);
    @apply -mx-5 grid grid-cols-2 gap-2.5 px-3 py-5;
    @apply lg:shadow-none;
  }

  &__custom {
    @apply text-white;
  }
}
</style>
