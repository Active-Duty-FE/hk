<template>
  <div class="actionBtn" :class="{ disabled }" @click="onClick">
    <img v-if="linkImg" :src="linkImg" alt="" loading="lazy" class="actionBtn__icon" />
    <span class="actionBtn__text">{{ text }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import EditIcon from '@/assets/svgs/icon-edit.svg?url'
import DeleteIcon from '@/assets/svgs/delete-small.svg?url'
import ShareIcon from '@/assets/svgs/cart-share.svg?url'
import PreviewIcon from '@/assets/svgs/icon-preview.svg?url'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['click'])

const LINKS = {
  edit: EditIcon,
  delete: DeleteIcon,
  share: ShareIcon,
  preview: PreviewIcon
}

const linkImg = computed(() => {
  return LINKS[props.icon]
})

const onClick = () => {
  if (props.disabled) return
  emits('click')
}
</script>

<style lang="scss" scoped>
.actionBtn {
  background: rgba(224, 224, 224, 0.4);
  @apply inline-flex h-5 w-fit cursor-pointer items-center gap-1 rounded-[3px] px-2 md:h-6;

  &.disabled {
    @apply cursor-not-allowed opacity-60;
  }

  &__icon {
    @apply aspect-square h-3 md:h-4;
  }

  &__text {
    @apply leading-base text-[10px] font-semibold md:text-sm md:font-medium;
  }
}
</style>
