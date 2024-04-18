<template>
  <a-collapse v-model:activeKey="activeKey" :bordered="false">
    <a-collapse-panel
      v-for="(item, index) in items"
      :key="index"
      :header="item.item"
      class="collapse-panel-custom"
      :show-arrow="false"
      :class="[activeKey.includes(String(index)) ? '!border-black-50' : '']"
    >
      <template #extra>
        <div class="mr-[8px]">
          <div class="icon absolute h-[15px] w-[1px] rotate-90"></div>
          <div
            :class="[
              { open: activeKey.includes(String(index)) },
              'icon h-[15px] w-[1px] duration-500'
            ]"
          ></div>
        </div>
      </template>
      <div v-clean-html="item.data" class="my-10 whitespace-pre-wrap px-5" />
    </a-collapse-panel>
  </a-collapse>
</template>
<script setup>
import { computed, ref } from 'vue'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { ProductDescriptionTabEnum } from '@/helpers/enum'

const vCleanHtml = buildVueDompurifyHTMLDirective()

const props = defineProps({
  productDetail: {
    type: Object,
    default: () => ({})
  }
})

const items = computed(() => {
  const result = []
  if (props.productDetail.howToYn) {
    result.push({
      item: ProductDescriptionTabEnum.HOW_TO,
      data: props.productDetail.howTo?.mobileContent
    })
  }

  if (props.productDetail.ingredientYn) {
    result.push({
      item: ProductDescriptionTabEnum.INGREDIENTS,
      data: props.productDetail.ingredient?.mobileContent
    })
  }

  if (props.productDetail.sustainabilityYn) {
    result.push({
      item: ProductDescriptionTabEnum.SUSTAINABILITY,
      data: props.productDetail.sustainability?.mobileContent
    })
  }
  return result
})

const activeKey = ref(['0'])
</script>

<style scoped lang="scss">
.ant-collapse {
  @apply border-t-solid border-t-1 border-t-gray-10;
}

.collapse-panel-custom {
  @apply bg-white;
  :deep(.ant-collapse-header) {
    @apply border-b-solid border-1 border-color-black-50  flex items-center p-5 text-base text-lg;
    padding-left: 20px !important;
  }

  :deep(.ant-collapse-content) {
    //@apply px-5;
  }

  :deep(.ant-collapse-content-box) {
    padding: 0 !important;
  }
}

.icon {
  background: black;
}

.open {
  transform: rotate(90deg) !important;
}
</style>
