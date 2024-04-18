<template>
  <r-modal-confirm :visible="visible" :width="400" :mask-closable="true" :footer="false">
    <template #extraTitle>
      <p class="text-navy-deep text-base font-medium">Alarm</p>
    </template>
    <template #extraDescription>
      <div>{{ mainContent }}</div>
      <a-divider />
      <div class="text-navy-deep cursor-pointer text-base font-medium" @click="onCancel">check</div>
    </template>
  </r-modal-confirm>
</template>
<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  onCancel: {
    type: Function,
    default: () => {}
  },
  mainContent: {
    type: String,
    default: ''
  }
})
</script>
