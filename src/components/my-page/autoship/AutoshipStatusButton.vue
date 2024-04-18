<template>
  <div class="autoshipButton" :class="[btnStyle, { disable }]" @click="$emit('click')">
    {{ text }}
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: ''
  },
  disable: {
    type: Boolean,
    default: false
  },
  btnStyle: {
    type: String,
    default: 'style1'
  }
})

defineEmits(['click'])
</script>

<style lang="scss" scoped>
.autoshipButton {
  @apply rounded-4 font-550 h-4.5 min-w-15 flex w-fit items-center justify-center px-1.5 text-[10px] leading-none;
  @apply border-1 border-solid border-transparent;

  &.style1 {
    @apply bg-navy-6 border-navy-6 cursor-pointer text-white;
  }

  &.style2 {
    @apply border-navy-6 text-navy-6 cursor-pointer;

    &.disable {
      @apply border-gray-17 text-navy-2 cursor-not-allowed;
    }
  }

  &.style3 {
    @apply border-gray-17 bg-gray-17 text-navy-2;
  }
}
</style>
