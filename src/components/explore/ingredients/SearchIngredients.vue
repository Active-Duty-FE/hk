<template>
  <div class="!mx-5 md:!mx-0">
    <div class="!mb-[50px]">
      <r-heading-slide
        text-normal="SEARCH"
        text-bold="INGREDIENTS"
        class-normal="text-2xl md:text-[40px] leading-normal"
        class-bold="text-2xl md:text-[40px] ml-2 leading-normal"
        parent-class="md:(!items-start !ml-0)  "
      />
    </div>
    <div v-if="!data.length" class="hidden md:block">
      <img alt="image" src="@/assets/images/explores/INGREDIENTSimg.png" />
    </div>

    <div v-else class="hidden md:block">
      <div>
        <div v-for="list in roundMap" :key="list" class="custom-image mb-5">
          <div
            v-for="(item, index) in data.slice(
              list === IngredientsEnum.LEFT_FIRST
                ? IngredientsEnum.TOP
                : IngredientsEnum.TOTAL_A_BLOCK,
              list === IngredientsEnum.LEFT_FIRST ? IngredientsEnum.TOTAL_A_BLOCK : data.length
            )"
            :key="item.id"
            :class="[
              { header: index === IngredientsEnum.TOP },
              { main: index === IngredientsEnum.LEFT_FIRST },
              { foot: index === IngredientsEnum.LEFT_SECOND },
              { nav: index === IngredientsEnum.RIGHT }
            ]"
          >
            <img
              :src="addPrefixForImage(item.imageUrl)"
              alt="img-ingredients"
              class="object-cover"
              :class="[
                { 'h-50 w-150': index === IngredientsEnum.TOP },
                { 'main h-50 w-[290px]': index === IngredientsEnum.LEFT_FIRST },
                { 'foot h-50 w-[290px]': index === IngredientsEnum.LEFT_SECOND },
                { 'nav h-105 w-[290px]': index === IngredientsEnum.RIGHT }
              ]"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="text-black-50 relative w-screen md:max-w-[520px]">
    <div class="z-10 w-full" :class="{ 'px-5 md:px-0': !showDropDownSelect }">
      <div class="bg-white !p-2">
        <a-input v-model:value="inputValue" class="w-full">
          <template #suffix>
            <LnbSearch class="cursor-pointer" @click="handleSearch" />
          </template>
        </a-input>
      </div>
    </div>
    <div class="mt-[42px] flex pl-5 md:pl-0">
      <PerfectScrollbar
        ref="alphabet"
        class="no-scrollbar flex overflow-x-auto"
        :class="isShowAll ? 'flex-wrap' : 'flex-1'"
      >
        <div
          v-for="item in getAlphabets()"
          :key="item"
          class="item-alphabets flex h-[45px] min-w-[45px] items-center justify-center px-4 text-sm"
          :class="chooseAlphabets === item ? '!bg-navy-6 font-bold text-white' : 'font-normal'"
          @click="searchAlphabets(item)"
        >
          {{ item }}
        </div>
      </PerfectScrollbar>
    </div>
    <a-button type="text" class="my-2 !hidden !p-0 md:block" @click="isShowAll = !isShowAll">
      SHOW ALL
    </a-button>
    <div class="mt-[60px] px-5 md:px-0">
      <div v-for="item in data" :key="item.id" @click="handleOpenModalDetail(item)">
        <template v-if="item?.displayTitle">
          <img
            :src="addPrefixForImage(item?.imageUrl)"
            alt="img-ingredients"
            class="mb-4 object-cover md:hidden"
          />
          <div class="relative cursor-pointer">
            <p class="font-475 mb-[15px] text-lg">{{ item.displayTitle }}</p>
            <p class="mb-0 text-sm">{{ item?.subCopy }}</p>
            <a-divider class="bg-black-50 my-[25px] md:!my-[30px]" />
            <ArrowRight class="absolute right-0 top-0" />
          </div>
        </template>
      </div>
      <div v-if="!data.length" class="text-center text-base">
        Sorry, no ingredients found.<br />
        Please try again.
      </div>
    </div>
  </div>
  <ModalDetailSearchIngredient
    v-model:visible="dataModal.visibleDetail"
    :data-detail="dataModal.currentDataDetail"
  />
</template>
<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import LnbSearch from '@/assets/svgs/lnb_search.svg'
import { getAlphabets, addPrefixForImage, countryLocalStorage } from '@/utils/common'
import ArrowRight from '@/assets/svgs/arrow-right.svg'
import MiniArrowRight from '@/assets/svgs/arrow-right-mini.svg'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { CmsTypeEnum, CmsDisplayTypeEnum, IngredientsEnum, CountryEnum } from '@/helpers/enum'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['get-content-ingredients'])

const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading
const inputValue = ref('')
const alphabet = ref()
const isShowAll = ref(false)
const showDropDownSelect = ref(false)
const chooseAlphabets = ref(getAlphabets()[0])
const dataModal = reactive({
  currentDataDetail: {},
  visibleDetail: false
})

const handleSearch = () => {
  searchIngredients(inputValue.value)
}

const searchAlphabets = (key) => {
  searchIngredients(key)
  chooseAlphabets.value = key
}

const getDetailContent = async (id) => {
  showGlobalLoading(true)
  const country =
    countryLocalStorage === CountryEnum.CA.value ? CountryEnum.CA.value : CountryEnum.US.value
  try {
    const response = await apiService.cmsService.getDetailContent(id, { country: country })
    if (response.success) {
      dataModal.currentDataDetail = response.data
    }
  } finally {
    showGlobalLoading(false)
  }
}
const handleOpenModalDetail = (item) => {
  dataModal.visibleDetail = true
  getDetailContent(item?.id)
}

const searchIngredients = (val) => {
  emits('get-content-ingredients', {
    displayType: CmsDisplayTypeEnum.CONTENT,
    type: CmsTypeEnum.INGREDIENTS,
    displayTitle: val
  })
}

const roundMap = computed(() => {
  if (props.data?.length > 4) return 2
  return 1
})

onMounted(() => {
  searchIngredients(chooseAlphabets.value)
})
</script>
<style scoped lang="scss">
:deep(.ant-input-affix-wrapper) {
  border: none;
  @apply border-b-solid border-1 border-black-50 rounded-0 h-10 w-full  shadow-none;
  &:focus {
    @apply shadow-none;
  }
  &:hover {
    @apply border-b-solid border-1 border-black-50;
  }
}

.bold-first-letter {
  &::first-letter {
    font-weight: bold;
  }
  &:hover {
    background: rgba(160, 173, 185, 0.2);
  }
  @apply cursor-pointer;
}
.item-alphabets {
  @apply bg-navy-3 cursor-pointer	 bg-opacity-20;
}

.custom-image {
  display: grid;
  grid-template-areas:
    'head head'
    'main  nav'
    'foot nav';
  gap: 20px;
}

.header {
  grid-area: head;
}
.nav {
  grid-area: nav;
}
.main {
  grid-area: main;
}
.foot {
  grid-area: foot;
}
</style>
