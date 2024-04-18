<template>
  <div class="step__wrap">
    <span
      v-for="step in totalStep"
      :key="step"
      class="step__item"
      :class="{ 'step__item-active': step === currentValue }"
      @click="canClick && (currentValue = step)"
    >
      {{ step }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1
  },
  totalStep: {
    type: Number,
    default: 1
  },
  canClick: {
    type: Boolean,
    default: false,
    required: false
  }
})

const emits = defineEmits(['update:modelValue'])

const currentValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  }
})
</script>

<style lang="scss" scoped>
.step {
  &__wrap {
    @apply flex w-fit gap-[9px];
  }

  &__item {
    font-family: sans-serif;
    @apply border-1 border-gray-4 text-gray-4 relative inline-flex
    h-[18px] w-[18px] items-center justify-center rounded-full border-solid
    bg-white text-[10px] font-semibold leading-[18px];

    &:not(:last-child):before {
      @apply bg-gray-4 absolute left-full top-1/2 ml-[1px] h-[1px] w-[9px];
      content: '';
    }

    &-active {
      @apply border-black-50 bg-black-50 text-white;
    }
  }
}
</style>
