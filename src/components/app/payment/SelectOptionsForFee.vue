<template>
  <div class="text-black-50 px-5">
    <p class="font-475 mb-5 text-base opacity-50">
      {{ $t('auth.sign_up.selectRecommend.membership_fee_title') }}
    </p>
    <p class="text-gray-12 font-medium">
      {{ $t('auth.sign_up.selectRecommend.membership_sub_title') }}
    </p>
    <a-divider class="bg-gray-11 my-[30px]"></a-divider>
  </div>
  <div class="mb-[30px] flex flex-col items-center px-5">
    <div class="bg-navy-1 rounded-2 relative h-[150px] w-[271px]">
      <Logo class="absolute left-[25px] top-[25px]" />
      <div class="absolute bottom-[25px] left-[25px]">
        <p class="mb-[10px] text-[10px] text-white">문구<br />확인중</p>
        <p class="mb-0 text-[24px] font-semibold leading-[24px] text-white">
          {{ formatCurrencyUltra(memberShipFee, currency) }}
        </p>
      </div>
    </div>
    <a-divider class="!mb-0 !mt-[30px]" />
  </div>
  <div class="px-5">
    <div v-for="item in listProductRegister" :key="item.productId" class="mb-[25px]">
      <r-checkbox-outlined
        class="!flex-col !items-start"
        :title="$t('auth.sign_up.selectRecommend.beauty_starter_kit')"
        :checked="Boolean(productSelect.find((e) => e.productId === item.productId))"
        @checked-change="handleSelectProduct(item)"
      >
        <template #fee>
          <p class="font-550">
            {{ renderCurrency(`${item.currencyPrice?.text}`)?.title }}$ {{ item?.salesAmount }}
          </p>
        </template>
        <template #content>
          <div class="mt-[15px] w-full">
            <div class="mb-[15px] flex justify-between text-base">
              <span>
                {{ item.productEnglishName }}
              </span>
            </div>

            <div class="flex w-full items-center justify-center">
              <img
                v-if="item?.thumbnailUrl"
                :src="addPrefixForImage(item?.thumbnailUrl)"
                alt="products"
                class="h-[162px] w-[213px]"
              />
              <img v-else :src="products" alt="products" />
            </div>
          </div>
        </template>
      </r-checkbox-outlined>
    </div>
  </div>
  <div class="m-5 mb-[25px]">
    <a-divider class="bg-black-50 my-0" />
  </div>
  <div class="mb-[25px] flex justify-between px-5">
    <div class="flex items-center gap-[10px]">
      <span class="font-550 text-base font-semibold">{{ $t('common.total') }}</span>
    </div>
    <span class="text-navy-6 font-625 text-lg"> {{ CURRENCY.HK + '$' }} {{ totalAmount }} </span>
  </div>
  <div class="m-5 mb-[25px]">
    <a-divider class="bg-black-50 my-0" />
  </div>
  <div v-if="!free_fee" class="mb-[30px] px-5">
    <a-divider class="bg-gray-11 my-0 mb-[25px]" />
    <div class="mb-[25px] flex justify-between text-sm">
      <span>Sales Tax</span>
      <span class="font-475">{{ CURRENCY.HK + '$' }} {{ taxProduct }}</span>
    </div>
    <div class="mb-[25px] flex justify-between text-sm">
      <span>Shipping</span>
      <span class="font-475">{{ CURRENCY.HK + '$' }} {{ shippingFee }}</span>
    </div>
    <a-divider class="bg-gray-11 my-0" />
  </div>
</template>
<script setup>
import products from '@/assets/images/products.png'
import Logo from '@assets/svgs/logo-white-small.svg'
import ChevronTop from '@/assets/svgs/chevron-top.svg'
import { addPrefixForImage } from '@/utils/common'
import { CURRENCY, CURRENCY_NEW } from '@/helpers/constant'
import { renderCurrency, formatCurrencyUltra } from '@/utils/currency'
import RCheckboxOutlined from '@/components/common/RCheckboxOutlined.vue'

defineProps({
  listProductRegister: {
    type: Array,
    default: () => []
  },
  productSelect: {
    type: Array,
    default: () => []
  },
  free_fee: {
    type: Boolean,
    default: false
  },
  memberShipFee: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  taxProduct: {
    type: Number,
    default: 0
  },
  shippingFee: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: CURRENCY.HKD
  }
})

const emits = defineEmits(['updateProductSelect'])

const handleSelectProduct = (data) => {
  emits('updateProductSelect', data)
}
</script>
<style lang="scss" scoped>
:deep(.ant-checkbox-checked) {
  .ant-checkbox-inner::after {
    @apply border-1 border-white;
  }
}
</style>
