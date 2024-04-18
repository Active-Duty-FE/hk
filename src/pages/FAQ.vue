<template>
  <div class="my-12.5 max-w-1240px mx-auto px-5 md:my-20">
    <h3 class="font-550 leading-base md:mb-7.5 text-28px md:text-50px mb-10 text-center">FAQ</h3>

    <div class="mb-18.75 leading-22px hidden text-center text-base font-normal md:block">
      If you do not find the answer you are looking for, please use the

      <CheckLoginContent v-slot="loginSlot" @complete="checkComplete">
        <span class="font-625 cursor-pointer underline" @click="loginSlot.checkLogin">
          Customer Support Ticket
        </span>
      </CheckLoginContent>
    </div>

    <div class="md:mb-7.5 gap-25px flex flex-col justify-end md:flex-row">
      <RSelect
        v-model:value="pageState.categorySelected"
        placeholder="Country*"
        :options="CATEGORIES"
        class="md:max-w-55 w-full"
        @change="handleSearch"
      />

      <RInput v-model:value="pageState.keyword" class="faq__searchInput">
        <template #suffix>
          <SearchIcon class="mb-1 cursor-pointer" @click="handleSearch" />
        </template>
      </RInput>
    </div>

    <div class="mb-12.5 mt-4 text-base font-normal leading-[22px] md:hidden">
      If you do not find the answer you are looking for, please use the

      <CheckLoginContent v-slot="loginSlot" @complete="checkComplete">
        <span class="font-625 cursor-pointer underline" @click="loginSlot.checkLogin">
          Customer Support Ticket
        </span>
      </CheckLoginContent>
    </div>

    <a-collapse v-model:activeKey="pageState.activeKey" :bordered="false">
      <a-collapse-panel
        v-for="content in pageState.contents"
        :key="content.faqId"
        class="collapse-panel-custom"
        :show-arrow="false"
        :class="{ '!border-gray-10': hasActive(content.faqId) }"
      >
        <template #extra>
          <div class="mr-[8px]">
            <div class="bg-gray-10 absolute h-[15px] w-[1px] rotate-90" />
            <div
              class="bg-gray-10 h-[15px] w-[1px] duration-500"
              :class="{ 'rotate-90': hasActive(content.faqId) }"
            />
          </div>
        </template>
        <template #header>
          <div class="flex flex-col gap-4 md:flex-row">
            <p class="faq__category">{{ findLabelByEnum(content.faqType.code) }}</p>
            <p class="faq__description">{{ content.title }}</p>
          </div>
        </template>
        <div v-clean-html="content.contents" class="faq__description md:ml-69" />
      </a-collapse-panel>
    </a-collapse>

    <div v-if="isShowLoadMore" class="mt-10 flex justify-center">
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
  <RModalConfirm
    v-model:visible="pageState.showModalError"
    :description="AUTH_REQUIRED.notAuth"
    text-ok="Login"
    text-cancel="Later"
    :width="270"
    :mask-closable="false"
    @ok="handleConfirm"
    @cancel="pageState.showModalError = false"
  />
  <RModalAlert
    v-model:visible="pageState.isShowModal"
    title=""
    text-btn="Ok"
    :description="pageState.descriptionModal"
    :width="280"
    @confirm="pageState.isShowModal = false"
  />
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, watch } from 'vue'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { CATEGORIES } from '@/mocks/FAQ'
import SearchIcon from '@/assets/svgs/icon-search.svg'
import AddIcon from '@/assets/svgs/add.svg'
import { useRouter, useRoute } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { useQuery } from 'vue-query'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { AUTH_REQUIRED } from '@/helpers/validate-message'
import { CONCIERGE_MESSAGE } from '@/helpers/validate-message'

