<template>
  <div class="mt-12.5 mx-auto mb-10 max-w-[1240px] px-5">
    <h3 class="font-550 leading-base mb-10 text-center text-[28px]">Customer Service Center</h3>
    <p class="mb-12.5 mt-4 text-center text-base font-normal leading-[22px]">
      If you do not find the answer you are looking for, please use the
      <span class="font-625 cursor-pointer underline" @click="writeInquiry">
        Customer Support Ticket
      </span>
    </p>
    <div class="mx-auto max-w-[350px] pb-8">
      <RInput
        v-model:value="pageState.keyword"
        class="faq__searchInput"
        placeholder="How can I help you?"
        @change="onSearch()"
      >
        <template #suffix>
          <SearchIcon class="mb-1 cursor-pointer" @click="onSearch()" />
        </template>
      </RInput>
    </div>

    <div class="py-4">
      <span
        v-for="category in FAQ_OPTIONS"
        :key="category"
        class="border-1 border-gray-11 mb-1 ml-1 inline-block cursor-pointer rounded-full border-solid px-2 py-[2px] font-light text-gray-600"
        @click="gotoFaqByCategory(category.value)"
      >
        {{ category.label }}
      </span>
    </div>
    <div class="pb-4 text-[20px] font-medium">There are a lot of inquiries like this recently.</div>

    <a-collapse v-model:activeKey="pageState.activeKey" :bordered="false">
      <a-collapse-panel
        v-for="content in pageState.results"
        :key="content.id"
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
          <div class="flex flex-col gap-4">
            <p class="faq__category">{{ findLabelByCategory(content.faqType.code) }}</p>
            <p class="faq__description">{{ content.title }}</p>
          </div>
        </template>
        <div v-clean-html="content.contents" class="faq__description" />
      </a-collapse-panel>
    </a-collapse>

    <div>
      <div class="flex justify-center gap-[10px] px-0 pt-10 md:px-5">
        <RButton
          title="Phone Reservation"
          class="!bg-navy-6 w-1/2 !rounded-sm !border-none opacity-50 md:w-[335px]"
          class-title="text-white"
          @click="gotoPhoneInquiry"
        />
        <CheckLoginContent v-slot="loginSlot" @complete="checkComplete">
          <RButton
            title="Customer Support Ticket"
            class="!bg-navy-6 w-1/2 !rounded-sm !border-none md:w-[335px]"
            class-title="text-white"
            @click="loginSlot.checkLogin"
          />
        </CheckLoginContent>
      </div>
    </div>
  </div>
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
import { onBeforeMount, reactive } from 'vue'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import SearchIcon from '@/assets/svgs/icon-search.svg'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { useQuery } from 'vue-query'
import { FAQ_OPTIONS } from '@/helpers/constant'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useDebounceFn } from '@vueuse/core'
import { CONCIERGE_MESSAGE } from '@/helpers/validate-message'

const router = useRouter()
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
  results: [],
  isShowModal: false,
  descriptionModal: ''
})

const findLabelByCategory = (item) => FAQ_OPTIONS.find((el) => el.enum === item)?.label

useQuery(
  ['topten-faq'],
  async () => {
    return await apiService.conciergeService.topTenFaq()
  },
  {
    onSuccess: (data) => {
      if (data.success) {
        pageState.contents = data?.data
        pageState.results = data?.data
      } else {
        pageState.contents = []
        pageState.contents = []
      }
      showGlobalLoading(false)
    },
    onError: () => {
      showGlobalLoading(false)
    },
    refetchOnWindowFocus: false
  }
)

const hasActive = (key) => {
  return pageState.activeKey.includes(String(key))
}

const doSearch = useDebounceFn(() => {
  pageState.results = pageState.contents.filter((el) =>
    el.title?.toLowerCase()?.includes(pageState.keyword.toLowerCase())
  )
  showGlobalLoading(false)
}, 500)

const onSearch = () => {
  showGlobalLoading(true)
  doSearch()
}

const writeInquiry = () => {
  pageState.isShowModal = true
  pageState.descriptionModal = CONCIERGE_MESSAGE.notAllowCreateTicket
  return
}

const gotoFaqByCategory = (category) => {
  router.push({ name: AppRoutes.faq.name, query: { category } })
}

const gotoPhoneInquiry = () => {
  router.push(AppRoutes.phoneInquiry)
}

const checkComplete = (data) => {
  writeInquiry()
}

onBeforeMount(() => {
  showGlobalLoading(true)
})
</script>

<style lang="scss" scoped>
.faq {
  &__searchInput {
    border-color: #666666 !important;
    border-right: none !important;
    @apply rounded-0 border-b-1 border-text-gray-10 h-10 border-0 py-0 shadow-none;
    @apply md:h-12;

    :deep(input) {
      @apply leading-base text-base;
    }
  }

  &__category {
    @apply font-550 leading-base mb-0 text-sm -tracking-[0.28px];
  }

  &__description {
    @apply text-gray-10 mb-0 whitespace-pre-line break-words text-base font-normal leading-[22px];

    :deep(a) {
      @apply text-gray-10 font-550 underline;
    }
  }
}

.ant-collapse {
  @apply border-t-1 border-gray-10 border-t-solid rounded-0 bg-white;
}

:deep(.custom-select .ant-select-selector) {
  @apply border-gray-10;
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
