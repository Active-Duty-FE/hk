<template>
  <div>
    <TheBanner
      class="banner-section"
      :image="addPrefixForImage(dataBanner?.background)"
      :content="dataBanner"
      :is-white="dataBanner?.fontColor"
      is-blog
    />
    <div class="second-section mx-auto max-w-[1240px] px-5">
      <div class="filter">
        <div class="filter__tab !md:w-fit" @click="pageState.isShowFilter = true">
          Filter
          <FiltersIcon class="mb-1" />
        </div>

        <a-divider type="vertical" class="!bg-gray-10 !md:hidden !top-0 !h-full" />

        <div class="filter__tab">
          <div v-if="!pageState.isShowInputSearch" class="filter__tab" @click="onShowInputSearch">
            Search
            <SearchIcon class="mb-1" />
          </div>
          <RInput
            v-else
            ref="inputSearchRef"
            v-model:value="pageState.keyword"
            class="filter__searchInput"
            @keydown.enter="getData"
          >
            <template #suffix>
              <SearchIcon class="mb-1 cursor-pointer" @click="getData" />
            </template>
          </RInput>
        </div>
      </div>
      <div v-if="dataBlogList?.length" class="flex flex-col gap-5 md:gap-40">
        <BlogListPost
          v-for="(blog, index) in dataBlogList"
          :key="blog.id"
          :blog="blog"
          :is-reverse="!!(index % 2)"
        />
      </div>

      <NoResult v-else />
    </div>

    <div class="md:mt-25 md:mb-45 mx-5 mt-10 flex justify-center">
      <RButton
        v-if="isShowLoadMore"
        title="MORE"
        class="md:!h-15 w-full max-w-[390px]"
        class-title="text-base font-550 text-gray-10"
        @click="loadMore"
      >
        <template #image>
          <AddIcon class="mb-1" />
        </template>
      </RButton>
    </div>

    <BlogListFilter v-model="pageState.isShowFilter" @show-result="showResult" />

    <QuizItem class="quiz-custom" />

    <DiveIn />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeMount, onMounted, reactive, ref, watch } from 'vue'
import { useBreakpoints, useWindowSize } from '@vueuse/core'
import AddIcon from '@/assets/svgs/add.svg'
import FiltersIcon from '@/assets/svgs/filters.svg'
import SearchIcon from '@/assets/svgs/icon-search.svg'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useQuery } from 'vue-query'
import apiService from '@/http/api'
import { addPrefixForImage } from '@/utils/common'
import { useCmsStore } from '@/stores/modules/cms'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 992)

const storeLoading = useGlobalLoadingStore()
const { showGlobalLoading } = storeLoading
const { getSnsList } = useCmsStore()

const inputSearchRef = ref()

const pageState = reactive({
  keyword: '',
  page: 1,
  limit: 10,
  blogsFilter: [],
  isShowInputSearch: false,
  isShowFilter: false
})

const payload = reactive({
  type: 'BLOG',
  displayType: 'CONTENT',
  displayTitle: undefined,
  listCategoryId: undefined
})

const params = reactive({
  currentPage: pageState.page,
  pageSize: pageState.limit
})

const device = useBreakpoints({
  tablet: 992
})

const { data: contentTitle, isFetching } = useQuery({
  queryKey: [
    'get-content-ec-title',
    {
      type: 'BLOG',
      displayType: 'TITLE'
    },
    {
      currentPage: 1,
      pageSize: 1
    }
  ],
  queryFn: () =>
    apiService.exploreService.getContentEC(
      {
        type: 'BLOG',
        displayType: 'TITLE'
      },
      {
        currentPage: 1,
        pageSize: 1
      }
    )
})

const { isFetching: contentFetching, data: contentDisplay } = useQuery({
  queryKey: ['get-content-ec-content', payload, params],
  queryFn: () => apiService.exploreService.getContentEC(payload, params),
  onSuccess: (response) => {
    const dataMap = response?.data?.content?.map((item) => ({
      id: item?.id,
      title: item?.displayTitle,
      description: item?.description,
      image: addPrefixForImage(isMobile.value ? item?.imageUrlMobile : item?.imageUrl),
      order: ~~item?.displayOrder
    }))
    pageState.blogsFilter = [...pageState.blogsFilter, ...dataMap].sort((a, b) => a.order - b.order)
  },
  refetchOnWindowFocus: false
})

const dataBanner = computed(() => {
  const data = contentTitle?.value?.data?.content.at(0)
  return {
    background: addPrefixForImage(isMobile.value ? data?.imageUrlMobile : data?.imageUrl),
    title: isMobile.value ? data?.titleMobile : data?.titlePc,
    subtitle: isMobile.value ? data?.subTitleMobile : data?.subTitlePc,
    description: data?.description,
    fontColor: data?.fontColor
  }
})

const dataBlogList = computed(() => {
  const data = contentDisplay?.value?.data?.content
  return data
    ?.map((item) => ({
      id: item?.id,
      title: item?.displayTitle,
      description: item?.description,
      image: addPrefixForImage(isMobile.value ? item?.imageUrlMobile : item?.imageUrl),
      order: ~~item?.displayOrder
    }))
    .sort((a, b) => a.order - b.order)
})

const isTablet = device.greater('tablet')

onBeforeMount(() => {
  if (isTablet.value) pageState.isShowInputSearch = true
})

const isShowLoadMore = computed(
  () => params.currentPage * params.pageSize < contentDisplay?.value?.data?.totalElements
)

const loadMore = () => {
  params.currentPage = params.currentPage + 1
}

const onShowInputSearch = () => {
  pageState.isShowInputSearch = true
  nextTick(() => {
    inputSearchRef.value.focus()
  })
}

const getData = () => {
  payload.displayTitle = pageState.keyword
  pageState.blogsFilter = []
}

const showResult = (data) => {
  payload.listCategoryId = data
  pageState.blogsFilter = []
}

watch(
  () => [isFetching.value, contentFetching.value],
  (value) => {
    const isLoading = value.some((item) => item)
    showGlobalLoading(isLoading)
  }
)

onMounted(() => {
  getSnsList()
})
</script>

<style lang="scss" scoped>
.quiz-custom {
  @apply md:my-50 my-22.5;

  :deep(.container) {
    @apply my-0;
  }
}

:deep(.diveIn) {
  @apply md:my-50 my-22.5;
  & > div {
    @media (min-width: 1200px) {
      align-items: center !important;
    }
  }
}

.filter {
  @apply border-1 border-gray-10 h-[38px] border-l-0 border-r-0 border-solid;
  @apply mb-7.5 mt-22.5 flex items-center justify-evenly;
  @apply md:mt-25 md:mb-10 md:justify-between md:border-none;

  &__tab {
    @apply font-550 leading-base flex h-full w-1/2 cursor-pointer items-center justify-center gap-2 text-base;
    @apply md:justify-start;
  }

  &__searchInput {
    border-color: #666666 !important;
    border-right: none !important;
    @apply rounded-0 h-full border-0 border-solid shadow-none;
    @apply md:border-b-1 md:py-0 md:pr-0;

    :deep(input) {
      @apply font-550 leading-base text-base;
    }
  }
}
</style>
