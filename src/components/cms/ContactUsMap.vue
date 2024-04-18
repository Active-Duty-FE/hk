<script setup>
import { onMounted, watch } from 'vue'

const MAP_ZOOM_INDEX = 16

const props = defineProps({
  lat: {
    type: Number,
    default: 0
  },
  long: {
    type: Number,
    default: 0
  }
})

defineOptions({
  inheritAttrs: true
})

const generateMap = () => {
  const iframe = document.querySelector('#contact-us-id')

  iframe.src = `https://maps.google.com/maps?q=${props.lat},${props.long}&hl=es;&output=embed&z=${MAP_ZOOM_INDEX}`
}
onMounted(() => {
  generateMap()
})
watch(
  [() => props.lat, () => props.long],
  ([lat, long]) => {
    if (lat && long) {
      generateMap()
    }
  },
  {
    deep: true
  }
)
</script>
<template>
  <iframe id="contact-us-id" title="Contact Us Map"></iframe>
</template>
