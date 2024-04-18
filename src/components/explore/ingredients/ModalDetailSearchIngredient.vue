<template>
  <a-modal
    v-bind="propsDefault"
    centered
    title="ABOUT INGREDIENTS"
    :width="1200"
    wrap-class-name="full-modal"
    :footer="false"
  >
    <div class="md:pt-25 content-detail overflow-auto pt-[50px]">
      <div class="md:(gap-15) md:(flex-row mx-0) mx-5 mb-[50px] flex flex-col justify-center gap-0">
        <div class="flex flex-col items-center md:hidden">
          <p class="font-550 mb-[25px] w-[233px] text-center text-[28px]">
            {{ dataDetail?.displayTitle }}
          </p>
          <p class="text-gray-14 mb-0 text-sm">{{ dataDetail?.subCopy }}</p>
          <a-divider class="bg-black-50 my-10" />
        </div>
        <img
          :src="addPrefixForImage(dataDetail?.imageUrlMobile || dataDetail?.imageUrl)"
          alt="about-ingredients"
          class="w-[500px] object-cover"
        />

        <div class="md:max-w-[447px]">
          <div class="hidden md:block">
            <p class="font-550 mb-[25px] text-[32px] leading-9">{{ dataDetail?.displayTitle }}</p>
            <p class="text-gray-14 mb-0 text-base leading-[22px]">{{ dataDetail?.subCopy }}</p>
            <a-divider class="bg-black-50 my-[30px]" />
          </div>
          <div v-clean-html="dataDetail?.description" />
        </div>
      </div>
      <div class="border-gray-3 border-b-solid md:m-25 mx-5 my-[50px] border-b"></div>
      <div class="flex justify-center">
        <div class="w-full md:max-w-[1000px]">
          <ShopProducts :data-products="dataDetail?.productEcList" />
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { toRefs } from 'vue'
import { addPrefixForImage } from '@/utils/common'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'

const props = defineProps({
  dataDetail: {
    type: Object,
    default: () => ({})
  }
})

const { dataDetail, ...propsDefault } = toRefs(props)
const vCleanHtml = buildVueDompurifyHTMLDirective()
</script>

<style lang="scss">
.full-modal {
  @apply text-black-50;
  .ant-modal {
    @media (max-width: 700px) {
      max-width: 100%;
      top: 0;
      padding-bottom: 0;
      margin: 0;
      right: 0;
    }
  }
  .ant-modal-content {
    @media (max-width: 700px) {
      display: flex;
      flex-direction: column;
      height: calc(100vh);
    }
  }
  .ant-modal-body {
    flex: 1;
    @apply p-0;
  }

  .ant-modal-header {
    @apply py-[25px];
  }

  .ant-modal-close-icon {
    @apply h-5 w-5 text-xl;

    svg {
      fill: #212121;
    }
  }

  .ant-modal-title {
    @apply font-550 text-center text-lg;
  }

  .content-detail {
    @media (max-width: 700px) {
      max-height: calc(100vh - 150px);
    }
    max-height: calc(100vh - 200px);
  }
}
</style>
