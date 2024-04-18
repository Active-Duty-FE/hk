<template>
  <div>
    <div class="flex items-center gap-2.5">
      <img
        :src="handleRenderAvatarCustomer"
        alt="avatar"
        class="intro__avatar aspect-square w-10 rounded-full"
      />
      <div class="w-full">
        <div class="mb-1">
          <span class="mr-1 text-lg font-medium leading-[22px]">{{ getFullName }}</span>
          <span class="leading-base text-sm font-normal">({{ currentAuthUser?.userNumber }})</span>
        </div>
        <div class="flex justify-between md:justify-start md:gap-4">
          <span class="intro__link" @click="toggleMyLevel">View Level Benefits</span>
          <span v-if="isBeautyPlanner" class="intro__link" @click="toggleReferralCode">
            Referral Links
          </span>
          <span class="intro__link" @click="openModalQrLogin()"> QR Login</span>
        </div>
      </div>
    </div>

    <div class="bg-#F9F9F9 mt-5 grid grid-cols-2 py-2.5">
      <div
        v-for="item in items"
        :key="item.key"
        class="intro__item cursor-pointer"
        @click="gotoPointCoupon(item.key)"
      >
        <span>{{ item.label }}</span>
        <p class="mb-0 text-lg font-bold leading-[18px]">
          {{ info[item.key] }} <span class="leading-base font-475 text-xs">{{ item.extra }}</span>
        </p>
      </div>
    </div>

    <RDrawerBottom v-model="pageState.isShowMyLevel" title="View My Level">
      <LevelBeauty v-if="isBeautyPlanner" />
      <LevelCustomer v-else />
    </RDrawerBottom>
    <RDrawerBottom v-model="pageState.isShowReferralCode" title="Referral Links">
      <MyReferralCode v-if="pageState.isShowReferralCode" />
    </RDrawerBottom>
  </div>
  <RModalAlert
    v-model:visible="modalQrCode"
    title="Login with QR"
    width="300px"
    @confirm="closeModalQrCode()"
  >
    <template #extraDescription>
      <div class="relative">
        <vue-qrcode :value="customLoginUrl()" :options="{ width: 260 }"></vue-qrcode>
        <img class="qrcode__image" :src="IconQRcode" alt="riman" />
      </div>
    </template>
  </RModalAlert>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { AppRoutes } from '@/router/path'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import MyReferralCode from './MyReferralCode.vue'
import { isBeautyPlanner } from '@/utils/role'
import IconQRcode from '@/assets/images/r-logo-rounded.webp'
import VueQrcode from '@chenfengyuan/vue-qrcode'
import secure from '@/utils/secure'
import storage from '@/utils/storage'
import {
  HK_MALL_URL,
  STORAGE_ACCESS_TOKEN,
  STORAGE_REFRESH_TOKEN,
  SHOP_LOGIN_KEY
} from '@/helpers/constant'

import { getFullName, handleRenderAvatarCustomer, getSaveTokenStorage } from '@/utils/auth'

const authUserStore = useAuthUserStore()
const { currentAuthUser } = storeToRefs(authUserStore)
const router = useRouter()
const modalQrCode = ref(false)

defineProps({
  info: {
    type: Object,
    default: () => ({
      point: 10000,
      coupon: 30
    })
  }
})

const items = [
  {
    label: 'Available Points',
    key: 'point',
    extra: 'P'
  },
  {
    label: 'Coupons',
    key: 'coupon',
    extra: 'EA'
  }
]

const pageState = reactive({
  isShowMyLevel: false,
  isShowReferralCode: false
})

const openModalQrLogin = () => {
  modalQrCode.value = true
}

const closeModalQrCode = () => {
  modalQrCode.value = false
}

const customLoginUrl = () => {
  const token = {
    access_token: storage.get(STORAGE_ACCESS_TOKEN, getSaveTokenStorage()),
    refresh_token: storage.get(STORAGE_REFRESH_TOKEN, getSaveTokenStorage())
  }
  return `${HK_MALL_URL}?qr=login&access_token=${token.access_token}&refresh_token=${token.refresh_token}`
}

const toggleMyLevel = () => {
  pageState.isShowMyLevel = !pageState.isShowMyLevel
}

const toggleReferralCode = () => {
  pageState.isShowReferralCode = !pageState.isShowReferralCode
}

const gotoPointCoupon = (key) => {
  if (key === 'point') return router.push({ name: AppRoutes.myPage.point.name })
  return router.push({ name: AppRoutes.myPage.coupon.name })
}
</script>

<style lang="scss" scoped>
.intro {
  &__link {
    @apply leading-base w-fit cursor-pointer text-sm font-normal underline;
  }

  &__item {
    @apply relative flex flex-col items-center justify-center gap-2.5;

    &:not(:last-child)::after {
      @apply h-7.5 bg-gray-14 absolute right-0 top-1/2 w-[1px] -translate-y-1/2 content-[''];
    }
  }
}
.qrcode__image {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.25);
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
}
</style>
