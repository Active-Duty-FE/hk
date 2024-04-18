<template>
  <div class="container-custom">
    <div class="login-wrap">
      <span class="font-550 relative mb-[30px] text-center text-lg"
      >{{ $t('common.sign_in') }}
        <span
          class="absolute right-0 cursor-pointer"
          @click="openModalQrLogin()"
        ><span class="text-[14px]">QR</span> <QrCodeIcon /></span
        ></span>
      <a-form ref="formRef" :rules="rules" :model="formState" class="form-wrap">
        <a-form-item name="username" class="form-item-group">
          <RInput
            v-model:value="formState.username"
            :placeholder="$t('auth.sign_in.placeholder_id')"
          />
        </a-form-item>
        <a-form-item name="password" class="form-item-group">
          <RInputPassword
            v-model:value="formState.password"
            :placeholder="$t('auth.sign_in.placeholder_password')"
            @keyup.prevent.enter="onLogin"
          />
        </a-form-item>
      </a-form>

      <div class="flex">
        <RCheckbox v-model:checked="formState.isSaveAccount">
          <span class="text-gray-10 text-sm font-normal leading-none -tracking-[0.28px]">
            {{ $t('auth.sign_in.save_account') }}
          </span>
        </RCheckbox>

        <RCheckbox v-model:checked="formState.isAutomaticLogin">
          <span class="text-gray-10 text-sm font-normal leading-none -tracking-[0.28px]">
            {{ $t('auth.sign_in.automatic_login') }}
          </span>
        </RCheckbox>
      </div>

      <RButton
        :title="$t('common.sign_in')"
        class-title="text-white"
        class="btn-custom !bg-black-50 !border-black-50 mt-5 uppercase"
        @click="onLogin"
      />

      <div class="action__group">
        <span class="action__item underline" @click="goToResetPassword">{{
          $t('common.reset_password')
        }}</span>
        <span class="action__item" @click="goFindAccount">{{ $t('common.find_account') }}</span>
      </div>

      <RButton class="btn-custom mb-2.5 !bg-white" @click="loginFacebook">
        <template #image>
          <FaceBook class="-mt-1" />
        </template>
        <template #content>
          <p class="text-black-50 mb-0 ml-2">
            Continue with <span class="font-625">{{ $t('common.social.facebook') }}</span>
          </p>
        </template>
      </RButton>

      <RButton class="btn-custom mb-2.5 !bg-white" @click="loginGoogle">
        <template #image>
          <Google class="-mt-1" />
        </template>
        <template #content>
          <p class="text-black-50 mb-0 ml-2">
            {{ $t('auth.sign_in.continue_with') }}
            <span class="font-625">{{ $t('common.social.google') }}</span>
          </p>
        </template>
      </RButton>
      <!--      <FormNonMemberLogin />-->
      <p class="m-auto max-w-[240px] whitespace-pre-wrap text-center text-xs">
        {{ TEXT_DISPLAY.contact }}
        <a class="!text-gray-10 font-550" href="mailto:cs@riman.com">cs@riman.com.</a>
      </p>

      <p class="font-550 mt-[32px] text-center text-lg">{{ $t('common.create_account') }}</p>
      <p class="mb-6 whitespace-pre-wrap text-center text-xs">
        {{ TEXT_DISPLAY.descriptionCreate }}
      </p>

      <RButton
        :title="$t('common.create_account')"
        class-title="text-white"
        class="btn-custom !bg-black-50"
        @click="goToRegister"
      />
    </div>
  </div>

  <RModalConfirm
    v-model:visible="formState.isShowModalConfirm"
    :title="$t('auth.sign_in.bottom_content_1')"
    :description="$t('auth.sign_in.bottom_content_2')"
    :text-ok="$t('auth.sign_in.bottom_content_3')"
    text-cancel="No"
    @ok="goToRegister"
    @cancel="formState.isShowModalConfirm = false"
  />

  <RModalAlert
    v-model:visible="formState.isShowModalAlert"
    :title="$t('common.alarm')"
    :description="formState.errorMessage"
    @confirm="formState.isShowModalAlert = false"
  />

  <RModalAlert
    v-model:visible="modalQrCode"
    title="Login with QR"
    width="300px"
    @confirm="closeModalQrCode()"
  >
    <template #extraDescription>
      <div class="relative">
        <vue-qrcode :value="customLoginUrl()"></vue-qrcode>
        <img class="qrcode__image" :src="IconQRcode" alt="riman" />
      </div>
    </template>
  </RModalAlert>
</template>

