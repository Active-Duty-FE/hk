<script setup>
import { useElementVisibility } from '@vueuse/core'
import { ref, watch } from 'vue'

defineProps({
  direction: {
    type: String,
    default: 'left'
  }
})

const transitionItem = ref()
const shown = ref(false)
const targetVisible = useElementVisibility(transitionItem)

watch(targetVisible, (val) => {
  shown.value = val
})
</script>

<template>
  <div ref="transitionItem" v-bind="$attrs">
    <Transition :name="'slide-' + direction" mode="in-out" :duration="800">
      <slot v-if="shown" />
    </Transition>
  </div>
</template>
