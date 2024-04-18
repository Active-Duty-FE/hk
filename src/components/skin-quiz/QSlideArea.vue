<template>
  <div class="h-full w-full px-[30px] md:px-[90px]">
    <div
      class="font-550 style-normal flex w-full justify-center pb-[22px] pt-[144px] text-[18px] leading-[22px] text-white md:pb-[30px] md:pt-[129px] md:text-2xl"
    >
      <div class="w-[167px] md:w-[239px]">{{ stepInfo?.title }}.</div>
    </div>
    <div class="h-[36px] text-[12px] font-light leading-none text-white md:text-[18px]">
      <div v-show="visibleLabel">
        Adjust the slider below to <br />
        achieve your desired level of glow!
      </div>
    </div>
    <div class="slide-item relative pt-[40px]">
      <div
        v-show="visibleLabel"
        class="absolute left-1/2 top-[10px] flex -translate-x-1/2 justify-center"
      >
        <ArrowDownIcon class="h-[20px]" />
      </div>
      <a-slider
        v-model:value="skinValue"
        :step="1"
        :min="0"
        :max="100"
        :tip-formatter="null"
        @after-change="onAfterChange"
        @change="() => (visibleLabel = false)"
      />
      <div>
        <div class="flex items-center justify-between pt-[18px]">
          <div class="font-475 style-normal w-[58px] text-[12px] leading-[12px] text-white">
            LIT-FROM WITHIN
          </div>
          <div class="font-475 style-normal w-[58px] text-[12px] leading-[12px] text-white">
            CLASSIC DEW
          </div>
          <div class="font-475 style-normal w-[58px] text-[12px] leading-[12px] text-white">
            GLASS SKIN
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { useQuizStore } from '@/stores/modules/quiz'
import { storeToRefs } from 'pinia'
import ArrowDownIcon from '@assets/svgs/skin-quiz/arrow_down.svg'

const quizStore = useQuizStore()
const { currentAnswers } = storeToRefs(quizStore)

defineProps({
  stepInfo: {
    type: Object,
    default: undefined
  }
})

const skinValue = ref(0)
const visibleLabel = ref(true)
const emits = defineEmits(['onAnswer'])

const onAfterChange = (value) => {
  currentAnswers.value[3] = {
    step: 4,
    value: value
  }
  emits('onAnswer', value)
}

const findAnswerIndex = () => {
  if (currentAnswers.value?.length) {
    return currentAnswers.value.find((el) => el.step === 4)
      ? currentAnswers.value.find((el) => el.step === 4).value
      : 0
  } else {
    return 0
  }
}

onMounted(() => {
  skinValue.value = findAnswerIndex()
  emits('onAnswer', skinValue.value)
})

watch(
  () => skinValue.value,
  (value) => {
    const handleElements = document.querySelectorAll('.ant-slider-handle')
    if (handleElements.length) {
      handleElements.forEach((handleElement) => {
        let size = 24 + (skinValue.value * 8) / 50
        if (skinValue.value >= 50) size = 32 + ((skinValue.value - 50) * 18) / 50
        handleElement.style.backgroundSize = `12px`
        handleElement.style.width = `${size}px`
        handleElement.style.height = `${size}px`
        handleElement.style.marginTop = `-${size / 2}px`
        handleElement.style.padding = `${(size - 12) / 2}px`
        handleElement.style.backgroundColor = `#364D52`
        handleElement.style.backgroundRepeat = 'no-repeat'
      })
    }
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped>
.slide-item {
  :deep(.ant-slider-rail) {
    height: 1px !important;
    background-color: #ffffff;
    opacity: 0.4;
  }

  :deep(.ant-slider-track) {
    height: 1px !important;
    background: linear-gradient(90deg, #fff 3.33%, #ffefb5 100%);
  }

  :deep(.ant-slider-handle) {
    background: transparent;
    background-image: url('@/assets/svgs/skin-quiz/slide-mark.svg') !important;
    background-position: center;
    background-size: auto;
    border: none;
  }
}
</style>
