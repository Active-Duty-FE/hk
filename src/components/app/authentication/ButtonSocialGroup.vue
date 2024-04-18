<template>
  <div class="pt-3 text-gray-50">
    <r-button
      v-if="!isCorporation"
      class="!border-black-50 mb-[5px] w-full"
      @click="handleActionLogin(TYPE_LOGIN.FACEBOOK)"
    >
      <template #image>
        <FaceBook />
      </template>
      <template #content>
        <span class="font-475 ml-[7px] text-sm">
          Sign Up with <span class="font-625">FACEBOOK</span>
        </span>
      </template>
    </r-button>
    <r-button
      v-if="!isCorporation"
      class="!border-black-50 mb-[5px] w-full"
      @click="handleActionLogin(TYPE_LOGIN.GOOGLE)"
    >
      <template #image>
        <Google />
      </template>
      <template #content>
        <span class="font-475 ml-[7px] text-sm">
          Sign Up with <span class="font-625">GOOGLE</span>
        </span>
      </template>
    </r-button>
    <r-button class="!border-black-50 w-full" @click="handleActionLogin(TYPE_LOGIN.EMAIL)">
      <template #image>
        <Email />
      </template>
      <template #content>
        <span class="font-475 ml-[7px] text-sm">
          Sign Up with <span class="font-625">E-MAIL</span>
        </span>
      </template>
    </r-button>
  </div>
</template>
<script setup>
import { AppRoutes } from '@/router/path'
import { handleGetGoogleInfo, initFacebookSdk } from '@/utils/authenticate'
import { storage } from '@/utils/storage'
import Email from '@assets/svgs/email-black.svg'
import FaceBook from '@assets/svgs/facebook.svg'
import Google from '@assets/svgs/google.svg'
import { STORAGE_USER_TYPE, GOOGLE_CLIENT_ID } from '@helpers/constant'
import { AuthUserEnum, AuthenticateTabEnum, ButtonSocialGroupEnum, SNSEnum } from '@helpers/enum'
import { googleSdkLoaded } from 'vue3-google-login'
import { useNotification } from '@/composables/notification'
import { useI18n } from 'vue-i18n'

initFacebookSdk()
const { t } = useI18n()
const TYPE_LOGIN = {
  FACEBOOK: 'FACEBOOK',
  GOOGLE: 'GOOGLE',
  EMAIL: 'EMAIL'
}
const props = defineProps({
  groupType: {
    type: String,
    default: ButtonSocialGroupEnum.REGISTER,
    required: false
  },
  userType: {
    type: String,
    default: AuthenticateTabEnum.CONSUMER,
    required: false
  },
  isCorporation: {
    type: Boolean,
    default: false,
    required: false
  },
  checkAge: {
    type: Boolean,
    default: false
  }
})
const { showNotification } = useNotification()
const emitEvents = defineEmits(['nextStep', 'snsProcess', 'openModalCertify'])

const loginGoogle = () => {
  googleSdkLoaded((google) => {
    google.accounts.oauth2
      .initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope:
          'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/user.birthday.read https://www.googleapis.com/auth/user.gender.read',
        callback: async (response) => {
          if (response?.access_token) {
            const userInfo = await handleGetGoogleInfo(response.access_token)
            if (props.groupType === ButtonSocialGroupEnum.REGISTER) {
              setUserTypeStorage(props.userType)
              emitEvents('snsProcess', {
                snsType: SNSEnum.GOOGLE,
                snsUser: transformSNSInfo(userInfo.data, SNSEnum.GOOGLE),
                userType: props.userType,
                path: AppRoutes.register.selectRecommender,
                snsToken: response.access_token
              })
            }
          }
        }
      })
      .requestAccessToken()
  })
}
function loginFacebook() {
  window.FB.login(
    function (response) {
      if (response.authResponse) {
        // connected
        getFaceBookInfo(response.authResponse?.accessToken)
      }
    },
    { scope: 'email,user_birthday,user_gender' }
  )
}

const loginEmail = () => {
  const userType = props.isCorporation ? AuthUserEnum.CO_OPERATE : props.userType
  setUserTypeStorage(userType)
  emitEvents('nextStep', {
    path: AppRoutes.register.selectRecommender,
    userType: userType
  })
}

const handleActionLogin = (type) => {
  if (props.checkAge) {
    switch (type) {
      case TYPE_LOGIN.EMAIL:
        loginEmail()
        break
      case TYPE_LOGIN.GOOGLE:
        loginGoogle()
        break
      default:
        loginFacebook()
    }
  } else {
    emitEvents('openModalCertify')
  }
}

function getFaceBookInfo(accessToken) {
  window.FB.api(
    '/me',
    'GET',
    { fields: 'id,name,email,first_name,last_name,birthday,gender' },
    function (userInfo) {
      if (props.groupType === ButtonSocialGroupEnum.REGISTER) {
        setUserTypeStorage(props.userType)
        emitEvents('snsProcess', {
          snsType: SNSEnum.FACEBOOK,
          snsUser: transformSNSInfo(userInfo, SNSEnum.FACEBOOK),
          userType: props.userType,
          path: AppRoutes.register.selectRecommender,
          snsToken: accessToken
        })
      }
    }
  )
}

const setUserTypeStorage = (userType) => {
  storage.set(STORAGE_USER_TYPE, { userType })
}

const transformSNSInfo = (data, snsType) => {
  if (snsType === SNSEnum.GOOGLE) {
    const birthday =
      data?.birthdays?.length &&
      `${data.birthdays[0].date.month}/${data.birthdays[0].date.day}/${data.birthdays[0].date.year}`
    const email = data?.emailAddresses?.length && data.emailAddresses[0].value
    const gender = data?.genders?.length && data.genders[0].value
    const id = data?.emailAddresses?.length && data.emailAddresses[0]?.metadata.source.id
    const name = data?.names?.length && data.names[0]
    return {
      ...data,
      email,
      birthday,
      gender,
      familyName: name?.familyName,
      givenName: name?.givenName,
      id
    }
  }
  return { ...data, familyName: data?.last_name, givenName: data?.first_name }
}
</script>
