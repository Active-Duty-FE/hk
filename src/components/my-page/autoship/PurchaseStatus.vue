<template>
  <div class="grid grid-cols-3">
    <div class="status__col">
      <span class="status__title">Round</span>
      <span class="status__value">{{ info?.turningTrain }}</span>
    </div>
    <div class="status__col">
      <span class="status__title">Accumulated Discount Amount</span>
      <div class="status__value gap-1">
        <span class="font-475 leading-base text-xs">$</span>
        <span>{{ info?.discountAmount }}</span>
      </div>
    </div>
    <div class="status__col">
      <span class="status__title">Skip</span>
      <span class="status__value">{{ info?.skipCount }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  info: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style lang="scss" scoped>
.status {
  &__col {
    @apply relative flex flex-col items-center gap-2.5;

    &:not(:last-child)::after {
      @apply h-7.5 bg-gray-14 absolute right-0 top-1/2 w-[1px] -translate-y-1/2 content-[''];
    }
  }

  &__title {
    @apply leading-base min-h-7.5 flex items-center justify-center text-center text-xs;
  }

  &__value {
    @apply leading-4.5 inline-flex items-center text-lg font-bold;
  }
}
</style>
