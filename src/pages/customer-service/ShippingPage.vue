<script setup>
import RSelect from '@/components/common/RSelect.vue'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { computed, onMounted, reactive, watch } from 'vue'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { DisplayTypePolicyEnum } from '@/helpers/enum'
import { mappingOptions, latestItem } from '@/utils/cms'
import { CountryEnum } from '@/helpers/enum'
import storage from '@/utils/storage'
import { STORAGE_IP_ADDRESS } from '@/helpers/constant'

const vCleanHtml = buildVueDompurifyHTMLDirective()

const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading

const state = reactive({
  totalSize: 0,
  formData: {
    pageSize: 15,
    pageNumber: 1
  },
  options: [],
  loading: false,
  selectedItem: null
})

const contentInner = computed(
  () => (state.options || [])?.find((item) => item.id === state.selectedItem)?.description || ''
)

const getPolicyList = async (isUpdate = false) => {
  try {
    showGlobalLoading(true)

    const params = {
      ...state.formData
    }

    const payload = {
      displayType: DisplayTypePolicyEnum.SHIPPING,
      nationType: storage.get(STORAGE_IP_ADDRESS, 'localStorage') ?? CountryEnum.US.value
    }

    const { data, success } = await apiService.cmsService.getPolicyList(payload, params)

    if (!success) {
      return
    }
    state.options = isUpdate
      ? [...state.options, ...(mappingOptions(data?.list) || [])]
      : [...(mappingOptions(data?.list) || [])]

    state.totalSize = data?.totalSize || 0

    if (!isUpdate && state.formData.pageNumber === 1) {
      state.selectedItem = latestItem(data?.list)?.id || null
    }
  } catch (error) {
    console.error(error)
  } finally {
    showGlobalLoading(false)
  }
}

const onScroll = (event) => {
  const target = event?.target
  const tempHeight = target?.scrollTop + target?.offsetHeight
  if (tempHeight === target?.scrollHeight && state.options?.length < state.totalSize) {
    state.formData.pageNumber += 1
  }
}

onMounted(() => {
  getPolicyList()
})

watch([() => state.formData.pageNumber], ([newPageNumber], [prevPageNumber]) => {
  if (newPageNumber !== prevPageNumber) {
    getPolicyList(true)
  }
})
</script>
<template>
  <div
    class="text-black-50 mx-auto flex flex-col items-center justify-center overflow-x-hidden px-5 py-[50px] md:max-w-[50%] md:px-20"
  >
    <h3 class="font-550 leading-base mb-10 text-center text-[28px]">Shipping</h3>
    <RSelect
      v-model:value="state.selectedItem"
      class="!mb-[40px] w-full"
      :options="state.options"
      :on-popup-scroll="onScroll"
    />
    <div v-clean-html="contentInner" class="break-words text-justify"></div>
  </div>
</template>

<style scoped lang="scss">
:deep(.ant-select-selection-item) {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: inline-block !important;
}
</style>
