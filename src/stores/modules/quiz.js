import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useQuizStore = defineStore('quizStore', () => {
  const currentAnswers = ref([])

  function setCurrentAnswers(value) {
    currentAnswers.value = value
  }

  return { currentAnswers, setCurrentAnswers }
})
