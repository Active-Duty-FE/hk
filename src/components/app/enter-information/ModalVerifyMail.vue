<template>
  <r-modal-confirm
    :visible="visible"
    :width="400"
    :mask-closable="true"
    :text-ok="'yes i will log in'"
    :text-cancel="'no'"
    @cancel="onCancel"
    @ok="onOk"
  >
    <template #extraTitle>
      <p class="text-navy-deep text-base font-medium">You are already a registered member.</p>
    </template>
    <template #extraDescription>
      <div class="flex justify-center gap-1">
        (<Email /> <span> {{ mainContent }} </span>)
      </div>
      <div>Do you want to log in?</div>
    </template>
  </r-modal-confirm>
</template>
<script setup>
import { AppRoutes } from '@/router/path'
import { useRouter } from 'vue-router'
import Email from '@assets/svgs/email-black.svg'

const router = useRouter()
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  onCancel: {
    type: Function,
    default: () => {}
  },
  mainContent: {
    type: String,
    default: ''
  }
})

const onOk = () => {
  router.push(AppRoutes.login.path)
}
</script>
