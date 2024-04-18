<template>
  <label class="text-black-50 font-475 !text-base !leading-[22px]" :class="classTitle">{{
    title
  }}</label>
  <span v-if="required" class="text-red-1000" :class="classRequired">*</span>
  <label class="text-gray-2 font-350 pl-1 !text-xs" :class="classTextHelper">{{
    textHelper
  }}</label>
</template>
<script setup>
defineProps({
  title: {
    type: String,
    default: '',
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  classTitle: {
    type: String,
    default: ''
  },
  classRequired: {
    type: String,
    default: ''
  },
  classTextHelper: {
    type: String,
    default: ''
  },
  textHelper: {
    type: String,
    default: ''
  }
})
</script>
