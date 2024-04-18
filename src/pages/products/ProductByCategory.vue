<template>
  <div class="flex flex-col items-center justify-center">
    <div class="parent-page relative w-full xl:max-w-[1200px]">
      <div
        v-if="pageState.currentCategory?.categoryTitle"
        class="mb-0"
        :class="getClassByCategoryLevel"
      >
        <IntroduceProduct
          :has-children="pageState.hasChildren"
          :category-info="pageState.currentCategory"
        />
      </div>
      <div class="p-5 xl:p-0">
        <div v-if="showBreadCrumb()" class="block pb-3 text-center md:hidden">
          <a-breadcrumb separator=">">
            <a-breadcrumb-item
              v-for="item in pageState.breadCrumbs"
              :key="item.categoryId"
              class="hover:text-navy-deep cursor-pointer"
              @click="gotoProductList(item)"
            >
              {{ item.categoryName }}
            </a-breadcrumb-item>
          </a-breadcrumb>
        </div>
        <div class="mb-[15px] sm:mb-[50px]">
          <p
            class="font-550 lg:(text-[40px] leading-[55px]) text-center text-[32px] leading-9 md:text-left"
            :class="getClassByCategory"
          >
            {{ showTitleCategory }}
          </p>
          <DrawerFilter
            class="filter-div"
            :show-filter="pageState.showFilter"
            :current-sort="pageState.searchOrderType"
            @apply-filter="onApplySort"
            @open="onOpenFilterZone"
          />
        </div>
        <div class="filter-div-two"></div>
        <ListProducts
          :data-products="pageState.results"
          :can-load-more="hasMore"
          @load-more="loadMore()"
        />
      </div>
    </div>
  </div>
  <div class="py-[100px]">
    <QuizItem />
  </div>
  <div class="flex flex-col items-center justify-center">
    <div class="parent-page relative w-full xl:max-w-[1200px]">
      <div v-if="pageState?.currentCategory?.blogs?.length">
        <div class="sm:mb-50 mb-[70px] hidden md:block">
          <BlogProductList :blogs="pageState?.currentCategory?.blogs" />
        </div>
        <div class="mb-[70px] md:hidden">
          <BlogMobileProduct :blogs="pageState?.currentCategory?.blogs" />
        </div>
      </div>
    </div>
  </div>
  <div v-if="isShowFilterModal" class="parent-filter">
    <div class="overlay-filter" @click="onCloseFilterModal"></div>
    <div class="custom-filter pointer-events-auto" :style="distanceStyleLeft">
      <div class="content-filter bg-white p-3 lg:w-[320px]" :style="distanceStyle">
        <div class="relative my-4 text-center">
          <span class="font-550 mt-2 text-2xl sm:text-[30px]">Filter</span>
          <div class="absolute right-0 top-0 cursor-pointer" @click="onCloseFilterModal">
            <CloseOutlined />
          </div>
        </div>
        <a-collapse v-model:activeKey="activeKey" :bordered="false">
          <a-collapse-panel
            v-for="(item, index) in filterMenus"
            :key="index"
            :header="item.categoryName"
            class="collapse-panel-custom"
            :show-arrow="false"
            :class="[activeKey.includes(String(index)) ? '!border-black-50' : '']"
          >
            <template #extra>
              <div class="mr-[8px]">
                <div class="icon absolute h-[15px] w-[1px] rotate-90"></div>
                <div
                  :class="[
                    { open: activeKey.includes(String(index)) },
                    'icon h-[15px] w-[1px]  duration-500'
                  ]"
                ></div>
              </div>
            </template>
            <div class="mt-[25px] flex flex-col gap-5">
              <r-checkbox
                v-for="child in item.children"
                :key="child.categoryId"
                v-model:checked="child.checked"
                class="!ml-0 !text-base sm:!text-lg"
              >
                {{ child.categoryName }}
              </r-checkbox>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
      <div class="bottom-filter px-3 py-5">
        <div class="text-black-50 font-550 flex justify-between text-sm sm:text-base">
          <span class="cursor-pointer" @click="onClearAll()">Clear all</span>
          <span class="cursor-pointer underline" @click="onApplyFilter">Show Results</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { reactive, watch, computed, ref, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { LIST_PRODUCT_SIZE, STORAGE_IP_ADDRESS } from '@/helpers/constant'
import { AppRoutes } from '@/router/path'
import apiService from '@/http/api'
import {
  getListMenus,
  getProductLists,
  textToSlug,
  transformNestedMenu,
  getParentCategoryByChild,
  addPrefixForImage,
  randomNumber
} from '@/utils/common'
import { useMenuStore } from '@/stores/modules/menu'
import { storeToRefs } from 'pinia'
import { MenuLevel, MenuType, CountryEnum } from '@/helpers/enum'
import { CloseOutlined } from '@ant-design/icons-vue'
import { useWindowSize } from '@vueuse/core'
import storage from '@/utils/storage'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 992)

