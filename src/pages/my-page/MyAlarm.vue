<template>
  <div class="pb-8">
    <div class="pb-2 text-right">
      <span
        v-if="pageState.results.length"
        class="text-navy-6 cursor-pointer underline"
        @click="onDeleteAll"
      >Delete All</span
      >
    </div>
    <div
      v-for="info in pageState.results"
      :key="info.notificationId"
      class="bg-gray-11 notify-content relative rounded-lg bg-opacity-60 p-5"
    >
      <div
        v-if="info.read"
        class="overlay-read pointer-events-auto absolute right-0 top-0 h-full bg-opacity-50"
      ></div>
      <HomeNotifyItem :info="info" :is-home="false" @delete="(id) => deleteNotification(id)" />
    </div>
    <div v-if="!pageState.results.length"><NoLatestNotify /></div>
    <div v-if="hasMore" class="pt-8">
      <RButton
        class="border-1 border-gray-6 mx-auto w-[335px] max-w-[335px] !bg-white"
        :title="genButtonTitle"
        @click="loadMore"
      />
    </div>
  </div>
  <RModalConfirm
    v-model:visible="pageState.showModalConfirm"
    description="Do you want to delete all alarm history?"
    text-ok="Confirm"
    text-cancel="Cancel"
    :width="270"
    :mask-closable="false"
    @ok="doDeleteAllNotify"
    @cancel="pageState.showModalConfirm = false"
  />
</template>
<script setup>
import apiService from '@/http/api'
import { computed, onMounted, reactive } from 'vue'
import { useQuery, useMutation } from 'vue-query'
import { useGlobalLoadingStore } from '@/stores/modules/loading'

const loadingStore = useGlobalLoadingStore()
const { showGlobalLoading } = loadingStore

const pageState = reactive({
  showModalConfirm: false,
  results: [],
  pageNumber: 1,
  pageSize: 10,
  totalPageNumber: 0
})

const hasMore = computed(() => pageState.pageNumber < pageState.totalPageNumber)
const genButtonTitle = computed(
  () => `See More (${pageState.pageNumber}/${pageState.totalPageNumber})`
)

const { refetch: refetchListNotify } = useQuery(
  ['list-notifications', pageState.pageNumber],
  () =>
    apiService.conciergeService.listNotification({
      pageNumber: pageState.pageNumber,
      pageSize: pageState.pageSize
    }),
  {
    onSettled: (data, error) => {
      if (data?.success && data?.data?.list) {
        pageState.totalPageNumber = data.data.totalPageNumber
        const lists = data.data.list || []
        pageState.results = pageState.pageNumber === 1 ? lists : [...pageState.results, ...lists]
      } else {
        //
      }
      showGlobalLoading(false)
    },
    refetchOnWindowFocus: false
  }
)

const { mutate: deleteAllNotification } = useMutation(
  'delete-all-notify',
  () => apiService.conciergeService.deleteAllNotification(),
  {
    onSettled: (data, error) => {
      if (data?.success) {
        pageState.showModalConfirm = false
        resetData()
      }
    }
  }
)

const { mutate: deleteNotification } = useMutation(
  'delete-notify',
  (notifyId) => apiService.conciergeService.deleteNotification(notifyId),
  {
    onSettled: (data, error) => {
      if (data?.success) {
        resetData()
      }
    }
  }
)

const resetData = () => {
  pageState.pageNumber = 1
  refetchListNotify.value()
}

const onDeleteAll = () => {
  pageState.showModalConfirm = true
}

const doDeleteAllNotify = () => {
  showGlobalLoading(false)
  deleteAllNotification()
}

const loadMore = () => {
  showGlobalLoading(true)
  pageState.pageNumber += 1
  refetchListNotify.value()
}

onMounted(() => {
  showGlobalLoading(true)
})
</script>
<style lang="scss" scoped>
.notify-content {
  &:hover {
    .overlay-read {
      display: none;
    }
  }
}
.overlay-read {
  max-width: calc(100% - 45px);
  width: calc(100% - 70px);
  opacity: 0.5;
  background-color: #ededed;
  z-index: 1;
  &:hover {
    display: none;
  }
}
</style>
