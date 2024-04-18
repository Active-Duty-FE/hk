<template>
  <div>
    <div class="quiz-container hidden h-[350px] md:block">
      <div class="quiz-text">
        <div class="quiz flex flex-col items-center text-center">
          <span class="quiz__description" :class="handleStyleFontColor(formState?.fontColor)">
            {{ formState?.displayTitle }}
          </span>
          <span class="quiz__title !font-550">
            <span :class="handleStyleFontColor(formState?.fontColor)" class="line-clamp-2">
              {{ formState?.subCopy }}
            </span>
          </span>

          <div
            class="btn__wrap btn-hover flex flex-row items-center justify-center text-center"
            @click="onClick"
          >
            <span class="btn__text" :class="handleStyleFontColor(formState?.fontColor)">
              {{ formState?.buttonText }}
            </span>
            <ArrowRight class="btn__icon mb-1" />
          </div>
        </div>
      </div>
      <image :src="addPrefixForImage(formState?.imageUrl)" class="quiz__image" alt="ritual image" />
    </div>
    <div class="quiz-container block p-4 md:hidden">
      <div class="quiz">
        <span
          class="quiz__description w-[140px] !text-[16px]"
          :class="handleStyleFontColor(formState?.fontColor)"
        >
          {{ formState?.displayTitle }}
        </span>

        <span class="quiz__title !font-550" :class="handleStyleFontColor(formState?.fontColor)">
          {{ formState?.subCopy }}
        </span>
        <div
          class="btn__wrap btn-hover"
          :class="handleStyleFontColor(formState?.fontColor)"
          @click="onClick"
        >
          <span class="btn__text">{{ formState?.buttonText }}</span>
          <ArrowRight class="btn__icon mb-1" />
        </div>
      </div>
      <img
        :src="addPrefixForImage(formState?.imageUrlMobile)"
        class="block w-full max-w-full align-top md:hidden"
        alt="ritual image"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import ArrowRight from '@/assets/svgs/arrow-right.svg'
import { addPrefixForImage, handleStyleFontColor } from '@/utils/common'

const props = defineProps({
  dataQuizItem: {
    type: Object,
    default: () => {}
  }
})
const formState = reactive({})

const onClick = () => {
  if (props.dataQuizItem.openInNewWindow) {
    window.open(props.dataQuizItem?.link, 'link', 'height=600,width=600')
  } else {
    window.open(props.dataQuizItem?.link, '_blank')
  }
}

watch(
  () => props.dataQuizItem,
  (value) => {
    if (value) {
      Object.assign(formState, value)
    }
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.quiz-container {
  @apply relative m-auto w-full;
}

.quiz-text {
  @apply mx-auto max-w-screen-xl;
  .quiz {
    position: relative !important;
  }
}

.quiz {
  @apply z-1 absolute  bottom-10 left-0 flex flex-col pl-10 lg:top-[50px];

  &__description {
    @apply leading-22px text-[18px] font-light;
    @apply lg:text-[24px] lg:leading-6;
  }

  &__title {
    @apply mb-10 mt-[25px] text-[40px] font-normal leading-[50px]  lg:mb-9;
    @apply lg:flex lg:flex-col lg:text-[64px] lg:leading-[68px];
  }

  &__image {
    @apply absolute bottom-0 left-0 right-0 top-0 h-full w-full object-cover;
  }
}

.btn {
  &__wrap {
    @apply flex w-fit cursor-pointer items-center gap-2.5;
  }

  &__text {
    @apply text-base font-medium leading-normal;
    @apply lg:(text-xl leading-[20px]);
  }

  &__icon {
    @apply h-5 w-5;

    :deep(path) {
      fill: #ffffff;
    }
  }
}

.btn-hover {
  position: relative;
  transition: 0.4s;
  svg {
    transform: translateX(-5px);
    transition: all 0.3s ease;
    opacity: 0;
  }
  &:hover svg {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
