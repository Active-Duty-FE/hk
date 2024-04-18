<template>
  <a-modal v-bind="propsDefault" centered :visible="props.visible">
    <h5 class="modal__title">{{ props.title }}</h5>
    <slot name="extraTitle" />
    <div class="modal__description">{{ props.description }}</div>
    <slot name="extraDescription" />

    <template #footer>
      <span class="btn-confirm cursor-pointer" @click="handleBtn">{{ textBtn }}</span>
    </template>
  </a-modal>
</template>

<script setup>
import { unref, watch } from 'vue'

const props = defineProps({
  width: {
    type: [Number, String],
    default: 500
  },
  visible: {
    type: Boolean,
    default: false
  },
  closable: {
    type: Boolean,
    default: false
  },
  wrapClassName: {
    type: String,
    default: 'modalAlert'
  },
  textBtn: {
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
  duration: {
    type: Number,
    default: 0
  }
})

const emits = defineEmits(['confirm', 'self-close'])
// keep this for re-checking issue
const { title, description, visible, ...propsDefault } = unref(props)

const handleBtn = () => {
  emits('confirm')
}

watch(
  () => props.visible,
  (val) => {
    if (val && props.duration) {
      setTimeout(() => {
        emits('self-close')
      }, props.duration)
    }
  }
)
</script>

<style lang="scss">
.modalAlert {
  .ant-modal-content {
    @apply rounded-[10px];
  }

  .ant-modal-footer {
    @apply flex justify-between p-0;
  }

  .ant-modal-body {
    @apply px-5 pb-4 pt-5 text-center;
  }

  .btn-confirm {
    @apply text-navy-1 w-full py-[14px] text-center font-bold;
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
