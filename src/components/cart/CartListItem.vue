<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="px-5">
    <div class="flex">
      <CartCheckSmall
        v-if="!cartItem?.deleted"
        :checked="cartItem.checked"
        @checked-change="onCheckItem"
      />
      <div
        class="font-550 title-product line-clamp-1 h-6 cursor-pointer px-[10px] text-[14px]"
        @click="gotoProductDetail(cartItem?.productId)"
      >
        {{ cartItem?.productNameInfo?.engName }}
      </div>
      <DeleteIcon
        class="ml-auto cursor-pointer"
        :class="{ ' hidden': !deletable }"
        @click="preDeleteItem"
      />
    </div>
    <div class="flex gap-6 pt-3">
      <div class="w-[100px] cursor-pointer">
        <img
          alt="product image"
          class="w-full"
          :src="addPrefixForImage(cartItem?.thumbnailUrl)"
          @click="gotoProductDetail(cartItem?.productId)"
        />
      </div>

      <div>
        <div>
          <div>
            <span
              v-if="cartItem?.productNameInfo?.optionName"
              class="text-[14px] opacity-75"
            >Option: {{ cartItem?.productNameInfo?.optionName }}</span
            >
            <template v-if="cartItem?.optionValues">
              <div v-for="(item, index) in cartItem.optionValues" :key="index" class="mb-2">
                <div class="flex items-center gap-2">
                  {{ item.optionName }} :

                  <div v-if="item.type?.code === ProductVariantEnum.IMAGE">
                    <img
                      :src="addPrefixForImage(item.optionValue)"
                      class="h-10 w-10 rounded-sm object-cover"
                      alt="image_option"
                    />
                  </div>
                  <div v-else>
                    {{ item.optionValue }}
                  </div>
                </div>
              </div>
            </template>

            <div
              v-if="!cartItem?.deleted"
              class="quantity-input border-1 border-gray-10 border-solid"
            >
              <a-input
                v-model:value="cartItem.quantity"
                @change="onChangeQuantity"
                @blur="doChangeQuantity"
              >
                <template #prefix>
                  <MinusIcon class="cursor-pointer" @click="increaseQuantity(false)" />
                </template>
                <template #suffix>
                  <PlusIcon class="cursor-pointer" @click="increaseQuantity(true)" />
                </template>
              </a-input>
            </div>
            <span class="text-red-1000 text-xs">{{ messageQuantity }}</span>
          </div>
          <div class="font-625 mt-3 text-base capitalize leading-4">
            <span :class="{ 'line-through': hasDiscount(cartItem) }">
              {{ renderCurrency(cartItem?.currency?.code) }}
              {{ convertNumber(cartItem?.salesAmountOriginal || cartItem?.salesAmount) }}
            </span>
            <span v-if="hasDiscount(cartItem)" class="font-425 mx-1">
              {{ renderCurrency(cartItem?.currency?.code) }}
              {{ convertNumber(cartItem?.salesAmountDiscountAfterRank || cartItem?.salesAmount) }}
            </span>
            <span class="text-gray-14 px-1 font-normal">|</span>
            <span class="text-truncate font-light">
              {{ convertNumber(cartItem?.bp) }}{{ getPointText }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <div><a-divider class="bg-gray-11 my-5" /></div>
  </div>
</template>
<script setup>
import DeleteIcon from '@/assets/svgs/delete-small.svg'
import MinusIcon from '@/assets/svgs/minus.svg'
import PlusIcon from '@/assets/svgs/plus.svg'
import { AppRoutes } from '@/router/path'
import { convertNumber, renderCurrency } from '@/utils/currency'
import { useRouter } from 'vue-router'
import { watch, ref } from 'vue'
import { ALPHABETS, ESCAPE } from '@/helpers/regex'
import { addPrefixForImage } from '@/utils/common'
import { ProductVariantEnum } from '@/helpers/enum'
import { getPointText } from '@/utils/product'

const messageQuantity = ref('')
const router = useRouter()
const emits = defineEmits(['checked', 'quantity', 'delete', 'blur'])
const props = defineProps({
  cartItem: {
    type: Object,
    default: undefined
  },
  deletable: {
    type: Boolean,
    default: true
  },
  minQuantity: {
    type: Number
  },
  maxQuantity: {
    type: Number
  }
})

const onCheckItem = () => {
  emits('checked', props.cartItem.cartId)
}

const hasDiscount = (cartItem) => {
  if (cartItem?.salesAmountOriginal) {
    return cartItem?.salesAmount && cartItem?.salesAmount !== cartItem?.salesAmountOriginal
  }
  return (
    cartItem?.salesAmountDiscountAfterRank &&
    cartItem?.salesAmount !== cartItem?.salesAmountDiscountAfterRank
  )
}

const increaseQuantity = (isIncrease) => {
  if (isIncrease) {
    if (props.cartItem.quantity >= 0) {
      messageQuantity.value = ''
      emits('quantity', { cartId: props.cartItem.cartId, isIncrease })
    }
  } else {
    if (props.cartItem.quantity > 1) {
      messageQuantity.value = ''
      emits('quantity', { cartId: props.cartItem.cartId, isIncrease })
    }
  }
}

const preDeleteItem = () => {
  emits('delete')
}

const gotoProductDetail = (id) => {
  router.push({ name: AppRoutes.product.detail.name, params: { productId: id } })
}

const validateMessage = (minQuantity, maxQuantity) => {
  if (props.cartItem?.quantity < minQuantity && minQuantity) {
    messageQuantity.value = `Product quantity must be greater than or equal to ${minQuantity}`
  } else if (props.cartItem?.quantity > maxQuantity && maxQuantity) {
    messageQuantity.value = `Product quantity must be less than or equal to ${maxQuantity}`
  } else {
    messageQuantity.value = ''
  }
}

const onChangeQuantity = () => {
  validateMessage(props.minQuantity, props.maxQuantity)
}

const doChangeQuantity = () => {
  const quantity = Number(props.cartItem.quantity)
  if (quantity && quantity > 0) {
    emits('blur', { cartId: props.cartItem.cartId, quantity })
  }
}

watch(
  [() => props.cartItem.quantity, () => props.minQuantity, () => props.maxQuantity],
  ([newVal, newMin, newMax]) => {
    if (newVal) {
      // eslint-disable-next-line vue/no-mutating-props
      props.cartItem.quantity = Number(String(newVal).replace(ALPHABETS, '').replace(ESCAPE, ''))
    }
    validateMessage(newMin, newMax)
  }
)
</script>
<style lang="scss" scoped>
.quantity-input {
  width: 80px;

  :deep(.ant-input) {
    @apply rounded-none text-center;
  }
}

.title-product {
  width: calc(100% - 30px);
}
</style>
