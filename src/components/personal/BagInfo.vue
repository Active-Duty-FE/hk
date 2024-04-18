<template>
  <div>
    <div v-if="bagState.bagList.length">
      <template v-for="item in bagState.bagList" :key="item.bagId">
        <a-divider class="!bg-gray-11 !mt-5" />
        <div class="mb-5">
          <div class="flex items-center justify-between">
            <div>
              <p class="leading-base !mb-[4px] text-[14px] font-normal">{{ item.title }}</p>
              <p class="font-300 leading-base mb-0 text-[12px]">
                {{ formatDateTime(item.createdAt, FORMAT_FULL_DATE_USE_DOT) }}
              </p>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <a-button
                  class="referral__buttonCopy ml-auto"
                  type="text"
                  @click="viewBagDetail(item.bagId)"
                >
                  <img src="@/assets/svgs/personal/view.svg?url" alt="" />
                  View
                </a-button>
                <a-button
                  class="referral__buttonCopy ml-auto"
                  type="text"
                  @click="shareBagDetail(item.shortUrl)"
                >
                  <img src="@/assets/svgs/personal/share.svg?url" alt="" />
                  Share
                </a-button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div v-else>
      <p class="style-normal mb-0 py-10 text-[14px] font-normal">There are no bags created.</p>
    </div>
    <div v-if="isBeautyPlanner" class="py-5">
      <r-button
        title="Create New Bag"
        class="!rounded-0 !bg-navy-6 btn-new w-full !min-w-full"
        class-title="text-lg"
        type="primary"
        height="40px"
        @click="createNewBag()"
      >
        <template #image>
          <AddIcon />
        </template>
      </r-button>
    </div>
  </div>
</template>
<script setup>
import AddIcon from '@/assets/svgs/add.svg'
import router from '@/router'
import { onBeforeMount, reactive, watch } from 'vue'
import apiService from '@/http/api'
import { AppRoutes } from '@/router/path'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useNotification } from '@/composables/notification'
import { formatDateTime } from '@/utils/datetime'
import { FORMAT_FULL_DATE_USE_DOT, MAX_BAG_LENGTH } from '@/helpers/constant'
import { isBeautyPlanner } from '@/utils/role'

const props = defineProps({
  dataDetail: {
    type: Object,
    default: () => ({})
  }
})

const { showGlobalLoading } = useGlobalLoadingStore()
const { showNotification } = useNotification()
const bagState = reactive({
  bagList: []
})

const emits = defineEmits(['close'])

const createNewBag = () => {
  onCreateNewBag()
}

onBeforeMount(() => {
  if (isBeautyPlanner.value) {
    getBags()
  }
})

const getBags = async () => {
  showGlobalLoading(true)
  const params = {
    isPersonalInfo: true
  }
  const { data, success } = await apiService.bagService.getBagList(params)
  bagState.bagList = success ? data : []
  showGlobalLoading(false)
}

const onCreateNewBag = () => {
  if (bagState.bagList.length >= MAX_BAG_LENGTH) {
    showNotification({
      type: 'error',
      message: `You can create up to ${MAX_BAG_LENGTH} bags.`
    })
    return
  }

  emits('close')
  router.push({ name: AppRoutes.myPage.bagManagement.create.name })
}

const viewBagDetail = (id) => {
  emits('close')
  router.push({ name: AppRoutes.bag.detail.name, params: { id } })
}

const shareBagDetail = async (url) => {
  await navigator.clipboard.writeText(url)
  showNotification({
    type: 'success',
    message: 'Bag’s link has been copied.'
  })
}

const mappingReferralData = (data) => {
  if (data?.bagResponses && data?.bagResponses.length) {
    bagState.bagList = data?.bagResponses
  }
}

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
.referral__buttonCopy {
  background: rgba(224, 224, 224, 0.4);
  @apply font-625 leading-base text-gray-10 flex h-5 items-center gap-1 px-1 text-[10px];
}

.btn-new {
  :deep(path) {
    fill: #ffffff;
  }
  &:hover {
    :deep(path) {
      fill: #212121;
    }
  }
}
</style>
