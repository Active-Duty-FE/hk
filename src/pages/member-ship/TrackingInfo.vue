<template>
  <div>
    <!-- tracking info -->
  </div>
</template>
<script setup>
import router from '@/router'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import storage from '@/utils/storage'
import { onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const { showGlobalLoading } = useGlobalLoadingStore()

const checkReferralInfo = async () => {
  showGlobalLoading(true)
  const referralCode = route.query?.referralCode || ''
  showGlobalLoading(false)
  if (!referralCode) {
    router.push('/')
  } else {
    router.push(`/?referrerCode=${referralCode}`)
    storage.set('riman-code', referralCode, 'localStorage')
  }
}

onBeforeMount(() => {
  checkReferralInfo()
})
</script>
