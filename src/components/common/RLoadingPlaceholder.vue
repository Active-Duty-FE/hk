<script setup>
defineProps({
  isShow: {
    type: Boolean,
    default: true
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '100%'
  },
  dark: {
    type: Boolean,
    default: false
  }
})
</script>
<template>
  <div
    v-if="isShow"
    class="gemx-loading-placeholder"
    :class="{ 'gemx-loading-placeholder--dark': dark }"
    :style="{ width, height }"
  ></div>
</template>

<style lang="scss" scoped>
$background: #f5f5f7;
$vue-content-placeholders-primary-color: #e8e8e8 !default;
$vue-content-placeholders-secondary-color: #e9e9e9 !default;
$vue-content-placeholders-dark-color: rgba(253, 253, 253, 0.2) !default;
$vue-content-placeholders-border-radius: 2px !default;
$vue-content-placeholders-line-height: 15px !default;

@keyframes gemx-loading-placeholder {
  0% {
    transform: translate3d(-30%, 0, 0);
  }

  100% {
    transform: translate3d(100%, 0, 0);
  }
}

.gemx-loading-placeholder {
  position: relative;
  overflow: hidden;
  height: $vue-content-placeholders-line-height;
  background: $vue-content-placeholders-secondary-color;
  border-radius: $vue-content-placeholders-border-radius;

  &--dark {
    background: $vue-content-placeholders-dark-color;
  }
  &--dark::before {
    background: linear-gradient(
      to right,
      transparent 0%,
      darken($vue-content-placeholders-dark-color, 3%) 15%,
      transparent 30%
    ) !important;
  }

  &.gemx-loading-placeholder--title {
    background: $vue-content-placeholders-primary-color;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    max-width: 1000px;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent 0%,
      darken($vue-content-placeholders-secondary-color, 3%) 15%,
      transparent 30%
    );
    animation-duration: 1.5s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: gemx-loading-placeholder;
    animation-timing-function: linear;
  }
}
</style>
