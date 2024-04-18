import { VALID_PHONE_SUCCESS } from '@/helpers/constant'
import apiService from '@/http/api'
import { defineStore, storeToRefs } from 'pinia'
import { reactive, ref } from 'vue'
import { useGlobalLoadingStore } from './loading'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { renderDataCardSubmit } from '@/utils/common'
import { useModalPinCode } from '@/stores/modules/modal-pincode'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'

export const useCreditCardStore = defineStore('credit-card', () => {
  const listCreditCard = ref([])
  const storeLoading = useGlobalLoadingStore()
  const authUserStore = useAuthUserStore()
  const { currentAuthUser } = storeToRefs(authUserStore)

  const modalPinCodeStore = useModalPinCode()
  const statusConditionPinCode = reactive({
    change: false,
    reset: false,
    dataReset: {}
  })

  const modalAlertState = reactive({
    showModal: false,
    description: '',
    textBtn: 'Check'
  })
  const router = useRouter()

  const visibleModalDelete = ref(false)
  const visibleModalReset = ref(false)

  const { showGlobalLoading } = storeLoading

  const updateStatusConditionPinCode = (data) => {
    Object.assign(statusConditionPinCode, data)
  }

  const getListCreditCard = async (id) => {
    try {
      showGlobalLoading(true)
      const response = await apiService.creditCardService.getListCard(id)
      if (response.success) {
        listCreditCard.value = response.data
      }
    } finally {
      showGlobalLoading(false)
    }
  }

  const updateCreditCard = async (userId, cardId) => {
    try {
      showGlobalLoading(true)
      const response = await apiService.creditCardService.updateCard(userId, cardId)
      if (response.success) getListCreditCard(userId)
      else {
        modalAlertState.showModal = true
        modalAlertState.description = response.message
      }
    } finally {
      showGlobalLoading(false)
    }
  }

  const deleteCreditCard = async (userId, cardId) => {
    try {
      showGlobalLoading(true)
      const response = await apiService.creditCardService.deleteCard(userId, cardId)
      if (response.success) {
        getListCreditCard(userId)
        visibleModalDelete.value = false
      } else {
        modalAlertState.showModal = true
        modalAlertState.description = response.message
      }
    } finally {
      showGlobalLoading(false)
    }
  }

  const validPhoneBeforeCreateCard = async (payload, formState) => {
    showGlobalLoading(true)
    const response = await apiService.authService.validateCellphone(payload)
    if (response.data.isValid === VALID_PHONE_SUCCESS) {
      createCreditCard(renderDataCardSubmit(formState))
    } else {
      modalAlertState.showModal = true
      modalAlertState.description = 'Please check again your cell phone.'
      showGlobalLoading(false)
    }
  }

  const createCreditCard = async (payload) => {
    showGlobalLoading(true)
    try {
      const response = await apiService.creditCardService.saveCard(
        payload,
        currentAuthUser.value.userSeqNo
      )
      if (response.success) {
        router.push(AppRoutes.myPage.creditCard)
      } else {
        modalAlertState.showModal = true
        modalAlertState.description = response.message
      }
    } finally {
      showGlobalLoading(false)
    }
  }

  const changeStatusModalAlert = (status) => {
    modalAlertState.showModal = status
  }

  const changeVisibleModalDelete = (status) => {
    visibleModalDelete.value = status
  }

  const checkPassCodeMatch = async (payload) => {
    showGlobalLoading(true)
    try {
      const response = await apiService.creditCardService.checkMatchPinCode(
        payload,
        currentAuthUser.value.userSeqNo
      )

      if (response.success && response.data.match) {
        modalPinCodeStore.handleUpdateToStepTwo(
          payload.orderPassword,
          'Please enter the password you wish to change'
        )
      } else {
        modalAlertState.showModal = true
        modalAlertState.description = 'Please check again pass'
        modalPinCodeStore.closePinPopup()
      }
    } finally {
      // modalPinCodeStore.closePinPopup()
      showGlobalLoading(false)
    }
  }

  const handleChangeStatusModalReset = (status) => {
    visibleModalReset.value = status
  }

  const resetPinCode = async (payload) => {
    showGlobalLoading(true)
    try {
      const response = await apiService.creditCardService.resetPinCode(
        payload,
        currentAuthUser.value.userSeqNo
      )
      if (!response.success) {
        modalAlertState.showModal = true
        modalAlertState.description = response.message
      }
    } finally {
      handleChangeStatusModalReset(false)
      modalPinCodeStore.closePinPopup()
      showGlobalLoading(false)
    }
  }

  const updatePinCode = async (payload) => {
    showGlobalLoading(true)
    try {
      const response = await apiService.creditCardService.updatePinCard(
        payload,
        currentAuthUser.value.userSeqNo
      )
      if (response.success) {
        modalAlertState.showModal = true
        modalAlertState.description = 'Passcode has been updated.'
        modalAlertState.textBtn = 'OK'
      } else {
        modalAlertState.showModal = true
        modalAlertState.description = response.message
      }
    } finally {
      modalPinCodeStore.closePinPopup()
      showGlobalLoading(false)
    }
  }

  const createPassCode = async (payload) => {
    try {
      showGlobalLoading(true)
      const response = await apiService.creditCardService.createPinCode(
        payload,
        currentAuthUser.value.userSeqNo
      )
      if (response.success) {
        modalPinCodeStore.closePinPopup()
        router.push(AppRoutes.myPage.creditCard)
      } else {
        modalAlertState.showModal = true
        modalAlertState.description = response.message
      }
    } finally {
      showGlobalLoading(false)
    }
  }
  return {
    listCreditCard,
    getListCreditCard,
    updateCreditCard,
    changeStatusModalAlert,
    modalAlertState,
    visibleModalDelete,
    changeVisibleModalDelete,
    deleteCreditCard,
    createCreditCard,
    validPhoneBeforeCreateCard,
    checkPassCodeMatch,
    resetPinCode,
    visibleModalReset,
    handleChangeStatusModalReset,
    statusConditionPinCode,
    updateStatusConditionPinCode,
    updatePinCode,
    createPassCode
  }
})
