<template>
  <p class="font-475 mb-[37px] text-base">Autoship subscription has been completed.</p>

  <p class="mb-15 text-xs">
    If the last round order is not in the state of delivery order, the order and payment will be
    cancelled.
  </p>

  <div class="fixed bottom-10 w-[calc(100%-40px)] max-w-[1200px]">
    <div class="flex w-full gap-[5px]">
      <r-button
        title="Go to Main"
        class="!text-navy-6 w-full"
        @click="transitPage(AppRoutes.home.path)"
      />
      <r-button
        type="primary"
        title="Autoship Order History"
        class="!bg-navy-6 w-full"
        @click="transitPage(AppRoutes.myPage.orderHistory.path)"
      />
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'

const router = useRouter()

const transitPage = (path) => {
  router.push(path)
}
</script>
