<template>
  <div>
    <app-mobile-header class="md:hidden" />
    <app-desktop-header class="hidden md:block" />
    <div
      :class="{
        'pt-[calc(65px_+_40px)]': isShowBannerWelcome,
        'pt-[65px]': !isShowBannerWelcome
      }"
    >
      <div class="sticky left-0 top-[65px] w-full bg-white">
        <div class="relative mx-auto max-w-[1240px] px-5">
          <LeftLinkIcon v-if="isShowBackIcon" class="icon-back" @click="router.go(-1)" />
          <p class="title">{{ title }}</p>
        </div>
        <a-divider class="!bg-gray-10 !my-0" />
      </div>

      <transition name="fade">
        <div :key="route.name" class="container-layout">
          <router-view />
        </div>
      </transition>
    </div>
  </div>
</template>
<script setup>
import apiService from '@/http/api'
import { computed, onBeforeMount } from 'vue'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { useRoute, useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import LeftLinkIcon from '@assets/svgs/menu-left-link.svg'
import { getCurrentCartBadge } from '@/utils/cart'
import { useMemberBannerStore } from '@/stores/modules/member-banner'
import { storeToRefs } from 'pinia'
import { RETURN_EXCHANGE_TYPE } from '@/helpers/constant'
const route = useRoute()
const router = useRouter()
const authUserStore = useAuthUserStore()
const { setCurrentAuthUser } = authUserStore
const { isShowBannerWelcome } = storeToRefs(useMemberBannerStore())

const title = computed(() => {
  return route.query?.type === RETURN_EXCHANGE_TYPE.EXCHANGE ? 'Exchange Details' : route.meta.title
})
const isShowBackIcon = computed(() => route.meta.backIcon)

const getMe = async () => {
  const { data, success } = await apiService.authService.me()
  if (success) setCurrentAuthUser(data)
  if (!success) {
    await router.push({ name: AppRoutes.home.name })
  }
}

const fetchData = async () => {
  await getMe()
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
  @apply absolute left-5 top-1/2 -mt-[2px] -translate-y-1/2 cursor-pointer;
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
  @apply mx-auto max-w-[1240px] overflow-y-auto;
  max-height: calc(100dvh - 65px - 61px);
}
</style>
