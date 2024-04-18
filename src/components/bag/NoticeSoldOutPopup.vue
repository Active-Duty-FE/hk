<template>
  <a-modal
    v-model:visible="visible"
    centered
    :title="title"
    :closable="false"
    :mask-closable="false"
    wrap-class-name="NoticeSoldOutPopup"
  >
    <div class="my-7.5 text-center">
      <img src="@/assets/svgs/icon-sold-out.svg?url" alt="" />
    </div>
    <p class="text__description">{{ description }}</p>

    <div class="bg-gray-11 py-7.5 bg-opacity-20 px-5">
      <p class="text__soldOut">{{ textSoldOut }}</p>

      <div class="flex flex-col">
        <div v-for="product in products" :key="product.productId" class="product__item">
          <span class="product__title">{{ product.englishName }}</span>
          <span v-if="product.optionCode" class="product__optionCode">{{
            product.optionCode
          }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <RButton
        title="Confirm"
        class="!border-navy-6 !bg-navy-6 w-full"
        class-title="text-white"
        @click="onConfirm"
      />
    </template>
  </a-modal>
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import { computed } from 'vue'
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
  },
  isSoldOut: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['update:modelValue', 'confirm'])
const visible = useVModel(props, 'modelValue', emits)
const title = computed(() =>
  props.isSoldOut ? 'Notice of Sold Out' : 'Notice of Temporary Sold Out'
)
const description = computed(() =>
  props.isSoldOut
    ? 'The items below are out of stock. Please check and order again. Thank you for your understanding.'
    : 'Among the products you selected, the following products are temporarily Sold Out. We will restock quickly and ship it as quickly as possible. Thank you for your understanding.'
)

const textSoldOut = computed(() => (props.isSoldOut ? 'Sold Out' : 'Temporarily Sold Out'))

const onConfirm = () => {
  if (props.isSoldOut) {
    router.push('/')
    return
  }
  emits('confirm')
  visible.value = false
}
</script>

<style lang="scss" scoped>
.text {
  &__description {
    @apply leading-base mb-10 whitespace-pre-line px-10 text-center text-sm -tracking-[0.28px];
  }

  &__soldOut {
    @apply leading-base font-550 mb-5 text-sm -tracking-[0.28px];
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

  &__optionCode {
    @apply;
  }
}
</style>

<style lang="scss">
.NoticeSoldOutPopup {
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
    @apply mt-10 border-t-0;
  }
}
</style>
