<template>
  <a-button
    v-bind="props"
    class="buttonCustom !flex items-center justify-center"
    :class="{
      '!hover:bg-white !hover:border-gray-1 !hover:text-gray-1': type === 'primary'
    }"
  >
    <div class="flex items-center justify-center">
      <slot name="image" />
      <slot name="content" />
      <span class="title gap-1.25 flex items-center px-2" :class="classTitle">
        <slot name="icon" :class="renderPositionIcon(positionIcon)"> </slot> {{ title }}
      </span>
    </div>
  </a-button>
</template>
<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  class: {
    type: String,
    default: 'w-full'
  },
  classTitle: {
    type: [String, Array],
    default: ''
  },
  // default , primary, dashed ...
  type: {
    type: String,
    default: 'default'
  },
  bgColor: {
    type: String,
    default: ''
  },
  borderColor: {
    type: String,
    default: '#212121'
  },
  height: {
    type: String,
    default: '40px'
  },
  borderRadius: {
    type: String,
    default: '0px'
  },
  onClick: {
    type: Function,
    default: () => {}
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  // center , left , right
  positionIcon: {
    type: String,
    default: 'right',
    required: false
  },
  htmlType: {
    type: String,
    default: 'button'
  }
})

const renderPositionIcon = (positionIcon) => {
  switch (positionIcon) {
    case 'right':
      return 'absolute right-1'
    case 'left':
      return 'absolute left-1'
    default:
      return ''
  }
}
</script>
<style lang="scss" scoped>
.buttonCustom {
  @apply font-550 font-sm;
  background-color: v-bind(bgColor);
  border-color: v-bind(borderColor);
  height: v-bind(height);
  min-height: v-bind(height);
  border-radius: v-bind(borderRadius);
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  &:hover {
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14),
      0px 1px 10px 0px rgba(0, 0, 0, 0.12);
  }
}
</style>
