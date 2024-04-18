<template>
  <div>...</div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import router from '@/router'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import storage from '@/utils/storage'
import { getSaveTokenStorage } from '@/utils/auth'
import { STORAGE_ACCESS_TOKEN, STORAGE_REFRESH_TOKEN } from '@/helpers/constant'
import apiService from '@/http/api'
import { onMounted } from 'vue'

const storeLoading = useGlobalLoadingStore()
const { showGlobalLoading } = storeLoading
const route = useRoute()

const checkToken = async () => {
  const accessToken = storage.get(STORAGE_ACCESS_TOKEN, getSaveTokenStorage())
  const refreshToken = storage.get(STORAGE_REFRESH_TOKEN, getSaveTokenStorage())

  showGlobalLoading(true)
  const loginCode = route.query.token
  const ipAddress = route.query.userIp
  if (!loginCode || !ipAddress || !accessToken || !refreshToken) {
    showGlobalLoading(false)
    return router.push(
      `/login?userIp=${ipAddress}&token=${loginCode}&redirectParams=${route.fullPath.replace(
        '&',
        '__'
      )}`
    )
  } else {
    const { data } = await apiService.authService.me()
    const userId = data?.userSeqNo
    apiService.authService.scanCodeSave({
      userId,
      loginCode,
      ipAddress,
      accessToken,
      refreshToken
    })
    showGlobalLoading(false)
    router.push('/')
  }
}

onMounted(() => {
  checkToken()
})
</script>
