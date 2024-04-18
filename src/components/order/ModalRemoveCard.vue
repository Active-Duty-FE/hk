<template>
  <RModalConfirm
    :visible="visible"
    text-ok="Remove"
    text-cancel="Cancel"
    :width="270"
    :mask-closable="false"
    wrap-class-name="modalRemoveCard"
    @cancel="onCancel"
    @ok="onOk"
  >
    <template #extraDescription>
      <p class="text-black-50 font-475 mb-0 text-center text-sm">
        Are you sure you want to remove this card from your profile?
      </p>
    </template>
  </RModalConfirm>
</template>
<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  onCancel: {
    type: Function,
    default: () => {}
  },
  onOk: {
    type: Function,
    default: () => {}
  }
})
</script>

<style lang="scss">
.modalRemoveCard {
  .ant-modal-content {
    @apply rounded-[10px];
  }

  .ant-modal-body {
    @apply px-[23px] pb-[41px] pt-[52px];
  }
  .ant-modal-footer {
    @apply flex p-0;
    .divider {
      @apply bg-gray-11 h-[52px] w-[1px];
    }
  }

  .btn {
    @apply w-full py-[14px] text-center font-bold;

    &__cancel {
      @apply text-blue-1100 font-475 text-base;
    }

    &__ok {
      @apply text-blue-1100 font-475 text-base;
    }
  }
}
</style>
