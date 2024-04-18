<template>
  <div class="result-page container mx-auto max-w-[1200px]">
    <div class="px-5 md:px-0">
      <div
        class="text-gray-10 font-550 style-normal leading-base pb-10 pt-[50px] text-center text-[28px]"
      >
        Search Results <span v-if="pageState.totalSize">({{ pageState.totalSize }})</span>
        <div>
          <span
            v-if="pageState.keySearch"
            class="bg-navy-deep rounded-full px-3 py-2 text-[16px] text-white"
          >{{ pageState.keySearch }}</span
          >
          <template v-if="!currentTab">
            <span
              v-for="item in pageState.categoryData"
              :key="item.categoryId"
              class="bg-navy-deep m-2 inline-block rounded-full px-3 py-2 text-[16px] text-white"
            >
              {{ item.categoryName }}
            </span>
          </template>
        </div>
      </div>
    </div>
    <RTabCustom :tabs="tabs" :model-value="currentTab" @update:model-value="onUpdate" />
    <ProductSearchResult
      v-if="!currentTab && pageState.results.length"
      :products="pageState.results"
    />
    <BlogSearchResult v-if="currentTab && pageState.results.length" :blogs="pageState.results" />
    <NoResult v-if="!pageState.results.length" class="!pb-[100px] !pt-[130px]" />
    <div v-if="hasMore" class="pb-[30px] pt-[40px]">
      <r-button
        class="!rounded-0 !border-color-black-50 btn-more hover:(!bg-navy-6 !text-white) mx-auto w-full max-w-[335px] cursor-pointer"
        class-title="text-lg"
        @click="loadMore"
      >
        <template #content>
          <div class="flex items-center justify-center">
            <AddIcon /> <span class="font-550 leading-base pl-[5px] pt-1 text-[16px]">MORE</span>
          </div>
        </template>
      </r-button>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import AddIcon from '@/assets/svgs/add.svg'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { SEARCH_PRODUCT_SIZE, STORAGE_MENUS_FLAT, STORAGE_IP_ADDRESS } from '@/helpers/constant'
import apiService from '@/http/api'
import storage from '@/utils/storage'
import { CountryEnum } from '@/helpers/enum'
import { addPrefixForImage } from '@/utils/common'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 992)
const loadingStore = useGlobalLoadingStore()
const { showGlobalLoading } = loadingStore

const route = useRoute()

const pageState = reactive({
  currentPage: 1,
  totalPage: 0,
  results: [],
  keySearch: '',
  totalSize: 0,
  categoryIds: [],
  categoryData: []
})

const hasMore = computed(() => pageState.currentPage < pageState.totalPage)

const tabs = [
  { value: 0, label: 'Product' },
  { value: 1, label: 'Blog' }
]
const currentTab = ref(0)

const getSearchResult = async (tab) => {
  showGlobalLoading(true)
  if (!tab) {
    getProductResult()
  } else {
    getBlogResult()
  }
  setTimeout(() => {
    showGlobalLoading(false)
  }, 1000)
}

const getBlogResult = async () => {
  const response = await apiService.exploreService.getContentEC(
    {
      type: 'BLOG',
      displayType: 'CONTENT',
      displayTitle: pageState.keySearch || undefined,
      listCategoryId: undefined
    },
    {
      currentPage: pageState.currentPage,
      pageSize: 10
    }
  )
  if (response?.success && response?.data) {
    pageState.totalPage = response.data?.totalPageNumber
    pageState.totalSize = response.data?.totalElements
    const results = response.data?.content || []
    const mappingData = results.map((item) => ({
      id: item?.id,
      title: item?.displayTitle,
      description: item?.description,
      image: addPrefixForImage(isMobile.value ? item?.imageUrlMobile : item?.imageUrl),
      order: ~~item?.displayOrder
    }))
    pageState.results = [...pageState.results, ...mappingData]
  }
  showGlobalLoading(false)
}

const getProductResult = async () => {
  const params = {
    pageNumber: pageState.currentPage,
    pageSize: SEARCH_PRODUCT_SIZE,
    keyword: pageState.keySearch || null,
    categoryIds: pageState?.categoryIds?.length ? pageState?.categoryIds?.join() : null,
    country: storage.get(STORAGE_IP_ADDRESS, 'localStorage') ?? CountryEnum.US.value
  }
  const response = await apiService.productService.searchListProducts(params)
  if (response?.success && response?.data) {
    pageState.totalPage = response.data?.totalPageNumber
    pageState.totalSize = response.data?.totalSize
    const results = response.data?.list || []
    pageState.results = [...pageState.results, ...results]
  }
  showGlobalLoading(false)
}

const resetPageState = () =>
  Object.assign(pageState, { totalPage: 0, results: [], currentPage: 1, totalSize: 0 })

const onUpdate = (data) => {
  currentTab.value = data
  resetPageState()
  getSearchResult(data)
}

const loadMore = () => {
  pageState.currentPage += 1
  getSearchResult(currentTab.value)
}

const getMenuData = (valueCate) => {
  const flatMenus = storage.get(STORAGE_MENUS_FLAT, 'localStorage')
  const matchItem = []
  valueCate?.forEach((element) => {
    const item = flatMenus.find((el) => el.categoryId === Number(element))
    if (item) matchItem.push(item)
  })
  pageState.categoryData = matchItem
  pageState.categoryIds = matchItem.map((el) => el.categoryId)
}

watch(
  () => [route.query?.keySearch, route.query?.categoryIds],
  ([valueSearch, valueCate]) => {
    pageState.keySearch = valueSearch || ''
    resetPageState()
    if (valueCate?.length) {
      getMenuData(valueCate)
    }
    getSearchResult(currentTab.value)
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped>
@screen lg {
  .result-page {
    .tabs {
      justify-content: flex-start;
      :deep(.tab__item) {
        width: 150px;
      }
    }
  }
}

.btn-more {
  svg {
    opacity: 0;
    transform: translateX(-5px);
    transition: all 0.3s ease;
    :deep(g) {
      fill: #123250 !important;
    }
  }
  &:hover {
    color: #123450;
    svg {
      opacity: 1;
      transform: translateX(0);
      :deep(g) {
        fill: #ffffff !important;
      }
    }
  }
}
</style>
