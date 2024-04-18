<template>
  <div
    class="border-y-1 border-y-solid border-color-black-50 text-black-50 flex w-full items-center justify-between"
  >
    <div
      v-if="showFilter"
      class="font-550 sm:(text-lg justify-start) border-r-solid border-1 border-color-black-50 sm:(py-5 border-none) relative flex w-1/2 cursor-pointer items-center justify-center gap-[5px] py-[13px] text-base"
      @click="openFilter"
    >
      <span> Filter </span>
      <FiltersIcon />
    </div>
    <div class="w-[200px]" :class="{ 'sort-popup !ml-auto': !showFilter }">
      <a-dropdown :trigger="['click']">
        <div
          class="font-550 flex cursor-pointer items-center gap-[5px] py-5 text-base sm:text-lg"
          :class="{ 'justify-end': !showFilter, 'justify-center': showFilter }"
          @click.prevent
        >
          <span>Sort</span>
          <DropDownIcon />
        </div>
        <template #overlay>
          <a-menu>
            <a-menu-item
              v-for="item in SORT_OPTIONS"
              :key="item.value"
              class="text-center"
              :class="currentSort === item.value && 'bg-[#f5f5f5]'"
              @click="applyFilter({ sort: item.value })"
            >
              <span>{{ item.label }}</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>
<script setup>
import FiltersIcon from '@/assets/svgs/filters.svg'
import { SORT_OPTIONS } from '@/helpers/constant'
import DropDownIcon from '@/assets/svgs/dropdown.svg'

defineProps({
  showFilter: {
    type: Boolean,
    default: true
  },
  currentSort: {
    type: String,
    default: null
  }
})

const emitEvents = defineEmits(['applyFilter', 'open'])

const openFilter = () => emitEvents('open', true)
const onClose = () => emitEvents('open', false)

const applyFilter = (data) => {
  onClose()
  emitEvents('applyFilter', data)
}
</script>
<style scoped lang="scss">
.collapse-panel-custom {
  @apply bg-white;

  :deep(.ant-collapse-header) {
    @apply border-b-solid border-1 border-color-black-50 flex items-center py-5 pr-0 text-base sm:text-lg;
    padding-left: 20px !important;
  }
}

.icon {
  background: black;
}

.open {
  transform: rotate(90deg) !important;
}

.sort-popup {
  @apply sm:(w-[200px]) w-full md:w-[200px];
}
</style>