const route = useRoute()
const router = useRouter()
const storeLoading = useGlobalLoadingStore()
const menuStore = useMenuStore()
const { showGlobalLoading } = storeLoading
const { flatMenus, currentMenus } = storeToRefs(menuStore)
const { setCurrentFlatMenus } = menuStore
const activeKey = ref([])
const filterMenus = ref([])

const pageState = reactive({
  showFilter: true,
  currentCategory: undefined,
  currentPage: 1,
  pageSize: LIST_PRODUCT_SIZE,
  totalPage: 0,
  results: [],
  searchOrderType: null,
  hasChildren: false,
  breadCrumbs: [],
  categoryContents: [],
  categoryIds: []
})

const missingProducts = ref([])

const isShowFilterModal = ref(false)
const distanceStyle = ref()
const distanceStyleLeft = ref()

const hasMore = computed(() => pageState.currentPage < pageState.totalPage)

const resetPageState = () =>
  Object.assign(pageState, {
    ...pageState,
    totalPage: 0,
    results: [],
    currentPage: 1,
    pageSize: LIST_PRODUCT_SIZE,
    breadCrumbs: [],
    searchOrderType: null,
    hasChildren: false,
    categoryContents: pageState.categoryContents,
    categoryIds: pageState.categoryIds || []
  })

const getMissingProduct = async (page, productItems) => {
  const response = await getProductLists({
    pageNumber: page,
    pageSize: 6,
    categoryId: pageState.currentCategory.categoryId,
    searchOrderType: pageState.searchOrderType,
    country: storage.get(STORAGE_IP_ADDRESS, 'localStorage') ?? CountryEnum.US.value,
    categoryIds: pageState?.categoryIds?.length ? pageState?.categoryIds?.join() : null
  })

  const products = response?.data?.list || []
  if (products.length) {
    const diffProducts =
      products.filter(
        (item) => productItems.findIndex((el) => el.productId === item.productId) === -1
      ) || []
    if (diffProducts.length) {
      missingProducts.value.push({
        page,
        products: diffProducts
      })
    }
  }
}

const loadDataProduct = async () => {
  showGlobalLoading(true)
  const response = await getProductLists({
    pageNumber: pageState.currentPage,
    pageSize: getPageSizeForApi(),
    categoryId: pageState.currentCategory.categoryId,
    searchOrderType: pageState.searchOrderType,
    country: storage.get(STORAGE_IP_ADDRESS, 'localStorage') ?? CountryEnum.US.value,
    categoryIds: pageState?.categoryIds?.length ? pageState?.categoryIds?.join() : null
  })

  if (response?.success && response?.data) {
    let results = response.data?.list || []
    results = addBannerForProductList(results)

    pageState.results = [...pageState.results, ...results]
    pageState.totalPage = response.data?.totalPageNumber
  }
  showGlobalLoading(false)
  if (6 - getPageSizeForApi() > 0) getMissingProduct(pageState.currentPage, response.data?.list)
  if (pageState.currentPage === pageState.totalPage && missingProducts.value.length) {
    addMissingProduct()
  }
}

const addMissingProduct = async () => {
  missingProducts.value.forEach((el) => {
    pageState.results.splice(el.page * 6, 0, ...el.products)
  })
}

