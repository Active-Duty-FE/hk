<template>
  <div>
    <WithdrawalVerify v-if="step === 1" @verify="step++" />
    <WithdrawalConfirm v-else />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const step = ref(1)
</script>
