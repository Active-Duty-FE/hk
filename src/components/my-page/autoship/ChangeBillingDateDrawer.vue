<template>
  <RDrawerBottom v-model="visible" title="Change Billing Date">
    <PaymentDate v-model="_dateDefault" @get-date-payment="onChangePaymentDate" />

    <span class="text-note">{{ TEXT_NOTE }}</span>

    <div class="mt-10 grid grid-cols-2 gap-1">
      <RButton
        title="Cancel"
        class="!border-navy-6"
        class-title="text-navy-6"
        @click="visible = false"
      />

      <RButton
        title="Confirm"
        class="!border-navy-6 !bg-navy-6 disabled:(!bg-navy-4 !border-navy-4)"
        class-title="text-white"
        @click="onConfirm"
      />
    </div>
  </RDrawerBottom>
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import { ref, watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  date: {
    type: Number,
    default: 0
  }
})

const _dateDefault = ref(null)

const emit = defineEmits(['update:visible', 'update:date'])

const visible = useVModel(props, 'visible', emit)

const TEXT_NOTE = 'Do you want to change the autoship\nsubscription billing date?'

const onChangePaymentDate = (date) => {
  _dateDefault.value = date
}

const onConfirm = () => {
  if (_dateDefault.value !== props.date) {
    emit('update:date', _dateDefault.value)
  }
  visible.value = false
}

watch(visible, (val) => {
  if (!val) return
  _dateDefault.value = props.date
})
</script>

<style lang="scss" scoped>
.text-note {
  @apply my-10 block whitespace-pre-wrap text-center -tracking-[0.28px];
}
</style>
