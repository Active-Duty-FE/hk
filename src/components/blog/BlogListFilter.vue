<template>
  <a-drawer
    v-model:visible="isShowDrawer"
    title="Filter"
    placement="left"
    class="blogListFilterDrawer"
    :width="widthDrawer"
  >
    <template #closeIcon>
      <CloseOutlined class="!text-gray-10 !flex !text-xl" />
    </template>
    <a-divider class="bg-gray-10 !my-0 !mb-5" />
    <RCheckboxGroup
      v-slot="{ label }"
      v-model:value="state.dataFilter"
      :options-custom="state.blogFilter"
      class="!flex flex-col gap-5"
    >
      <span class="pl-1 text-base sm:text-lg">{{ label }}</span>
    </RCheckboxGroup>

    <template #footer>
      <div class="text-gray-10 font-550 flex justify-between">
        <span class="cursor-pointer text-sm md:text-base" @click="onClear">Clear all</span>
        <span class="cursor-pointer text-base underline md:text-lg" @click="onFilter">
          Show Results
        </span>
      </div>
    </template>
  </a-drawer>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { useVModel } from '@vueuse/core'
import { CloseOutlined } from '@ant-design/icons-vue'
import useResize from '@/composables/resize'
import { useQuery } from 'vue-query'
import apiService from '@/http/api'

const emits = defineEmits(['close', 'update:modelValue', 'showResult'])
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const isShowDrawer = useVModel(props, 'modelValue', emits)

const windowWidth = useResize()

const state = reactive({
  activeKey: [],
  dataFilter: [],
  blogFilter: []
})

useQuery({
  queryKey: ['get-content-category'],
  queryFn: () => apiService.exploreService.getContentCategory(),
  onSuccess: (response) => {
    state.blogFilter = response.data.map((item) => ({
      label: item.displayTitle,
      value: item.id
    }))
  }
})

const widthDrawer = computed(() => (windowWidth.value > 900 ? 649 : '85vw'))

const onClear = () => {
  state.dataFilter = []
  isShowDrawer.value = false
  emits('showResult', state.dataFilter)
}

const onFilter = () => {
  isShowDrawer.value = false
  emits('showResult', state.dataFilter)
}
</script>

<style lang="scss" scoped>
.collapse-panel-custom {
  @apply bg-white;

  :deep(.ant-collapse-header) {
    @apply border-b-solid border-1 border-gray-10 flex items-center py-5 pr-0 text-base sm:text-lg;
    padding-left: 20px !important;
  }
}

:deep(.ant-collapse-content-box) {
  padding-top: 25px !important;
  padding-bottom: 25px;
  @apply px-5;
}

:deep(.ant-checkbox) {
  @apply mb-1;
}
</style>

<style lang="scss">
.blogListFilterDrawer {
  .ant-drawer-header,
  .ant-drawer-body,
  .ant-drawer-footer {
    @apply px-7.5;
  }

  .ant-drawer-header,
  .ant-drawer-footer {
    @apply py-7.5 border-none;
  }

  .ant-drawer-header-title {
    @apply flex-row-reverse;
  }

  .ant-drawer-footer {
    @apply flex-row-reverse;
  }

  .ant-drawer-title {
    @apply font-550 text-gray-10 text-center text-[30px] leading-[30px];
  }

  .ant-drawer-close {
    @apply m-0 p-0;
  }
}
</style>
