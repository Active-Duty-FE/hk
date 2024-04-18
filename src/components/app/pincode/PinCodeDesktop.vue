<template>
  <div class="hl-input-container m-auto text-center">
    <input
      v-for="(input, index) in length"
      :id="generateInputId(index)"
      :ref="(el) => generateRef(index, el)"
      :key="index"
      v-model="inputValues[index]"
      type="password"
      autocomplete="new-password"
      maxlength="1"
      :style="{
        fontSize: hlFontSize,
        borderBottom: hlInputColor(index),
        color: fontColor,
        width: hlWidth
      }"
      contenteditable="true"
      @keydown="handleKeydown"
      @keyup="handleInputFocus(index)"
      @paste.prevent="handlePastedValues"
      @input="returnFullString()"
    />
  </div>
</template>

<script setup>
import { ONLY_NUMBER } from '@/helpers/regex'
import { ref, computed, watch } from 'vue'

const emits = defineEmits(['pinCodeData'])
const props = defineProps({
  length: {
    type: Number,
    required: true
  },
  fontSize: {
    type: Number,
    default: 22,
    required: false
  },
  inputColor: {
    type: String,
    default: '#063451',
    required: false
  },
  fontColor: {
    type: String,
    default: '#444444',
    required: false
  },
  allowPaste: {
    type: Boolean,
    default: true,
    required: false
  },
  onlyNumber: {
    type: Boolean,
    default: true,
    required: false
  },
  isRefresh: {
    type: Boolean,
    default: false
  },
  failCount: {
    type: Number,
    default: 0
  }
})

watch(
  () => [props.isRefresh, props.failCount],
  (value) => {
    inputValues.value = []
    inputRefs[0].focus()
  }
)

const inputRefs = {}

const inputValues = ref([])

const hlFontSize = computed(() => `${props.fontSize}px`)
const hlWidth = computed(() => `${props.fontSize + 8}px`)

const handleKeydown = (event) => {
  if (!props.onlyNumber) {
    return
  }
  const key = event.charCode || event.keyCode || 0
  if (!(ONLY_NUMBER.test(event.key) || key === 8)) {
    event.preventDefault()
  }
}

const generateRef = (index, el) => {
  inputRefs[index] = el
}

const generateInputId = (index, el) => {
  return `hl_${index + 1}`
}

const hlInputColor = (index) => {
  const color = inputValues.value[index] ? props.inputColor : '#eeeeee'

  return `3px solid ${color}`
}

const handleInputFocus = (index) => {
  if (inputValues.value[index] && inputValues.value[index] !== '' && index < props.length - 1) {
    inputRefs[index + 1].focus()
  } else if (index > 0 && (!inputValues.value[index] || inputValues.value[index] === '')) {
    inputRefs[index - 1].focus()
  }
}

const handlePastedValues = (event) => {
  if (props.allowPaste) {
    const pastedValue = event.clipboardData.getData('text/plain')
    const splitValues = pastedValue.split('')
    let canPaste = true

    if (props.onlyNumber) {
      const regex = new RegExp(`^\\d{${props.length}}$`)
      canPaste = regex.test(pastedValue)
    }

    if (canPaste) {
      for (let i = 0; i < props.length; i++) {
        updateInputValue(i, splitValues[i])
      }

      inputRefs[props.length].focus()

      returnFullString()
    }
  }
}

const updateInputValue = (index, value) => {
  inputValues.value[index] = value
}

const returnFullString = () => {
  const data = inputValues.value.join('')
  if (data.length === props.length) emits('pinCodeData', data)
}
</script>

<style lang="scss" scoped>
.hl-input-container {
  input {
    border: none;
    margin-left: 10px;
    text-align: center;

    &:first-child {
      margin-left: 0;
    }
    &:focus {
      outline: none;
    }
  }
}
</style>
