<template>
  <div
    v-if="appState.showBannerWelcome"
    class="bg-black-100 fixed z-20 flex h-10 w-full cursor-pointer items-center"
    @click="openPersonalMall()"
  >
    <div
      class="font-500 banner-mall container mx-5 flex max-w-full items-center gap-2 pb-[10px] text-sm text-white md:mx-auto md:pb-0"
    >
      <img
        v-if="appState.avatar"
        :src="addPrefixForImage(appState.avatar)"
        alt="avatar"
        class="aspect-square h-[25px] w-[25px] rounded-full"
      />
      <div v-else class="aspect-square h-[25px] w-[25px] rounded-full text-center">
        <img :src="LogoDefault" alt="avatar" class="aspect-square h-[25px] w-[25px] rounded-full" />
      </div>
      <template v-if="!appState.bannerMallInfo"> Welcome! Riman's Mall </template>
      <template v-else> Welcome! {{ appState.bannerMallInfo }} 's Mall </template>
      <PlusPersonal class="ml-auto" />
    </div>
  </div>
  <concierge-bottom
    v-if="!isHomePage"
    class="hidden md:block"
    :is-show-dot="isDotShow"
    @click="isShowConcierge = true"
  />
  <Transition name="slide-bottom">
    <ConciergePopupHome
      v-if="isShowConcierge && !isHomePage"
      :user="currentAuthUser"
      @close="isShowConcierge = false"
    />
  </Transition>
  <router-view />
  <global-loading />
  <MaintainPopup />
  <PersonalMallPopup
    v-if="appState.showPersonalPopup"
    :visible="appState.showPersonalPopup && isDesktop"
    :referral-code="appState.currentReferralCode"
    :all-header-info="appState.allHeaderInfo"
    @close="appState.showPersonalPopup = false"
  />
  <RModalAlert
    v-model:visible="appState.showDialogAlert"
    :width="270"
    text-btn="OK"
    @confirm="onConfirmMall()"
  >
    <template #extraDescription>
      <div class="text-center">
        <p class="font-475 mb-[14px] text-base leading-[22px]">You're on another Planner site</p>
      </div>
    </template>
  </RModalAlert>
  <RModalAlert
    v-model:visible="showAccessDenyPopup"
    :width="350"
    :footer="false"
    :mask-closable="false"
    closable
    @cancel="setShowAccessDenyPopup(false)"
  >
    <template #extraDescription>
      <div>
        <p class="text-[18px]">COMING SOON</p>
        <p class="pb-4 text-[15px]">
          Get ready for our Skin Quiz <br />
          designed to curate the perfect RIMAN Ritual <br />
          tailored specifically for your skin!
        </p>
        <RButton
          title="OK"
          class="!bg-navy-6 !w-full !shadow-none"
          class-title="!text-white"
          @click="setShowAccessDenyPopup(false)"
        />
      </div>
    </template>
  </RModalAlert>
</template>
<script setup>
import apiService from '@/http/api'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { useMemberBannerStore } from '@/stores/modules/member-banner'
import { useMenuStore } from '@/stores/modules/menu'
import { shopLogin, qrLogin } from '@/utils/authenticate'
import { useWindowSize } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, onBeforeMount, reactive, watch, ref, onBeforeUpdate, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { isBeautyPlanner } from './utils/role'
import { useConciergeStore } from '@/stores/modules/concierge'
import LogoDefault from '@/assets/images/avatar/default.webp'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useShowAccessSkinQuiz } from '@/stores/modules/access-skinquiz'
import { AppRoutes } from './router/path'
import { addPrefixForImage } from './utils/common'
import PlusPersonal from '@/assets/svgs/personal/plus.svg'
import { loadLocale } from './utils/i18n'
const { setShowAccessDenyPopup } = useShowAccessSkinQuiz()
const { showAccessDenyPopup } = storeToRefs(useShowAccessSkinQuiz())
const { isShowConcierge } = storeToRefs(useConciergeStore())

dayjs.extend(utc)
dayjs.extend(timezone)
// set default local timezone
dayjs.tz.setDefault(dayjs.tz.guess())

const { width } = useWindowSize()
const isDesktop = computed(() => width.value > 992)

const menuStore = useMenuStore()
const { fetchListMenus } = menuStore
const authUserStore = useAuthUserStore()
const route = useRoute()
const { currentAuthUser } = storeToRefs(authUserStore)
const { setBannerWelcome } = useMemberBannerStore()
const isHomePage = computed(() => route.name === AppRoutes.home.name)
const isDotShow = ref(false)

