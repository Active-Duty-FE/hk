import axios from 'axios'
import apiService from '@/http/api'
import { AuthUserEnum } from '@helpers/enum'
import { storage } from '@/utils/storage'
import {
  SHOP_LOGIN_KEY,
  STORAGE_ACCESS_TOKEN,
  STORAGE_AUTOMATIC_LOGIN,
  STORAGE_IS_LOGGED_IN,
  STORAGE_REFRESH_TOKEN
} from '@/helpers/constant'
import { getSaveTokenStorage } from '@/utils/auth'
import { useRoute, useRouter } from 'vue-router'
import secure from '@/utils/secure'
import { useAuthUserStore } from '@/stores/modules/auth-user'

export const handleGetGoogleInfo = async (token) => {
  return await axios.get(
    'https://people.googleapis.com/v1/people/me?personFields=emailAddresses,birthdays,names,nicknames,genders&access_token=' +
      token
  )
}

export const initFacebookSdk = () => {
  return new Promise((resolve) => {
    window.fbAsyncInit = function () {
      const FB = window.FB
      FB.init({
        appId: import.meta.env.VITE_FB_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v8.0'
      })
    }

    // load facebook sdk script
    ;(function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) {
        return
      }
      const js = d.createElement(s)
      js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    })(document, 'script', 'facebook-jssdk')
  })
}

export const handleGetFaceBookInfo = async (accessToken) => {
  return await axios.get(
    `https://graph.facebook.com/v17.0/me?fields=id,name,email,first_name,last_name,birthday,gender&access_token=${accessToken}`
  )
}

export const checkSnsToken = async (tokenSocial, socialServiceType, email) => {
  const response = await apiService.authService.checkExistUser({
    tokenSocial,
    serviceType: socialServiceType.toUpperCase(),
    email
  })
  return response
}

export const getRegisterStep = (snsType) => {
  if (!snsType || snsType === AuthUserEnum.CONSUMER) return 3
  return 4
}

export const encrypEmail = (email) => {
  const parts = email.split('@')
  const username = parts[0]
  const domain = parts[1]

  const maskedUsername = username.substr(0, 2) + '**'

  return maskedUsername + '@' + domain
}

export const refreshToken = async () => {
  const refreshPayload = {
    grant_type: 'refresh_token',
    scope: 'write',
    region_code: 'US',
    refresh_token: storage.get(STORAGE_REFRESH_TOKEN, getSaveTokenStorage())
  }
  const payload = new FormData()
  for (const key in refreshPayload) {
    payload.append(key, refreshPayload[key])
  }

  const response = await apiService.authService.usernameLogin(payload)
  return response
}

export const shopLogin = async () => {
  const route = useRoute()
  const router = useRouter()
  const { setCurrentAuthUser } = useAuthUserStore()
  await router?.isReady()

  const key = route.query.secure || ''
  if (!key) return
  router.replace({ query: null })

  let keyPared = ''
  try {
    keyPared = atob(key)
  } catch {
    //
  }
  if (!keyPared) return

  const keyDecrypt = secure.decrypt(keyPared, SHOP_LOGIN_KEY)
  if (!keyDecrypt) return

  const data = JSON.parse(keyDecrypt)
  const access_token = data?.access_token
  const refresh_token = data?.refresh_token
  storage.removeAllStorage(STORAGE_ACCESS_TOKEN)
  storage.removeAllStorage(STORAGE_REFRESH_TOKEN)
  storage.removeAllStorage(STORAGE_IS_LOGGED_IN)
  storage.removeAllStorage(STORAGE_AUTOMATIC_LOGIN)
  storage.set(STORAGE_ACCESS_TOKEN, access_token)
  storage.set(STORAGE_REFRESH_TOKEN, refresh_token)
  storage.set(STORAGE_IS_LOGGED_IN, true)

  const { data: dataUser, success } = await apiService.authService.me()
  setCurrentAuthUser(success ? dataUser : null)
}

export const qrLogin = async () => {
  const route = useRoute()
  const router = useRouter()
  const { setCurrentAuthUser } = useAuthUserStore()
  await router?.isReady()

  const qr = route.query.qr || ''
  const accessToken = route.query.access_token || ''
  const refreshToken = route.query.refresh_token || ''
  if (!qr || !accessToken || !refreshToken) return
  router.replace({ query: null })

  storage.removeAllStorage(STORAGE_ACCESS_TOKEN)
  storage.removeAllStorage(STORAGE_REFRESH_TOKEN)
  storage.removeAllStorage(STORAGE_IS_LOGGED_IN)
  storage.removeAllStorage(STORAGE_AUTOMATIC_LOGIN)
  storage.set(STORAGE_ACCESS_TOKEN, accessToken)
  storage.set(STORAGE_REFRESH_TOKEN, refreshToken)
  storage.set(STORAGE_IS_LOGGED_IN, true)

  const { data: dataUser, success } = await apiService.authService.me()
  setCurrentAuthUser(success ? dataUser : null)
}
