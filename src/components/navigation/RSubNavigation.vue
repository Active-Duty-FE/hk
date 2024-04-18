<template>
  <div class="flex items-center" :class="positionClass">
    <component :is="iconBack" v-if="!isHideBackIcon" :class="iconClass" @click="handleClickIcon" />
    <span class="px-2" :class="titleClass">
      {{ title }}
    </span>
    <slot name="rightAction">
      <span />
    </slot>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import ArrowLeft from '@assets/svgs/arrow-left.svg'
const props = defineProps({
  iconBack: {
    type: Object,
    default: () => ArrowLeft,
    required: false
  },
  title: {
    type: String,
    default: '',
    require: true
  },
  titleClass: {
    type: String,
    default: 'text-base capitalize font-medium',
    require: false
  },
  customClass: {
    type: String,
    default: 'h-50px px-5 border-b-solid  border-1 border-black-50',
    require: false
  },
  iconClass: {
    type: String,
    default: 'cursor-pointer',
    require: false
  },
  iconClick: {
    type: Function,
    default: () => {},
    required: false
  },
  isHideBackIcon: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['iconClick'])
const handleClickIcon = () => {
  emits('iconClick')
}

const positionClass = computed(() => {
  if (props.isHideBackIcon) return `${props.customClass} justify-center`

  return props.iconBack
    ? `${props.customClass} justify-between`
    : `${props.customClass} justify-center`
})
</script>
