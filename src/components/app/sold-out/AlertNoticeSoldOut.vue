<template>
  <a-modal
    v-model:visible="visible"
    centered
    title=""
    :closable="false"
    :mask-closable="false"
    wrap-class-name="notice-sold-out"
    :width="335"
  >
    <div class="mt-7.5 mb-[10px] text-center">
      <span
        class="style-normal leading-base bg-navy-6 mt-[40px] inline-block h-[30px] rounded-[4px] px-[13px] pt-[6px] text-[14px] font-bold text-white"
      >NOTICE</span
      >
    </div>
    <p class="text__description text-navy-6 mx-auto mb-5 w-[260px] text-[14px] font-[550]">
      There's an out-of-stock product on your list.
    </p>
    <p
      class="style-normal leading-base mb-7.5 mx-auto w-[280px] text-center text-[14px] -tracking-[0.28px]"
    >
      We've spotted a temporary out-of-stock product on your list, but don't worry! <br />
      We'll restock them soon and <br />
      ship them to you as fast as we can. <br />
      Thank you for your patience!
    </p>

    <div v-if="isSingle" class="bg-gray-11 py-7.5 bg-opacity-20 px-5">
      <div class="flex flex-col">
        <p class="text-gray-10 leading-base mb-[22px] text-[14px] font-[550] -tracking-[0.28px]">
          *OUT-OF-STOCK PRODUCT
        </p>
        <p class="text-gray-10 style-normal mb-2 text-[14px] font-normal -tracking-[0.28px]">
          {{
            productInfo?.originalName || productInfo?.productEnglishName || productInfo?.productName
          }}
        </p>
        <p v-if="productInfo?.productEnglishName" class="hidden">
          Option: {{ productInfo?.productEnglishName || productInfo?.productName }}
        </p>
        <p
          v-for="(productOption, index) in variants"
          :key="productOption"
          class="text-gray-10 style-normal mb-0 text-[14px] font-normal -tracking-[0.28px]"
        >
          {{ index }}:
          <span v-if="variants[index]?.includes('product/')"
          ><img
            :src="addPrefixForImage(variants[index])"
            class="h-10 w-10 rounded-sm object-cover"
            alt="image_option"
          />
          </span>
          <span v-else>{{ variants[index] }}</span>
        </p>
      </div>
    </div>

    <div v-else class="bg-gray-11 py-7.5 bg-opacity-20 px-5">
      <div class="flex flex-col">
        <p class="text-gray-10 leading-base mb-[22px] text-[14px] font-[550] -tracking-[0.28px]">
          *OUT-OF-STOCK PRODUCT
        </p>
        <div class="max-h-[100px] overflow-auto">
          <div v-for="(item, rootIndex) in soldOutItems" :key="item.cartId">
            <p class="text-gray-10 style-normal mb-2 text-[14px] font-normal -tracking-[0.28px]">
              {{ item?.productNameInfo?.engName }}
            </p>
            <p class="hidden">
              <span v-if="item?.productNameInfo?.optionName" class="text-[14px] opacity-75">
                Option: {{ item?.productNameInfo?.optionName }}
              </span>
            </p>
            <template v-if="item?.optionValues">
              <div v-for="(itemOption, index) in item.optionValues" :key="index" class="mb-2">
                <div class="flex items-center gap-2">
                  {{ itemOption.optionName }} :

                  <div v-if="itemOption.type?.code === ProductVariantEnum.IMAGE">
                    <img
                      :src="addPrefixForImage(itemOption.optionValue)"
                      class="h-10 w-10 rounded-sm object-cover"
                      alt="image_option"
                    />
                  </div>
                  <div v-else>
                    {{ itemOption.optionValue }}
                  </div>
                </div>
              </div>
            </template>
            <a-divider v-if="rootIndex < soldOutItems.length - 1" class="!my-1" />
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="bg-gray-11 flex bg-opacity-20 px-5 pb-5">
        <RButton
          title="Buy Next Time"
          class="!border-navy-6 !text-navy-6 w-full !bg-white"
          class-title="text-navy-6"
          @click="buyNextTime"
        />
        <RButton
          :title="isSingle ? 'Add To Bag' : 'Checkout'"
          class="!border-navy-6 !bg-navy-6 w-full !text-white"
          class-title="text-white"
          @click="handleAddToBag"
        />
      </div>
    </template>
  </a-modal>
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { ProductVariantEnum } from '@/helpers/enum'
import { addPrefixForImage } from '@/utils/common'

const router = useRouter()
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  productInfo: {
    type: Object,
    default: undefined
  },
  variants: {
    type: Object,
    default: undefined
  },
  isSingle: {
    type: Boolean,
    default: true
  },
  soldOutItems: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['update:modelValue', 'continue'])
const visible = useVModel(props, 'modelValue', emits)

const buyNextTime = () => {
  if (props.isSingle) {
    visible.value = false
    router.push({
      name: AppRoutes.product.detail.name,
      params: {
        productId: props.productInfo.productId
      }
    })
  } else {
    visible.value = false
  }
}

const handleAddToBag = () => {
  emits('continue')
}
</script>
<style lang="scss">
.text {
  &__description {
    @apply leading-base px-10 text-center text-sm -tracking-[0.28px];
  }
}
.notice-sold-out {
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
    @apply border-t-0 p-0;
  }
}
</style>
