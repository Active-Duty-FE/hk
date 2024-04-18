<template>
  <div>
    <MyPageMenu
      title="Autoship Subscription Management"
      :icon="autoShipSubscribe.subscriptionId ? 'menu' : ''"
      @click="gotoAutoshipManagement"
    />
    <div v-if="autoShipSubscribe.subscriptionId" class="mt-4 grid grid-cols-2 gap-1">
      <AutoshipItem label="Gift Cycle" :value="roundGift" />

      <AutoshipItem label="Benefit">
        <div class="flex items-end">
          <span class="font-550 leading-base text-base">{{ autoShipSubscribe.benefit }}</span>
          <span class="font-475 leading-base text-[10px]">% Discount</span>
        </div>
      </AutoshipItem>

      <AutoshipItem label="Billing Date" :value="autoShipSubscribe.paymentDate" />

      <AutoshipItem label="Autoship Payment">
        <div>
          <span>$</span>
          <span>{{ convertNumber(autoShipSubscribe.totalAmount) }}</span>
        </div>
      </AutoshipItem>
    </div>

    <div v-else class="text__wrap">
      <span class="text__title">{{ TEXT.title }}</span>
      <span class="text__content">{{ TEXT.content }}</span>
      <span class="text__button" @click="onSubscribe">{{ TEXT.button }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import apiService from '@/http/api'
import { AppRoutes } from '@/router/path'
import { useRouter } from 'vue-router'
import { convertNumber } from '@/utils/currency'

const TEXT = {
  title: "Looks like you don't have any Autoship orders set up.",
  content:
    'Subscribe to our convenient Autoship service and \nsay goodbye to order stress and unlock the awesome benefits!',
  button: 'Subscribe Autoship'
}

const router = useRouter()
const autoShipSubscribe = ref({
  subscriptionId: null,
  paymentDate: null,
  roundGift: null,
  totalAmount: null,
  benefit: null
})

const roundGift = computed(() => {
  const round = autoShipSubscribe.value.roundGift || 0
  return `${round}/3`
})

onMounted(() => {
  getAutoShipSubscribe()
})

const gotoAutoshipManagement = () => {
  if (!autoShipSubscribe.value.subscriptionId) return
  router.push({
    name: AppRoutes.myPage.autoshipManagement.name,
    params: { id: autoShipSubscribe.value.roundGift }
  })
}

const getAutoShipSubscribe = async () => {
  const { data, success } = await apiService.myPageService.getAutoShipSubscribe()
  autoShipSubscribe.value = success ? data : {}
}

const onSubscribe = () => {
  router.push('/product-category/skincare')
}
</script>

<style lang="scss" scoped>
.text {
  &__wrap {
    background: rgba(224, 224, 224, 0.2);
    @apply py-7.5 mt-4 flex flex-col items-center justify-center gap-4;
  }

  &__title {
    @apply text-center text-xl font-normal -tracking-[0.28px];
  }

  &__content {
    @apply whitespace-pre-wrap text-center text-sm font-normal -tracking-[0.28px];
  }

  &__button {
    @apply leading-base font-550  w-fit cursor-pointer text-xs underline;
  }
}
</style>
