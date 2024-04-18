import Axios from 'axios'
import authService from '@/http/services/auth'
import cartService from '@/http/services/cart'
import orderService from '@/http/services/order'
import addressService from '@/http/services/address'
import menuService from '@/http/services/menu'
import productService from '@/http/services/product'
import myPageService from '@/http/services/my-page'
import conciergeService from '@/http/services/concierge'
import uploadService from '@/http/services/upload'
import creditCardService from '@/http/services/credit-card'
import skinQuizService from '@/http/services/skin-quiz'
import bagService from '@/http/services/bag'
import cmsService from '@/http/services/cms'
import mainService from '@/http/services/main'
import exploreService from '@/http/services/explore'
import returnService from '@/http/services/return'
import etcService from '@/http/services/etc'
import mediaStorageService from '@/http/services/media-storage'

import { storage } from '@/utils/storage'
import {
  STORAGE_ACCESS_TOKEN,
  STORAGE_AUTOMATIC_LOGIN,
  STORAGE_IS_LOGGED_IN,
  STORAGE_REFRESH_TOKEN,
  WHITE_LIST_CAN_ACCESS
} from '@/helpers/constant'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { refreshToken } from '@/utils/authenticate'
import { getSaveTokenStorage } from '@/utils/auth'
import router from '@/router'
import { useAlert } from '@/composables/alert'
import { AppRoutes } from '@/router/path'

export const BASE_API_URL =
  import.meta.env.VITE_POSITION === 'ntq' ? '/api' : import.meta.env.VITE_API_URL

let isShowLogoutAlert = false

const axiosInstance = Axios.create({
  baseURL: BASE_API_URL,
  timeout: 300000
})

axiosInstance.interceptors.request.use(
  (config) => {
    return requestInterceptors(config)
  },
  (error) => {
    return requestInterceptorsError(error)
  }
)

const requestInterceptors = async (config) => {
  const isPublic = config.headers?.isPublic || false
  const accessToken = storage.get(STORAGE_ACCESS_TOKEN, getSaveTokenStorage())

  if (accessToken && !isPublic) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}

// start handle refresh token here, currently alway redirect to login page if un-auth
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config
    const canAccess = WHITE_LIST_CAN_ACCESS.includes(router.currentRoute.value.path)
    if (canAccess) return Promise.reject(error)
    if (error?.response?.status === 401 && error?.response?.code === 'G-9003') {
      const authUserStore = useAuthUserStore()
      const { setCurrentAuthUser } = authUserStore
      const saveStorage = getSaveTokenStorage()

      setCurrentAuthUser(null)
      storage.remove(STORAGE_ACCESS_TOKEN, saveStorage)
      storage.remove(STORAGE_REFRESH_TOKEN, saveStorage)
      storage.remove(STORAGE_AUTOMATIC_LOGIN, saveStorage)
      storage.remove(STORAGE_IS_LOGGED_IN, saveStorage)

      await useAlert({
        title: 'Alert',
        content: 'You have been automatically logged out\ndue to security issue.'
      })

      if (router.currentRoute.value.name === AppRoutes.home.name) {
        router.go(0)
      } else {
        await router.push('/')
      }
      return
    }

    if (error?.response?.status === 403) {
      if (isShowLogoutAlert) return
      isShowLogoutAlert = true
      const { success, access_token } = await refreshToken()
      const authUserStore = useAuthUserStore()
      const { setCurrentAuthUser } = authUserStore
      const saveStorage = getSaveTokenStorage()

      if (success) {
        isShowLogoutAlert = false
        storage.set(STORAGE_ACCESS_TOKEN, access_token, saveStorage)
        config.headers = {
          ...config.headers,
          authorization: `Bearer ${access_token}`
        }
        return axiosInstance(config)
      }

      isShowLogoutAlert = false
      setCurrentAuthUser(null)
      storage.remove(STORAGE_ACCESS_TOKEN, saveStorage)
      storage.remove(STORAGE_REFRESH_TOKEN, saveStorage)
      storage.remove(STORAGE_AUTOMATIC_LOGIN, saveStorage)
      storage.remove(STORAGE_IS_LOGGED_IN, saveStorage)

      await useAlert({
        title: 'Alert',
        content: 'You have been automatically logged out\ndue to security issue.'
      })

      if (router.currentRoute.value.name === AppRoutes.home.name) {
        router.go(0)
      } else {
        await router.push('/')
      }
      return
    }
    return Promise.reject(error)
  }
)

// end

const requestInterceptorsError = (error) => {
  return Promise.reject(error)
}

const apiService = {
  authService: authService(axiosInstance),
  cartService: cartService(axiosInstance),
  orderService: orderService(axiosInstance),
  addressService: addressService(axiosInstance),
  menuService: menuService(axiosInstance),
  productService: productService(axiosInstance),
  myPageService: myPageService(axiosInstance),
  conciergeService: conciergeService(axiosInstance),
  uploadService: uploadService(axiosInstance),
  creditCardService: creditCardService(axiosInstance),
  skinQuizService: skinQuizService(axiosInstance),
  bagService: bagService(axiosInstance),
  mainService: mainService(axiosInstance),
  exploreService: exploreService(axiosInstance),
  returnService: returnService(axiosInstance),
  cmsService: cmsService(axiosInstance),
  etcService: etcService(axiosInstance),
  mediaStorageService: mediaStorageService(axiosInstance)
}

export default apiService
