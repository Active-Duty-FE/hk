<template>
  <a-dropdown :trigger="['click']">
    <slot />
    <template #overlay>
      <a-menu v-if="!overlaySlot">
        <a-menu-item v-for="item in options" :key="item.value">
          <span @click="emits('click', item.value)">{{ item.label }}</span>
        </a-menu-item>
      </a-menu>

      <slot v-else name="overlay" />
    </template>
  </a-dropdown>
</template>

<script setup>
defineProps({
  options: {
    type: Array,
    default: () => []
  }
})
const emits = defineEmits(['click'])
const slots = defineSlots()

const overlaySlot = slots.overlay
</script>
