<template>
  <div class="healer-pincode z-10" :class="pincodeSuccess ? 'healer-pincode--success' : ''">
    <div
      class="healer-pincode__fields !pb-12"
      :class="pincodeError ? 'healer-pincode__fields--miss' : ''"
    >
      <span
        v-for="item in DEFAULT_PIN_LENGTH"
        :key="item"
        :class="pincode.length >= item ? 'active' : ''"
      />
    </div>
    <div class="healer-pincode__numbers default-pincode-area absolute bottom-0 z-10 w-full pb-1">
      <button
        v-for="(number, idx) in [1, 2, 3, 4, 5, 6, 7, 8, 9]"
        :key="idx"
        class=""
        :disabled="buttonDisabled"
        @click="clickPinButton(number)"
      >
        <span>{{ number }}</span>
      </button>
      <button :disabled="buttonDisabled" @click="resetPincode">
        <span class="text-gray-3">Clear</span>
      </button>
      <button :disabled="buttonDisabled" @click="clickPinButton(0)">
        <span>0</span>
      </button>
      <button class="healer-pincode__undo" :disabled="buttonDisabled" @click="undoPinCode">
        <span>
          <PinNextIcon />
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onUnmounted, watch } from 'vue'
import PinNextIcon from '@/assets/svgs/pin-next.svg'
import { DEFAULT_PIN_LENGTH } from '@/helpers/constant'

const emits = defineEmits(['pinCodeData'])
const props = defineProps({
  stepText: {
    type: String,
    default: ''
  },
  pincodeError: {
    type: Boolean,
    default: false
  },
  pincodeSuccess: {
    type: Boolean,
    default: false
  },
  errorValidate: {
    type: String,
    default: ''
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

const pincode = ref('')

const pincodeLength = computed(() => pincode.value.length)
const buttonDisabled = computed(() => props.pincodeError || props.pincodeSuccess)

const clickPinButton = (pressedNumber) => {
  if (pincodeLength.value < 6) {
    pincode.value = pincode.value + pressedNumber
  }
}

const resetPincode = () => {
  pincode.value = ''
}

const undoPinCode = () => {
  if (pincode.value.length) {
    pincode.value = pincode.value.slice(0, -1)
  }
}

onUnmounted(() => resetPincode())

watch(
  () => pincode.value,
  (val) => {
    if (pincodeLength.value === 6) {
      emits('pinCodeData', pincode.value)
    }
  }
)

watch(
  () => [props.isRefresh, props.failCount],
  (value) => {
    pincode.value = ''
  }
)
</script>

<style scoped lang="scss">
.healer-pincode {
  padding: 15px 0;

  .default-pincode-area {
    border-radius: 10px 10px 0 0;
    box-shadow: 0px -3px 3px 0px rgba(0, 0, 0, 0.1);
    -webkit-box-shadow: 0px -3px 3px 0px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 0px -3px 3px 0px rgba(0, 0, 0, 0.1);
  }

  &__fields {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 200px;
    padding: 0 20px;
    margin: 20px auto 50px;

    &--miss {
      animation: miss 0.8s ease-out 1;
    }

    span {
      height: 14px;
      width: 14px;
      box-shadow: inset 0 0 0 2px #36485e;
      background-color: transparent;
      border-radius: 100%;
      position: relative;
      display: inline-block;
      text-align: center;
      transition: box-shadow 0.2s linear;

      &.active {
        box-shadow: inset 0 0 0 7px #36485e;
      }
    }
  }

  &__numbers {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    justify-items: center;
    align-items: center;
    row-gap: 20px;

    button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 70px;
      height: 70px;
      border-radius: 50%;
      color: #36485e;
      background: #ffffff;
      user-select: none;
      font-size: 24px;
      outline: none;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.5);
      transition: all 0.2s linear;

      &:active {
        transform: translateY(2px);
      }

      span {
        opacity: 1;
        transition: all 0.2s linear;
      }
    }
  }

  &--success {
    .healer-pincode__numbers {
      border-radius: 10px 10px 0 0;
      box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
      -webkit-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
      -moz-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
      button {
        transform: translateY(2px);
        color: #36485e52;

        span {
          opacity: 0.4;
        }
      }
    }

    .healer-pincode__fields {
      span {
        box-shadow: inset 0 0 0 7px #41b883;
      }
    }

    .healer-pincode__undo {
      svg {
        fill: #36485e52;
      }
    }
  }
}

@keyframes miss {
  0% {
    transform: translate(0, 0);
  }
  10% {
    transform: translate(-25px, 0);
  }
  20% {
    transform: translate(25px, 0);
  }
  30% {
    transform: translate(-20px, 0);
  }
  40% {
    transform: translate(20px, 0);
  }
  50% {
    transform: translate(-10px, 0);
  }
  60% {
    transform: translate(10px, 0);
  }
  70% {
    transform: translate(-5px, 0);
  }
  80% {
    transform: translate(5px, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}
</style>
