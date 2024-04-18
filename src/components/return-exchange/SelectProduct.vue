<script setup>
import SubTitle from '@/components/return-exchange/SubTitle.vue'
import { computed, reactive, ref } from 'vue'
import { notices } from '@/mocks/return-exchange'
import { AppRoutes } from '@/router/path'
import { useRouter } from 'vue-router'
import ListIcon from '@/assets/svgs/list.svg'
import { useMutation, useQuery } from 'vue-query'
import apiService from '@/http/api'
import { useReturnExchangeStore } from '@/stores/modules/return-exchange'
import { useNotification } from '@/composables/notification'
import REAgreement from '@/pages/return-exchange/REAgreement.vue'
import { useAlertConfirm } from '@/composables/alert'
import { RETURN_EXCHANGE_TYPE } from '@/helpers/constant'
import { useGlobalLoadingStore } from '@/stores/modules/loading'

const props = defineProps({
  title: {
    default: undefined,
    type: String,
    required: false
  },
  orderInfo: {
    type: Object,
    default: undefined
  }
})

const useREStore = useReturnExchangeStore()
const { showNotification } = useNotification()
const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading
const router = useRouter()

const cartItems = ref([])
const agreement = ref()

const pageState = reactive({
  isCheckedAll: false,
  showModalDeleteCart: false,
  currentCartItem: [],
  singleCartItem: undefined,
  isDisabled: computed(() => checkAtLeastItemSelected()),
  isValidated: false
})

const emits = defineEmits(['updateStep', 'changeFormData'])

const productSelected = computed(() => {
  return cartItems.value
    .filter((el) => el.checked === true)
    .map((el) => ({
      productId: el.productId,
      quantity: el.quantity,
      productOptionId: el.productOptionId
    }))
})

const estimateVariable = computed(() => ({
  salesOrderId: props?.orderInfo?.salesOrderId,
  returnOrderReasonType: props?.orderInfo?.returnOrderReasonType,
  productList: productSelected.value
}))

const isAcceptAgreement = computed(() => agreement.value?.isAcceptAgreement)

useQuery({
  queryKey: [
    'load-product',
    {
      salesOrderId: props?.orderInfo?.salesOrderId
    }
  ],
  queryFn: () =>
    apiService.returnService.loadProductReturn({
      salesOrderId: props?.orderInfo?.salesOrderId
    }),
  onSuccess: (response) => {
    const listItems = response.data
    const cartEntries = []
    listItems.forEach((cart, index) => {
      const maxQuantity = cart?.productInfo?.quantity - (cart?.productInfo?.returnQuantity || 0)
      if (maxQuantity) {
        cartEntries.push({
          ...cart?.productInfo,
          productNameInfo: {
            engName: cart?.productInfo?.productName
          },
          salesAmount: cart?.productInfo?.saleAmount,
          checked: findCheckedStatus(cart),
          maxQuantity: maxQuantity,
          quantity: maxQuantity,
          cartId: index
        })
      }
    })
    cartItems.value = cartEntries
  },
  refetchOnWindowFocus: false
})

const { data: estimateData } = useQuery({
  queryKey: ['estimate-product', estimateVariable, estimateVariable.value?.productList.length],
  queryFn: () => apiService.returnService.estimateReturnOrder(estimateVariable.value),
  onSuccess: (res) => {
    if (res?.code === '2000') {
      pageState.isValidated = true
      useREStore.setEstimateOrderInfo(res.data)
    } else {
      showNotification({
        type: 'error',
        message: res?.message
      })
      pageState.isValidated = false
      useREStore.setEstimateOrderInfo(res.data)
    }
  },
  refetchOnWindowFocus: false,
  enabled: computed(
    () =>
      estimateVariable.value?.productList.length > 0 &&
      props.orderInfo?.returnExchangeType === RETURN_EXCHANGE_TYPE.RETURN
  )
})

const isValidQuantity = (quantity, maxQuantity) => {
  return quantity && quantity > 0 && quantity <= maxQuantity
}

const checkAtLeastItemSelected = () => {
  const isChecked = cartItems.value.some((el) => el.checked === true)
  const validQuantity = cartItems.value.some(
    (el) => el.checked && !isValidQuantity(el.quantity, el.maxQuantity)
  )
  return isChecked && !validQuantity
}

const onChangeQuantity = (data) => {
  const itemIndex = cartItems.value.findIndex((el) => el.cartId === data.cartId)
  let quantity = 1
  const currentQuantity = Number(cartItems.value[itemIndex].quantity)
  if (!data.isIncrease) {
    quantity = cartItems.value[itemIndex].quantity > 1 ? currentQuantity - 1 : 1
  } else {
    if (currentQuantity === cartItems.value[itemIndex].maxQuantity) {
      return
    }
    quantity = currentQuantity + 1
  }
  cartItems.value[itemIndex].quantity = quantity
}