const appState = reactive({
  showPersonalPopup: false,
  mallInfo: undefined,
  bannerMallInfo: undefined,
  showBannerWelcome: false,
  canClickBanner: false,
  showDialogAlert: false,
  currentReferralCode: '',
  allHeaderInfo: undefined,
  avatar: ''
})

const openPersonalMall = () => {
  appState.showPersonalPopup = true
}

onBeforeMount(() => {
  setBannerWelcome(false)
  fetchListMenus()
  shopLogin()
  qrLogin()
})

const onConfirmMall = () => {
  openPersonalMall()
  appState.showDialogAlert = false
}

const getMyPersonalMall = async () => {
  if (currentAuthUser.value?.userSeqNo) {
    appState.currentReferralCode = currentAuthUser.value?.userSeqNo
    const { data, success } = await apiService.myPageService.getMyPersonalMall(
      currentAuthUser.value?.userSeqNo
    )
    if (success) {
      appState.mallInfo = data?.userPersonalMallInfoResponse
      appState.bannerMallInfo = data?.userPersonalMallInfoResponse?.mallName
      appState.showBannerWelcome = true
      appState.canClickBanner = true
      setBannerWelcome(true)
      window.referralCode = undefined
      appState.avatar = data?.userPersonalMallInfoResponse?.profileUrl
    }
  }
}

const getMallNameByReferralCode = async (code) => {
  const { data, success } = await apiService.myPageService.trackingMemberNumber(code)
  window.referralCode = undefined
  return {
    data,
    success
  }
}

const getMallStateInfoData = async (code, canClickBanner = true, reCallMyMall = false) => {
  appState.currentReferralCode = code
  const { data, success } = await getMallNameByReferralCode(code)
  if (!success || !data?.isShowHeader) return
  if (data?.isShowHeader) {
    appState.allHeaderInfo = data
    appState.bannerMallInfo = data?.userPersonalMallInfoResponse?.mallName
    appState.showBannerWelcome = true
    appState.canClickBanner = canClickBanner
    appState.avatar = data?.userPersonalMallInfoResponse?.profileUrl
    setBannerWelcome(true)
    if (reCallMyMall) getMyPersonalMall()
  }
}

const getReferralCode = () => {
  const user = currentAuthUser?.value
  return isBeautyPlanner.value ? user?.userNumber : user?.referralUserNumber
}

const handleNonCustomer = (refCode) => {
  getMallStateInfoData(refCode, true)
}

const handleCustomer = (refCode) => {
  const code = getReferralCode() || refCode
  getMallStateInfoData(code, true)
}

const handleBeautyPlanner = (refCode) => {
  const userNumber = currentAuthUser?.value?.userNumber
  if (refCode === userNumber) {
    getMyPersonalMall()
  } else {
    window.referralCode = undefined
    getMallStateInfoData(refCode, true, true)
    appState.showDialogAlert = true
  }
}

const checkReferralInfo = async (referralCode) => {
  if (referralCode) {
    if (!currentAuthUser?.value?.userSeqNo) {
      handleNonCustomer(referralCode)
    } else if (!isBeautyPlanner.value) {
      handleCustomer(referralCode)
    } else {
      handleBeautyPlanner(referralCode)
    }
  } else if (currentAuthUser?.value?.userSeqNo) {
    const refCode = window?.referrerCode || getReferralCode()
    checkReferralInfo(refCode)
  }
}

watch(
  () => route.query?.referrerCode,
  (value) => {
    if (value) window.referralCode = undefined
    checkReferralInfo(window?.referrerCode || value)
  },
  {
    immediate: true
  }
)

watch(
  () => currentAuthUser?.value,
  () => {
    if (currentAuthUser?.value?.userSeqNo) {
      if (currentAuthUser?.value?.referralUserNumber) {
        if (isBeautyPlanner.value) {
          checkReferralInfo(
            window?.referrerCode || route.query?.referrerCode || currentAuthUser?.value?.userNumber
          )
        } else {
          checkReferralInfo(
            window?.referrerCode ||
              route.query?.referrerCode ||
              currentAuthUser?.value?.referralUserNumber
          )
        }
      }
    }
  },
  { immediate: true }
)

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

onMounted(() => {
  loadLocale()
})

onBeforeUpdate(() => {
  isShowConcierge.value = false
  checkIsShowDot()
})
</script>
