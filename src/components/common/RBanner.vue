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
  @apply relative;

  &__content {
    @apply z-1 relative w-4/5;
  }

  &__image {
    background-image: url('@/assets/images/banner-1.png');
    @apply bg-(cover no-repeat right) absolute  right-0 top-0 h-full w-4/5;
  }
}
</style>
