<template>
  <a-divider class="bg-gray-11 !mb-[25px] !mt-0" />
  <div class="mb-5 flex justify-between text-sm">
    <span>Name</span>
    <span>{{ data?.receiverFirstName }} {{ data?.receiverLastName }}</span>
  </div>
  <div class="mb-5 flex justify-between text-sm">
    <span>Address</span>
    <div v-if="data">
      {{ shippingAddressDescriptionNonMember(data) }}
    </div>
  </div>
  <div v-if="isMember" class="mb-5 flex justify-between text-sm">
    <span>Message</span>
    <span class="text-xs">{{ data?.deliveryRequest }}</span>
  </div>
</template>
<script setup>
import { shippingAddressDescriptionNonMember } from '@/utils/common'
defineProps({
  data: {
    type: Object,
    default: () => {}
  },
  isMember: {
    type: Boolean,
    default: true
  }
})
</script>
