<script setup>
import IconCopy from '@/assets/svgs/icon-copy.svg'
import { computed, onBeforeUnmount, onMounted, reactive } from 'vue'
import { QR_API_PREFIX } from '@/http/endpoints/my-page'
import apiService, { BASE_API_URL } from '@/http/api'
import { AppRoutes } from '@/router/path'
import { HK_MALL_URL } from '@/helpers/constant'

const pageState = reactive({
  userInfo: {},
  isLoading: false,
  isCopied: ''
})

const qrImage = computed(() => {
  if (!pageState.userInfo?.referralLink) return ''
  return `${BASE_API_URL + QR_API_PREFIX}?qrcodeFileName=${pageState.userInfo?.qrcodeFileName}`
})

const fetchData = async () => {
  pageState.isLoading = true
  const { data, success } = await apiService.myPageService.getProfile()
  if (success) {
    pageState.userInfo = data
  } else {
    pageState.userInfo = {}
  }
  pageState.isLoading = false
}

const copyTextToClipboard = async (text, isReferral = false) => {
  try {
    const txtCopy = !isReferral
      ? text
      : `${HK_MALL_URL}${AppRoutes.memberShip.path}?referralCode=${text}`
    await navigator.clipboard.writeText(txtCopy)
    pageState.isCopied = text
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}

const copyStatus = (text) => {
  if (pageState.isCopied === text) {
    return 'Copied'
  }
  return 'Copy'
}

const saveImageToLocal = async () => {
  if (!qrImage.value) return

  const response = await fetch(qrImage.value)

  const blobImage = await response.blob()

  const href = URL.createObjectURL(blobImage)

  const anchorElement = document.createElement('a')
  anchorElement.href = href
  anchorElement.download = 'QR-referral-code'

  document.body.appendChild(anchorElement)
  anchorElement.click()

  document.body.removeChild(anchorElement)
  window.URL.revokeObjectURL(href)
}

onMounted(() => {
  fetchData()
})

onBeforeUnmount(() => {
  pageState.isCopied = ''
})
</script>
<template>
  <div class="">
    <a-divider class="!bg-gray-10 !mb-3.75 !mt-0" />
    <div class="text-gray-10 flex items-center justify-between gap-1">
      <div class="w-3/5 truncate text-sm">Referral Shopping Link</div>
      <div
        class="w-full truncate text-xs"
        :class="{ 'animate-pulse rounded-full bg-slate-200': pageState.isLoading }"
      >
        {{ pageState.userInfo?.refererCode }}
      </div>
      <div class="w-20">
        <a-button
          type="text"
          class="rounded-0.75 bg-btn flex w-20 items-center justify-center"
          :disabled="!pageState.userInfo?.refererCode"
          @click="copyTextToClipboard(pageState.userInfo?.refererCode, true)"
        >
          <div class="text-2.5 font-625 leading-0 flex items-center gap-1">
            <IconCopy />
            {{ copyStatus(pageState.userInfo?.refererCode) }}
          </div>
        </a-button>
      </div>
    </div>
    <a-divider class="!bg-gray-10 !my-3.75" />
    <div class="text-gray-10 flex items-center justify-between">
      <div class="w-3/5 truncate text-sm">Referral Enrollment Link</div>
      <div
        class="w-full truncate text-xs"
        :class="{ 'animate-pulse rounded-full bg-slate-200': pageState.isLoading }"
      >
        {{ pageState.userInfo?.referralLink }}
      </div>
      <div class="w-20">
        <a-button
          type="text"
          class="rounded-0.75 bg-btn flex w-20 items-center justify-center"
          :disabled="!pageState.userInfo?.referralLink"
          @click="copyTextToClipboard(pageState.userInfo?.referralLink, false)"
        >
          <div class="text-2.5 font-625 leading-0 flex items-center gap-1">
            <IconCopy />
            {{ copyStatus(pageState.userInfo?.referralLink) }}
          </div>
        </a-button>
      </div>
    </div>
    <a-divider class="!bg-gray-10 !my-3.75" />
    <div v-if="qrImage" class="text-gray-10 flex items-center justify-between">
      <div class="w-3/5 truncate text-sm">Referral Enrollment QR Code</div>
      <div class="w-full truncate text-xs">
        <RLoadingPlaceholder v-if="pageState.isLoading" height="150px" width="150px" />
        <a-image v-else :width="200" :src="qrImage" />
      </div>
      <div class="w-20">
        <a-button
          type="text"
          class="rounded-0.75 bg-btn flex w-20 items-center justify-center"
          @click="saveImageToLocal"
        >
          <div class="text-2.5 font-625 leading-0 flex flex items-center gap-1">
            <IconCopy />
            Save
          </div>
        </a-button>
      </div>
    </div>
    <a-divider v-if="qrImage" class="!bg-gray-10 !my-3.75" />

    <div class="flex items-start gap-2">
      <img src="@/assets/images/my-page/icon-dot.svg?url" alt="" class="mt-1" />
      <span>
        Share your Membership Number or Referral Link with your friends, and enjoy special benefits
        when you are connected!
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bg-btn {
  background: rgba(224, 224, 224, 0.4);
}
</style>
