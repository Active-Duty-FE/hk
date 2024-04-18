<script setup>
defineProps({
  algin: {
    type: String,
    default: 'horizontal'
  }
})
</script>
<template>
  <div
    class="text-gray-1 font-400 border-blue flex justify-between border text-[14px]"
    :class="{ ' flex-col': algin == 'vertical' }"
  >
    <div class="w-fit">
      <slot name="label"></slot>
    </div>
    <div class="font-475 truncate">
      <slot name="value"></slot>
    </div>
  </div>
</template>
