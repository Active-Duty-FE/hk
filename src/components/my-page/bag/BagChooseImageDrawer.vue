<template>
  <RDrawerBottom v-model="visible" :title="title" height="fit-content">
    <div class="-mt-5">
      <div class="mb-5 text-right">
        <img
          v-if="isUsePersonalImage"
          src="@/assets/svgs/icon-check-primary.svg?url"
          alt=""
          class="mr-1"
        />

        <span
          class="custom__image"
          :class="{ active: isUsePersonalImage }"
          @click="onOpenCustomImage"
        >
          Use Personal Image
        </span>

        <input
          ref="fileRef"
          type="file"
          :accept="ACCEPT"
          class="hidden"
          @change="onChooseCustomImage"
        />
      </div>

      <div class="no-scrollbar mb-7.5 -mx-5 flex gap-2.5 overflow-x-auto px-5">
        <div
          v-for="image in images"
          :key="image.bagId"
          class="image__item"
          :class="{ isProfile, active: getImageSelected(image.bagId) }"
          @click="onChangeImage(image)"
        >
          <img
            :src="image.bagUrl"
            alt=""
            loading="lazy"
            class="h-full w-full object-cover"
            :class="{ isProfile }"
          />
          <img
            v-if="getImageSelected(image.bagId)"
            src="@/assets/svgs/icon-check.svg?url"
            alt=""
            loading="lazy"
            class="image__checked"
          />
        </div>
      </div>

      <RButton
        title="Save"
        class-title="font-550 text-white text-sm"
        class="!border-navy-6 !bg-navy-6 w-full"
        @click="onSave"
      />
    </div>
  </RDrawerBottom>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useVModels } from '@vueuse/core'
import { isValidAcceptFile } from '@/utils/file'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  images: {
    type: Array,
    default: () => []
  },
  imageSelected: {
    type: [String, File, Number, Object],
    default: ''
  },
  isProfile: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['update:visible', 'save'])

const ACCEPT = 'image/png,image/jpg,image/jpeg'

const { visible } = useVModels(props, emits)
const currentImage = ref({})
const fileRef = ref()

const isUsePersonalImage = computed(() => {
  return currentImage.value && !currentImage.value?.bagId && currentImage.value?.name
})

const getImageSelected = (id) => {
  return id === currentImage.value?.bagId
}

const onOpenCustomImage = () => {
  fileRef.value.click()
}

const onChooseCustomImage = (event) => {
  const files = event.target.files
  if (!files.length) return
  const isValid = isValidAcceptFile(files, ACCEPT)
  if (!isValid) return
  currentImage.value = files[0]
  fileRef.value.value = ''
}

const onChangeImage = (image) => {
  currentImage.value = image
}

const onSave = () => {
  emits('save', currentImage.value)
  visible.value = false
}

watch(visible, (val) => {
  currentImage.value = val ? props.imageSelected : {}
})
</script>

<style lang="scss" scoped>
.custom__image {
  @apply leading-base text-gray-14 w-fit cursor-pointer text-xs font-medium underline;

  &.active {
    @apply text-navy-6;
  }
}

.image {
  &__item {
    @apply max-w-22.5 max-h-22.5 min-h-22.5 min-w-22.5 relative;

    &::before {
      @apply absolute bottom-0 left-0 right-0 top-0 border-2 border-solid border-transparent transition-all content-[''];
    }

    &.isProfile::before {
      @apply border-rounded-full;
    }

    &.active::before {
      @apply border-navy-6;
    }
  }

  &__checked {
    @apply z-2 bg-navy-6 absolute bottom-1.5 right-1.5 rounded-full transition-all;
  }
}

.isProfile {
  @apply rounded-full;
}
</style>