const addBannerForProductList = (results) => {
  if (!results.length) return []
  const firstBanner = pageState.categoryContents[pageState.currentPage * 2 - 2]
  const secondBanner = pageState.categoryContents[pageState.currentPage * 2 - 1]
  if ((!firstBanner && !secondBanner) || results.length === 6) return results
  if (results.length === 4) {
    if (firstBanner) {
      results = [
        {
          ...firstBanner,
          isThumbnail: true,
          productId: randomNumber()
        },
        ...results
      ]
    }
    if (secondBanner) {
      results = [
        ...results,
        {
          ...secondBanner,
          isThumbnail: true,
          productId: randomNumber()
        }
      ]
    }
  } else if (results.length === 5) {
    results = [
      {
        ...firstBanner,
        isThumbnail: true,
        productId: randomNumber()
      },
      ...results
    ]
  }
  return results
}

const loadMore = () => {
  pageState.currentPage += 1
  loadDataProduct()
}

const getCurrentCategoryInfo = (val) => {
  const childData = transformNestedMenu(flatMenus.value, pageState.currentCategory.categoryId)
  pageState.hasChildren = !!childData.length
  if (
    (pageState.currentCategory?.categoryLevel === MenuLevel.ONE && checkCateGoryHasChild()) ||
    (pageState.currentCategory.categoryType === MenuType.PAGE && childData.length)
  ) {
    pageState.showFilter = true
  } else {
    pageState.showFilter = false
  }
}

const checkCateGoryHasChild = () =>
  typeof pageState.currentCategory?.hasChildren === 'boolean'
    ? pageState.currentCategory?.hasChildren
    : false

const showTitleCategory = computed(() => {
  if (pageState.showFilter) return 'Shop All'
  return showBreadCrumb() ? pageState.currentCategory?.categoryName : ''
})

const getClassByCategory = computed(() => {
  if (!pageState.showFilter) return 'text-center md:hidden block'
  if (pageState.currentCategory?.categoryLevel === MenuLevel.ONE) return 'block text-left'
  if (pageState.currentCategory?.categoryLevel === MenuLevel.THREE) {
    return 'hidden'
  }
  return 'text-left'
})

const getClassByCategoryLevel = computed(() => {
  if (pageState.currentCategory?.categoryLevel === MenuLevel.THREE) {
    return 'mt-[10px] md:mt-[40px] !mb-0'
  } else {
    return 'mb-[70px] !md:unset'
  }
})

const reFetchMenus = async () => {
  const response = await getListMenus()
  return response.data?.map((el) => ({ ...el, path: textToSlug(el.categoryName) }))
}

const getBreadCrumb = (category) => {
  pageState.breadCrumbs = getParentCategoryByChild(category, flatMenus.value)
}

const showBreadCrumb = () =>
  pageState.currentCategory?.categoryLevel === MenuLevel.THREE &&
  !pageState.currentCategory?.categoryTitle

const getListProducts = async () => {
  try {
    let currentCategory = {}
    showGlobalLoading(true)
    if (!flatMenus.value.length) {
      const menus = await reFetchMenus()
      setCurrentFlatMenus(menus)
      currentCategory = menus.find((el) => el.path === route.params.category)
    } else {
      currentCategory = flatMenus.value.find((el) => el.path === route.params.category)
    }
    getBreadCrumb(currentCategory)
    if (currentCategory?.categoryId) {
      const response = await apiService.menuService.viewMenuDetail(currentCategory?.categoryId)
      if (response?.success && response.data) {
        pageState.currentCategory = response.data
        pageState.categoryContents = mapCategoryContent(response.data)
        getCurrentCategoryInfo()
        loadDataProduct()
      } else {
        showGlobalLoading(false)
        router.push('/')
      }
      const listChildMenu = currentMenus.value?.find(
        (el) => el.categoryId === currentCategory.categoryId
      )
      if (listChildMenu?.children) {
        const itemHasChild = listChildMenu.children?.filter(
          (el) => el?.children && el.children.length
        )
        const finalList = itemHasChild.map((element) => {
          const items = element.children.map((el) => ({ ...el, checked: false }))
          return { ...element, children: items }
        })
        filterMenus.value = finalList
        activeKey.value = Object.keys(filterMenus.value)
      }
    }
  } catch (error) {
    showGlobalLoading(false)
  }
}

const getTopTargetForFilter = () => {
  const el = document.querySelector('.filter-div')
  return window.scrollY + el.getBoundingClientRect().top + 10
}

