<template>
  <div
    class="!md:py-[180px] container mx-auto flex w-full max-w-[1200px] justify-center px-5 pt-[70px] md:px-0"
  >
    <div class="relative grid max-w-[960px] grid-cols-2 gap-x-[15px] gap-y-5 md:grid-cols-4">
      <div v-for="(event, index) in data" :key="index" style="aspect-ratio: 1" class="relative">
        <img
          alt="image event"
          :src="addPrefixForImage(event?.imageUrl) ?? EventImageOne"
          class="aspect-square w-full"
        />
        <span
          class="-translate-1/2 md:text-8 font-475 text-6 absolute left-1/2 top-1/2 text-center text-white"
        >
          {{ event?.displayTitle }}
        </span>
      </div>
    </div>
    <a-modal v-model:visible="visible" width="40%" wrap-class-name="full-modal">
      <img
        alt="image event"
        :src="addPrefixForImage(event?.imageUrl) ?? EventImageOne"
        class="w-full"
      />
    </a-modal>
  </div>
</template>
<script setup>
import EventImageOne from '@/assets/images/explores/events/event-bg.png'
import { addPrefixForImage } from '@/utils/common'
import { ref } from 'vue'

defineProps({
  data: {
    type: Array,
    default: () => []
  }
})

const visible = ref(false)
</script>
<style lang="scss">
.modal {
  position: absolute;
  right: 5px;
  top: 5px;
  opacity: 0.5;
  display: flex;
  align-items: center;
  justify-content: center;
}
.anticon {
  .anticon svg {
    height: 16px;
    width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.ant-modal-mask {
  background-color: rgba(0, 0, 0, 0.4);
}
.ant-modal-footer {
  display: none;
}
.ant-modal {
  min-width: 360px;
}
</style>
