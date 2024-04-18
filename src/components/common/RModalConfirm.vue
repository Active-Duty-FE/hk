<template>
  <a-modal v-bind="propsDefault" :wrap-class-name="wrapClassName" centered>
    <h5 class="modal__title">{{ title }}</h5>
    <slot name="extraTitle" />
    <div class="modal__description" :class="propsDefault.descriptionClass">{{ description }}</div>
    <slot name="extraDescription" />

    <template #footer>
      <span class="btn btn__cancel cursor-pointer" @click="handleCancel">{{ textCancel }}</span>
      <span class="divider" />
      <span class="btn btn__ok cursor-pointer" @click="handleOk">{{ textOk }}</span>
    </template>
  </a-modal>
</template>

<script setup>
import { computed, unref } from 'vue'

const props = defineProps({
  width: {
    type: [Number, String],
    default: 500
  },
  closable: {
    type: Boolean,
    default: false
  },
  maskClosable: {
    type: Boolean,
    default: true
  },
  wrapClassName: {
    type: String,
    default: 'modalConfirm'
  },
  textCancel: {
    type: String,
    default: 'Cancel'
  },
  textOk: {
    type: String,
    default: 'Ok'
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  descriptionClass: {
    type: String,
    default: ''
  },
  styleButton: {
    type: String,
    default: '',
    validator(value) {
      if (!value) return true
      // The value must match one of these strings
      return ['style2'].includes(value)
    }
  }
})
const emits = defineEmits(['cancel', 'ok'])

const { title, description, textCancel, textOk, ...propsDefault } = unref(props)

const wrapClassName = computed(() => `${props.wrapClassName} ${props.styleButton}`)

const handleCancel = () => {
  emits('cancel')
}
const handleOk = () => {
  emits('ok')
}
</script>

<style lang="scss">
.modalConfirm {
  .ant-modal-content {
    @apply rounded-[10px];
  }

  .ant-modal-footer {
    @apply flex justify-between p-0;
  }

  .ant-modal-body {
    @apply px-5 pb-4 pt-5 text-center;
  }

  .btn {
    @apply w-full py-[14px] text-center text-base font-bold;

    &__cancel {
      @apply text-gray-2;
    }

    &__ok {
      @apply text-navy-1;
    }
  }

  &.style2 {
    .btn {
      @apply font-475 text-base leading-4;

      &__cancel {
        @apply text-blue-1100;
      }

      &__ok {
        @apply text-blue-1100;
      }
    }
  }

  .divider {
    @apply bg-grey-1 w-[2px];
  }

  .modal {
    &__title {
      @apply whitespace-pre-wrap text-base font-bold;
    }

    &__description {
      @apply whitespace-pre-wrap text-sm;
    }
  }
}
</style>
