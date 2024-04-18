<template>
  <div>
    <div class="flex items-center justify-between">
      <span class="w-25 bg-left-area">Member ID</span>
      <div
        class="referral__copyContent w-[calc(100%-100px)] pl-2.5"
        @click="handleTextCopy(pageState.userInfo?.refererCode, true)"
      >
        <span class="font-300">{{ pageState.userInfo?.refererCode }}</span>
        <a-button
          class="referral__copyButton ml-auto"
          type="text"
          :disabled="!pageState.userInfo?.refererCode"
        >
          <img src="@/assets/svgs/icon-copy.svg?url" alt="" />
          {{ pageState.txtCopy === pageState.userInfo?.refererCode ? 'Copied' : 'Copy' }}
        </a-button>
      </div>
    </div>
    <a-divider class="!bg-gray-11 !my-0" />
    <div class="flex w-full items-center">
      <span class="w-25 bg-left-area">Easy Referral Link</span>
      <div class="referral__copyContent !inline w-full pl-2.5">
        <div class="w-full items-center">
          <div>
            <span class="font-300">{{ pageState.userInfo?.referralLink }}</span>
            <a-button
              :disabled="!pageState.userInfo?.referralLink"
              class="referral__copyButton !ml-auto"
              type="text"
              @click="handleTextCopy(pageState.userInfo?.referralLink, false)"
            >
              <img src="@/assets/svgs/icon-copy.svg?url" alt="" />
              {{ pageState.txtCopy === pageState.userInfo?.referralLink ? 'Copied' : 'Copy' }}
            </a-button>
          </div>
        </div>
      </div>
    </div>
    <a-divider class="!bg-gray-11 !my-0" />
    <div v-if="qrImageData" class="text-gray-10 flex items-center justify-between">
      <div class="w-25 bg-left-area h-[200px] truncate text-sm">QR code</div>
      <div class="w-full truncate pl-2.5 text-xs">
        <RLoadingPlaceholder v-if="pageState.isLoading" height="150px" width="150px" />
        <a-image v-else :width="200" :src="qrImageData" />
      </div>
      <div class="w-20">
        <a-button class="referral__copyButton !ml-auto" type="text" @click="saveLocalImage">
          <IconCopy />
          Save
        </a-button>
      </div>
    </div>
    <a-divider v-if="qrImageData" class="!bg-gray-11 !mb-[25px] !mt-0" />
  </div>
</template>

<script setup>
import IconCopy from '@/assets/svgs/icon-copy.svg'
import { copyText } from '@/utils/common'
import apiService, { BASE_API_URL } from '@/http/api'
import { reactive, computed, onMounted, watch } from 'vue'
import { QR_API_PREFIX } from '@/http/endpoints/my-page'
import { AppRoutes } from '@/router/path'
import { HK_MALL_URL } from '@/helpers/constant'
import { isBeautyPlanner } from '@/utils/role'

const props = defineProps({
  dataDetail: {
    type: Object,
    default: () => ({})
  }
})

const pageState = reactive({
  txtCopy: undefined,
  userInfo: {},
  isLoading: false
})

const qrImageData = computed(() => {
  if (!pageState.userInfo?.referralLink) return ''
  return `${BASE_API_URL + QR_API_PREFIX}?qrcodeFileName=${pageState.userInfo?.qrcodeFileName}`
})

const dataFetching = async () => {
  pageState.isLoading = true
  const { data, success } = await apiService.myPageService.getProfile()
  if (success) {
    pageState.userInfo = data
  } else {
    pageState.userInfo = {}
  }
  pageState.isLoading = false
}

const handleTextCopy = (text, isReferral = false) => {
  pageState.txtCopy = text
  const txtCopy = !isReferral
    ? text
    : `${HK_MALL_URL}${AppRoutes.memberShip.path}?referralCode=${text}`
  copyText(txtCopy)
}

const saveLocalImage = async () => {
  if (!qrImageData.value) return

  const response = await fetch(qrImageData.value)

  const blobImage = await response.blob()

  const href = URL.createObjectURL(blobImage)

  const anchorElement = document.createElement('a')
  anchorElement.href = href
  anchorElement.download = 'referral-code-qr'

  document.body.appendChild(anchorElement)
  anchorElement.click()

  document.body.removeChild(anchorElement)
  window.URL.revokeObjectURL(href)
}

const mappingReferralData = (data) => {
  pageState.userInfo = {
    refererCode: data?.referralInfoResponse?.userNumber,
    referralLink: data?.referralInfoResponse?.userLink,
    qrcodeFileName: data?.referralInfoResponse?.qrCodeFileName
  }
}

onMounted(() => {
  if (isBeautyPlanner.value) {
    dataFetching()
  }
})

watch(
  () => props.dataDetail,
  () => {
    if (!isBeautyPlanner.value) {
      mappingReferralData(props.dataDetail?.mallInfo)
    }
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.referral {
  &__label {
    @apply font-475 leading-base text-gray-10 text-sm;
  }

  &__user {
    @apply leading-base font-550 text-navy-6 h-15 flex items-center bg-[#F9F9F9] px-5 text-lg;
  }

  &__copyContent {
    @apply leading-base text-gray-10 flex items-center gap-1 text-xs font-normal;
  }

  &__copyButton {
    background: rgba(224, 224, 224, 0.4);
    @apply font-625 leading-base text-gray-10 flex h-5 items-center gap-1 px-1 text-[10px];
  }
}
.bg-left-area {
  width: 100px;
  min-width: 100px;
  padding: 16px 8px;
  background-color: rgba(244, 244, 244, 0.5);
}
</style>
