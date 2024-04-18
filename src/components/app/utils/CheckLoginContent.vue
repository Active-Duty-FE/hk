<template>
  <slot :check-login="handleCheckLogin" />
  <RModalConfirm
    v-model:visible="pageState.showModalError"
    :description="AUTH_REQUIRED.notAuth"
    text-ok="Login"
    text-cancel="Later"
    :width="270"
    :mask-closable="false"
    @ok="handleConfirm"
    @cancel="pageState.showModalError = false"
  />
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { AUTH_REQUIRED } from '@/helpers/validate-message'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { reactive } from 'vue'

const authUserStore = useAuthUserStore()
const { currentAuthUser } = storeToRefs(authUserStore)
const emits = defineEmits(['complete'])

const pageState = reactive({
  showModalError: false
})

const handleCheckLogin = () => {
  if (!currentAuthUser.value) {
    pageState.showModalError = true
  } else {
    // true -> continue
    return emits('complete', true)
  }
}

const handleConfirm = () => {
  // false -> modal show -> when click ok -> emit -> make func with case not login
  return emits('complete', false)
}
</script>
