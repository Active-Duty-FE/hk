<template>
  <div class="container mx-auto mb-[155px] mt-[90px] hidden md:block">
    <div class="h-quiz-desktop flex">
      <div class="bg-navy-deep w-1/2 text-center">
        <QWelcome v-if="!pageState.isStartQuiz" @start-quiz="handleStartQuiz" />
        <div
          v-if="pageState.stepInfo && pageState.currentStep && pageState.currentStep <= 4"
          class="h-full"
        >
          <QStep
            :step-info="pageState.stepInfo"
            :current-step="pageState.currentStep"
            @change-step="handleChangeStep"
          />
        </div>
        <QEmailCollect v-if="pageState.currentStep === 5" @on-result="handleSkip" />
        <QRitualResult
          v-if="pageState.currentStep === 6"
          :result-product="pageState.resultProduct"
          @restart="handleRestartQuiz"
        />
      </div>
      <div class="bg-intro-content w-1/2" :style="backgroundImageQuiz()"></div>
    </div>
  </div>
  <div class="welcome-quiz block md:hidden">
    <div class="bg-navy-deep h-full text-center">
      <QWelcome v-if="!pageState.isStartQuiz" @start-quiz="handleStartQuiz" />
      <div
        v-if="pageState.stepInfo && pageState.currentStep && pageState.currentStep <= 4"
        class="h-full"
      >
        <QStep
          :step-info="pageState.stepInfo"
          :current-step="pageState.currentStep"
          @change-step="handleChangeStep"
        />
      </div>
      <QEmailCollect v-if="pageState.currentStep === 5" @on-result="handleSkip" />
      <QRitualResult
        v-if="pageState.currentStep === 6"
        :result-product="pageState.resultProduct"
        @restart="handleRestartQuiz"
      />
    </div>
  </div>
</template>
<script setup>
import { onBeforeMount, onMounted, reactive, watch } from 'vue'
import { QUIZ_ICONS } from '@/helpers/quiz'
import ImageIntro from '@/assets/images/quiz/intro.png'
import ImageStepOne from '@/assets/images/quiz/step-1.webp'
import ImageStepTwo from '@/assets/images/quiz/step-2.webp'
import ImageStepThree from '@/assets/images/quiz/step-3.webp'
import ImageStepFour from '@/assets/images/quiz/step-4.webp'
import ImageStepLast from '@/assets/images/quiz/last.webp'
import { useQuizStore } from '@/stores/modules/quiz'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import apiService from '@/http/api'
import { storeToRefs } from 'pinia'
import { useMutation } from 'vue-query'
import storage from '@/utils/storage'
import { STORAGE_STEP_SKIN_QUIZ, STORAGE_BACK_SKIN_QUIZ } from '@/helpers/constant'

const quizStore = useQuizStore()
const currentAuthUserStore = useAuthUserStore()
const loadingStore = useGlobalLoadingStore()
const { setCurrentAnswers } = quizStore
const { currentAnswers } = storeToRefs(quizStore)
const { currentAuthUser } = storeToRefs(currentAuthUserStore)
const { showGlobalLoading } = loadingStore

const pageState = reactive({
  isStartQuiz: false,
  currentStep: 0,
  stepInfo: undefined,
  imageQuizContent: ImageIntro,
  questionLists: [],
  resultProduct: undefined
})

const showQuizByCurrentStep = (val) => (val === 0 ? [] : handleGetQuizItems(val))

const handleGetQuizItems = (val) => {
  const items = pageState.questionLists[val - 1]
  const questData = {
    questionId: items.questionId,
    type: items.type,
    title: items.content,
    subTitle: '',
    steps: items.answerResponses.map((el, index) => ({
      icon: findIconForQuest(val, index),
      title: el.title,
      content: el.content,
      answerId: el.answerId,
      maxValue: el.maxValue,
      minValue: el.minValue
    }))
  }

  return questData
}

const findIconForQuest = (step, index) => {
  if (step === 2) {
    return QUIZ_ICONS[step * step + index]
  } else {
    return QUIZ_ICONS[step * step + index - 1]
  }
}

const handleStartQuiz = () => {
  pageState.currentStep = 1
  pageState.isStartQuiz = true
}

const handleChangeStep = (isNext) => {
  if (!isNext) {
    pageState.currentStep -= 1
    if (pageState.currentStep === 0) {
      pageState.isStartQuiz = false
      setCurrentAnswers([])
    }
  } else {
    pageState.currentStep += 1
  }
}

const { mutate: handleSaveQuiz } = useMutation(
  async (payload) => {
    const response = await apiService.skinQuizService.saveAnswer(payload)
    return response
  },
  {
    onSettled: (data, error) => {
      showGlobalLoading(false)
      if (error) return
      handleGetListProductByQuiz({ userSkinQuizTestId: data?.data?.skinQuizUserTestId })
    }
  }
)

