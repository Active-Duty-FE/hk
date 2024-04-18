<template>
  <div class="status__wrap">
    <div class="status__round">{{ round }}</div>
    <div class="my-5 flex flex-col gap-1">
      <div v-if="isShowPayment" class="flex flex-col gap-1">
        <AutoshipStatusButton btn-style="style1" text="Payment" @click="onPayment" />
        <AutoshipStatusButton btn-style="style2" text="SKIP" @click="onSkip" />
      </div>

      <div v-else class="flex flex-col items-center justify-center gap-1">
        <AutoshipStatusButton v-if="item.isSkip" btn-style="style2" disable text="Skip" />
        <AutoshipStatusButton v-if="isMissed" btn-style="style3" text="Missed" />
        <div v-if="isComplete || item.hasGift" class="flex flex-col justify-center gap-1">
          <img v-if="isComplete" src="@/assets/svgs/my-page/checked.svg?url" alt="" height="18" />
          <img v-if="item.hasGift" src="@/assets/svgs/my-page/gift.svg?url" alt="" height="18" />
        </div>
        <div v-if="roundGift" class="status__roundGift">{{ roundGift }}</div>
        <div v-if="item.paymentScheduleDate" class="status__date">
          {{ item.paymentScheduleDate }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { AUTOSHIP_STATUS_ENUM } from '@/helpers/enum'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['skip', 'payment'])

const statusPayment = computed(() => props.item?.turningTrainStatus?.code)

const isComplete = computed(() => statusPayment.value === AUTOSHIP_STATUS_ENUM.COMPLETE_PAYMENT)
const isMissed = computed(() => statusPayment.value === AUTOSHIP_STATUS_ENUM.MISS_ORDER)

const isShowPayment = computed(() => {
  const status = [
    AUTOSHIP_STATUS_ENUM.BEFOR_PAYMENT,
    AUTOSHIP_STATUS_ENUM.CANCEL_PAYMENT,
    AUTOSHIP_STATUS_ENUM.MISS_ORDER
  ].includes(statusPayment.value)

  return status && !props.item.isSkip
})

const round = computed(() => {
  const turningTrain = props.item.turningTrain
  if (turningTrain) return `${turningTrain}R`
  return ''
})

const roundGift = computed(() => {
  const round = props.item.roundGift ?? 0
  if (round) return `Gift (${round}/3)`
  return ''
})

const onPayment = () => {
  emit('payment')
}

const onSkip = () => {
  emit('skip')
}
</script>

<style lang="scss" scoped>
.status {
  &__wrap {
    @apply border-b-solid border-1 border-gray-14/50 flex flex-col items-center;
  }

  &__round {
    @apply border-1 border-t-solid border-b-solid border-gray-14/50 bg-gray-6 min-h-10 w-full py-2 text-center;
  }

  &__roundGift {
    @apply text-navy-6 font-550 leading-base text-xs;
  }

  &__date {
    @apply leading-base text-[10px];
  }
}
</style>
