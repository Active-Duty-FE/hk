<template>
  <a-collapse v-model:activeKey="activeKey" :bordered="false" class="!mb-[50px] md:!mb-0 md:hidden">
    <a-collapse-panel
      v-for="(item, index) in FOOTER_MENU"
      :key="index"
      :header="item.title"
      class="collapse-panel-custom"
      :show-arrow="false"
    >
      <template #extra>
        <div class="mr-[8px]">
          <div class="absolute h-[15px] w-[1px] rotate-90 bg-white"></div>
          <div
            :class="[
              { open: activeKey.includes(String(index)) },
              'h-[15px] w-[1px] bg-white duration-500'
            ]"
          ></div>
        </div>
      </template>
      <p
        v-for="child in item.children"
        :key="child.title"
        class="cursor-pointer p-0 text-white"
        @click="handleTransitMenuFooter(child, router)"
      >
        {{ child.title }}
      </p>
    </a-collapse-panel>
  </a-collapse>
</template>
<script setup>
import { ref } from 'vue'
import { FOOTER_MENU } from '@helpers/footer'
import { handleTransitMenuFooter } from '@/utils/footer'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeKey = ref([])
</script>
<style scoped lang="scss">
.collapse-panel-custom {
  @apply bg-navy-deep;

  :deep(.ant-collapse-header) {
    @apply flex items-center py-[30px] pr-0 text-base text-white;
    padding-left: 0px !important;
  }
}

.open {
  transform: rotate(90deg) !important;
}
</style>
