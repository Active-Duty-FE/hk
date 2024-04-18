<template>
  <div
    class="quiz-controller border-b-1 flex h-[40px] items-center justify-between border-l-0 border-r-0 border-t-0 border-solid border-white border-opacity-[0.2] px-[24px] md:h-[55px] md:px-[91px]"
  >
    <div v-for="step in 4" :key="step" class="cursor-pointer">
      <span
        :class="{ active: isActiveStep(step) }"
        class="quiz-item md:font-475 relative text-sm font-normal leading-normal text-white opacity-[0.6] md:text-lg"
      >
        Step {{ step }}
      </span>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  currentStep: {
    type: Number,
    default: 1
  }
})
const isActiveStep = (stepNum) => stepNum === props.currentStep
</script>
<style lang="scss" scoped>
.quiz-controller {
  .active {
    @apply opacity-100;
  }

  .quiz-item::after {
    position: absolute;
    content: '';
    display: table;
    clear: both;
    bottom: -16px;
    left: 50%;
    width: 0;
    height: 1px;
    background: #ffffff;
    -webkit-transition: width 125ms ease, opacity 200ms ease;
    transition: width 125ms ease, opacity 200ms ease;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    @media only screen and (max-width: 768px) {
      bottom: -12px;
    }
  }

  .active::after {
    opacity: 1;
    width: 100%;
  }
}
</style>
