<template>
  <div>
    <div class="grid grid-cols-4 gap-y-4">
      <AutoshipStatusItem
        v-for="(item, index) in items"
        :key="index"
        :item="item"
        @skip="onSkip(item)"
        @payment="onPayment(item)"
      />
    </div>

    <ul class="mb-0 mt-5 flex flex-col gap-2.5 pl-4">
      <li v-for="(text, index) in TEXT_NOTE" :key="index" class="text__note">{{ text }}</li>
    </ul>
  </div>
</template>

<script setup>
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useAlertConfirm } from '@/composables/alert'
import { AppRoutes } from '@/router/path'
import { useRouter } from 'vue-router'
import { useNotification } from '@/composables/notification'

const { showGlobalLoading } = useGlobalLoadingStore()
const router = useRouter()
const { showNotification } = useNotification()

const emit = defineEmits(['skip'])
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  subscriptionId: {
    type: Number,
    default: 0
  }
})

const TEXT_NOTE = [
  'Skip option is not available on the day of payment (PDT based).',
  'If you skip or miss the payment, the free gift cycle will reset back to 0.'
]

const onSkip = async ({ turningTrain }) => {
  const confirm = await useAlertConfirm({
    content: 'Do you want to skip this round?',
    okText: 'Ok',
    cancelText: 'Cancel'
  })

  if (!confirm) return

  showGlobalLoading(true)

  const { success, message } = await apiService.myPageService.skipTurningTrain({
    subscriptionId: props.subscriptionId,
    turningTrain
  })

  showNotification({
    type: success ? 'success' : 'error',
    message: success ? 'Round has been skipped' : message
  })

  showGlobalLoading(false)
  emit('skip')
}

const onPayment = (item) => {
  router.push({
    name: AppRoutes.autoShip.autoShipCheckout.name,
    params: {
      identification: props.subscriptionId
    },
    query: {
      turningTrain: item.turningTrain
    }
  })
}
</script>

<style lang="scss" scoped>
.text__note {
  @apply leading-base text-xs;
}
</style>
