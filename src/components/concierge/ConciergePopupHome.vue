<template>
  <div
    class="concierge-content fixed bottom-0 right-0 z-[19] w-full rounded-t-xl bg-white md:right-[40px] md:w-[375px]"
  >
    <div class="relative flex h-full flex-col">
      <div class="relative">
        <div
          class="border-b-1 border-gray-11 flex items-center justify-center border-x-0 border-t-0 border-solid py-2"
        >
          <RIcon />
          <span class="leading-base text-gray-10 pl-1 pt-2 text-[18px] font-medium">Concierge</span>
          <span class="absolute right-5 top-4 cursor-pointer" @click="closePopup">
            <CloseIcon />
          </span>
        </div>
      </div>
      <div v-if="!user" class="px-5 py-5">
        <div class="bg-gray-11 rounded-lg bg-opacity-60 px-3 py-4">
          <img width="42" src="@/assets/images/r-logo-rounded.webp" alt="image content" />
          <span class="pl-1">
            Please <u class="cursor-pointer" @click="gotoLogin()">login</u> to see your notification
          </span>
        </div>
      </div>
      <div v-else class="px-5 py-5">
        <div class="flex items-center justify-between pb-1">
          <div class="text-[18px] font-medium">{{ genTitlePopup() }}</div>
          <div
            class="text-navy-6 w-[66px] cursor-pointer text-[12px] underline"
            @click="gotoMyPageAlarm"
          >
            View more
          </div>
        </div>
        <div class="bg-gray-11 max-h-[214px] overflow-y-auto rounded-lg bg-opacity-60 px-3 pt-4">
          <template v-for="(info, index) in pageState.notifications" :key="info.notificationId">
            <HomeNotifyItem :info="info" />
            <a-divider
              v-if="index < pageState.notifications?.length - 1"
              class="bg-grey-1 !mb-2 !mt-0"
            />
          </template>
          <NoLatestNotify v-if="!pageState.notifications.length" />
        </div>
      </div>
      <a-divider class="bg-gray-11 !mb-6 !mt-0" />
      <div class="flex items-center justify-between px-5 pb-2">
        <div class="text-[18px] font-medium">How can I help you?</div>
        <div class="text-navy-6 cursor-pointer text-[12px] underline" @click="gotoCustomerFaq">
          View more
        </div>
      </div>
      <div class="flex items-start justify-between gap-[12px] px-5 pb-3">
        <img width="30" src="@/assets/images/r-logo-rounded.webp" alt="image content" />
        <div class="bg-gray-11 w-full rounded-lg bg-opacity-60">
          <div
            class="bg-gray-6 search-box rounded-lg border-x-0 border-y-0 border-t-0 border-solid border-transparent bg-opacity-60"
          >
            <a-input
              v-model:value="pageState.keySearch"
              class="!bg-gray-11 !rounded-lg bg-opacity-60 !py-[6px]"
              @press-enter="gotoSearchFaqPage"
            >
              <template #suffix>
                <span class="cursor-pointer" @click="gotoSearchFaqPage">
                  <SearchIcon />
                </span>
              </template>
            </a-input>
          </div>
        </div>
      </div>
      <div class="flex items-start justify-between gap-[12px] px-5 pb-3">
        <div class="w-full pb-24 pl-10">
          <span
            v-for="category in FAQ_OPTIONS"
            :key="category"
            class="border-1 border-gray-11 mb-1 ml-1 inline-block cursor-pointer rounded-xl border-solid px-2 py-[0.5] font-light text-gray-600"
            @click="gotoFaqByCategory(category.value)"
          >
            {{ category.label }}
          </span>
        </div>
      </div>
      <div class="absolute bottom-0 w-full bg-white pb-5">
        <div class="flex justify-between gap-[10px] px-5">
          <RButton
            title="Phone Reservation"
            class="!bg-navy-6 w-1/2 !rounded-sm !border-none opacity-50"
            class-title="text-white !text-[13px]"
            @click="gotoPhoneInquiry"
          />
          <CheckLoginContent v-slot="loginSlot" @complete="checkComplete">
            <RButton
              title="Customer Support Ticket"
              class="!bg-navy-6 w-1/2 !rounded-sm !border-none"
              class-title="text-white !text-[13px]"
              @click="loginSlot.checkLogin"
            />
          </CheckLoginContent>
        </div>
      </div>
    </div>
  </div>
  <RModalAlert
    v-model:visible="pageState.isShowModal"
    title=""
    text-btn="Ok"
    :description="pageState.descriptionModal"
    :width="280"
    @confirm="pageState.isShowModal = false"
  />
