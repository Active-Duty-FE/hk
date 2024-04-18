<script setup>
defineProps({
  title: {
    default: undefined,
    type: String,
    required: false
  }
})
</script>
<template>
  <div class="text-navy-6 font-550 text-7 px-5 py-10">{{ title }}</div>
</template>
