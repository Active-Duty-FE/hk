<template>
  <RDrawerBottom v-model="visible" title="Add Product" height="90%">
    <div class="category__wrap no-scrollbar">
      <div
        v-for="{ categoryId, categoryName } in categories"
        :key="categoryId"
        class="category__item"
        :class="{ active: categoryId === state.categoryId }"
        @click="onChangeCategory(categoryId)"
      >
        {{ categoryName }}
      </div>
    </div>

    <a-dropdown :trigger="['click']" class="mb-5">
      <div class="product__sort">
        <span>Sort</span>
        <DropDownIcon />
      </div>
      <template #overlay>
        <a-menu>
          <a-menu-item
            v-for="item in SORT_OPTIONS"
            :key="item.value"
            :class="{ active: item.value === state.searchOrderType }"
            @click="onChangeOrderType(item.value)"
          >
            <span>{{ item.label }}</span>
          </a-menu-item>
        </a-menu>
      </template>
    </a-dropdown>

    <div ref="productRef" class="product__wrap">
      <div v-if="state.productList.length" class="product__list">
        <AddProductItem
          v-for="item in state.productList"
          :key="item.productId"
          :product="item"
          :is-selected="!!state.productSelected[item.productId]"
          @change="onSelectProduct"
        />
      </div>
      <div v-else class="pt-5 text-center">No data</div>

      <RButton
        v-if="state.pageNumber < state.totalPageNumber"
        title="MORE"
        class="!border-gray-10 mx-auto mt-10 w-full md:w-[390px]"
        class-title="text-gray-10 text-base md:text-lg font-550"
        @click="getMoreProduct"
      >
        <template #content>
          <img src="@/assets/svgs/add.svg?url" alt="" loading="lazy" class="mb-1" />
        </template>
      </RButton>
    </div>

    <div class="mt-10 grid grid-cols-2 gap-1">
      <RButton
        title="Cancel"
        class="!border-navy-6"
        class-title="text-navy-6"
        @click="visible = false"
      />
      <RButton
        title="Confirm"
        class="!border-navy-6 !bg-navy-6 disabled:(!bg-navy-4 !border-navy-4)"
        class-title="text-white"
        :disabled="isDisableConfirm"
        @click="onCheckSoldOut"
      />
    </div>

    <AddProductChooseOptionDrawer
      v-model:visible="state.isShowChooseOptionStateDrawer"
      :data="chooseOptionState"
      :is-autoship="isAutoship"
      @confirm="onSelectProductOption"
    />

    <SoldOutPopup
      v-model="state.isShowNoticeSoldOutPopup"
      :products="state.productSoldOutList"
      @add="onConfirm(true)"
      @skip="onConfirm(false)"
    />
  </RDrawerBottom>
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import cloneDeep from 'lodash/cloneDeep'
import { getProductLists } from '@/utils/common'
import { computed, reactive, ref, watch } from 'vue'
import { useMenuStore } from '@/stores/modules/menu'
import { storeToRefs } from 'pinia'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { SORT_OPTIONS, STORAGE_IP_ADDRESS } from '@/helpers/constant'
import DropDownIcon from '@/assets/svgs/dropdown.svg'
import apiService from '@/http/api'
import { parseDataVariantProduct } from '@/utils/product'
import storage from '@/utils/storage'
import { CountryEnum, PRODUCT_STATUS_ENUM } from '@/helpers/enum'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  isAutoship: {
    type: Boolean,
    default: false
  },
  isBag: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['update:visible', 'confirm'])
const visible = useVModel(props, 'visible', emits)
const { flatMenus } = storeToRefs(useMenuStore())
const { showGlobalLoading } = useGlobalLoadingStore()

const categories = computed(() => {
  const categoriesLv1 = flatMenus.value.filter((cat) => cat.level === 1)
  return [
    {
      categoryId: undefined,
      categoryName: 'All'
    },
    ...categoriesLv1
  ]
})

const state = reactive({
  pageNumber: 1,
  pageSize: 10,
  categoryId: undefined,
  searchOrderType: undefined,
  productList: [],
  totalPageNumber: 0,
  productSelected: {},
  isShowChooseOptionStateDrawer: false,
  isShowNoticeSoldOutPopup: false,
  productSoldOutList: []
})

const chooseOptionState = reactive({
  isCombine: false,
  selectedHash: {},
  optionHash: {},
  productSelected: {}
})
const productRef = ref()

const isDisableConfirm = computed(() => !Object.keys(state.productSelected).length)

