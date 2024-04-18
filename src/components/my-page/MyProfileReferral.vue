<template>
  <div>
    <div v-if="userInfo.recommenderName">
      <p class="referral__label">Referral</p>
      <div class="referral__user">
        {{ userInfo.recommenderName }}
        <a-divider type="vertical" class="!bg-navy-6 !h-4 !bg-opacity-40" />
        {{ userInfo.recommenderNumber }}
      </div>

      <a-divider class="!bg-gray-11 !my-7.5" />
    </div>
    <div class="mb-2.5 flex items-center justify-between">
      <span>My Membership Number</span>
      <div class="referral__contentCopy" @click="handleCopyText(userInfo.refererCode, true)">
        <span>{{ userInfo.refererCode }}</span>
        <a-button class="referral__buttonCopy" type="text" :disabled="!userInfo.refererCode">
          <img src="@/assets/svgs/icon-copy.svg?url" alt="" />
          {{ pageState.txtCopy === userInfo.refererCode ? 'Copied' : 'Copy' }}
        </a-button>
      </div>
    </div>

    <div class="mb-4 flex items-center justify-between">
      <span>Easy Referral Link</span>
      <div class="referral__contentCopy">
        <span>{{ userInfo?.referralLink }}</span>
        <a-button
          :disabled="!userInfo.referralLink"
          class="referral__buttonCopy"
          type="text"
          @click="handleCopyText(userInfo.referralLink, false)"
        >
          <img src="@/assets/svgs/icon-copy.svg?url" alt="" />
          {{ pageState.txtCopy === userInfo.referralLink ? 'Copied' : 'Copy' }}
        </a-button>
      </div>
    </div>

    <div class="flex items-start gap-2">
      <img src="@/assets/images/my-page/icon-dot.svg?url" alt="" class="mt-1" />
      <span>
        Share your Membership Number or Referral Link with your friends, and enjoy special benefits
        when you are connected!
      </span>
    </div>
  </div>
</template>

<script setup>
import { HK_MALL_URL } from '@/helpers/constant'
import { AppRoutes } from '@/router/path'
import { copyText } from '@/utils/common'
import { reactive } from 'vue'

defineProps({
  userInfo: {
    type: Object,
    default: () => ({})
  }
})

const pageState = reactive({
  txtCopy: undefined
})

const handleCopyText = (text, isReferral = false) => {
  const txtCopy = !isReferral
    ? text
    : `${HK_MALL_URL}${AppRoutes.memberShip.path}?referralCode=${text}`
  pageState.txtCopy = text
  copyText(txtCopy)
}
</script>

<style lang="scss" scoped>
.referral {
  &__label {
    @apply font-475 leading-base text-gray-10 text-sm;
  }

  &__user {
    @apply leading-base font-550 text-navy-6 h-15 flex items-center bg-[#F9F9F9] px-5 text-lg;
  }

  &__contentCopy {
    @apply leading-base text-gray-10 flex items-center gap-1 text-xs font-normal;
  }

  &__buttonCopy {
    background: rgba(224, 224, 224, 0.4);
    @apply font-625 leading-base text-gray-10 flex h-5 items-center gap-1 px-1 text-[10px];
  }
}
</style>
