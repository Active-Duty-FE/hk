<template>
  <div class="flex gap-2" @drop="onDrop" @dragover="onDragover">
    <a-form-item-rest>
      <RInput
        readonly
        :value="filename"
        :placeholder="placeholder"
        class="!rounded-0"
        @click="onOpenSelectFile"
      />
    </a-form-item-rest>
    <RButtonUpload :id="id" :accept="accept" @change="onChange">
      <RButton class-title="text-white" class="!bg-gray-10 !border-none" :title="title" />
    </RButtonUpload>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: undefined,
    default: undefined
  },
  placeholder: {
    type: String,
    default: 'Please Upload File'
  },
  title: {
    type: String,
    default: 'Upload'
  },
  accept: {
    type: String,
    default: '*'
  },
  id: {
    type: String,
    default: ''
  },
  customValidate: {
    type: Function,
    default: null
  },
  nameInfo: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['update:modelValue', 'change'])

const filename = ref(props.nameInfo)

const currentValue = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  }
})

const onChange = ({ file }) => {
  if (props.customValidate && !props.customValidate(file)) return
  currentValue.value = file
  filename.value = file.name
}

const onOpenSelectFile = () => {
  const element = document.getElementById(props.id)
  if (!element) return
  element.click()
}

const onDragover = (e) => {
  e.preventDefault()
}

const onDrop = (e) => {
  e.preventDefault()
  const element = document.getElementById(props.id)
  if (!element) return

  const file = e.dataTransfer.files[0]
  if (!file) return

  if (props.customValidate && !props.customValidate(file)) return
  currentValue.value = file
  filename.value = file.name

  emits('change')
}

watch(
  () => props.nameInfo,
  (value) => {
    filename.value = value
  },
  {
    immediate: true
  }
)
</script>
