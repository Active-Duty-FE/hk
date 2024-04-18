<template>
  <div>
    <div class="quiz-container hidden md:block">
      <img
        :src="addPrefixForImage(dataQuizItem?.imageUrl)"
        class="quiz__image"
        alt="ritual image"
      />
      <div class="quiz flex items-center justify-center text-center">
        <span class="quiz__description">{{ dataQuizItem?.subCopy }}</span>
        <span class="quiz__title !font-550">{{ dataQuizItem?.displayTitle }}</span>
        <div class="btn__wrap btn-hover" @click="onClick">
          <span class="btn__text">{{ dataQuizItem?.buttonText }}</span>
          <ArrowRight class="btn__icon mb-1" />
        </div>
      </div>
    </div>
    <div class="quiz-container block h-[450px] md:hidden">
      <img
        :src="addPrefixForImage(dataQuizItem?.imageUrlMobile)"
        class="quiz__image"
        alt="ritual image"
      />
      <div class="quiz">
        <span class="quiz__description mt-4 w-[140px] !text-[16px]">{{
          dataQuizItem?.subCopy
        }}</span>
        <span class="quiz__title !font-550">{{ dataQuizItem?.displayTitle }}</span>
        <div class="btn__wrap btn-hover" @click="onClick">
          <span class="btn__text">{{ dataQuizItem?.buttonText }}</span>
          <ArrowRight class="btn__icon mb-1" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ArrowRight from '@/assets/svgs/arrow-right.svg'
import { addPrefixForImage } from '@/utils/common'

const props = defineProps({
  dataQuizItem: {
    type: Object,
    default: () => {}
  }
})

const onClick = () => {
  if (!props.dataQuizItem.link) return
  const isNewWindow = props.dataQuizItem.openInNewWindow
  window.open(props.dataQuizItem.link, isNewWindow ? '' : '_self')
}
</script>

<style lang="scss" scoped>
.quiz-container {
  @apply md:(mb-[12.5rem] mx-0) relative  mb-[70px] w-full;
}

.quiz-text {
  @apply mx-auto max-w-screen-xl;
  .quiz {
    position: relative !important;
  }
}

.quiz {
  @apply z-1 md:py-17.5 relative left-0 flex flex-col px-10 py-10;

  &__description {
    @apply leading-22px text-[18px] font-light text-white;
    @apply lg:text-[24px] lg:leading-6;
  }

  &__title {
    @apply mb-10 mt-[25px] whitespace-pre-line text-[40px] font-normal leading-[50px] text-white lg:mb-9;
    @apply lg:flex lg:flex-col lg:text-[64px] lg:leading-[68px];
  }

  &__image {
    @apply z-1 absolute bottom-0 left-0 right-0 top-0 h-full w-full object-cover;
  }
}

.btn {
  &__wrap {
    @apply flex w-fit cursor-pointer items-center gap-2.5 text-white;
  }

  &__text {
    @apply text-base font-medium leading-normal text-white;
    @apply lg:(text-xl leading-[20px]);
  }

  &__icon {
    @apply h-5 w-5 opacity-100 transition-all md:-translate-x-1.5 md:opacity-0;

    :deep(path) {
      fill: #ffffff;
    }
  }
}

.btn-hover {
  position: relative;
  transition: 0.4s;

  &:hover svg {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
