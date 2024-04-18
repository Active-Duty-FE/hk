<template>
  <div class="_banner">
    <div class="_banner__content">
      <slot />
    </div>
    <div class="_banner__image" :class="imageClass"></div>
  </div>
</template>

<script setup>
defineProps({
  imageClass: {
    type: String,
    required: false,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
._banner {
  @apply relative overflow-hidden rounded-[10px];

  &__content {
    @apply z-1 relative w-4/5;
  }

  &__image {
    background-image: url('@/assets/images/login-banner.webp');
    background-position: center bottom 35%;
    right: -60px;
    width: 90%;
    @apply bg-(cover no-repeat) absolute top-0 h-full;
  }
}
</style>
