import { onMounted, ref } from 'vue'

export default function useResize() {
  const windowWidth = ref(window.innerWidth)

  const handleResize = () => {
    windowWidth.value = window.innerWidth
  }

  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })
  return windowWidth
}
