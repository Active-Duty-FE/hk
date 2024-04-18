<template>
  <div class="withdrawalConfirm mx-auto max-w-[450px]">
    <div class="flex-1">
      <p class="text__title">Do you want to proceed with membership withdrawal?</p>

      <div class="py-4">
        <div v-for="note in NOTES" :key="note" class="mt-2.5 flex items-start gap-2">
          <img src="@/assets/images/my-page/icon-dot.svg?url" alt="" class="mt-1" />
          <span class="leading-base text-gray-14 text-xs font-normal">{{ note }}</span>
        </div>
      </div>

      <div>
        <a-divider class="!bg-gray-14 !mb-[15px]" />
        <div class="flex justify-between">
          <span class="leading-base text-gray-10 text-[14px] font-medium">Available Coupons</span>
          <span class="leading-base text-gray-10 text-[12px] font-normal"
          >{{ pageState.coupon }} Coupons</span
          >
        </div>
        <a-divider class="!bg-gray-14 !my-[15px]" />
        <div class="flex justify-between">
          <span class="leading-base text-gray-10 text-[14px] font-medium">Available Points</span>
          <span class="leading-base text-gray-10 text-[12px] font-normal"
          >{{ pageState.point }} Points</span
          >
        </div>
        <a-divider class="!bg-gray-14 !mt-[15px]" />
      </div>

      <p class="text__title">Please select reason for withdrawal</p>

      <RCheckboxGroup
        v-slot="{ label }"
        v-model:value="formState.reason"
        :options-custom="reasonList"
        class="!flex flex-col gap-2.5"
      >
        <span class="text__reason">{{ label }}</span>
      </RCheckboxGroup>

      <div v-if="formState.reason.includes('OTHER')" class="ml-6.5 mt-1">
        <RInput v-model:value="formState.other" placeholder="Please enter your details" />
        <span
          v-if="!formState.other"
          class="text-[12px] text-red-500"
        >Please fill in your details</span
        >
      </div>
    </div>

    <div class="mx-auto mt-10 grid w-full max-w-[350px] grid-cols-2 gap-1 pb-2">
      <RButton
        title="Cancel"
        class-title="font-550 text-navy-6 text-sm"
        class="!border-navy-6 w-full"
        @click="onCancel"
      />

      <RButton
        title="Confirm"
        class-title="font-550 text-white text-sm"
        class="!border-navy-6 !bg-navy-6 w-full"
        @click="onConfirm"
      />
    </div>
  </div>
  <RModalConfirm
    v-model:visible="pageState.showModalError"
    text-ok="Ok"
    text-cancel="Cancel"
    :width="270"
    :mask-closable="false"
    @ok="handleConfirmAction"
    @cancel="pageState.showModalError = false"
  >
    <template #extraDescription>
      <div>{{ pageState.description }}</div>
    </template>
  </RModalConfirm>
  <RModalAlert
    v-model:visible="pageState.showModalValidate"
    :description="pageState.validateMessage"
    text-ok="Ok"
    :width="270"
    :mask-closable="false"
    @confirm="pageState.showModalValidate = false"
  >
  </RModalAlert>
  <RModalAlert
    v-model:visible="pageState.showModalWithdraw"
    :description="pageState.validateWithdraw"
    text-ok="Ok"
    :width="270"
    :mask-closable="false"
    @confirm="gotoMyPage()"
  >
  </RModalAlert>
</template>

<script setup>
import { useNotification } from '@/composables/notification'
import {
  STORAGE_ACCESS_TOKEN,
  STORAGE_IS_LOGGED_IN,
  STORAGE_REFRESH_TOKEN
} from '@/helpers/constant'
import apiService from '@/http/api'
import router from '@/router'
import { AppRoutes } from '@/router/path'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { useCartStore } from '@/stores/modules/cart'
import { useMemberBannerStore } from '@/stores/modules/member-banner'
import { useMenuStore } from '@/stores/modules/menu'
import storage from '@/utils/storage'
import { storeToRefs } from 'pinia'
import { onMounted, reactive, ref, watch } from 'vue'
import { useQuery } from 'vue-query'
import { useGlobalLoadingStore } from '@/stores/modules/loading'

const menuStore = useMenuStore()
const { fetchListMenus } = menuStore
const { setBannerWelcome } = useMemberBannerStore()
const cartStore = useCartStore()
const { currentAuthUser } = storeToRefs(useAuthUserStore())
const { showNotification } = useNotification()
const { showGlobalLoading } = useGlobalLoadingStore()

