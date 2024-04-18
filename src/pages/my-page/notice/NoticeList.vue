<template>
  <div>
    <div class="-mx-5 md:mx-0">
      <RTabCustom v-model="state.currentTab" :tabs="tabs" @change="onChangeTab" />
    </div>

    <div>
      <RInput
        v-model:value="state.keyword"
        class="notice-searchInput"
        @keydown.enter="onSearch(false)"
      >
        <template #suffix>
          <SearchIcon class="mb-1 cursor-pointer" @click="onSearch(false)" />
        </template>
      </RInput>
    </div>

    <div v-if="state.noticeList.length" class="mt-12.5">
      <NoticeItem v-for="item in state.noticeList" :key="item.id" :item="item" />
    </div>

    <div v-else class="notice-empty">
      <span class="font-475">No search results found.</span>
      <span class="-tracking-[0.28px]">Please double-check your search terms.</span>
    </div>

    <RButton
      v-if="state.pageNumber < state.totalPageNumber"
      title="MORE"
      class="!border-gray-10 mx-auto mb-10 w-full md:w-[390px]"
      class-title="text-gray-10 text-base md:text-lg font-550"
      @click="onSearch(true)"
    >
      <template #content>
        <img src="@/assets/svgs/add.svg?url" alt="" loading="lazy" class="mb-1" />
      </template>
    </RButton>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, reactive } from 'vue'
import SearchIcon from '@/assets/svgs/icon-search.svg'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import apiService from '@/http/api'
import { isBeautyPlanner } from '@/utils/role'

const { showGlobalLoading } = useGlobalLoadingStore()
const tabs = [
  {
    label: `All`,
    value: 'ALL'
  },
  {
    label: `Notice`,
    value: 'NOTICE'
  },
  {
    label: `News`,
    value: 'NEW'
  }
]

const state = reactive({
  currentTab: 'ALL',
  keyword: '',
  pageSize: 10,
  pageNumber: 1,
  noticeList: [],
  totalPageNumber: 0
})

const onChangeTab = () => {
  state.keyword = ''
  state.pageSize = 10
  state.pageNumber = 1
  onSearch(false)
}

onBeforeMount(() => {
  onSearch(false)
})

const displayType = computed(() => (isBeautyPlanner.value ? 'PLANNER' : 'CUSTOMER'))

const onSearch = async (isLoadMore) => {
  state.pageNumber = isLoadMore ? state.pageNumber + 1 : 1
  showGlobalLoading(true)
  const { data } = await apiService.etcService.getNoticeList(
    {
      displayCategory: state.currentTab,
      keyWord: state.keyword,
      typeService: 'NOTICE',
      displayType: displayType.value
    },
    {
      pageNumber: state.pageNumber,
      pageSize: state.pageSize
    }
  )
  showGlobalLoading(false)

  if (isLoadMore) {
    state.noticeList.push(...(data?.list || []))
  } else {
    state.noticeList = data?.list || []
  }

  state.totalPageNumber = ~~data?.totalPageNumber
}
</script>

<style lang="scss" scoped>
.notice {
  &-heading {
    @apply font-550 leading-base mt-12.5 mb-10 text-center text-[28px];
  }

  &-searchInput {
    border-right: 0 !important;
    border-color: #666666 !important;
    @apply border-b-1 mt-6 h-10 rounded-none border-0 shadow-none;
  }

  &-empty {
    @apply leading-base mt-20 flex h-full flex-col items-center justify-center text-sm;
  }
}
</style>
