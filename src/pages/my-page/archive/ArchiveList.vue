<template>
  <div>
    <div class="">
      <RInput v-model:value="state.keyword" class="notice-searchInput" @keydown.enter="onSearch">
        <template #suffix>
          <SearchIcon class="mb-1 cursor-pointer" @click="onSearch(true)" />
        </template>
      </RInput>
    </div>

    <div v-if="state.archiveList.length" class="pt-[50px]">
      <ArchiveItem
        v-for="(item, index) in state.archiveList"
        :key="item.id"
        :item="item"
        :count="index"
      />
    </div>

    <div v-else class="notice-empty pt-[100px]">
      <span class="font-475">No search results found.</span>
      <span class="-tracking-[0.28px]">Please double-check your search terms.</span>
    </div>
    <div v-if="isShowLoadMore" class="my-[30px] flex justify-center">
      <RButton
        title="MORE"
        class="w-full max-w-[390px]"
        class-title="text-base text-gray-10 leading-base"
        @click="loadMore"
      >
        <template #image>
          <AddIcon class="mb-1" />
        </template>
      </RButton>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import SearchIcon from '@/assets/svgs/icon-search.svg'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import apiService from '@/http/api'
import AddIcon from '@/assets/svgs/add.svg'
import { TypeServiceEnum } from '@/helpers/enum'

const state = reactive({
  keyword: '',
  pageSize: 10,
  pageNumber: 1,
  totalPage: 1,
  archiveList: []
})
const { showGlobalLoading } = useGlobalLoadingStore()
const isShowLoadMore = computed(() => state.pageNumber < state.totalPage)

const loadMore = () => {
  state.pageNumber++
  onSearch()
}

const onSearch = async (reset) => {
  if (reset) {
    state.pageNumber = 1
    state.archiveList = []
  }
  const payload = {
    keyWord: state.keyword,
    typeService: TypeServiceEnum.ARCHIVE
  }
  try {
    const params = { pageNumber: state.pageNumber, pageSize: state.pageSize }
    showGlobalLoading(true)
    const { data } = await apiService.etcService.getArchiveSearchList(payload, params)
    state.archiveList = [...state.archiveList, ...data.list]
    state.totalPage = data.totalPageNumber
  } finally {
    showGlobalLoading(false)
  }
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
    @apply border-b-1 h-10 rounded-none border-0 shadow-none;
  }

  &-empty {
    @apply leading-base mt-20 flex h-full flex-col items-center justify-center text-sm;
  }
}
</style>
