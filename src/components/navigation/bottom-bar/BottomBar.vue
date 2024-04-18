<template>
  <div class="bottom-content fixed bottom-0 z-[19] flex h-[80px] w-full bg-white px-[20px]">
    <div class="relative flex w-full items-center justify-between">
      <div class="cursor-pointer text-center" @click="gotoPage('/')">
        <BottomHome :class="{ currentTab: isActive('/') }" />
        <span
          :class="{ 'text-navy-deep': isActive('/') }"
          class="text-navy-3 font-475 block text-[12px] uppercase leading-[10px]"
        >
          Home
        </span>
      </div>
      <div
        class="cursor-pointer pr-[28px] text-center"
        @click="gotoPage('/product-category/monthly-specials')"
      >
        <BottomRiman :class="{ currentTab: isActive('/product-category/monthly-specials') }" />
        <span
          class="text-navy-3 font-475 block text-[12px] uppercase leading-[10px]"
          :class="{ 'text-navy-deep': isActive('/product-category/monthly-specials') }"
        >
          Specials
        </span>
      </div>
      <div class="bottom-main cursor-pointer" @click="openConcierge">
        <span class="h-15 relative block">
          <MainLayer class="m-[7.5px]" />
          <MainFloat class="absolute bottom-0 left-0 right-0 top-0 m-auto" />
          <MainDot v-if="isDotShow" class="absolute right-4 top-4" />
        </span>
      </div>
      <div class="cursor-pointer pl-[28px] text-center" @click="gotoPage('/my-page/order-history')">
        <BottomBenefit :class="{ currentTab: isActive('/my-page/order-history') }" />
        <span class="text-navy-3 font-475 block text-[12px] uppercase leading-[10px]">Orders</span>
      </div>
      <div class="cursor-pointer text-center" @click="gotoPage('/my-page')">
        <BottomAccount :class="{ currentTab: isActive('/my-page') }" />
        <span class="text-navy-3 font-475 block text-[12px] uppercase leading-[10px]">{{
          myPageTitle
        }}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import BottomHome from '@assets/svgs/bottom/home.svg'
import BottomRiman from '@assets/svgs/bottom/star.svg'
import BottomBenefit from '@assets/svgs/bottom/order.svg'
import BottomAccount from '@assets/svgs/bottom/my.svg'
import MainFloat from '@assets/svgs/main-float.svg'
import MainLayer from '@assets/svgs/main-layer.svg'
import MainDot from '@assets/svgs/main-dot.svg'
import { useRouter } from 'vue-router'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { computed, onBeforeUpdate, ref } from 'vue'
import { isBeautyPlanner } from '@/utils/role'
import { storeToRefs } from 'pinia'
import apiService from '@/http/api'

const isDotShow = ref(false)
const router = useRouter()
const currentTab = ref('/')
const useAuthUser = useAuthUserStore()
const { currentAuthUser } = storeToRefs(useAuthUser)
const myPageTitle = computed(() => {
  if (!useAuthUser.currentAuthUser) return 'Account'
  return isBeautyPlanner.value ? 'RBO' : 'My Page'
})

const emits = defineEmits(['openConcierge'])

const gotoPage = (page) => {
  currentTab.value = page
  router.push({ path: page })
}

const isActive = (page) => {
  return page === currentTab.value
}

const openConcierge = () => emits('openConcierge')

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
  checkIsShowDot()
})
</script>
<style lang="scss" scoped>
.bottom-content {
  box-shadow: 0px -2px 2px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0px -2px 2px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px -2px 2px 0px rgba(0, 0, 0, 0.1);
}

.bottom-main {
  @apply w-15 h-15 absolute top-[-10px];
  background: url('@/assets/svgs/main-shadow.svg');
  left: 50%;
  transform: translateX(-50%);
  -webkit-transform: translateX(-50%);
  -moz-transform: translateX(-50%);
  border-radius: 50%;
  background-color: #ffffff;
}

.currentTab {
  :deep(rect) {
    fill: #04263f !important;
  }

  :deep(.pathOne) {
    fill: #04263f !important;
  }

  :deep(.pathTwo) {
    fill: #04263f !important;
  }

  :deep(g path) {
    fill: #04263f !important;
  }
}
</style>