</template>
<script setup>
import CloseIcon from '@/assets/svgs/pin-close.svg'
import RIcon from '@/assets/svgs/r-icon.svg'
import SearchIcon from '@assets/svgs/search.svg'
import { FAQ_OPTIONS, ROLES_BE } from '@/helpers/constant'
import { AppRoutes } from '@/router/path'
import { useRouter } from 'vue-router'
import { onBeforeUnmount, reactive } from 'vue'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { storeToRefs } from 'pinia'
import { useQuery } from 'vue-query'
import apiService from '@/http/api'
import { getFullName, getIsLoggedIn } from '@/utils/auth'
import { CONCIERGE_MESSAGE } from '@/helpers/validate-message'

const router = useRouter()
const authStore = useAuthUserStore()
const { currentAuthUser } = storeToRefs(authStore)
const emits = defineEmits(['close'])
const pageState = reactive({
  keySearch: undefined,
  notifications: [],
  isShowModal: false,
  descriptionModal: ''
})

defineProps({
  user: {
    type: Object,
    default: null
  }
})

useQuery(['recent-notifications'], () => apiService.conciergeService.recentNotification(), {
  onSettled: (data, error) => {
    if (data?.success && data?.data) {
      pageState.notifications = data.data
    } else {
      //
    }
  },
  refetchOnWindowFocus: false,
  enabled: !!currentAuthUser?.value || !!getIsLoggedIn()
})

const closePopup = () => emits('close')

const checkComplete = (data) => {
  pageState.isShowModal = true
  pageState.descriptionModal = CONCIERGE_MESSAGE.notAllowCreateTicket
  return
}

const gotoLogin = (redirect) =>
  redirect
    ? router.push({ name: AppRoutes.login.name, query: { redirect } })
    : router.push(AppRoutes.login)

const gotoCustomerFaq = () => {
  router.push(AppRoutes.customerFaq)
}

const gotoMyPageAlarm = () => {
  router.push(AppRoutes.myPage.alarm)
}

const gotoPhoneInquiry = () => {
  router.push(AppRoutes.phoneInquiry)
}

const gotoSearchFaqPage = () => {
  router.push({ name: AppRoutes.faq.name, query: { keySearch: pageState.keySearch?.trim() } })
}

const gotoFaqByCategory = (category) => {
  router.push({
    name: AppRoutes.faq.name,
    query: { keySearch: pageState.keySearch?.trim(), category }
  })
}

const genTitlePopup = () => {
  if (!currentAuthUser) {
    return 'RIMAN'
  } else {
    if (
      [ROLES_BE.no_referral_consumer, ROLES_BE.consumer].includes(
        currentAuthUser.value?.userType?.code
      )
    ) {
      return 'RIMAN'
    }
    return `${getFullName.value} Shopping Mall`
  }
}

onBeforeUnmount(() => {
  closePopup()
})
</script>
<style lang="scss" scoped>
.search-box {
  box-shadow: 0px 5px 15px -5px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0px 5px 15px -5px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px 5px 15px -5px rgba(0, 0, 0, 0.1);

  :deep(.ant-input-affix-wrapper) {
    @apply border-none py-[4px] shadow-none;

    &:focus {
      @apply shadow-none;
    }
  }

  :deep(.ant-input-suffix) {
    @apply mt-1 cursor-pointer;
  }

  :deep(.disable-action) {
    path {
      stroke: #e0e0e0 !important;
    }
  }

  :deep(.ant-input) {
    @apply bg-gray-11 bg-opacity-60;
  }
}

.concierge-content {
  box-shadow: -2px -2px 5px 2px rgba(0, 0, 0, 0.12);
  @apply max-h-[calc(100%-80px)];
}
</style>
