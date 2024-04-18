<template>
  <div class="flex items-start gap-5">
    <img :src="addPrefixForImage(item.thumbnailUrl)" alt="" class="product__image" />

    <div class="product__content">
      <span class="product__title">{{ item.englishName }}</span>

      <span
        v-if="item.optionCode"
        class="leading-base text-truncate whitespace-pre-line text-sm -tracking-[0.28px]"
      >
        {{ item.optionCode }}
      </span>

      <RInputNumber
        v-model:value="currentValue"
        :min="0"
        :max="99"
        :disabled="disabled"
        :class="{ disabled }"
      >
        <template #addonBefore>
          <div class="select-none" @click="decreaseQuantity">
            <MinusIcon />
          </div>
        </template>
        <template #addonAfter>
          <div class="select-none" @click="increaseQuantity">
            <PlusIcon />
          </div>
        </template>
      </RInputNumber>

      <div class="flex items-center gap-2 text-base leading-[22px]">
        <span v-if="item?.purchaseAmount !== item?.salesAmount" class="line-through">
          {{ renderCurrency(item?.currencyPrice) }}{{ convertNumber(item?.salesAmount) }}
        </span>
        <span class="font-semibold">
          {{ renderCurrency(item?.currencyPrice) }}{{ convertNumber(item?.purchaseAmount) }}
        </span>
        <span class="text-gray-14">|</span>
        <span class="text-truncate font-light">
          {{ convertNumber(item?.bp ?? item?.point) || 0 }} {{ newTextPoint }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import { addPrefixForImage } from '@/utils/common'
import { convertNumber, renderCurrency } from '@/utils/currency'
import PlusIcon from '@/assets/svgs/plus.svg'
import MinusIcon from '@/assets/svgs/minus.svg'
import { getPointText } from '@/utils/product'
import { computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  modelValue: {
    type: Number,
    default: 0
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['update:modelValue'])
const currentValue = useVModel(props, 'modelValue', emits)

const newTextPoint = computed(() =>
  getPointText.value === 'BP' ? getPointText.value : 'Reward Point'
)

const decreaseQuantity = () => {
  if (props.disabled) return
  if (currentValue.value <= 0) return
  currentValue.value--
}
const increaseQuantity = () => {
  if (props.disabled) return
  if (currentValue.value >= 99) return
  currentValue.value++
}
</script>

<style lang="scss" scoped>
.product {
  &__image {
    @apply w-30 aspect-square object-cover;
  }

  &__content {
    @apply flex w-[calc(100%-140px)] flex-col gap-3;
  }

  &__title {
    @apply leading-5.5 text-truncate text-gray-15 text-base font-semibold;
  }

  &__variant {
    @apply leading-base text-sm font-light -tracking-[0.28px];
  }
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
  @apply w-8 cursor-pointer px-0;
}

.disabled :deep(.ant-input-number-group-addon) {
  @apply bg-grey-4 cursor-not-allowed;
}
</style>