const router = useRouter()
const route = useRoute()
const vCleanHtml = buildVueDompurifyHTMLDirective({
  hooks: {
    uponSanitizeAttribute: (node) => {
      if ('target' in node) {
        node.setAttribute('target', '_blank')
        node.setAttribute('rel', 'noopener')
      }
    }
  }
})
const loadingStore = useGlobalLoadingStore()
const { showGlobalLoading } = loadingStore

const pageState = reactive({
  activeKey: [],
  contents: [],
  categorySelected: '',
  keyword: '',
  page: 1,
  limit: 10,
  totalPage: 0,
  showModalError: false,
  isShowModal: false,
  descriptionModal: ''
})

const filterState = reactive({
  faqType: null,
  searchKeyword: '',
  pageNumber: 1,
  pageSize: 10
})

useQuery(['list-faq', filterState], () => apiService.conciergeService.listFaq(filterState), {
  onSuccess: (data) => {
    if (data.success && data?.data) {
      setResults(data.data)
    }
    showGlobalLoading(false)
  },
  onError: () => {
    showGlobalLoading(false)
  },
  refetchOnWindowFocus: false
})

const setResults = (data) => {
  pageState.totalPage = data.totalPageNumber
  const lists = data?.list || []
  pageState.contents = filterState.pageNumber === 1 ? lists : [...pageState.contents, ...lists]
}

const findLabelByEnum = (item) => {
  return CATEGORIES.find((el) => el.enum === item)?.label
}

const isShowLoadMore = computed(() => filterState.pageNumber < pageState.totalPage)

const hasActive = (key) => {
  return pageState.activeKey.includes(String(key))
}

const loadMore = () => {
  showGlobalLoading(true)
  filterState.pageNumber++
}

const handleSearch = () => {
  pageState.keyword && showGlobalLoading(true)
  filterState.pageNumber = 1
  filterState.searchKeyword = pageState.keyword
  const value = CATEGORIES.find((el) => el.value === pageState.categorySelected)?.enum
  filterState.faqType = value || null
}

const gotoLogin = (redirect) =>
  redirect
    ? router.push({ name: AppRoutes.login.name, query: { redirect } })
    : router.push(AppRoutes.login)

const checkComplete = (data) => {
  pageState.isShowModal = true
  pageState.descriptionModal = CONCIERGE_MESSAGE.notAllowCreateTicket
  return
}

const initSearchValue = () => {
  pageState.keyword = route.query?.keySearch || ''
  pageState.categorySelected = route.query?.category || ''
  handleSearch()
}

watch(
  () => [route.query],
  () => {
    initSearchValue()
  },
  {
    immediate: true
  }
)

onBeforeUnmount(() => {
  showGlobalLoading(false)
})
</script>

<style lang="scss" scoped>
.faq {
  &__searchInput {
    border-right: none !important;
    @apply rounded-0 border-b-1 border-gray-10 md:border-gray-11 md:max-w-83.75 h-10 border-0 py-0 shadow-none;
    @apply md:h-12;

    :deep(input) {
      @apply leading-base text-base;
    }
  }

  &__category {
    @apply font-550 leading-base md:w-70 mb-0 break-words text-sm -tracking-[0.28px];
  }

  &__description {
    @apply text-gray-10 mb-0 whitespace-pre-line break-words break-words text-base font-normal leading-[22px];

    :deep(a) {
      @apply text-gray-10 font-550 underline;
    }
  }
}

.ant-collapse {
  @apply border-t-1 border-gray-10 border-t-solid rounded-0 bg-white;
}

:deep(.custom-select .ant-select-selector) {
  @apply border-gray-10 md:border-gray-11;
}

:deep(.ant-collapse-item) {
  @apply border-gray-10 py-8.75;
}

:deep(.ant-collapse-header) {
  padding: 0 !important;
}

:deep(.ant-collapse-content) {
  @apply mt-4;
}

:deep(.ant-collapse-content-box) {
  padding: 20px !important;
  @apply bg-gray-11 bg-opacity-20;
}
</style>
