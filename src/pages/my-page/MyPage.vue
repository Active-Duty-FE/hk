<template>
  <div>
    <MyPageIntro :info="myPageState" />

    <div
      class="mt-6 flex cursor-pointer items-center gap-3"
      @click="router.push({ name: AppRoutes.myPage.notice.list.name })"
    >
      <img src="@/assets/svgs/icon-megaphone.svg?url" alt="" />
      <MyPageMenu title="My Activity" class="w-full" icon="subMenu" />
    </div>

    <a-divider class="!bg-gray-10 !my-10" />

    <MyPageOrderHistory :information="myPageState.order" />

    <a-divider class="!bg-gray-10 !my-10" />

    <MyPageAutoshipHistory />

    <a-divider class="!bg-gray-10 !my-10" />

    <div>
      <MyPageMenu title="My Activity" class="mb-6" icon="menu" />

      <div class="flex flex-col gap-5">
        <MyPageMenu
          v-for="menu in MY_ACTIVITY_MENU"
          :key="menu.name"
          :name="menu.name"
          :title="menu.label"
          icon="subMenu"
        />
      </div>
    </div>

    <a-divider class="!bg-gray-10 !my-10" />

    <div>
      <MyPageMenu title="My Information" class="mb-6" icon="menu" />

      <div class="flex flex-col gap-5">
        <MyPageMenu
          v-for="menu in MY_INFORMATION_MENU"
          :key="menu.name"
          :name="menu.name"
          :title="menu.label"
          icon="subMenu"
        />
      </div>
    </div>

    <div class="mb-15 mt-5 w-full max-w-[350px]">
      <p class="font-550 text-navy-6 cursor-pointer text-base" @click="onSignOut">Sign Out</p>
    </div>

    <MyPageFooter />
  </div>
</template>

<script setup>
import { AppRoutes } from '@/router/path'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { onBeforeMount, onMounted, reactive } from 'vue'
import {
  STORAGE_IS_LOGGED_IN,
  STORAGE_ACCESS_TOKEN,
  STORAGE_REFRESH_TOKEN,
  VALUE_COUNTRY,
  ROLES_BE
} from '@/helpers/constant'
import storage from '@/utils/storage'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { useCartStore } from '@/stores/modules/cart'
import { isBeautyPlanner } from '@/utils/role'
import apiService from '@/http/api'
import { useMemberBannerStore } from '@/stores/modules/member-banner'
import { useMenuStore } from '@/stores/modules/menu'

const menuStore = useMenuStore()
const { fetchListMenus } = menuStore
const { setBannerWelcome } = useMemberBannerStore()
const router = useRouter()
const cartStore = useCartStore()
const authUserStore = useAuthUserStore()
const { currentAuthUser } = storeToRefs(authUserStore)

const MY_ACTIVITY_MENU = [
  {
    label: 'My Customer Support Tickets',
    name: AppRoutes.myPage.myInquiry.name
  },
  {
    label: 'My Product Reviews',
    name: AppRoutes.myPage.myReview.name
  }
]

const MY_INFORMATION_MENU = [
  {
    label: 'My Profile',
    name: AppRoutes.myPage.myProfile.name
  },
  {
    label: 'SNS Account',
    name: AppRoutes.myPage.snsAccount.name
  },
  {
    label: 'My Credit Card',
    name: AppRoutes.myPage.creditCard.name
  },
  {
    label: 'Shipping Address Management',
    name: AppRoutes.myPage.shippingAddressManagement.name
  }
]

const myPageState = reactive({
  point: 0,
  coupon: 0,
  order: {
    orderComplete: 0,
    inProgress: 0,
    onRoute: 0,
    delivered: 0,
    returnExchange: 0
  }
})

onBeforeMount(() => {
  if (isBeautyPlanner.value) {
    MY_INFORMATION_MENU.splice(2, 0, {
      label: 'Bag Management',
      name: AppRoutes.myPage.bagManagement.list.name
    })
    MY_INFORMATION_MENU.splice(1, 0, {
      label: 'My Personal Mall',
      name: AppRoutes.myPage.personalMall.name
    })
    if (currentAuthUser.value?.nationalCode === VALUE_COUNTRY.US) {
      MY_INFORMATION_MENU.push({
        label: 'Membership Fee',
        name: AppRoutes.myPage.memberShipFee.name
      })
    }
    if (currentAuthUser.value.userType?.code === ROLES_BE.corporation) {
      MY_INFORMATION_MENU.push({
        label: 'Business Information',
        name: AppRoutes.myPage.businessInformation.name
      })
    }
    MY_INFORMATION_MENU.push({
      label: 'Archive',
      name: AppRoutes.myPage.archive.list.name
    })
  } else {
    MY_INFORMATION_MENU.push({
      label: 'Conversion to planner',
      name: AppRoutes.myPage.conversionOnBoarding.name
    })
  }
})

const onSignOut = () => {
  setBannerWelcome(false)
  storage.removeAllStorage(STORAGE_ACCESS_TOKEN)
  storage.removeAllStorage(STORAGE_REFRESH_TOKEN)
  storage.removeAllStorage(STORAGE_IS_LOGGED_IN)
  cartStore.setStandardCartBadge(0)
  cartStore.setAutoShipCartBadge(0)
  cartStore.setNfrCartBadge(0)
  currentAuthUser.value = null
  router.push({ name: AppRoutes.login.name })
  fetchListMenus()
}

const getPointMyPage = async () => {
  const response = await apiService.myPageService.getPointMyPage(currentAuthUser.value?.userSeqNo)
  if (response.success) {
    myPageState.point = response.data.totalPoint
  }
}
const getCouponMyPage = async () => {
  const response = await apiService.myPageService.getCouponMyPage()
  if (response.success) {
    myPageState.coupon = response.data.availableCouponCount
  }
}
const getViewOrderMyPage = async () => {
  const response = await apiService.myPageService.getOrderMyPage()
  if (response.success) {
    const {
      deliveryOrderCount,
      salesOrderCompleteCount,
      deliveryCount,
      deliveryCompleteCount,
      returnCount
    } = response.data
    myPageState.order = {
      orderComplete: salesOrderCompleteCount,
      inProgress: deliveryOrderCount,
      onRoute: deliveryCount,
      delivered: deliveryCompleteCount,
      returnExchange: returnCount
    }
  }
}

onMounted(() => {
  getPointMyPage()
  getCouponMyPage()
  getViewOrderMyPage()
})
</script>
