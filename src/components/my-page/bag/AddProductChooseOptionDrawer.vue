<template>
  <RDrawerBottom v-model="visible" title="Choose Option" height="fit-content">
    <div class="option__wrap">
      <p class="product__title">{{ data.productSelected?.productEnglishName }}</p>

      <div v-for="(options, key) in optionHash" :key="key">
        <p class="option__label">
          {{ key }}
          <span class="text-red-1000">*</span>
        </p>

        <RSelect
          v-model:value="state[key]"
          class="!mb-5 w-full"
          @change="(val) => onChangeData(key, val)"
        >
          <a-select-option
            v-for="item in options"
            :key="`${key}-${item.productCategoryOptionDetailId}`"
            :value="item.productCategoryOptionDetailId"
          >
            <img
              v-if="hasImage(item)"
              class="mr-2 rounded-full object-cover"
              width="30"
              height="30"
              :src="addPrefixForImage(item.optionValue)"
              alt=""
            />
            {{ getNameVariant(item) }}
          </a-select-option>
        </RSelect>
      </div>
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
        :disabled="isDisabledConfirmBtn"
        @click="onConfirm"
      />
    </div>
  </RDrawerBottom>
</template>

<script setup>
import { useVModel } from '@vueuse/core/index'
import { computed, reactive, toRefs, watch } from 'vue'
import { addPrefixForImage } from '@/utils/common'
import { PRODUCT_STATUS_ENUM, ProductVariantEnum } from '@/helpers/enum'
import { useNotification } from '@/composables/notification'

const { showNotification } = useNotification()
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: () => ({})
  },
  isAutoship: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['update:visible', 'confirm'])
const visible = useVModel(props, 'visible', emits)
const state = reactive({})
const { optionHash, isCombine, selectedHash, productSelected } = toRefs(props.data)

const isDisabledConfirmBtn = computed(() => {
  if (!optionSelected.value) return true

  if (props.isAutoship) {
    return !optionSelected.value?.autoShipYn
  }

  return false
})

const optionSelected = computed(() => {
  const key = Object.values(state).filter(Boolean).join('-')
  return selectedHash.value[key]
})

const optionHashById = computed(() => {
  const optionById = {}

  for (const key in optionHash.value) {
    const option = optionHash.value[key]
    for (const item of option) {
      optionById[item.productCategoryOptionDetailId] = item
    }
  }
  return optionById
})

const hasImage = (item) => {
  return item.optionType?.code === ProductVariantEnum.IMAGE && item.optionValue
}

const getNameVariant = (item) => {
  return item.imageName || item.optionValue
}

const onChangeData = (key, value) => {
  if (isCombine.value) return
  resetState()
  state[key] = value
}

const resetState = () => {
  Object.keys(optionHash.value).forEach((key) => {
    Object.assign(state, {
      [key]: undefined
    })
  })
}

const onConfirm = () => {
  const variants = []
  for (const keyVariant in state) {
    const idVariant = state[keyVariant]
    if (!idVariant) continue
    const nameVariant = getNameVariant(optionHashById.value[idVariant])
    variants.push(`${keyVariant}: ${nameVariant}`)
  }

  showNotification({
    type: 'success',
    message: 'Product has been added'
  })

  const hasSoldOut = optionSelected.value?.values?.some(
    (value) => value.salesStatus?.code === PRODUCT_STATUS_ENUM.SOLD_OUT
  )

  const { priceOriginal, salesAmount, point } = optionSelected.value?.values?.[0] || {}

  emits('confirm', {
    productOptionId: optionSelected.value?.productId,
    productOptionName: optionSelected.value?.productName,
    product: { ...productSelected.value, priceOriginal, salesAmount, point },
    optionCode: variants.join('\n'),
    hasSoldOut
  })
}

watch(
  () => visible.value,
  (val) => {
    if (!val) {
      // Reset state to an empty object
      Object.keys(state).forEach((key) => {
        delete state[key]
      })
      return
    }

    resetState()
  }
)
</script>

<style lang="scss" scoped>
.product__title {
  @apply font-550 mb-10 text-base leading-[22px];
}

.option {
  &__wrap {
    max-height: calc(80dvh - 220px);
    @apply border-1 border-gray-10 border-solid p-5;
  }

  &__label {
    @apply font-550 mb-2 text-sm leading-5;
  }
}
</style>
