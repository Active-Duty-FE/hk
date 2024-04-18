<template>
  <a-upload class="custom-upload" v-bind="props" :before-upload="beforeUpload">
    <slot />
  </a-upload>
</template>
<script setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
    required: false
  },
  accept: {
    type: String,
    default: '*',
    required: false
  },
  directory: {
    type: Boolean,
    default: false,
    required: false
  },
  multiple: {
    type: Boolean,
    default: false,
    required: false
  },
  name: {
    type: String,
    default: 'RFile',
    required: false
  },
  showUploadList: {
    type: Boolean,
    default: false,
    required: false
  },
  maxCount: {
    type: Number,
    default: 1,
    required: false
  }
})

const beforeUpload = (event) => {
  // disable default upload behavior
  return false
}
</script>
