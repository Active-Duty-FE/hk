<template>
  <a-modal
    v-if="isShowModal"
    v-model:visible="isShowModal"
    centered
    wrap-class-name="maintainPopup"
    :footer="false"
    :mask="false"
    width="100%"
    :z-index="9999"
  >
    <template #closeIcon>
      <CloseIcon class="icon-close opacity-0" />
    </template>
    <img
      src="@/assets/images/maintain/maintain-mobile.jpg"
      class="z-2 h-full w-full object-cover md:hidden"
      alt=""
    />
    <div class="z-2 hidden flex-col items-center justify-center md:flex">
      <WarningOutlined class="md:text-20 text-12 mb-5" />
      <p class="text-title">{{ TEXT_DISPLAY.title }}</p>
      <p class="text-content">{{ TEXT_DISPLAY.content1 }}</p>
      <p class="text-content">{{ TEXT_DISPLAY.content2 }}</p>
    </div>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue'
import { WarningOutlined } from '@ant-design/icons-vue'
import CloseIcon from '@/assets/svgs/close.svg'

const TEXT_DISPLAY = {
  title: 'WEBSITE\nUNDER CONSTRUCTION',
  content1: `We are currently undergoing system maintenance. \n We'll be back shortly.`,
  content2: 'Thank you for your patience!'
}

const isShowModal = ref(import.meta.env.VITE_MAINTAIN_POPUP === 'true')
</script>

<style lang="scss" scoped>
.text {
  &-title {
    @apply md:text-10 leading-base text-6 whitespace-pre-wrap text-center font-bold md:whitespace-nowrap;
  }

  &-content {
    @apply leading-base whitespace-pre-wrap text-center text-base font-light md:text-xl;
  }
}

.icon-close :deep(g) {
  @apply stroke-black-100 md:stroke-white;
}
</style>

<style lang="scss">
.maintainPopup {
  @apply flex items-end md:items-center;

  .ant-modal {
    @apply z-2 m-0 max-w-full;

    &:after {
      @apply bg-red z-1 bg-black-100 absolute bottom-0 left-0 right-0 top-0 bg-opacity-90 backdrop-blur content-[''];
    }
  }

  .ant-modal-content {
    @apply bg-transparent;
  }

  .ant-modal-body {
    @apply flex h-screen items-center justify-center  p-0 text-white md:px-5;
  }
}
</style>
