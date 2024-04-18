<template>
  <div>
    <app-mobile-header class="md:hidden" />
    <app-desktop-header class="hidden md:block" />

    <div class="pt-[65px]" :class="{ 'pt-[85px]': isShowBannerWelcome }">
      <div class="sticky left-0 top-[65px] block w-full bg-white md:hidden">
        <div class="relative mx-auto max-w-[1240px] px-5">
          <div class="icon-back" @click="router.go(-1)">
            <ArrowLeft v-if="!isHideBackIcon" />
          </div>
          <p class="title">{{ title }}</p>
        </div>
        <a-divider class="!bg-gray-10 !my-0" />
      </div>

      <p v-if="isLoading" class="h-50vh flex items-center justify-center">Loading...</p>
      <transition v-else name="fade">
        <perfect-scrollbar :key="route.name" class="container-layout">
          <router-view />
        </perfect-scrollbar>
      </transition>
    </div>
  </div>
</template>
<script setup>
import apiService from '@/http/api'
import { computed, onBeforeMount, ref } from 'vue'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { useRoute, useRouter } from 'vue-router'
import ArrowLeft from '@assets/svgs/arrow-left.svg'
import { getCurrentCartBadge } from '@/utils/cart'
import { useMemberBannerStore } from '@/stores/modules/member-banner'
import { storeToRefs } from 'pinia'

const route = useRoute()
const router = useRouter()
const authUserStore = useAuthUserStore()
const { setCurrentAuthUser } = authUserStore
const { isShowBannerWelcome } = storeToRefs(useMemberBannerStore())

const isLoading = ref(true)

const title = computed(() => route.meta.title)
const isHideBackIcon = computed(() => route.meta.hideBackIcon)

const getMe = async () => {
  const { data, success } = await apiService.authService.me()
  if (success) setCurrentAuthUser(data)
  isLoading.value = false
  return success
}

const fetchData = async () => {
  const success = await getMe()
  if (!success) return
  await getCurrentCartBadge()
}

onBeforeMount(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.title {
  @apply font-550 leading-base h-15 mb-0 flex items-center justify-center text-lg;
}

.icon-back {
  @apply absolute left-5 top-1/2 -ml-4 -mt-[2px] inline-flex -translate-y-1/2 cursor-pointer items-center justify-center p-4;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.container-layout {
  @apply pt-12.5 mx-auto max-w-[1240px] overflow-y-auto px-5;
  max-height: calc(100dvh - 65px - 61px);
}
</style>
