<template>
  <RDrawerBottom v-model="visible" title="Autoship Status" height="90%">
    <AutoshipStatus :items="items" :subscription-id="subscriptionId" @skip="emit('skip')" />
  </RDrawerBottom>
</template>

<script setup>
import { useVModel } from '@vueuse/core'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array,
    default: () => []
  },
  subscriptionId: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:visible', 'skip'])

const visible = useVModel(props, 'visible', emit)
</script>
