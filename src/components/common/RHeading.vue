<template>
  <component :is="icon" class="pr-2" :class="classIcon" />
  <span
    v-if="title"
    class="text-navy-6 font-550 whitespace-pre-line text-[28px]"
    :class="classTitle"
  >
    {{ title }}
  </span>
  <p class="font-350 text-gray-2 mb-0 whitespace-pre-line" :class="classSubTitle">{{ subTitle }}</p>
</template>
<script setup>
defineProps({
  title: {
    type: String,
    default: '',
    required: true
  },
  subTitle: {
    type: String,
    default: ''
  },
  classTitle: {
    type: String,
    default: ''
  },
  classSubTitle: {
    type: String,
    default: ''
  },
  classIcon: {
    type: String,
    default: ''
  },
  icon: {
    type: Function,
    default: () => {}
  }
})
</script>
