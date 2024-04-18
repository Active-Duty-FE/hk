<template>
  <div>
    <app-mobile-header class="md:hidden" />
    <app-desktop-header class="hidden md:block" />

    <div class="pt-[65px]" :class="{ '!pt-[105px]': isShowBannerWelcome }">
      <div class="show-header sticky left-0 top-[65px] w-full bg-white">
        <div class="relative mx-auto max-w-[1240px] px-5">
          <div class="icon-back" @click="onBackNavigator">
            <ArrowLeft v-if="!isHideBackIcon" />
          </div>
          <p class="title">{{ title }}</p>
        </div>
        <a-divider class="!bg-gray-10 !my-0" />
      </div>

      <p v-if="isLoading" class="h-50vh flex items-center justify-center">Loading...</p>
      <transition v-else name="fade">
        <div :key="route.name" class="container-layout">
          <router-view />
        </div>
      </transition>
    </div>
  </div>
</template>
<script setup>
import apiService from '@/http/api'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { useMemberBannerStore } from '@/stores/modules/member-banner'
import { getCurrentCartBadge } from '@/utils/cart'
import ArrowLeft from '@assets/svgs/arrow-left.svg'
import { storeToRefs } from 'pinia'
import { computed, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ROLES_BE } from '@/helpers/constant'

const { isShowBannerWelcome } = storeToRefs(useMemberBannerStore())
const route = useRoute()
const router = useRouter()
const authUserStore = useAuthUserStore()
const { setCurrentAuthUser, setInfoUserToConvert } = authUserStore

const isLoading = ref(true)

const title = computed(() => route.meta.title)
const isHideBackIcon = computed(() => route.meta.hideBackIcon)
const backRouter = computed(() => route.meta.backRouter)

const getMe = async () => {
  const { data, success } = await apiService.authService.me()
  if (success) setCurrentAuthUser(data)
  isLoading.value = false
  const response = { success, data }
  return response
}

const getUserInfoConvert = async () => {
  const { data, success } = await apiService.myPageService.getInfoUserConvertPlanner()
  if (success) {
    setInfoUserToConvert(data)
  }
}

const fetchData = async () => {
  const response = await getMe()
  if (!response.success) return
  await getCurrentCartBadge()
  if ([ROLES_BE.consumer, ROLES_BE.no_referral_consumer].includes(response?.data.userType?.code)) {
    await getUserInfoConvert()
  }
}

onBeforeMount(() => {
  fetchData()
})

const onBackNavigator = () => {
  if (backRouter.value) {
    return router.push({ name: backRouter.value })
  }

  router.go(-1)
}
</script>

<style lang="scss" scoped>
.title {
  @apply font-550 leading-base h-15 mb-0 flex items-center justify-center text-lg;
}

.icon-back {
  @apply absolute left-5 top-1/2 -ml-4 inline-flex -translate-y-1/2 cursor-pointer items-center justify-center p-4;
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
  max-height: calc(100dvh - 65px - 101px);
}
</style>
