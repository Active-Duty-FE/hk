<template>
  <div>
    <div class="sticky left-0 w-full bg-white">
      <div class="relative mx-auto max-w-[1240px] px-5">
        <div class="icon-back" @click="onBackNavigator">
          <ArrowLeft v-if="!isHideBackIcon" />
        </div>
        <p class="title">{{ title }}</p>
      </div>
      <a-divider class="!bg-gray-10 !my-0" />
    </div>

    <transition name="fade">
      <div :key="route.name" class="container-layout">
        <router-view />
      </div>
    </transition>
  </div>
</template>
<script setup>
import { computed } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import ArrowLeft from '@assets/svgs/arrow-left.svg'

const route = useRoute()
const router = useRouter()

const title = computed(() => route.meta.title)
const isHideBackIcon = computed(() => route.meta.hideBackIcon)
const backRouter = computed(() => route.meta.backRouter)

const onBackNavigator = () => {
  if (backRouter.value) {
    return router.push({ name: backRouter.value })
  }

  router.go(-1)
}
</script>

<style lang="scss" scoped>
.title {
  @apply font-550 leading-base h-15 mb-0 flex items-center justify-center text-lg;
}

.icon-back {
  @apply absolute left-5 top-1/2 -ml-4 -mt-[2px] inline-flex -translate-y-1/2 cursor-pointer items-center justify-center p-4;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.container-layout {
  @apply pt-12.5 mx-auto flex   max-w-[1240px]  flex-col overflow-y-auto px-5;
  max-height: calc(100dvh - 65px);
}
</style>
