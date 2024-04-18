<template>
  <a-tabs class="custom-tabs" v-bind="props" type="card">
    <slot />
  </a-tabs>
</template>

<script setup>
const props = defineProps({
  /** type for tabs */
  type: {
    type: String,
    required: false,
    default: 'card'
  },

  /** class custom for tabs */
  class: {
    type: String,
    default: '',
    required: false
  },

  /** size for tabs */
  size: {
    type: String,
    required: false,
    default: 'default'
  }
})
</script>
