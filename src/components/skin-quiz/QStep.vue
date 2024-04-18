<template>
  <div class="flex h-full flex-col items-center md:justify-between">
    <div class="w-full">
      <QStepControl :current-step="currentStep" />
    </div>
    <div class="w-full pb-[64px] md:h-full">
      <QArea
        v-if="currentStep < 4"
        :step-info="stepInfo"
        :answer-index="answerIndex"
        @on-answer="onSelectAnswer"
      />
      <QSlideArea v-else :step-info="stepInfo" @on-answer="onSelectAnswer" />
    </div>
    <div class="w-full pb-5 md:pb-20">
      <div class="flex justify-center gap-[5px] md:gap-[10px]">
        <RButton
          title="Back"
          class="border-1 font-500 w-[165px] !border-white bg-transparent py-[15px] text-[18px] text-white md:w-[205px]"
          @click="gotoPreviousStep"
        />
        <RButton
          title="Next"
          :class="{ '!bg-yellow-1': isAnswerIndex() }"
          class="!text-navy-6 w-[165px] border-0 !bg-white py-[12px] md:w-[205px]"
          @click="gotoNextStep"
        />
      </div>
    </div>
  </div>
  <RModalAlert
    v-model:visible="pageState.isShowModalAlarm"
    title="Hi!"
    text-btn="OK"
    description="Please choose an answer to complete your skin quiz."
    :width="270"
    @confirm="pageState.isShowModalAlarm = false"
  />
</template>
<script setup>
import { reactive, ref, watch } from 'vue'
import { useQuizStore } from '@/stores/modules/quiz'
import { storeToRefs } from 'pinia'

const quizStore = useQuizStore()
const { currentAnswers } = storeToRefs(quizStore)

const props = defineProps({
  stepInfo: {
    type: Object,
    default: undefined
  },
  currentStep: {
    type: Number,
    default: 1
  }
})

const findAnswerIndex = () => {
  if (currentAnswers.value?.length) {
    return currentAnswers.value.find((el) => el.step === props.currentStep)
      ? currentAnswers.value.find((el) => el.step === props.currentStep).value
      : -1
  } else {
    return -1
  }
}

const answerIndex = ref(-1)

const isAnswerIndex = () => {
  return answerIndex.value > -1
}

const pageState = reactive({
  isShowModalAlarm: false
})

const emits = defineEmits(['changeStep'])

const onSelectAnswer = (index) => {
  currentAnswers.value[props.currentStep - 1] = {
    step: props.currentStep,
    value: index
  }
  answerIndex.value = index
}

const gotoNextStep = () => {
  if (answerIndex.value >= 0) {
    answerIndex.value = -1
    emits('changeStep', true)
  } else {
    pageState.isShowModalAlarm = true
  }
}

const gotoPreviousStep = () => {
  emits('changeStep', false)
}

watch(
  () => props.currentStep,
  () => {
    answerIndex.value = findAnswerIndex()
  }
)
</script>
<style lang="scss" scoped>
.buttonCustom {
  min-height: 50px;
  color: white;
  @media only screen and (max-width: 768px) {
    min-height: 40px;
  }
  &:hover {
    color: black;
  }
}
</style>
