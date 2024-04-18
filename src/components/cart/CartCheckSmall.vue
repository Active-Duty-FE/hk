<template>
  <div class="cart-check-box flex cursor-pointer items-center" @click="onCheck">
    <span class="relative">
      <UnCheckIcon />
      <CheckIcon v-if="checked" class="absolute left-[3px] top-[3px] m-auto" />
    </span>
    <slot name="content" />
  </div>
</template>
<script setup>
import UnCheckIcon from '@/assets/svgs/small-check.svg'
import CheckIcon from '@/assets/svgs/check.svg'

const emits = defineEmits(['checkedChange'])
const props = defineProps({
  checked: {
    type: Boolean,
    default: false
  }
})

const onCheck = () => {
  emits('checkedChange', props.checked)
}
</script>