const { mutate: handleGetListProductByQuiz } = useMutation(
  async (payload) => {
    const response = await apiService.skinQuizService.getSetProduct(payload)
    return response
  },
  {
    onSettled: (data, error) => {
      showGlobalLoading(false)
      if (error) return
      pageState.resultProduct = data?.data
      pageState.currentStep = 6
    }
  }
)

const handleSkip = (userEmail = null) => {
  let payload = {
    listAnswerQuestion: mappingAnswer()
  }
  if (userEmail) {
    payload = {
      ...payload,
      userEmail
    }
  }

  const userId = currentAuthUser?.value?.userSeqNo || null
  const userEmailData = currentAuthUser?.value?.email || null

  if (userId) {
    payload = {
      ...payload,
      userId
    }

    if (userEmailData) {
      payload = {
        ...payload,
        userEmail: payload?.userEmail || userEmailData
      }
    }
  }
  showGlobalLoading(true)
  if (!payload?.userEmail) {
    const answerIds = payload.listAnswerQuestion.map((el) => el.answerId)
    handleGetListProductByQuiz({ answerIds })
  } else {
    handleSaveQuiz(payload)
  }
}

// const handleSaveQuiz = async () => {
// refresh quiz data
//   // setCurrentAnswers([])
//   // pageState.currentStep = 6
// }

const mappingAnswer = () => {
  const data = currentAnswers.value
  return data.map((item, index) => ({
    questionId: findAnswerId(item.step, item.value).questionId,
    answerId: findAnswerId(item.step, item.value).answerId,
    value: item.step === 4 ? item.value / 100 : item.value + 1
  }))
}

const findAnswerId = (step, indexAnswer) => {
  const quiz = handleGetQuizItems(step)
  let answerId
  if (step !== 4) {
    answerId = quiz.steps.find((el, index) => index === indexAnswer).answerId
  } else {
    const rangData = quiz.steps
    answerId = rangData.find(
      (el) => el.minValue <= indexAnswer / 100 && el.maxValue >= indexAnswer / 100
    ).answerId
  }

  return {
    questionId: quiz.questionId,
    answerId
  }
}

const handleRestartQuiz = () => {
  setCurrentAnswers([
    { step: 1, value: -1 },
    { step: 2, value: -1 },
    { step: 3, value: -1 },
    { step: 4, value: 50 }
  ])
  pageState.currentStep = 1
  pageState.isStartQuiz = true
  storage.remove(STORAGE_STEP_SKIN_QUIZ)
  storage.remove(STORAGE_BACK_SKIN_QUIZ)
}

const showImageByStep = (val) => {
  switch (val) {
    case 1:
      return ImageStepOne
    case 2:
      return ImageStepTwo
    case 3:
      return ImageStepThree
    case 4:
      return ImageStepFour
    case 5:
      return ImageStepLast
    case 6:
      return ImageStepLast
    default:
      return ImageIntro
  }
}

const backgroundImageQuiz = () => {
  return {
    backgroundImage: `url(${pageState.imageQuizContent})`
  }
}

watch(
  () => pageState.currentStep,
  (value) => {
    pageState.imageQuizContent = showImageByStep(value)
    if (value <= 4) {
      pageState.stepInfo = showQuizByCurrentStep(value)
    }

    storage.set(STORAGE_STEP_SKIN_QUIZ, {
      currentAnswers: currentAnswers.value,
      pageStates: pageState
    })
  }
)

const getListQuestion = async () => {
  const response = await apiService.skinQuizService.getListQuestion()
  if (response?.data?.length) {
    pageState.questionLists = response.data
  }
}

onBeforeMount(() => {
  getListQuestion()
})

onMounted(() => {
  setCurrentAnswers([
    { step: 1, value: -1 },
    { step: 2, value: -1 },
    { step: 3, value: -1 },
    { step: 4, value: 50 }
  ])
  // Check if user back from product detail
  if (storage.get(STORAGE_BACK_SKIN_QUIZ)) {
    const { currentAnswers, pageStates } = storage.get(STORAGE_STEP_SKIN_QUIZ)
    setCurrentAnswers(currentAnswers)
    Object.assign(pageState, pageStates)
    const payload = {
      listAnswerQuestion: mappingAnswer()
    }
    const answerIds = payload.listAnswerQuestion.map((el) => el.answerId)
    handleGetListProductByQuiz({ answerIds })
  }
})
</script>
<style lang="scss" scoped>
.bg-intro-content {
  background-position: center center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
}

.welcome-quiz {
  @apply h-[calc(100vh-65px)];
}

.h-quiz-desktop {
  @apply h-[calc(100vh-150px)];
}
</style>
