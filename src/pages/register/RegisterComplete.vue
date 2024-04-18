<template>
  <div class="container-custom">
    <div class="register__wrap">
      <div class="register__heading">
        <span
          class="font-550 mb-5 block text-lg leading-none"
          :class="isCorporate ? 'text-navy-6' : 'text-black-50'"
        >
          {{ isCorporate ? 'Sign Up Complete' : 'Success!' }}
        </span>
        <RHeading
          :class-title="`whitespace-pre-wrap ${!isCorporate ? '!text-black-50' : ''}`"
          :title="textWelcome"
        />

        <div class="membership">
          <div class="membership__text">{{ $t('common.membership_number') }} : {{ userId }}</div>

          <a-tooltip
            v-model:visible="isShowCopied"
            class="membership__copy"
            trigger="click"
            @visible-change="onCopy"
          >
            <template #title>{{ $t('common.copied') }}</template>
            <IconCopy /> {{ $t('common.copy') }}
          </a-tooltip>
        </div>
      </div>
      <div v-if="isCorporate" class="bg-white px-5">
        <p class="text-lg font-medium">
          {{ $t('auth.sign_up.register_complete.business_benefit') }}
        </p>
        <p class="text-lg opacity-70">
          {{ $t('auth.sign_up.register_complete.business_registration') }}
        </p>
        <p class="text-lg font-medium">하단 관련 안내 문구 노출</p>
      </div>
      <div v-else class="w-full bg-white px-2">
        <img src="@/assets/images/register-complete.webp" alt="" class="w-full" />
      </div>
      <div class="bg-white px-2 pb-4">
        <div class="welcome__description">
          <RButton
            v-if="isCorporate"
            title="Enter Business Information"
            class="!bg-navy-6 !border-navy-6 mb-2 w-full"
            class-title=" text-white whitespace-pre-line"
            @click="goToEnterBusinessInformation"
          />

          <RButton
            title="Start RIMAN"
            class="!bg-navy-6 !border-navy-6 mb-2 w-full"
            class-title=" text-white whitespace-pre-line"
            @click="goToMain"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  STORAGE_ENTER_INFORMATION,
  STORAGE_USER_NUMBER,
  STORAGE_USER_TYPE
} from '@helpers/constant'
import { storage } from '@/utils/storage'
import { AuthUserEnum } from '@/helpers/enum'
import IconCopy from '@/assets/svgs/icon-copy.svg'
import apiService from '@/http/api'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { STORAGE_ACCESS_TOKEN, STORAGE_IS_LOGGED_IN } from '@/helpers/constant'
import { getSaveTokenStorage } from '@/utils/auth'
import { useI18n } from 'vue-i18n'
import RButton from '@/components/common/RButton.vue'
import RHeading from '@/components/common/RHeading.vue'

const { t } = useI18n()
const router = useRouter()
const isShowCopied = ref(false)
const timeoutId = ref(null)
const authUserStore = useAuthUserStore()

const { setCurrentAuthUser } = authUserStore

const isCorporate = computed(
  () => storage.get(STORAGE_USER_TYPE)?.userType === AuthUserEnum.CO_OPERATE
)

const { firstName, lastName } = storage.get(STORAGE_ENTER_INFORMATION) || {}
const userId = storage.get(STORAGE_USER_NUMBER)

const fullName = computed(() => {
  if (firstName && lastName) return `${firstName} ${lastName}`
  if (firstName) return firstName
  if (lastName) return lastName

  return ''
})

const textWelcome = computed(() =>
  t('auth.sign_up.register_complete.joining', {
    fullName: fullName.value
  })
)

const description = computed(() => {
  if (isCorporate.value) {
    return {
      subtitle1: t('auth.sign_up.register_complete.benefits')
    }
  }

  return {
    subtitle1: t('auth.sign_up.register_complete.discount'),
    link: t('auth.sign_up.register_complete.coupons'),
    subtitle2: ''
  }
})

const getMe = async () => {
  const response = await apiService.authService.me()
  if (response.success) {
    setCurrentAuthUser(response.data)
    const saveStorage = getSaveTokenStorage()
    storage.set(STORAGE_IS_LOGGED_IN, true, saveStorage)
  } else {
    setCurrentAuthUser(null)
  }
}

const goToMain = () => {
  router.push('/')
}

const goToEnterBusinessInformation = () => {
  router.push('/register/business-information')
}

const onCopy = (show) => {
  if (timeoutId.value && !show) {
    isShowCopied.value = true
  }
  navigator.clipboard.writeText(userId)

  if (timeoutId.value) clearTimeout(timeoutId.value)

  timeoutId.value = setTimeout(() => {
    isShowCopied.value = false
  }, 1000)
}
onBeforeUnmount(() => {
  storage.remove(STORAGE_USER_TYPE)
  storage.remove(STORAGE_ENTER_INFORMATION)
  storage.remove(STORAGE_USER_NUMBER)
})
onMounted(() => {
  if (storage.get(STORAGE_ACCESS_TOKEN, 'localStorage')) getMe()
})
</script>

<style lang="scss" scoped>
.container-custom {
  background-image: url('@/assets/images/register-complete-bg.webp');
  @apply flex min-h-full items-center justify-center;
  @apply lg:min-h-screen;
}

.register {
  &__wrap {
    @apply flex h-full max-w-md flex-col p-5;
    @apply lg:h-auto;
  }

  &__heading {
    @apply border-none bg-white px-5 pb-6 pt-[50px];
    @apply lg:border-1 lg:border-gray-6 lg:border-b-0 lg:border-solid;
  }
}

.membership {
  @apply mt-5 flex items-center gap-5 leading-none;
}

:deep(.membership__copy) {
  background: rgba(224, 224, 224, 0.4);
  @apply text-black-50 font-625 flex h-5 cursor-pointer items-center gap-1 rounded-[3px] px-1.5 text-[10px];
}

.welcome__description {
  letter-spacing: -0.28px;

  @apply text-black-50 mt-6 text-sm;

  &-subtitle {
    @apply font-350 text-gray-12 whitespace-pre-wrap leading-[22px];
  }

  &-link {
    @apply text-black-50 font-medium leading-[22px];
  }
}
</style>
