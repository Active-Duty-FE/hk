<template>
  <div @click="transitToOrderHistory">
    <MyPageMenu title="Order History" icon="menu" />

    <div class="mt-4 grid grid-cols-5 py-4">
      <div v-for="menu in menus" :key="menu.value">
        <div
          class="grid cursor-pointer gap-1 px-3"
          @click.stop="transitToReturnExchange(menu.value)"
        >
          <span class="order-count">{{ information[menu.value] }}</span>
          <span class="order-label"> {{ menu.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { AppRoutes } from '@/router/path'
import { useRouter } from 'vue-router'

const router = useRouter()
defineProps({
  information: {
    type: Object,
    default: () => ({
      orderComplete: 0,
      inProgress: 3,
      onRoute: 2,
      delivered: 5,
      returnExchange: 4
    })
  }
})

const menus = [
  {
    label: 'Order Complete',
    value: 'orderComplete'
  },
  {
    label: 'In Progress',
    value: 'inProgress'
  },
  {
    label: 'On Route',
    value: 'onRoute'
  },
  {
    label: 'Delivered',
    value: 'delivered'
  },
  {
    label: 'Return/\nExchange',
    value: 'returnExchange'
  }
]

const transitToOrderHistory = () => {
  router.push(AppRoutes.myPage.orderHistory)
}

const transitToReturnExchange = (value) => {
  if (value === 'returnExchange') {
    router.push(AppRoutes.returnExchange.returnHistory)
  } else transitToOrderHistory()
}
</script>

<style lang="scss" scoped>
.order {
  &-count {
    @apply font-475 leading-base text-center text-lg;
  }

  &-label {
    @apply leading-base flex items-center justify-center break-words text-center text-[10px] -tracking-[0.3px];
  }
}
</style>
