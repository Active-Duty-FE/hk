<template>
  <div
    class="concierge-content fixed bottom-0 right-0 z-[19] w-full rounded-t-xl bg-white md:!hidden"
  >
    <div class="relative flex h-full flex-col">
      <div class="relative">
        <div
          class="border-b-1 border-gray-11 flex items-center justify-center border-x-0 border-t-0 border-solid"
        >
          <span class="leading-base text-gray-10 py-5 text-[18px] font-medium"
          >My Personal Mall</span
          >
          <span class="absolute right-5 top-5 cursor-pointer" @click="closePopup">
            <CloseIcon />
          </span>
        </div>
      </div>
      <div class="overflow-y-scroll">
        <PersonalMallContent :data-detail="appState.dataDetail" @close="closePopup" />
      </div>
    </div>
  </div>
  <a-modal
    wrap-class-name="popup-personal-mall"
    centered
    :visible="visible"
    :footer="false"
    title="My Personal Mall"
    @cancel="closePopup"
  >
    <div class="max-h-[650px] overflow-y-auto">
      <PersonalMallContent :data-detail="appState.dataDetail" @close="closePopup" />
    </div>
  </a-modal>
</template>
<script setup>
import CloseIcon from '@/assets/svgs/pin-close.svg'
import { onBeforeMount, onBeforeUnmount, reactive, watch } from 'vue'
import apiService from '@/http/api'
import { addPrefixForImage } from '@/utils/common'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { storeToRefs } from 'pinia'
import { isBeautyPlanner } from '@/utils/role'

const { currentAuthUser } = storeToRefs(useAuthUserStore())
const emits = defineEmits(['close'])
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  referralCode: {
    type: String,
    default: undefined
  },
  allHeaderInfo: {
    type: Object,
    default: undefined
  }
})

const appState = reactive({
  dataDetail: {
    mallInfo: undefined,
    avatar: ''
  }
})

const closePopup = () => emits('close')

onBeforeUnmount(() => {
  closePopup()
})

const getMyPersonalMall = async () => {
  const { data, success } = await apiService.myPageService.getMyPersonalMall(
    currentAuthUser.value?.userSeqNo
  )
  if (success) {
    appState.dataDetail.mallInfo = data
    if (data?.userPersonalMallInfoResponse?.profileUrl) {
      appState.dataDetail.avatar = addPrefixForImage(data?.userPersonalMallInfoResponse?.profileUrl)
    }
  }
}

const mappingDataIntro = (data) => {
  appState.dataDetail.mallInfo = data
  appState.dataDetail.avatar = data?.userPersonalMallInfoResponse?.profileUrl
    ? addPrefixForImage(data?.userPersonalMallInfoResponse?.profileUrl)
    : ''
}

onBeforeMount(() => {
  if (isBeautyPlanner.value) {
    getMyPersonalMall()
  }
})

watch(
  [() => props.referralCode, () => props.allHeaderInfo],
  () => {
    if (!isBeautyPlanner.value) {
      mappingDataIntro(props.allHeaderInfo)
    }
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped>
.concierge-content {
  box-shadow: -2px -2px 5px 2px rgba(0, 0, 0, 0.12);
  @apply h-[calc(100%-100px)] max-h-[calc(100%-100px)];
}
</style>
