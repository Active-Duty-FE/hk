<template>
  <div>
    <a-modal v-model:visible="visible" centered width="500" :footer="null">
      <img
        :src="addPrefixForImage(props.image)"
        alt="divein-product"
        class="mb-6 aspect-square h-[450px] w-[450px] cursor-pointer object-cover"
      />
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { addPrefixForImage } from '@/utils/common'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: ''
  }
})
const visible = useVModel(props, 'modelValue')
</script>