const onSelectAll = (isChecked) => {
  pageState.isCheckedAll = !isChecked
  getCheckedItemForAll(isChecked)
}

const getCheckedItemForAll = (isChecked) => {
  if (!isChecked) {
    cartItems.value = cartItems.value.map((el) => ({ ...el, checked: true }))
  } else {
    cartItems.value = cartItems.value.map((el) => ({ ...el, checked: false }))
    pageState.isValidated = false
  }
}

const findCheckedStatus = (item) => {
  return cartItems.value.find((el) => el.cartId === item.cartId)?.checked || false
}

const onCheckChildItem = (child) => {
  child.checked = !child.checked
  resolveCheckAllState()
}

const resolveCheckAllState = () => {
  const unChecked = cartItems.value.some((el) => el.checked === false)
  pageState.isCheckedAll = !unChecked
}

const onBlurQuantity = (data) => {
  const itemIndex = cartItems.value.findIndex((el) => el.cartId === data.cartId)
  cartItems.value[itemIndex].quantity = data.quantity
  cartItems.value[itemIndex].salesAmount = data.quantity * cartItems.value[itemIndex]?.saleAmount
}

const isReturnRequest = computed(() => {
  return props.orderInfo?.returnExchangeType === RETURN_EXCHANGE_TYPE.RETURN
})

const { mutate: createReturnOrderMutate } = useMutation(
  async (payload) => {
    showGlobalLoading(true)
    const response = isReturnRequest.value
      ? await apiService.returnService.createReturnOrder(payload)
      : await apiService.returnService.createExchange(payload)
    return response
  },
  {
    onSuccess: (response) => {
      if (response.success) {
        useREStore.setReturnNumberOrder(response.data?.returnOrderNumber)
        router.push({
          name: AppRoutes.returnExchange.returnDetails.name,
          params: { id: response.data?.returnOrderNumber },
          query: isReturnRequest.value
            ? {}
            : {
              type: RETURN_EXCHANGE_TYPE.EXCHANGE
            }
        })
      } else {
        showNotification({
          type: 'error',
          message: response.message
        })
      }
      showGlobalLoading(false)
    }
  }
)

const handleNext = async () => {
  const params = {
    ...props?.orderInfo,
    productList: productSelected.value
  }

  useREStore.setOrderInfo(params)
  delete params.files
  delete params.personalReason
  createReturnOrderMutate(params)
}

const onCancel = async () => {
  const confirm = await useAlertConfirm({
    content: 'Do you want to cancel the return or exchange application?',
    okText: 'Ok',
    cancelText: 'Cancel'
  })
  if (!confirm) return
  emits('updateStep', 0)
}

const disabledBtnConfirm = computed(() => {
  if (isReturnRequest.value) {
    return !pageState.isDisabled || !pageState.isValidated || !isAcceptAgreement.value
  } else return !productSelected.value?.length
})
</script>
<template>
  <SubTitle :title="title"> </SubTitle>
  <template v-if="cartItems?.length">
    <a-divider class="!bg-gray-10 !my-0" />
    <div class="px-5">
      <div class="flex items-center justify-between py-[13px]">
        <CartCheckBox v-model:checked="pageState.isCheckedAll" @checked-change="onSelectAll">
          <template #content>
            <span class="font-475 text-gray-10 pl-[10px] text-[16px] leading-[22px]">
              Select All
            </span>
          </template>
        </CartCheckBox>
      </div>
      <a-divider class="bg-gray-10 !mb-5 !mt-0" />
    </div>
  </template>

  <CartListItem
    v-for="cartItem in cartItems"
    :key="cartItem.cartId"
    :cart-item="cartItem"
    :deletable="false"
    @checked="onCheckChildItem(cartItem)"
    @quantity="onChangeQuantity"
    @blur="onBlurQuantity"
  />
  <div v-if="isReturnRequest" class="px-5">
    <div>
      <div
        v-for="notice in notices"
        :key="notice"
        class="relative flex items-center text-[14px] font-normal"
      >
        <ListIcon class="absolute top-2 mr-2" /> <span class="pl-2">{{ notice }}</span>
      </div>
    </div>
  </div>

  <div v-if="productSelected?.length && isReturnRequest" class="my-6">
    <REAgreement ref="agreement" :estimate-data="estimateData" />
  </div>

  <div class="fz-[19] my-4 block flex w-full gap-2 bg-white px-5">
    <r-button
      class-title="text-navy-1"
      title="Cancel"
      class="disabled:(!bg-navy-4 border-1 !border-navy-4) !mx-auto w-full !shadow-none"
      @click="onCancel"
    />
    <r-button
      class-title="text-white"
      :title="isReturnRequest ? 'Confirm' : 'OK'"
      class="!bg-navy-1 disabled:(!bg-navy-4 border-1 !border-navy-4) !mx-auto w-full"
      :disabled="disabledBtnConfirm"
      @click="handleNext"
    />
  </div>
</template>
