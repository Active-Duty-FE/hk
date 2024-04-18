<template>
  <div class="hidden md:block">
    <div class="flex gap-[53px]">
      <div v-for="item in FOOTER_MENU" :key="item.title">
        <p class="mb-[30px] w-max text-lg font-semibold uppercase leading-normal">
          {{ item.title }}
        </p>
        <p
          v-for="child in item.children"
          :key="child.title"
          class="mb-5 w-max cursor-pointer text-base font-normal leading-normal"
          @click="handleTransitMenuFooter(child, router)"
        >
          {{ child.title }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { FOOTER_MENU } from '@helpers/footer'
import { handleTransitMenuFooter } from '@/utils/footer'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