<script setup>
import { initFacebookSdk } from '@/utils/authenticate'
import { onBeforeMount, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import FaceBook from '@/assets/svgs/facebook.svg'
import Google from '@/assets/svgs/google.svg'
import IconQRcode from '@/assets/images/r-logo-rounded.webp'
import { googleTokenLogin } from 'vue3-google-login'
import { requiredRule } from '@/helpers/validation'
import appApiService from '@/http/api'
import { SNSEnum } from '@/helpers/enum'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  GOOGLE_CLIENT_ID,
  STORAGE_ACCESS_TOKEN,
  STORAGE_AUTOMATIC_LOGIN,
  STORAGE_IS_LOGGED_IN,
  STORAGE_REFRESH_TOKEN,
  STORAGE_SAVE_ACCOUNT,
  PAYLOAD_LOGIN_DEFAULT,
  STORAGE_USER_NUMBER_FIND_ACCOUNT,
  IP_DETECT_URL
} from '@helpers/constant'
import { useMenuStore } from '@/stores/modules/menu'
const menuStore = useMenuStore()
const { fetchListMenus } = menuStore
import storage from '@/utils/storage'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { AppRoutes } from '@/router/path'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import RInput from '@/components/common/RInput.vue'
import RInputPassword from '@/components/common/RInputPassword.vue'
import RCheckbox from '@/components/common/RCheckbox.vue'
import RButton from '@/components/common/RButton.vue'
import RModalConfirm from '@/components/common/RModalConfirm.vue'
import RModalAlert from '@/components/common/RModalAlert.vue'
const { t } = useI18n()
import VueQrcode from '@chenfengyuan/vue-qrcode'
import { HK_MALL_URL } from '@/helpers/constant'
import axios from 'axios'
import { getCurrentMilliseconds } from '@/utils/datetime'
import QrCodeIcon from '@/assets/images/qr-code.svg'

const storeLoading = useGlobalLoadingStore()
const { showGlobalLoading } = storeLoading

const authUserStore = useAuthUserStore()
const { setCurrentAuthUser } = authUserStore

initFacebookSdk()
const router = useRouter()
const route = useRoute()

const TEXT_DISPLAY = {
  contact: t('auth.sign_in.bottom_content_4'),
  descriptionCreate: t('auth.sign_in.bottom_content_5')
}

const formState = reactive({
  username: undefined,
  password: undefined,
  isShowModalConfirm: false,
  isShowModalAlert: false,
  errorMessage: '',
  isSaveAccount: false,
  isAutomaticLogin: false
})
const formRef = ref()
const modalQrCode = ref(false)

const rules = reactive({
  username: [requiredRule(t('common.id'))],
  password: [requiredRule(t('common.password'))]
})

onBeforeMount(() => {
  const savedAccount = storage.get(STORAGE_SAVE_ACCOUNT, 'localStorage')
  if (savedAccount) formState.username = savedAccount
})

const onLogin = async () => {
  try {
    await formRef.value.validate()

    const payload = new FormData()
    for (const key in PAYLOAD_LOGIN_DEFAULT) {
      payload.append(key, PAYLOAD_LOGIN_DEFAULT[key])
    }
    payload.set('username', formState.username)
    payload.set('password', formState.password)

    showGlobalLoading(true)
    const response = await appApiService.authService.usernameLogin(payload)
    handleLogin(response, true)
    fetchListMenus()
  } catch {
    //
  }
}

const loginGoogle = async () => {
  try {
    const responseGoogle = await googleTokenLogin({ clientId: GOOGLE_CLIENT_ID })
    if (!responseGoogle?.access_token) return

    const payload = new FormData()
    for (const key in PAYLOAD_LOGIN_DEFAULT) {
      payload.append(key, PAYLOAD_LOGIN_DEFAULT[key])
    }
    payload.set('service_type', SNSEnum.GOOGLE)
    payload.set('token_social', responseGoogle.access_token)

    showGlobalLoading(true)
    const response = await appApiService.authService.usernameLogin(payload)
    handleLogin(response)
  } catch {
    //
  }
}

const loginFacebook = async () => {
  try {
    const { authResponse } = await new Promise(window.FB.login)
    if (!authResponse?.accessToken) return

    const payload = new FormData()
    for (const key in PAYLOAD_LOGIN_DEFAULT) {
      payload.append(key, PAYLOAD_LOGIN_DEFAULT[key])
    }
    payload.set('service_type', SNSEnum.FACEBOOK)
    payload.set('token_social', authResponse.accessToken)

    showGlobalLoading(true)
    const response = await appApiService.authService.usernameLogin(payload)
    handleLogin(response)
  } catch {
    //
  }
}

