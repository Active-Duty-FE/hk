<template>
  <a-input-password
    class="custom-pass-input"
    v-bind="props"
    @input="$emit('update:value', $event.target.value)"
  />
</template>
<script setup>
const props = defineProps({
  value: {
    type: String,
    default: '',
    required: true
  },
  placeholder: {
    type: String,
    default: ''
  },
  class: {
    type: String,
    default: 'h-12 border-gray-5'
  },
  maxlength: {
    type: Number,
    default: 2000
  },
  type: {
    type: String,
    default: 'text'
  },
  autoComplete: {
    type: String,
    default: 'new-password'
  }
})
defineEmits(['update:value'])
</script>
