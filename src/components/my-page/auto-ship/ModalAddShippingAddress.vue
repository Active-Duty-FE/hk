<template>
  <RDrawerBottom title="Add Shipping Address" :height="'90%'">
    <ShippingAddressForm
      ref="shippingAddressFormRef"
      :is-modal="true"
      @update-success="updateShippingAddress"
    />
  </RDrawerBottom>
</template>
<script setup>
const emits = defineEmits(['close-modal'])

const updateShippingAddress = () => {
  emits('close-modal')
}
</script>
