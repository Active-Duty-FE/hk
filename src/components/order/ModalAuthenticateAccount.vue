<template>
  <RModalConfirm
    :visible="visible"
    text-ok="Remove"
    text-cancel="Cancel"
    :width="270"
    :mask-closable="false"
    :footer="false"
    wrap-class-name="modalAuthenticateAccount"
  >
    <template #extraDescription>
      <p class="text-black-50 font-475 mb-0 text-center">
        Please reset your passcode<br />
        after authenticating your<br />
        account.
      </p>
      <a-divider class="mb-[23px]" />
      <p
        class="text-navy-deep font-625 mb-0 cursor-pointer text-center text-base"
        @click="onCancel"
      >
        Authenticate Account
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
  }
})
</script>

<style lang="scss">
.modalAuthenticateAccount {
  .ant-modal-content {
    @apply rounded-[10px];
  }

  .ant-modal-body {
    @apply px-0 pb-[25px] pt-[30px];
  }

  .btn {
    @apply w-full py-[14px] text-center font-bold;
  }
}
</style>
