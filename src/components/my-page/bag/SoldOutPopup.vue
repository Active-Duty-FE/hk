<template>
  <a-modal
    v-model:visible="visible"
    centered
    width="350px"
    :closable="false"
    :mask-closable="false"
    wrap-class-name="SoldOutPopup"
  >
    <div class="grid place-items-center pt-10">
      <p class="text__soldOut">NOTICE</p>
    </div>
    <p class="text__title">{{ title }}</p>
    <p class="text__description">{{ description }}</p>

    <div class="bg-gray-11 py-7.5 bg-opacity-20 px-5">
      <p class="font-550 text-sm -tracking-[0.28px]">*OUT-OF-STOCK PRODUCT</p>
      <div class="flex flex-col">
        <div v-for="product in products" :key="product.productId" class="product__item">
          <span class="product__title">{{ product.productEnglishName }}</span>
          <span v-if="product.optionCode" class="product__optionCode">{{
            product.optionCode
          }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="grid grid-cols-2">
        <RButton
          title="Buy Next Time"
          class="!border-navy-6 w-full"
          class-title="text-navy-6"
          @click="emit('skip')"
        />
        <RButton
          title="Add To Bag"
          class="!border-navy-6 !bg-navy-6 w-full"
          class-title="text-white"
          @click="emit('add')"
        />
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import { useRouter } from 'vue-router'

const router = useRouter()
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  products: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'skip', 'add'])
const visible = useVModel(props, 'modelValue', emit)

const title = `There's an out-of-stock\nproduct on your list.`
const description = `We've spotted a temporary out-of-stock\nproduct on your list, but don't worry!\nWe'll restock them soon and\nship them to you as fast as we can.\nThank you for your patience!`

const onConfirm = () => {
  visible.value = false
}
</script>

<style lang="scss" scoped>
.text {
  &__soldOut {
    @apply bg-navy-6 leading-base m-2.5 rounded px-3 py-2 text-sm font-bold text-white;
  }

  &__title {
    @apply text-navy-6 font-550 leading-base whitespace-pre-wrap text-center text-sm;
  }

  &__description {
    @apply leading-base mb-7.5 whitespace-pre-line px-5 text-center text-sm -tracking-[0.28px];
  }
}

.product {
  &__item {
    @apply border-b-1 border-b-solid border-b-gray-11 flex flex-col gap-1 py-4;

    &:first-child {
      @apply pt-0;
    }

    &:last-child {
      @apply border-b-0 pb-0;
    }
  }

  &__optionCode {
    @apply whitespace-pre-line;
  }
}
</style>

<style lang="scss">
.SoldOutPopup {
  .ant-modal-header {
    @apply border-b-0 p-5;
  }

  .ant-modal-title {
    @apply font-550 leading-base text-center text-lg;
  }

  .ant-modal-body {
    @apply p-0;
  }

  .ant-modal-footer {
    @apply bg-gray-11 border-t-0 bg-opacity-20 px-5 pb-10;
  }
}
</style>
