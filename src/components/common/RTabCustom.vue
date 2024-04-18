<template>
  <div class="tabs">
    <div
      v-for="tab in tabs"
      :key="tab.value"
      class="tab__item"
      :class="{ active: currentTab === tab.value }"
      @click="onChange(tab.value)"
    >
      {{ tab.label }}
    </div>
  </div>
</template>

<script setup>
import { useVModel } from '@vueuse/core'

const props = defineProps({
  tabs: {
    type: Array,
    default: () => []
  },
  modelValue: {
    type: [String, Number],
    default: 0
  }
})

const emits = defineEmits(['update:modelValue', 'change'])

const currentTab = useVModel(props, 'modelValue', emits)

const onChange = (tab) => {
  if (currentTab.value === tab) return
  currentTab.value = tab
  emits('change', tab)
}
</script>

<style lang="scss" scoped>
.tabs {
  box-shadow: inset 0 -1px #063451;
  @apply flex w-full justify-between;
}

.tab {
  &__item {
    @apply font-475 border-1 border-gray-13 text-gray-13 flex h-[45px] w-full cursor-pointer
    items-center justify-center border-solid border-b-transparent border-r-transparent
    px-1 text-center text-sm transition-all;

    &.active {
      @apply text-navy-6 border-navy-6 border-b-white;
    }

    &:first-child {
      @apply ml-5;
    }

    &:last-child {
      @apply mr-5;
    }
  }
}

.tab__item + .tab__item {
  margin-left: -1px;
}

.active ~ .tab__item {
  @apply border-r-gray-13 border-l-transparent;
}
</style>