const NOTES = [
  'Upon membership withdrawal, membership in the Riman Mall is restricted for 30 days.',
  'All remaining Points and Coupons will expire once you withdraw your membership.',
  'Please decide carefully as it cannot be used afterwards.',
  'Before withdrawal, check again to see if there are products currently being shipped. If there is a product that is being shipped, you can withdraw after delivery is complete.',
  'Upon membership withdrawal, your information cannot be recovered, and login access is unavailable.'
]

const reasonList = ref([])
const formState = reactive({
  reason: [],
  other: ''
})
const pageState = reactive({
  point: 0,
  coupon: 0,
  showModalError: false,
  isCancel: true,
  description: '',
  isWithdraw: false,
  showModalValidate: false,
  validateMessage: 'Please select the reason for withdrawal.',
  showModalWithdraw: false,
  validateWithdraw: ''
})

useQuery(['list-reason'], () => apiService.myPageService.reasonWithdraw(), {
  onSettled(response) {
    if (response.success && response.data) {
      reasonList.value = response.data?.map((el) => ({ ...el, label: el?.text, value: el?.code }))
    }
  },
  refetchOnWindowFocus: false
})

const getPointMyPage = async () => {
  const response = await apiService.myPageService.getPointMyPage(currentAuthUser.value?.userSeqNo)
  if (response.success) {
    pageState.point = response.data.totalPoint
  }
}
const getCouponMyPage = async () => {
  const response = await apiService.myPageService.getCouponMyPage()
  if (response.success) {
    pageState.coupon = ~~response.data.availableCouponCount
  }
}

const onCancel = () => {
  pageState.description = 'Would you like to cancel your membership withdrawal application?'
  pageState.isCancel = true
  pageState.isWithdraw = false
  pageState.showModalError = true
}

const onConfirm = () => {
  const validateFailed = isDisableButtonConfirm()
  if (validateFailed) {
    pageState.showModalValidate = true
  } else {
    pageState.isCancel = false
    pageState.isWithdraw = true
    pageState.description =
      'When you withdraw, all coupons and points you have will be destroyed. Do you want to proceed?'
    pageState.showModalError = true
  }
}

const signOut = () => {
  setBannerWelcome(false)
  storage.removeAllStorage(STORAGE_ACCESS_TOKEN)
  storage.removeAllStorage(STORAGE_REFRESH_TOKEN)
  storage.removeAllStorage(STORAGE_IS_LOGGED_IN)
  cartStore.setStandardCartBadge(0)
  cartStore.setAutoShipCartBadge(0)
  cartStore.setNfrCartBadge(0)
  currentAuthUser.value = null
  fetchListMenus()
  router.push('/')
}

const handleConfirmAction = async () => {
  if (pageState.isCancel) {
    router.push({ path: AppRoutes.myPage.path })
    return
  }
  if (pageState.isWithdraw) {
    try {
      pageState.showModalError = false
      showGlobalLoading(true)
      const payload = {
        note: formState.other || '',
        withdrawalReasonType: formState.reason[0]
      }
      const response = await apiService.myPageService.withdrawMember(
        currentAuthUser.value.userSeqNo,
        payload
      )
      showGlobalLoading(false)
      if (response && response.success && response.status === 200) {
        showNotification({ type: 'success', message: 'Withdraw successfully!' })
        signOut()
      } else {
        pageState.validateWithdraw = response?.message
        pageState.showModalWithdraw = true
      }
      return
    } catch (error) {
      showGlobalLoading(false)
    }
  }
}

const gotoMyPage = () => {
  pageState.showModalWithdraw = false
  router.push({ path: AppRoutes.myPage.path })
}

const isDisableButtonConfirm = () => {
  if (!formState.reason.length) return true
  if (formState.reason.length) {
    if (!formState.reason.includes('OTHER')) return false
    if (!formState.other) return true
    return false
  }
  return true
}

watch(
  () => formState.reason,
  (value) => {
    if (!value.length) formState.other = ''
    if (value.length && !value.includes('OTHER')) formState.other = ''
    if (value.length > 1) {
      formState.reason = [formState.reason.findLast((el) => el)]
    }
  },
  { deep: true }
)

onMounted(() => {
  getPointMyPage()
  getCouponMyPage()
})
</script>

<style lang="scss" scoped>
.withdrawalConfirm {
  height: calc(100dvh - 65px - 61px - 50px - 40px);
  @apply flex flex-col;
}

.text {
  &__title {
    @apply font-550 text-gray-10 mb-0 text-base leading-[22px];
  }

  &__reason {
    @apply leading-base pl-0.5 text-sm -tracking-[0.28px];
  }
}
</style>
