<template>
  <div class="w-full py-5">
    <div>
      <span
        v-if="
          item?.salesStatus?.code &&
            [ProductSaleStatus.SOLD_OUT, ProductSaleStatus.PAUSE].includes(item?.salesStatus?.code)
        "
        class="bg-navy-1 inline w-fit rounded-sm px-1 text-[12px] uppercase text-white"
      >
        {{ ProductSaleStatusText[item?.salesStatus?.code] }}
      </span>
    </div>
    <div class="mb-4 flex items-center justify-between gap-4">
      <span class="product__title">{{ item?.englishName }}</span>

      <img src="@/assets/svgs/delete-small.svg?url" alt="" class="icon__delete" @click="onDelete" />
    </div>

    <div class="flex items-start gap-5">
      <div class="image__wrap">
        <img :src="addPrefixForImage(item?.thumbnailUrl)" alt="" class="image__item" />
      </div>

      <div class="product__content">
        <div class="flex flex-col">
          <span v-if="item?.productOptionName" class="product__optionName">{{
            item.productOptionName
          }}</span>
          <span
            v-if="item?.productOptionId"
            class="leading-base whitespace-pre-line text-sm -tracking-[0.28px]"
          >
            {{ item?.optionCode }}
          </span>
        </div>

        <RInputNumber v-model:value="quantity" :min="1" :max="99">
          <template #addonBefore>
            <div class="cursor-pointer select-none" @click="decreaseQuantity">
              <MinusIcon />
            </div>
          </template>
          <template #addonAfter>
            <div class="cursor-pointer select-none" @click="increaseQuantity">
              <PlusIcon />
            </div>
          </template>
        </RInputNumber>

        <div class="flex items-center gap-2">
          <span class="product__price">
            {{ renderCurrency(item?.currency?.code)
            }}{{ convertNumber(item?.salesAmountDiscountAfterRank) }}
          </span>
          <span>|</span>
          <span class="product__point text-truncate">
            {{ convertNumber(item?.bp) }}{{ getPointText }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PlusIcon from '@/assets/svgs/plus.svg'
import MinusIcon from '@/assets/svgs/minus.svg'
import { useVModel } from '@vueuse/core'
import { addPrefixForImage } from '@/utils/common'
import { convertNumber, renderCurrency } from '@/utils/currency'
import { getPointText } from '@/utils/product'
import { ProductSaleStatus, ProductSaleStatusText } from '@/helpers/enum'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  item: {
    type: Object,
    default: () => ({})
  }
})
const emits = defineEmits(['update:modelValue', 'delete'])

const quantity = useVModel(props, 'modelValue', emits)

const decreaseQuantity = () => {
  if (quantity.value <= 1) return
  quantity.value--
}

const increaseQuantity = () => {
  if (quantity.value >= 99) return
  quantity.value++
}

const onDelete = () => {
  emits('delete', {
    productOptionId: props.item?.productOptionId,
    productId: props.item?.productId
  })
}
</script>

<style lang="scss" scoped>
.image {
  &__wrap {
    @apply w-30 h-30 relative;
  }

  &__item {
    @apply absolute bottom-0 left-0 right-0 top-0 aspect-square w-full transition-all duration-300;
  }
}

.product {
  &__content {
    width: calc(100% - 120px - 16px);
    @apply flex flex-col gap-3;
  }

  &__title {
    @apply text-gray-15 text-truncate text-base font-medium leading-5;
  }

  &__optionName {
    @apply text-truncate text-[14px] opacity-75;
  }

  &__price {
    @apply font-625 text-base leading-4;
  }

  &__point {
    @apply font-475 text-base leading-[22px];
  }
}

.icon__delete {
  @apply h-fit w-4 w-fit cursor-pointer;
}

:deep(.ant-input-number) {
  border-color: #212121 !important;
  @apply border-l-none border-r-none;
}

:deep(.ant-input-number-group-wrapper) {
  @apply w-fit;
}

:deep(.ant-input-number-input) {
  @apply min-h-5.5 w-6 px-0 text-center;
}

:deep(.ant-input-number-group-addon) {
  border-color: #212121;
  background: transparent;
  @apply w-8 px-0;
}
</style>
