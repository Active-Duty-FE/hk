<template>
  <div
    class="cart-check-box flex cursor-pointer items-center"
    :class="props.class"
    @click="onCheck"
  >
    <div class="relative flex flex-row items-start gap-3">
      <div class="mt-1 flex items-center">
        <UnCheckIconSmall />
        <CheckIcon v-if="checked" class="absolute left-[3px] top-[7px] m-auto" />
      </div>
      <div class="flex flex-col gap-1">
        <span class="font-bold">{{ title }}</span>
        <slot name="fee" />
      </div>
    </div>
    <slot name="content" />
  </div>
</template>
<script setup>
import UnCheckIconSmall from '@/assets/svgs/un-check-small.svg'
import CheckIcon from '@/assets/svgs/check-icon-small.svg'

const emits = defineEmits(['checkedChange'])
const props = defineProps({
  checked: {
    type: Boolean,
    default: false
  },
  class: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})

const onCheck = () => {
  emits('checkedChange', props.checked)
}
</script>
