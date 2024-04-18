<template>
  <a-modal
    v-if="isShowModal"
    :visible="isShowModal"
    centered
    wrap-class-name="exceededPopup"
    :footer="false"
    :closable="false"
    :width="592"
  >
    <div class="relative flex flex-col items-center">
      <div class="w-full !bg-black">
        <div
          class="rounded-1 mx-auto mt-10 flex w-20 cursor-pointer justify-center border-none bg-[#063451] py-[10px] text-[14px] leading-none text-white"
        >
          NOTICE
        </div>
        <div class="mt-[10px] text-center text-[#063451]">Exceeded Purchase Limit</div>
        <p class="mx-5 mt-[20px] text-center md:mx-10">
          You've exceeded the purchase limit for NFR product listed below. Please reorder without
          the restricted items.
        </p>
        <div class="mt-[30px] bg-gray-100 px-5 py-[30px] md:px-10">
          <div class="max-h-52 overflow-auto">
            <div v-for="item in exceededProductList" :key="item?.productId" class="flex flex-col">
              <ExceededItem :info="item" />
            </div>
          </div>

          <button
            class="mx-15 border-1 mx-auto mt-10 w-full cursor-pointer border-solid border-none border-[#063451] bg-white py-[15px] text-[14px] leading-none text-[#063451]"
            @click="closeModal"
          >
            Order Next Time
          </button>
          <button
            class="mx-15 mx-auto mt-4 w-full cursor-pointer border-none bg-[#063451] py-[15px] text-[14px] leading-none text-white"
            :disabled="isDisable"
            :class="isDisable ? '!bg-gray cursor-not-allowed' : ''"
            @click="handleCheckout"
          >
            Delete Restricted Product & Checkout
          </button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import ExceededItem from '@/components/cart/ExceededItem.vue'
import { computed } from 'vue'
const emit = defineEmits(['setIsShowModal', 'createSaleOrder'])
const props = defineProps({
  isShowModal: {
    type: Boolean,
    default: false
  },
  exceededProductList: {
    type: Array,
    default: () => []
  },
  checkedCartList: {
    type: Array,
    default: () => []
  }
})

const getCartCheckout = () => {
  const productIdsToRemove = props.exceededProductList.map((item) => item.productId)
  const listCartCheckout = []
  props.checkedCartList?.forEach((item) => {
    let itemCart = item
    if (productIdsToRemove.includes(item.productId)) {
      const itemExceeded = props.exceededProductList.find(
        (itemx) => itemx.productId === item.productId
      )
      itemCart = { ...item, quantity: itemExceeded.remainingQuantity }
      if (itemExceeded.remainingQuantity) {
        listCartCheckout.push(itemCart)
      }
    } else {
      listCartCheckout.push(itemCart)
    }
  })
  return listCartCheckout
}

const isDisable = computed(() => !getCartCheckout().length)

const handleCheckout = () => {
  const listCartCheckout = getCartCheckout()
  emit('createSaleOrder', listCartCheckout)
}

const closeModal = () => {
  emit('setIsShowModal')
}
</script>
<style lang="scss">
.exceededPopup {
  p {
    margin-bottom: 0;
  }

  .ant-modal {
    width: 335px;
  }
  .ant-modal-body {
    padding: 0;
  }
  .ant-modal-content {
    border-radius: 10px;
  }
}
</style>
