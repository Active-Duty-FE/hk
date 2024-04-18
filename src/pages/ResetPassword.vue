<template>
  <div class="container-custom flex min-h-screen lg:h-screen lg:items-center">
    <div class="mx-auto bg-white">
      <div class="flex h-[530px] w-[367px] flex-col px-5 py-[30px] md:w-[500px] lg:h-auto">
        <div class="flex-1">
          <p class="text__title font-550 text-center text-[18px] leading-normal">
            {{ TEXT_DISPLAY.title }}
          </p>
          <p
            class="text__description mx-auto mb-[36px] w-[292px] w-full text-center text-[12px] font-normal leading-normal"
          >
            {{ TEXT_DISPLAY.description }}
          </p>

          <a-form ref="formRef" :rules="rules" :model="formState" class="form-wrap">
            <RLabel :title="$t('common.id')" required />
            <a-form-item name="membershipNumber" class="form-item-group">
              <RInput
                v-model:value="formState.membershipNumber"
                :maxlength="10"
                :placeholder="$t('auth.sign_in.placeholder_id')"
              />
            </a-form-item>

            <a-form-item name="email" class="!mt-7">
              <RLabel :title="$t('common.email')" required />
              <RInput v-model:value="formState.email" placeholder="abc@abc.abcd" />
            </a-form-item>
          </a-form>
        </div>

        <div class="flex w-full gap-[5px] pt-9">
          <div class="w-1/2">
            <RButton
              :title="$t('common.cancel')"
              height="40px"
              class-title="text-navy-6 font-550 text-[14px]"
              class="!border-navy-6 w-full border border-solid bg-white"
              @click="onCancel"
            />
          </div>
          <div class="w-1/2">
            <RButton
              :title="$t('common.confirm')"
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
        :after-close="gotoLoginPage"
        :text-btn="$t('common.confirm')"
        :width="350"
        @confirm="gotoLoginPage"
      >
        <template #extraTitle>
          <span class="whitespace-pre-wrap text-base font-bold">{{ $t('common.id') }}</span>
        </template>
        <template #extraDescription>
          <span class="whitespace-pre-wrap">{{ formState.descriptionModal }}</span>
        </template>
      </RModalAlert>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { emailRule, requiredRule } from '@/helpers/validation'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { useI18n } from 'vue-i18n'
import apiService from '@/http/api'
import { useMutation } from 'vue-query'
import { RESET_PASSWORD } from '@/helpers/validate-message'
import RLabel from '@/components/common/RLabel.vue'
import RInput from '@/components/common/RInput.vue'
import RButton from '@/components/common/RButton.vue'
import RModalAlert from '@/components/common/RModalAlert.vue'
import { convertStringNumber } from '@/utils/common'
import storage from '@/utils/storage'
import { STORAGE_USER_NUMBER_FIND_ACCOUNT } from '@/helpers/constant'

const router = useRouter()
const { t } = useI18n()
const TEXT_DISPLAY = {
  description: t('auth.reset_password.content_1'),
  title: t('common.reset_password')
}

const formState = reactive({
  membershipNumber: undefined,
  isShowModalConfirm: false,
  titleModal: t('common.alarm'),
  descriptionModal: undefined,
  isSuccess: false
})

const rules = reactive({
  membershipNumber: [requiredRule(t('common.id'))],
  email: [requiredRule(t('common.email')), emailRule(t('common.email'))]
})

const formRef = ref()

const onCancel = () => {
  router.push({ name: AppRoutes.login.name })
}

const { mutate: findUserPassMutation, isLoading } = useMutation(
  async (payload) => {
    return await apiService.authService.findUserPassword(payload)
  },
  {
    onSuccess: (data) => {
      if (data?.success && data?.data?.userId) {
        showAlarmError(true, RESET_PASSWORD.mailSuccess)
      } else {
        showAlarmError(false, RESET_PASSWORD.systemError)
      }
    },
    onError: () => {
      formState.isSuccess = false
    }
  }
)

const showAlarmError = (success, content) => {
  formState.isSuccess = success
  formState.descriptionModal = content
  formState.isShowModalConfirm = true
}

const gotoLoginPage = () => {
  if (formState.isSuccess) {
    router.push(AppRoutes.login)
  } else {
    formState.descriptionModal = ''
    formState.isShowModalConfirm = false
  }
}

const onConfirm = async () => {
  if (!formState.membershipNumber) {
    formState.descriptionModal = RESET_PASSWORD.idRequired
    formState.isShowModalConfirm = true
  } else if (!formState.email) {
    formState.descriptionModal = RESET_PASSWORD.mailRequired
    formState.isShowModalConfirm = true
  }
  try {
    // get data with this value
    const formData = await formRef.value.validate()
    findUserPassMutation({
      membershipNumber: formData.membershipNumber.trim(),
      email: formData.email
    })
  } catch (error) {
    //
  }
}
watch(
  () => formState.membershipNumber,
  () => {
    formState.membershipNumber = convertStringNumber(formState.membershipNumber)
  }
)

const getNumberUserFromFindAccount = () => {
  const data = storage.get(STORAGE_USER_NUMBER_FIND_ACCOUNT)
  if (data?.auto) {
    formState.membershipNumber = data.userNumber
  }
  storage.remove(STORAGE_USER_NUMBER_FIND_ACCOUNT)
}

onMounted(() => {
  getNumberUserFromFindAccount()
})
</script>

<style lang="scss" scoped>
.container-custom {
  background-image: url('@/assets/images/login-bg.webp');
  @apply flex min-h-full items-center justify-center p-5;
  @apply lg:min-h-screen;
}

.form-item-group {
  @apply mb-2;

  &.ant-form-item-has-error {
    @apply mb-0;
  }
}

.btn {
  &__group {
    box-shadow: -5px 0 10px rgba(0, 0, 0, 0.1);
    @apply -mx-5 grid grid-cols-2 gap-2.5 px-3 py-5;
    @apply lg:px-1/4 lg:mx-0 lg:shadow-none;
  }

  &__custom {
    @apply text-white;
  }
}
</style>
