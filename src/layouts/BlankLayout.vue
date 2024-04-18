<template>
  <p v-if="isLoading && accessToken" class="h-50vh flex items-center justify-center">Loading...</p>
  <div v-else>
    <router-view />
  </div>
</template>
<script setup>
import apiService from '@/http/api'
import { onBeforeMount, ref } from 'vue'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import storage from '@/utils/storage'
import { STORAGE_ACCESS_TOKEN } from '@/helpers/constant'
import { getSaveTokenStorage } from '@/utils/auth'

const isLoading = ref(true)
const authUserStore = useAuthUserStore()

const { setCurrentAuthUser } = authUserStore
const accessToken = storage.get(STORAGE_ACCESS_TOKEN, getSaveTokenStorage())

const getMe = async () => {
  const { data, success } = await apiService.authService.me()
  if (success) setCurrentAuthUser(data)
  isLoading.value = false
  return success
}

onBeforeMount(() => {
  if (accessToken) getMe()
})
</script>
