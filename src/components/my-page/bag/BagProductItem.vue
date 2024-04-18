<template>
  <div class="flex items-start gap-5 py-5">
    <div class="image__wrap">
      <img
        :src="addPrefixForImage(item.thumbnailUrl)"
        alt=""
        class="image__item image__thumbnail"
      />
      <img :src="addPrefixForImage(item.hoverUrl)" alt="" class="image__item image__hover" />
    </div>

    <div class="product__content">
      <span class="product__title">{{ item.productEnglishName }}</span>

      <div class="flex flex-col">
        <span v-if="item.productOptionName" class="product__optionName">{{
          item.productOptionName
        }}</span>
        <span
          v-if="item.productOptionId"
          class="leading-base whitespace-pre-line text-sm -tracking-[0.28px]"
        >
          {{ item.optionCode }}
        </span>
      </div>

      <RInputNumber v-model:value="currentValue" :min="1" :max="maxQuantity">
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
        <span
          v-if="item.priceOriginal !== item.salesAmount"
          class="text-base leading-4 line-through"
        >
          {{ renderCurrency(item?.currencyPrice?.code) }}{{ convertNumber(item.priceOriginal) }}
        </span>
        <span class="product__price">
          {{ renderCurrency(item?.currencyPrice?.code) }}{{ convertNumber(price) }}
        </span>
        <span>|</span>
        <span class="product__point text-truncate">
          {{ convertNumber(item?.point) || 0 }}{{ getPointText }}
        </span>
      </div>
    </div>

    <img
      src="@/assets/svgs/delete-small.svg?url"
      alt=""
      class="icon__delete"
      @click="emits('delete', item.productOptionId || item.productId)"
    />
  </div>
</template>

<script setup>
import PlusIcon from '@/assets/svgs/plus.svg'
import MinusIcon from '@/assets/svgs/minus.svg'
import { useVModel } from '@vueuse/core'
import { addPrefixForImage } from '@/utils/common'
import { computed, watch } from 'vue'
import { convertNumber, renderCurrency } from '@/utils/currency'
import { getPointText } from '@/utils/product'

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

const currentValue = useVModel(props, 'modelValue', emits)

const maxQuantity = computed(() => {
  if (!props.item.maxQuantityLimit) return undefined

  return ~~props.item.maxQuantityLimit
})

const price = computed(() => props.item.salesAmount ?? props.item.priceOriginal)

const decreaseQuantity = () => {
  currentValue.value--
}
const increaseQuantity = () => {
  currentValue.value++
}

watch(currentValue, (value) => {
  if (maxQuantity.value && value > maxQuantity.value) currentValue.value = maxQuantity.value
  const minQuantity = ~~props.item.minQuantityLimit || 1
  if (value <= minQuantity) currentValue.value = minQuantity
})
</script>

<style lang="scss" scoped>
.image {
  &__wrap {
    @apply w-30 h-30 relative;

    &:hover .image {
      &__thumbnail {
        @apply opacity-0;
      }

      &__hover {
        @apply opacity-100;
      }
    }
  }

  &__item {
    @apply absolute bottom-0 left-0 right-0 top-0 aspect-square w-full transition-all duration-300;
  }

  &__hover {
    @apply opacity-0;
  }
}

.product {
  &__content {
    width: calc(100% - 120px - 16px - 40px);
    @apply flex flex-col gap-3;
  }

  &__title {
    @apply text-truncate text-gray-15 text-base font-medium leading-5;
  }

  &__optionName {
    @apply text-[14px] opacity-75;
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
