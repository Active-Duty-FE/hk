<template>
  <div class="flex flex-col lg:items-center" :class="parentClass">
    <div
      class="font-250 text-black-50 md:(text-[40px] leading-[54px]) flex flex-wrap text-[36px] leading-[38px]"
      :class="classHeading"
    >
      <span :class="classNormal">{{ textNormal }}</span>
      <div v-if="isBreak" class="block w-full md:hidden"></div>
      <span class="font-650" :class="classBold">{{ textBold }}</span>
    </div>
    <span
      v-if="description"
      class="text-gray-10 font-300 leading-5.5 text-base lg:text-lg lg:leading-6"
      :class="classDescription"
    >
      {{ description }}
    </span>
  </div>
</template>
<script setup>
defineProps({
  parentClass: {
    type: String,
    default: ''
  },
  textNormal: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  textBold: {
    type: String,
    default: ''
  },
  classHeading: {
    type: String,
    default: ''
  },
  classNormal: {
    type: String,
    default: ''
  },
  classBold: {
    type: String,
    default: ''
  },
  classDescription: {
    type: String,
    default: ''
  },
  isBreak: {
    type: Boolean,
    default: false
  }
})
</script>
