<template>
  <div class="home no-scrollbar">
    <perfect-scrollbar>
      <app-mobile-header class="md:hidden" />
      <app-desktop-header class="hidden md:block" />
      <div
        class="min-h-[570px] pt-[55px]"
        :class="[
          { '!pt-0': isHomePage || isPaddingTop },
          { '!pt-82px md:!pt-[95px]': isShowBannerWelcome }
        ]"
      >
        <router-view />
      </div>
      <footer-main v-if="!isLoginPage" :class="generateClassFooter()" />
      <concierge-bottom
        v-if="isHomePage"
        class="hidden md:block"
        :is-show-dot="isDotShow"
        @click="isShowConcierge = true"
      />
      <Transition name="slide-bottom" mode="out-in">
        <bottom-bar
          v-if="isShowBottomBar"
          class="block md:hidden"
          @open-concierge="isShowConcierge = true"
        />
      </Transition>
      <button-back-top />
      <Transition name="slide-bottom">
        <ConciergePopupHome
          v-if="isShowConcierge && isHomePage"
          :user="currentAuthUser"
          @close="isShowConcierge = false"
        />
      </Transition>
    </perfect-scrollbar>
  </div>
</template>
<script setup>
import { GNB_BLACK_LISTS, STORAGE_ACCESS_TOKEN } from '@/helpers/constant'
import apiService from '@/http/api'
import { AppRoutes } from '@/router/path'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { useMemberBannerStore } from '@/stores/modules/member-banner'
import { getSaveTokenStorage } from '@/utils/auth'
import { getCurrentCartBadge } from '@/utils/cart'
import storage from '@/utils/storage'
import { useWindowScroll, useScroll } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onBeforeUpdate, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useConciergeStore } from '@/stores/modules/concierge'

const { isShowBannerWelcome } = storeToRefs(useMemberBannerStore())
const authUserStore = useAuthUserStore()
const { setCurrentAuthUser } = authUserStore
const { currentAuthUser } = storeToRefs(authUserStore)

const route = useRoute()

const showConcierge = ref(false)
const pageTimeout = ref()

const { y: positionY } = useWindowScroll()
const { isScrolling } = useScroll(window)

const isAtTop = computed(() => positionY.value === 0)
const isScrollingDown = computed(() => positionY.value !== 0)
const isDotShow = ref(false)

const isShowBottomBar = computed(() => {
  if (isHideGNB.value) return false
  return !isScrolling.value || (isAtTop.value && !isHideGNB.value)
})

const { isShowConcierge } = storeToRefs(useConciergeStore())

const getMe = async () => {
  const { success, data } = await apiService.authService.me()
  if (success) {
    setCurrentAuthUser(data)
  } else {
    setCurrentAuthUser(null)
  }
  return success
}
const notPaddingTop = [
  // AppRoutes.aboutUs.name,
  // AppRoutes.sustainability.name,
  AppRoutes.ingredient.name,
  AppRoutes.blog.name,
  AppRoutes.ritual.name,
  AppRoutes.byoungPoolBusiness.name,
  AppRoutes.events.name,
  AppRoutes.byoungPoolRetreat.name
]

const isHomePage = computed(() => route.name === AppRoutes.home.name)
const isLoginPage = computed(() => route.name === AppRoutes.login.name)
const isPaddingTop = computed(() => notPaddingTop.includes(route.name))

const isHideGNB = computed(() => GNB_BLACK_LISTS.includes(route.name))

const generateClassFooter = () => {
  if (isHideGNB.value) return 'hidden md:block'
  return 'block'
}

function isElementVisible() {
  const $banner = document.querySelector('.banner-section')
  const rect = $banner?.getBoundingClientRect()
  return rect?.bottom > 0
}

const eventWheel = (e) => {
  const bannerVisible = isElementVisible()
  const $secondSection = document.querySelector('.second-section')

  const isMobile = window.innerWidth < 768
  if (isMobile) return
  if (pageTimeout.value) {
    clearTimeout(pageTimeout.value)
  }
  pageTimeout.value = setTimeout(() => {
    const isScrollDown = e.deltaY > 0

    if (bannerVisible && isScrollDown) {
      window.scrollTo({
        top: $secondSection?.offsetTop,
        behavior: 'smooth'
      })
    }
  }, 50)
}

const handleEventWheel = () => {
  document.addEventListener(
    'wheel',
    (e) => {
      eventWheel(e)
    },
    { passive: false }
  )
}

onBeforeMount(async () => {
  if (storage.get(STORAGE_ACCESS_TOKEN, getSaveTokenStorage())) {
    const success = await getMe()
    if (!success) return
    await getCurrentCartBadge()
  }
  handleEventWheel()
  checkIsShowDot()
})

onBeforeUnmount(() => {
  document.removeEventListener('wheel', handleEventWheel)
})

const checkIsShowDot = async () => {
  if (currentAuthUser.value && currentAuthUser.value?.userSeqNo) {
    const data = await apiService.conciergeService.recentNotification()
    if (data?.data && data?.data.length) {
      isDotShow.value = true
    } else {
      isDotShow.value = false
    }
  } else {
    isDotShow.value = false
  }
}

onBeforeUpdate(() => {
  isShowConcierge.value = false
  checkIsShowDot()
})
</script>
