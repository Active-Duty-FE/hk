<template>
  <div class="concierge-main z-1 fixed cursor-pointer">
    <span class="h-15 relative block">
      <MainLayerConcierge />
      <MainFloat class="absolute bottom-0 left-0 right-0 top-0 m-auto" />
      <MainDot v-if="isShowDot" class="absolute right-4 top-4" />
    </span>
  </div>
</template>
<script setup>
import MainFloat from '@assets/svgs/main-float.svg'
import MainLayerConcierge from '@assets/svgs/main-layer-concierge.svg'
import MainDot from '@assets/svgs/main-dot.svg'

defineProps({
  isShowDot: {
    type: Boolean,
    default: false
  }
})
</script>
<style lang="scss" scoped>
.bottom-content {
  box-shadow: 0px -2px 2px 0px rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: 0px -2px 2px 0px rgba(0, 0, 0, 0.1);
  -moz-box-shadow: 0px -2px 2px 0px rgba(0, 0, 0, 0.1);
}

.concierge-main {
  right: 40px;
  bottom: 40px;
}

@media (max-width: 991px) {
  .concierge-main {
    right: 30px;
    z-index: 19;
    bottom: 165px;
  }
}
</style>
