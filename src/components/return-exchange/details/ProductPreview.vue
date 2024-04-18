<script setup>
import { defineProps, onMounted, onUnmounted, reactive, ref } from 'vue'

defineProps({
  images: {
    type: Array,
    required: true
  }
})

const containerRef = ref(null)
const draggingState = reactive({
  isDragging: false,
  startX: 0,
  scrollLeft: 0
})

const handleMouseDown = (event) => {
  draggingState.isDragging = true
  draggingState.startX = event.pageX - containerRef.value.offsetLeft
  draggingState.scrollLeft = containerRef.value.scrollLeft
}

const handleMouseMove = (event) => {
  if (!draggingState.isDragging) return
  event.preventDefault()
  const x = event.pageX - containerRef.value.offsetLeft
  const walk = (x - draggingState.startX) * 2
  requestAnimationFrame(() => {
    containerRef.value.scrollLeft = draggingState.scrollLeft - walk
  })
}

const handleMouseUp = () => {
  draggingState.isDragging = false
}

onMounted(() => {
  containerRef.value.addEventListener('mousedown', handleMouseDown)
  containerRef.value.addEventListener('mousemove', handleMouseMove)
  containerRef.value.addEventListener('mouseup', handleMouseUp)
  containerRef.value.addEventListener('mouseleave', handleMouseUp)
})

onUnmounted(() => {
  containerRef.value.removeEventListener('mousedown', handleMouseDown)
  containerRef.value.removeEventListener('mousemove', handleMouseMove)
  containerRef.value.removeEventListener('mouseup', handleMouseUp)
  containerRef.value.removeEventListener('mouseleave', handleMouseUp)
})
</script>

<template>
  <div
    ref="containerRef"
    class="flex gap-2 overflow-x-auto"
    :class="{ ' cursor-grabbing': draggingState.isDragging }"
  >
    <div v-for="(image, index) in images" :key="index">
      <img class="rounded-0.75 aspect-square w-[105px]" :src="image" :alt="'image preview'" />
    </div>
  </div>
</template>

<style scoped>
.overflow-x-auto::-webkit-scrollbar {
  display: none;
}
</style>
