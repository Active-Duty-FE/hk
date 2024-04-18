<template>
  <div v-if="pageState.listInquiries?.length" class="-mx-5 md:mx-0">
    <a-divider class="!bg-gray-10 !mb-0 !mt-[25px]" />
    <a-collapse v-model:activeKey="activeKey" :bordered="false">
      <a-collapse-panel
        v-for="(item, index) in pageState.listInquiries"
        :key="index"
        class="collapse-panel-custom"
        :show-arrow="false"
        :class="[activeKey.includes(String(index)) ? '!border-black-50' : '']"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              <div class="font-475 text-navy-6 style-normal leading-base pb-[10px] text-[12px]">
                {{ genInquiryStatus(item) }}
              </div>
              <div class="text-gray-10 style-normal leading-base font-550 text-[18px]">
                {{ item.inquiryTitle }}
              </div>
            </div>
          </div>
        </template>
        <template #extra>
          <div class="mr-[8px]">
            <div v-if="activeKey.includes(String(index))">
              <MinusIcon class="cursor-pointer" />
            </div>
            <div v-else>
              <AddIcon class="cursor-pointer" />
            </div>
          </div>
        </template>
        <div>
          <InquiryItem
            :key="item.inquiryId"
            v-model:open="item.open"
            :item-info="item"
            @delete="onDelete(item.inquiryId)"
          />
        </div>
      </a-collapse-panel>
    </a-collapse>
    <div class="w-full pb-[30px] pt-10">
      <RButton
        v-if="hasMore"
        class="border-1 border-gray-6 btn-more mx-auto w-[335px] max-w-[335px] !bg-white"
        @click="loadMore"
      >
        <template #content>
          <div>
            <PlusIcon />
            <span class="font-550 leading-base pl-[5px] text-[16px]">MORE</span>
          </div>
        </template>
      </RButton>
    </div>
  </div>
  <div v-else>
    <div class="text-center text-[16px] font-medium">There is no registered item.</div>
  </div>
  <RModalConfirm
    v-model:visible="pageState.showModalDelete"
    description="Are you sure you want to remove this item?"
    text-ok="Remove"
    text-cancel="Cancel"
    :width="270"
    description-class=""
    @ok="removeItem"
    @cancel="cancelRemove"
  />
</template>
<script setup>
import PlusIcon from '@/assets/svgs/my-page/plus.svg'
import { ref, reactive, onMounted, computed, onBeforeUnmount } from 'vue'
import MinusIcon from '@/assets/svgs/my-page/minus.svg'
import AddIcon from '@/assets/svgs/my-page/add.svg'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { InquiryStatusEnum } from '@/helpers/enum'

const { showGlobalLoading } = useGlobalLoadingStore()
const activeKey = ref([])

const pageState = reactive({
  showModalDelete: false,
  listInquiries: [],
  currentId: undefined,
  pageSize: 10,
  currentPage: 1,
  totalPage: 0
})

const genInquiryStatus = (item) => {
  if (item?.inquiryStatusType?.code === InquiryStatusEnum.RECEIPT) return 'Received'
  return item?.inquiryStatusType?.text
}

const hasMore = computed(() => pageState.currentPage < pageState.totalPage)

const onDelete = (id) => {
  pageState.currentId = id
  pageState.showModalDelete = true
}

const removeItem = async () => {
  try {
    showGlobalLoading(true)
    await apiService.conciergeService.deleteInquiry(pageState.currentId)
  } catch (error) {
    showGlobalLoading(false)
  }
  pageState.showModalDelete = false
  resetPageState()
  getListInquiry()
}

const resetPageState = () =>
  Object.assign(pageState, { currentPage: 1, listInquiries: [], totalPage: 0 })

const cancelRemove = () => {
  pageState.showModalDelete = false
}

const loadMore = () => {
  showGlobalLoading(true)
  pageState.currentPage += 1
  getListInquiry()
}

const getListInquiry = async () => {
  const params = {
    pageNumber: pageState.currentPage,
    pageSize: pageState.pageSize
  }
  const response = await apiService.conciergeService.listMyInquiry(params)
  if (response?.success && response?.data) {
    pageState.totalPage = response.data?.totalPageNumber
    const results = response.data?.list || []
    pageState.listInquiries = [...pageState.listInquiries, ...results]
  }
  showGlobalLoading(false)
}

onMounted(() => {
  showGlobalLoading(true)
  getListInquiry()
})

onBeforeUnmount(() => {
  showGlobalLoading(false)
})
</script>
<style lang="scss" scoped>
.collapse-panel-custom {
  @apply bg-white;
  :deep(.ant-collapse-header) {
    @apply border-b-solid border-1 border-color-black-50  flex items-center p-5 text-lg;
    padding-left: 20px !important;
  }

  :deep(.ant-collapse-content-box) {
    padding: 0 !important;
  }
}

:deep(.ant-collapse-item-active) {
  .ant-collapse-header {
    border-bottom: none !important;
  }
}

.btn-more {
  svg {
    opacity: 0;
    transform: translateX(-5px);
    transition: all 0.3s ease;
    :deep(path) {
      fill: #123450 !important;
    }
  }
  &:hover {
    color: #123450;
    svg {
      opacity: 1;
      transform: translateX(0);
      :deep(path) {
        fill: #123450 !important;
      }
    }
  }
}
</style>
