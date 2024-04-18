<template>
  <div class="flex h-full flex-col items-center justify-center">
    <div
      class="style-normal pb-[35px] text-[18px] font-normal leading-normal text-white md:text-xl"
    >
      <span class="text-[18px]">WELCOME</span><span class="italic">!</span>
    </div>
    <div
      class="style-normal font-550 mx-auto w-[287px] pb-[25px] text-[40px] leading-[42px] text-white md:pb-[35px]"
    >
      FIND YOUR RIMAN RITUAL
    </div>
    <div
      class="font-475 style-normal mx-auto w-[283px] pb-[65px] text-sm leading-normal text-white md:pb-[51px] md:text-lg"
    >
      Start the quiz to find the perfect Ritual Set that's right for you!
    </div>
    <div>
      <r-button
        title="START THE QUIZ"
        class-title="flex items-center leading-5 h-10 md:h-[50px]"
        class="text-navy-6 font-550 !border-navy-6 mx-auto w-[160px] border border-solid !bg-white py-4 text-base leading-normal md:w-[205px] md:text-lg"
        @click="startQuiz"
      />
    </div>
  </div>
</template>
<script setup>
import { useShowAccessSkinQuiz } from '@/stores/modules/access-skinquiz'
import { countryLocalStorage } from '@/utils/common'
import { CountryEnum } from '@/helpers/enum'

const emits = defineEmits(['startQuiz'])
const { setShowAccessDenyPopup } = useShowAccessSkinQuiz()

const startQuiz = () => {
  if (countryLocalStorage !== CountryEnum.CA.value) return emits('startQuiz')
  setShowAccessDenyPopup(true)
}
</script>
<style scoped>
.buttonCustom[data-v-1099723d] {
  min-height: 50px;
  @media only screen and (max-width: 768px) {
    min-height: 40px;
  }
}
</style>