const fetchProductData = async (getMore = false) => {
  showGlobalLoading(true)
  const payload = {
    pageNumber: state.pageNumber,
    pageSize: state.pageSize,
    categoryId: state.categoryId,
    searchOrderType: state.searchOrderType,
    country: storage.get(STORAGE_IP_ADDRESS, 'localStorage') ?? CountryEnum.US.value
  }

  if (props.isAutoship) {
    payload.autoShipYn = true
  }

  const { data, success } = props.isBag
    ? await apiService.productService.getProductBagList(payload)
    : await getProductLists(payload)
  showGlobalLoading(false)
  if (getMore) return data

  state.productList = success ? data?.list || data : []
  state.totalPageNumber = data?.totalPageNumber ?? 0
}

const getMoreProduct = async () => {
  state.pageNumber++
  const data = await fetchProductData(true)
  state.productList.push(...(data?.list || []))
  state.totalPageNumber = data?.totalPageNumber ?? 0
}

const onChangeCategory = (categoryId) => {
  if (state.categoryId === categoryId) return
  state.pageNumber = 1
  state.categoryId = categoryId
  state.productSelected = {}
  productRef.value?.scrollTo({ top: 0 })
  fetchProductData()
}

const onChangeOrderType = (orderType) => {
  if (state.searchOrderType === orderType) return
  state.pageNumber = 1
  state.searchOrderType = orderType
  state.productSelected = {}
  productRef.value?.scrollTo({ top: 0 })
  fetchProductData()
}

const onSelectProduct = async ({ product, checked }) => {
  if (!checked) {
    delete state.productSelected[product.productId]
    return
  }

  if (product.optionYn) {
    showGlobalLoading(true)
    const { data } = await apiService.productService.getProductDetail(product.productId)
    showGlobalLoading(false)
    const dataVariant = parseDataVariantProduct(data?.option)
    Object.assign(chooseOptionState, cloneDeep(dataVariant))
    chooseOptionState.productSelected = product
    state.isShowChooseOptionStateDrawer = true
    return
  }

  state.productSelected[product.productId] = product
}

const onSelectProductOption = ({
  productOptionId,
  productOptionName,
  product,
  optionCode,
  hasSoldOut
}) => {
  state.productSelected[product.productId] = {
    ...product,
    productOptionId,
    productOptionName,
    optionCode,
    hasSoldOut
  }
  state.isShowChooseOptionStateDrawer = false
}

const checkProductSoldOut = (item) =>
  item.salesStatus?.code === PRODUCT_STATUS_ENUM.SOLD_OUT || item.hasSoldOut

const onCheckSoldOut = () => {
  const productSoldOut = Object.values(state.productSelected).filter((item) =>
    checkProductSoldOut(item)
  )
  state.productSoldOutList = productSoldOut

  if (productSoldOut.length) {
    state.isShowNoticeSoldOutPopup = true
    return
  }

  onConfirm(true)
}

const onConfirm = (isAdd) => {
  state.isShowNoticeSoldOutPopup = false

  // Remove product sold out
  if (!isAdd) {
    Object.values(state.productSelected).forEach((item) => {
      if (checkProductSoldOut(item)) {
        delete state.productSelected[item.productId]
      }
    })
  }

  emits('confirm', state.productSelected)
  visible.value = false
}

watch(visible, (val) => {
  if (val) fetchProductData()

  if (!val) {
    Object.assign(state, {
      pageNumber: 1,
      categoryId: undefined,
      searchOrderType: undefined,
      productList: [],
      totalPageNumber: 0,
      productSelected: {}
    })
  }
})
</script>

<style lang="scss" scoped>
.category {
  &__wrap {
    &::-webkit-scrollbar {
      @apply h-2;
    }

    &::-webkit-scrollbar-thumb:hover {
      @apply bg-gray-13;
    }

    @apply mb-5 flex gap-1 overflow-x-auto pb-2;
  }

  &__item {
    @apply inline-flex h-11 cursor-pointer items-center justify-center whitespace-nowrap px-5 transition-all;
    @apply border-1 border-gray-13 border-solid;

    &.active {
      @apply border-navy-6 text-navy-6;
    }
  }
}

.product {
  &__wrap {
    @apply h-full max-h-[calc(100dvh-440px)] overflow-y-auto md:max-h-[calc(100dvh-513px)];
  }

  &__list {
    @apply gap-y-7.5 grid grid-cols-2 gap-x-4;
  }

  &__sort {
    @apply border-1 border-b-solid border-t-solid flex h-10 cursor-pointer items-center justify-center;
  }
}

:deep(.ant-dropdown-menu-item.active) {
  @apply font-semibold;
}
</style>
