<script setup>
import MenuItem from '@/components/return-exchange/agreement/MenuItemCustom.vue'

defineProps({
  total: {
    type: Number,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  returnMethods: {
    type: Object,
    required: true
  }
})

const renderPrice = (value, index) => {
  return !index ? `$ ${Math.abs(value ?? 0)}` : `- $ ${Math.abs(value ?? 0)}`
}
</script>
<template>
  <div class="flex flex-col gap-5">
    <MenuItem v-for="(item, index) in items" :key="item">
      <template #label> {{ item.label }} </template>
      <template #value>
        {{ renderPrice(item.value, index) }}
      </template>
    </MenuItem>
    <MenuItem>
      <template #label> Refund Method </template>
      <template #value>
        <div class="text-right">
          <div>{{ returnMethods?.text }}</div>
          <div class="font-400 text-[12px]">{{ returnMethods?.cardNumber }}</div>
        </div>
      </template>
    </MenuItem>
    <div>
      <a-divider class="!bg-gray-10 !my-0" />
      <MenuItem class="pt-5">
        <template #label>
          <span class="font-475 text-gray-10 text-[16px]"> Total </span>
        </template>
        <template #value>
          <span class="font-625 text-gray-10 text-[18px]"> $ {{ Math.abs(total ?? 0) }} </span>
        </template>
      </MenuItem>
    </div>
  </div>
</template>
