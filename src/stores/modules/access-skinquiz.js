import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useShowAccessSkinQuiz = defineStore('show-access-skin-quiz', () => {
  const showAccessDenyPopup = ref(false)

  function setShowAccessDenyPopup(value) {
    showAccessDenyPopup.value = value
  }

  return { showAccessDenyPopup, setShowAccessDenyPopup }
})