const handleLogin = (data, isShowAlert = false) => {
  formState.errorMessage = ''
  const {
    success,
    access_token,
    refresh_token,
    scope,
    user_type,
    user_id,
    user_name,
    mobileNumber,
    roles,
    groups,
    user_display_name,
    email,
    jti,
    message
  } = data

  formState.errorMessage = message

  // Hide loading
  showGlobalLoading(false)

  if (success) {
    if (formState.isSaveAccount) {
      // Estimated expiration time is fake test data, later will change
      storage.set(STORAGE_SAVE_ACCOUNT, formState.username, 'localStorage', 600)
    }

    if (formState.isAutomaticLogin) {
      // Estimated expiration time is fake test data, later will change
      storage.set(STORAGE_AUTOMATIC_LOGIN, true, 'localStorage', 300)
    }
    const saveStorage = formState.isAutomaticLogin ? 'localStorage' : 'sessionStorage'

    storage.set(STORAGE_ACCESS_TOKEN, access_token, saveStorage)
    storage.set(STORAGE_REFRESH_TOKEN, refresh_token, saveStorage)
    storage.set(STORAGE_IS_LOGGED_IN, true, saveStorage)

    setCurrentAuthUser({
      scope,
      user_type,
      user_id,
      user_name,
      mobileNumber,
      roles,
      groups,
      user_display_name,
      email,
      jti
    })

    const redirect =
      route?.query?.redirectParams?.replace('__', '&') || route?.query?.redirect || '/'
    router.push(redirect)
    return
  }

  if (isShowAlert) {
    formState.isShowModalAlert = true
  } else {
    formState.isShowModalConfirm = true
  }
}

const goFindAccount = () => {
  router.push(AppRoutes.findAccount)
}

const goToResetPassword = () => {
  router.push(AppRoutes.resetPassword)
}

const goToRegister = () => {
  authUserStore.resetActiveAuthenticationTab()
  const referrerCode = route.query?.referrerCode || ''
  const storageCode = storage.get('riman-code', 'localStorage') || ''
  router.push(`/register/on-boarding?referrerCode=${referrerCode || storageCode}`)
  storage.remove('riman-code', 'localStorage')
}

const authState = reactive({
  userIp: '',
  uniqueToken: ''
})

const intervalScanningQr = ref()

const openModalQrLogin = () => {
  modalQrCode.value = true
  makeScanningPolling()
  generateUniqueToken()
}

const makeScanningPolling = () => {
  const intervalId = setInterval(async () => {
    await doCheckQrLogin()
  }, 5000)
  intervalScanningQr.value = intervalId
}

const doCheckQrLogin = async () => {
  const { data, success } = await appApiService.authService.getScanCodeLogin({
    loginCode: authState.uniqueToken,
    ipAddress: authState.userIp
  })

  if (data && success) {
    if (data?.accessToken && data?.refreshToken) {
      clearInterval(intervalScanningQr.value)
      closeModalQrCode()
      await handleLoginQrCode(data)
    }
  }
}

const handleLoginQrCode = async (dataRes) => {
  if (formState.isSaveAccount) {
    storage.set(STORAGE_SAVE_ACCOUNT, formState.username, 'localStorage')
  }

  if (formState.isAutomaticLogin) {
    storage.set(STORAGE_AUTOMATIC_LOGIN, true, 'localStorage')
  }

  const saveStorage = formState.isAutomaticLogin ? 'localStorage' : 'sessionStorage'

  storage.set(STORAGE_ACCESS_TOKEN, dataRes?.accessToken, saveStorage)
  storage.set(STORAGE_REFRESH_TOKEN, dataRes?.refreshToken, saveStorage)
  storage.set(STORAGE_IS_LOGGED_IN, true, saveStorage)
  const { data: dataUser, success } = await appApiService.authService.me()
  setCurrentAuthUser(success ? dataUser : null)

  router.push('/')
}

const getIpAddress = async () => {
  const { data } = await axios.get(IP_DETECT_URL)
  authState.userIp = data.ip
}

const generateUniqueToken = () => {
  const token = getCurrentMilliseconds()
  const secureToken = btoa(String(token) + 'rimanqrlogin')
  authState.uniqueToken = secureToken.replace(/[^\w\s]/gi, '')
}

const customLoginUrl = () => {
  const url = `${HK_MALL_URL}/qr-login?userIp=${authState.userIp}&token=${authState.uniqueToken}`
  console.log(url)
  return url
}

onMounted(() => {
  getIpAddress()
})

const closeModalQrCode = () => {
  modalQrCode.value = false
  clearInterval(intervalScanningQr.value)
}

onBeforeUnmount(() => {
  clearInterval(intervalScanningQr.value)
})

const getNumberUserFromFindAccount = () => {
  const data = storage.get(STORAGE_USER_NUMBER_FIND_ACCOUNT)
  if (data?.auto) {
    formState.username = data.userNumber
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
  background-size: cover;
  @apply flex min-h-full items-center justify-center p-5;
  @apply lg:min-h-screen;
}

@media only screen and (max-width: 991px) {
  .container-custom {
    min-height: 100vh;

    .login-wrap {
      height: auto;
    }
  }
}

.login-wrap {
  @apply py-15 flex h-full w-full max-w-md flex-col bg-white px-5;
  @apply lg:h-auto;
}

.form-wrap {
  @apply flex flex-col;
}

.form-item-group {
  @apply mb-2;

  &.ant-form-item-has-error {
    @apply mb-0;
  }
}

.btn-custom {
  @apply font-475 w-full text-sm;
}

.action {
  &__group {
    @apply flex-justify-between my-5 flex;
  }

  &__item {
    @apply text-gray-10 font-475 relative cursor-pointer text-center text-xs leading-none;
  }
}

.qrcode__image {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.25);
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
}
</style>
