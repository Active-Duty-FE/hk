<template>
  <div class="grid grid-cols-7">
    <div v-for="item in ARRAY_DATE_AUTO_SHIP" :key="item" class="flex items-center justify-center">
      <div
        v-if="conditionShowDate(item)"
        class="text-black-50 font-550 flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[38px]"
        :class="{
          'bg-grey-4': currentDate === item,
          'bg-navy-6 !text-white ': item === Number(date)
        }"
        @click="onClick(item)"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ARRAY_DATE_AUTO_SHIP, MAX_DATE_ORDER, MIN_DATE_ORDER } from '@/helpers/constant'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: ''
  }
})

const emits = defineEmits(['update:modelValue', 'get-date-payment'])

const date = useVModel(props, 'modelValue', emits)

const currentDate = new Date().getDate()

const onClick = (val) => {
  date.value = val
  emits('get-date-payment', val)
}

const conditionShowDate = (date) => {
  return date > MIN_DATE_ORDER && date < MAX_DATE_ORDER
}
</script>