const getTopTargetForLeft = () => {
  const el = document.querySelector('.parent-page')
  return el.getBoundingClientRect().left
}

const getHeightForFilterContent = () => {
  try {
    const el = document.querySelector('.custom-filter')
    return el.getBoundingClientRect().height
  } catch (error) {
    return 600
  }
}

const onOpenFilterZone = (isOpen) => {
  if (isOpen && !isMobile.value) {
    window.scrollTo({
      top: getTopTargetForFilter() - 200,
      behavior: 'smooth'
    })
    distanceStyle.value = `margin-top: 260px;`
    distanceStyleLeft.value = `margin-left: ${getTopTargetForLeft()}px`
    document.body.classList.add('overflow-hidden')
  }
  isShowFilterModal.value = isOpen
  if (isOpen && !isMobile.value) {
    setTimeout(() => {
      distanceStyle.value = `margin-top: 260px;height: ${getHeightForFilterContent()}px`
    }, 1500)
  }
}

const onCloseFilterModal = () => {
  isShowFilterModal.value = false
  document.body.classList.remove('overflow-hidden')
}

const mapCategoryContent = (category) => {
  if (!category?.categoryContents) return []
  return category.categoryContents
    .filter((el) => el.type === 'CONTENT')
    .map((el) => ({
      ...el,
      pcImageUrl: addPrefixForImage(el.pcImageUrl),
      mobileImageUrl: addPrefixForImage(el.mobileImageUrl)
    }))
}

const gotoProductList = (item) => {
  if (item.categoryLevel === MenuLevel.ONE || item.level === MenuLevel.ONE) {
    return router.push({
      name: AppRoutes.product.productCategory.name,
      params: { category: item.path }
    })
  }
}

const onApplySort = (data) => {
  resetPageState()
  pageState.searchOrderType = data.sort
  loadDataProduct()
}

const onApplyFilter = () => {
  if (isMobile.value) isShowFilterModal.value = false
  let checkedItem = []
  filterMenus.value?.forEach((element) => {
    const categoryIds = element.children?.filter((el) => el.checked)?.map((el) => el.categoryId)
    checkedItem = [...checkedItem, ...categoryIds]
  })
  pageState.categoryIds = checkedItem
  document.body.classList.remove('overflow-hidden')
  resetPageState()
  loadDataProduct()
  isShowFilterModal.value = false
}

const getPageSizeForApi = () => {
  const bannerNums = pageState.categoryContents.length
  if (!bannerNums) return 6
  const resumeBanner = bannerNums - (pageState.currentPage * 2 - 2)
  if (resumeBanner <= 0) return 6
  if (resumeBanner > 1) return 4
  return 5
}

const resetFilter = () => {
  const items = filterMenus.value.map((el) => {
    const itemChild = el.children.map((item) => ({ ...item, checked: false }))
    return {
      ...el,
      children: itemChild
    }
  })

  filterMenus.value = items
}

const onClearAll = () => {
  resetFilter()
  onApplyFilter()
}

onBeforeUnmount(() => document.body.classList.remove('overflow-hidden'))

watch(
  () => route.params.category,
  (val) => {
    if (val) {
      isShowFilterModal.value = false
      resetFilter()
      resetPageState()
      getListProducts()
    }
  },
  {
    immediate: true
  }
)
</script>
<style scoped lang="scss">
.collapse-panel-custom {
  @apply bg-white;

  :deep(.ant-collapse-header) {
    @apply border-b-solid border-1 border-color-black-50 flex items-center py-5 pr-0 text-base sm:text-lg;
    padding-left: 20px !important;
  }
}

.icon {
  background: black;
}

.open {
  transform: rotate(90deg) !important;
}

.parent-filter {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  z-index: 99999999;
  .overlay-filter {
    background: black;
    opacity: 0.2;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .custom-filter {
    @media (max-width: 992px) {
      height: 100%;
      width: 100%;
      .content-filter {
        height: 100%;
      }
    }
    width: 320px;
    background-color: white;
    height: calc(100% - 260px);
    position: relative;
  }

  .bottom-filter {
    position: absolute;
    bottom: 0;
    width: 100%;
    background: white;
  }

  .content-filter {
    overflow-y: scroll;
    padding-bottom: 100px;
  }
}
</style>
