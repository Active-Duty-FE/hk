<template>
  <a-tab-pane class="custom-tab-panel" v-bind="props">
    <slot />
  </a-tab-pane>
</template>

<script setup>
const props = defineProps({
  /** class custom for tab panel */
  class: {
    type: String,
    default: '',
    required: false
  },

  /** tab text */
  tab: {
    type: String,
    required: false,
    default: 'default'
  }
})
</script>
