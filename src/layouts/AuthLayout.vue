<template>
  <div class="container-fluid lg:(bg-gray-6) m-auto min-h-screen">
    <div class="flex flex-col items-center justify-center">
      <div class="flex w-full items-center justify-center">
        <div class="h-screen w-full">
          <app-mobile-header class="md:hidden" />
          <div
            class="lg:(bg-gray-6) h-full lg:h-auto lg:!pt-0"
            :class="{ '!pt-[70px]': isHideSubNavigation }"
          >
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { NAVIGATION_BLACK_LISTS } from '@helpers/constant'

const route = useRoute()

const isHideSubNavigation = computed(() => NAVIGATION_BLACK_LISTS.includes(route.name))
</script>
