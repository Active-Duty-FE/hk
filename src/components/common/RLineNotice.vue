<template>
  <div class="flex items-start gap-2">
    <div class="-mt-1.5 w-max">
      <Point />
    </div>
    <div class="text-xs" :class="classContent">{{ content }}</div>
    <slot />
  </div>
</template>
<script setup>
import Point from '@/assets/svgs/point.svg'
defineProps({
  content: {
    type: String,
    default: ''
  },
  classContent: {
    type: String,
    default: ''
  }
})
</script>
