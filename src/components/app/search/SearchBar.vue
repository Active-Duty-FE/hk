<template>
  <div
    class="search-box border-navy-deep border-t-1 fixed left-0 z-[21] w-full border-x-0 border-y-0 border-solid"
    :class="isShowBannerWelcome ? 'top-[82px] md:top-[95px]' : 'top-[50px]'"
  >
    <a-input
      v-model:value="searchState.keySearch"
      placeholder="Search"
      autofocus
      @press-enter="gotoSearchPage"
    >
      <template #suffix>
        <span class="cursor-pointer" @click="gotoSearchPage">
          <SearchIcon :class="{ 'disable-action': !searchState.keySearch }" />
        </span>
      </template>
    </a-input>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import SearchIcon from '@assets/svgs/search.svg'

import { useMemberBannerStore } from '@/stores/modules/member-banner'

const { isShowBannerWelcome } = useMemberBannerStore()

const emits = defineEmits(['onSearch'])
const searchState = reactive({
  keySearch: ''
})

const gotoSearchPage = (event) => {
  if (event.target.value || searchState.keySearch) emits('onSearch', searchState.keySearch)
}
</script>
<style lang="scss" scoped>
.search-box {
  box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0 5px 15px -5px rgba(0, 0, 0, 0.1);

  :deep(.ant-input-affix-wrapper) {
    @apply border-none py-[4px] shadow-none;

    &:focus {
      @apply shadow-none;
    }
  }

  :deep(.ant-input-suffix) {
    @apply mt-1 cursor-pointer;
  }

  :deep(.disable-action) {
    path {
      stroke: #e0e0e0 !important;
    }
  }
}
</style>
