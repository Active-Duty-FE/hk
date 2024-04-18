<template>
  <div class="cart-check-box flex cursor-pointer items-center" @click="onCheck">
    <span class="relative h-6">
      <UnCheckIcon v-if="size === SIZE_CHECKBOX.LARGE" />
      <UnCheckIconSmall v-else />
      <CheckIcon
        v-if="checked"
        class="absolute m-auto"
        :class="[size === SIZE_CHECKBOX.SMALL ? 'left-[0px] top-[1px]' : 'left-[5px] top-[5px]']"
      />
    </span>
    <slot name="content" />
  </div>
</template>
<script setup>
import UnCheckIcon from '@/assets/svgs/un-check.svg'
import UnCheckIconSmall from '@/assets/svgs/un-check-small.svg'
import CheckIcon from '@/assets/svgs/check.svg'
import { SIZE_CHECKBOX } from '@/helpers/constant'

const emits = defineEmits(['checkedChange'])
const props = defineProps({
  checked: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: SIZE_CHECKBOX.LARGE
  }
})

const onCheck = () => {
  emits('checkedChange', props.checked)
}
</script>
