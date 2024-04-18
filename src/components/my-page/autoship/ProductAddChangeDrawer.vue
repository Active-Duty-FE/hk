<template>
  <RDrawerBottom v-model="visible" title="Add or Change">
    <div class="grid grid-cols-2 gap-1">
      <div class="action__wrap" @click="onAdd">
        <img class="action__icon" src="@/assets/svgs/my-page/product-add.svg?url" alt="" />
        <span class="action__text">ADD</span>
      </div>
      <div class="action__wrap" @click="onChange">
        <img class="action__icon" src="@/assets/svgs/my-page/product-change.svg?url" alt="" />
        <span class="action__text">CHANGE</span>
      </div>
    </div>

    <ul class="mb-0 mt-5 flex flex-col gap-2.5 pl-4">
      <li class="text__note">ADD : You can only add products to this autoship order.</li>
      <li class="text__note">
        CHANGE : You can change your entire products in this autoship order.
      </li>
      <li class="text__note">
        If you want to make changes to specific items from this list, please visit your Autoship
        Subscription Management page to edit.
      </li>
    </ul>
  </RDrawerBottom>
</template>

<script setup>
import { useVModel } from '@vueuse/core'
import { useAlertConfirm } from '@/composables/alert'
import { useNotification } from '@/composables/notification'

const { showNotification } = useNotification()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  items: {
    type: Array,
    default: () => []
  },
  immediateChange: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'add', 'change'])

const visible = useVModel(props, 'visible', emit)

const onAdd = () => {
  if (!props.immediateChange) {
    showNotification({
      type: 'success',
      message: 'Added to the list of subscriptions'
    })
    emit('add')
    visible.value = false
  } else {
    emit('add')
  }
}

const onChange = async () => {
  const confirm = await useAlertConfirm({
    content: 'All subscription products will be changed. Do you want to proceed?',
    okText: 'Ok',
    cancelText: 'Cancel'
  })

  if (!confirm) return
  emit('change')

  if (!props.immediateChange) {
    visible.value = false
  }
}
</script>

<style lang="scss" scoped>
.action {
  &__wrap {
    @apply flex cursor-pointer flex-col items-center justify-center gap-2 bg-[#F9F9F9] py-6;
  }

  &__icon {
    @apply;
  }

  &__text {
    @apply font-550 text-lg leading-6;
  }
}

.text__note {
  @apply leading-base text-xs;
}
</style>
