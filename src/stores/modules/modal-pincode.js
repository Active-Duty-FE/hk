import { useBreakpoints } from '@vueuse/core'
import { defineStore } from 'pinia'
import { reactive } from 'vue'

export const useModalPinCode = defineStore('pin-code', () => {
  const device = useBreakpoints({
    desktop: 992
  })
  const isMobile = device.smaller('desktop')

  const pinCodeState = reactive({
    showPinCodeMobile: false,
    showPinCodeDesktop: false,
    titlePinCode: '',
    stepText: '',
    errorValidate: '',
    isSetupPass: false,
    currentSetPassStep: 1,
    setUpPinCode: undefined,
    isRefresh: false,
    failCount: 0
  })

  const handleUpdateToStepTwo = (pinCode, stepText) => {
    pinCodeState.setUpPinCode = pinCode
    pinCodeState.currentSetPassStep = 2
    pinCodeState.stepText = stepText
    pinCodeState.isRefresh = true
  }

  const doShowPinPopup = (titlePinCode, stepText) => {
    pinCodeState.isRefresh = false
    pinCodeState.isSetupPass = true
    pinCodeState.titlePinCode = titlePinCode
    pinCodeState.failCount = 0
    pinCodeState.stepText = stepText
    if (isMobile.value) {
      // show mobile pin
      pinCodeState.showPinCodeMobile = true
      pinCodeState.showPinCodeDesktop = false
    } else {
      // show desktop pin
      pinCodeState.showPinCodeDesktop = true
      pinCodeState.showPinCodeMobile = false
    }
  }

  const closePinPopup = () => {
    pinCodeState.currentSetPassStep = 1
    pinCodeState.showPinCodeDesktop = false
    pinCodeState.showPinCodeMobile = false
    pinCodeState.errorValidate = ''
    pinCodeState.setUpPinCode = ''
    pinCodeState.stepText = ''
    pinCodeState.isRefresh = true
  }

  const updateTextValid = (text) => {
    pinCodeState.errorValidate = text
  }

  const updateContentPinCodeWhenError = (failCount, stepText, errMessage) => {
    pinCodeState.isRefresh = true
    pinCodeState.stepText = stepText
    pinCodeState.failCount = failCount

    pinCodeState.errorValidate = errMessage
  }

  return {
    pinCodeState,
    doShowPinPopup,
    closePinPopup,
    handleUpdateToStepTwo,
    updateTextValid,
    updateContentPinCodeWhenError
  }
})
