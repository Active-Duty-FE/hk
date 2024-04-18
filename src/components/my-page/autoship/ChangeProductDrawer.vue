<template>
  <RDrawerBottom v-model="visible" title="Change Product">
    <div class="-mt-5 flex h-full flex-col">
      <div
        class="border-1 border-b-solid flex cursor-pointer items-center gap-1 pb-5"
        @click="state.isShowAddProduct = true"
      >
        <img src="@/assets/svgs/my-page/add-square.svg?url" alt="" />
        <span class="font-475 leading-5.5 text-base">Add Product</span>
      </div>

      <div class="flex-1">
        <div v-if="state.productList.length" class="md:max-h-100 max-h-75 overflow-y-auto">
          <AutoshipProductItem
            v-for="item in state.productList"
            :key="`${item.productId}-${item.productOptionId}`"
            v-model="item.quantity"
            :item="item"
            class="product__item"
            @delete="onDelete"
          />
        </div>

        <div v-else class="py-10 text-center">No data</div>
      </div>
      <div class="border-1 border-t-solid border-b-solid mt-5 py-5">
        <div class="text-gray-15 font-550 mb-4 flex items-center justify-between">
          <span class="text-base leading-5">Total</span>
          <span class="leading-6.5 text-xl"
          >{{ renderCurrency(state.productList[0]?.currency?.code) }}
            {{ convertNumber(amountAndPoint.amount) }}</span
          >
        </div>
        <div class="flex items-center justify-between text-sm">
          <span class="-tracking-[0.28px]">Total Points</span>
          <span class="font-475 leading-base"
          >{{ convertNumber(amountAndPoint.point) }} {{ getPointText }}</span
          >
        </div>
      </div>

      <div class="my-10 flex items-center justify-center">
        Do you want to change the autoship subscription Product?
      </div>

      <div class="grid grid-cols-2 gap-1">
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
          @click="onConfirm"
        />
      </div>
    </div>

    <ProductAddChangeDrawer
      v-model:visible="state.isShowChangeAddProductDrawer"
      @change="confirmChangeProduct"
      @add="confirmAddProduct"
    />

    <AddProductDrawer
      v-model:visible="state.isShowAddProduct"
      is-autoship
      @confirm="onAddProduct"
    />
  </RDrawerBottom>
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import { computed, reactive, watch } from 'vue'
import cloneDeep from 'lodash/cloneDeep'
import { convertNumber, renderCurrency } from '@/utils/currency'
import { isBeautyPlanner } from '@/utils/role'
import { getPointText } from '@/utils/product'

const MAX_POINT = 20
const POINT_PERCENTAGE_PLANNER = 10 / 100
const POINT_PERCENTAGE_CUSTOMER = 5 / 100

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  products: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'confirm'])

const visible = useVModel(props, 'visible', emit)

const state = reactive({
  isShowAddProduct: false,
  productList: [],
  isShowChangeAddProductDrawer: false,
  changeAddProductList: []
})

const isDisableConfirm = computed(() => !state.productList.length)

const amountAndPoint = computed(() => {
  return state.productList.reduce(
    (result, p) => {
      const quantity = ~~p.quantity
      const amount = +p.salesAmountDiscountAfterRank

      const amountItem = amount * quantity
      let pointItem =
        amountItem * (isBeautyPlanner.value ? POINT_PERCENTAGE_PLANNER : POINT_PERCENTAGE_CUSTOMER)

      if (isBeautyPlanner.value) {
        pointItem = pointItem > MAX_POINT ? MAX_POINT : pointItem
      }

      result.amount += amountItem
      result.point += pointItem
      return result
    },
    {
      amount: 0,
      point: 0
    }
  )
})

watch(visible, (value) => {
  if (!value) return
  state.productList = cloneDeep(props.products || [])
})

const onAddProduct = (productMap) => {
  state.changeAddProductList = Object.values(productMap)
  state.isShowChangeAddProductDrawer = true
}

const parseProductDisplay = (item) => {
  return {
    ...item,
    quantity: +item.minQuantityLimit,
    englishName: item.productEnglishName,
    bp: item.autoShipBp,
    salesAmountDiscountAfterRank: item.salesAmount ?? item.priceOriginal
  }
}

const confirmChangeProduct = () => {
  state.productList = []
  state.changeAddProductList.forEach((product) => {
    state.productList.push(parseProductDisplay(product))
  })
}

const confirmAddProduct = () => {
  state.changeAddProductList.forEach((productAdd) => {
    const productOptionIdAdd = productAdd.productOptionId
    const productIdAdd = productAdd.productId
    const findProduct = state.productList.find((p) => {
      if (productOptionIdAdd) {
        return +p.productId === +productIdAdd && +p.productOptionId === +productOptionIdAdd
      }
      return +p.productId === +productIdAdd
    })

    if (findProduct) {
      findProduct.quantity++
    } else {
      state.productList.push(parseProductDisplay(productAdd))
    }
  })
}

const onDelete = ({ productId, productOptionId }) => {
  state.productList = state.productList.filter((p) => {
    if (+productOptionId) {
      return +p.productId === +productId && +p.productOptionId !== +productOptionId
    }
    return +p.productId !== +productId
  })
}

const onConfirm = async () => {
  const products = state.productList.map((p) => ({
    productId: p.productId,
    productOptionId: p.productOptionId,
    quantity: p.quantity,
    salesAmount: p.salesAmountDiscountAfterRank,
    bp: p.bp
  }))

  emit('confirm', {
    totalSalesAmount: amountAndPoint.value.amount,
    changeProductDtoList: products
  })
}
</script>

<style lang="scss" scoped>
.product__item:not(:last-child) {
  @apply border-b-solid border-1 border-gray-11;
}
</style>
