import { onMounted, reactive } from 'vue'

export function useReadMore(element, height) {
  const state = reactive({
    hasShowMore: false,
    isShowMore: true
  })

  onMounted(() => {
    if (!element.value) return state

    console.log(element.value.offsetHeight)

    if (element.value.offsetHeight > height) {
      state.hasShowMore = true
      state.isShowMore = false
    }
  })

  return state
}
