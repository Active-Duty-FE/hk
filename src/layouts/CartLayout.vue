<template>
  <div>
    <app-mobile-header class="md:hidden" />
    <app-desktop-header class="hidden md:block" />
    <div class="pt-[115px] md:pt-[65px]">
      <r-sub-navigation
        class="border-b-gray-10 fixed left-0 z-10 w-full border-t-0 bg-white md:hidden"
        :class="isShowBannerWelcome ? 'top-[85px]' : 'top-[55px]'"
        title-class="text-lg font-550"
        :title="subNavigationTitle"
        :is-hide-back-icon="true"
      />
      <router-view></router-view>
    </div>
    <footer-main class="md:block" :class="{ hidden: totalCartBadge }" />
  </div>
</template>
<script setup>
import apiService from '@/http/api'
import { onMounted, computed } from 'vue'
import { useCartStore } from '@/stores/modules/cart'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { AppRoutes } from '@/router/path'
import { getCurrentCartBadge } from '@/utils/cart'
import { useMemberBannerStore } from '@/stores/modules/member-banner'

const { isShowBannerWelcome } = storeToRefs(useMemberBannerStore())

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const authUserStore = useAuthUserStore()
const { setCurrentAuthUser } = authUserStore
const { totalCartBadge } = storeToRefs(cartStore)

const getMe = async () => {
  const { success, data } = await apiService.authService.me()
  if (success) {
    setCurrentAuthUser(data)
  } else {
    setCurrentAuthUser(null)
    await router.push({ name: AppRoutes.home.name })
  }
  return success
}

const transformSubNavigationTitle = () => {
  if (route.path === AppRoutes.cart.list.path) {
    if (totalCartBadge.value) return `Shopping Bag (${totalCartBadge.value} items)`
  }
  return route.meta?.subNavTitle || 'Shopping Bag'
}

const subNavigationTitle = computed(() => transformSubNavigationTitle())

onMounted(async () => {
  const success = await getMe()
  if (!success) return
  await getCurrentCartBadge()
})
</script>
