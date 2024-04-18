import { defineStore } from 'pinia'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import apiService from '@/http/api'
import { getAddressList } from '@/utils/address'
import { STATUS_PAYMENT } from '@/helpers/constant'
import { useNotification } from '@/composables/notification'

const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading

export const useOrderStore = defineStore('order', {
  state: () => ({
    addressList: [],
    saleTaxOrder: 0,
    listCards: [],
    cardForPayment: {},
    dataPayment: {},
    passValidFormPayment: false,
    loadingCellphone: false,
    loadingVerifyCodePhone: false,
    tokenPhone: '',
    matchPhone: false,
    modalAlertState: {
      showModal: false,
      descriptionModal: ''
    },
    visibleModalUnAuthCard: false,
    statusPinCode: {
      create: false,
      match: false,
      pinCode: ''
    },
    visibleAuthCard: false,
    listCoupons: [],
    amountDiscountFromCoupon: 0,
    listCouponsChoose: [],
    pointInfo: {},
    totalPoint: null,
    messageTax: null
  }),

  actions: {
    handleChangeModalAlertState(showModal, descriptionModal) {
      this.modalAlertState = { showModal, descriptionModal }
    },
    async getAddressSavedList() {
      showGlobalLoading(true)
      this.addressList = await getAddressList()
      showGlobalLoading(false)
    },
    async calculateTaxOrder(data) {
      this.messageTax = null
      const { showNotification } = useNotification()
      const response = await apiService.orderService.calculateTaxOrderForAuth(data)

      const { totalTaxAmount } = response.data
      this.saleTaxOrder = totalTaxAmount
      if (!response.success) {
        this.messageTax = response?.data
        showNotification({ type: 'error', duration: 3, message: response?.data })
      }
    },
    async getListCard(id, getDefaultCard) {
      const response = await apiService.creditCardService.getListCard(id)
      if (response.success) {
        const { data } = response
        this.listCards = data?.reverse()
        const defaultCard = data.find((e) => e.defaultCard && !e.block)
        if (defaultCard && getDefaultCard) {
          this.cardForPayment = defaultCard
          this.updateDataPayment(
            { ...this.dataPayment, statusPayment: STATUS_PAYMENT.CREATE_CARD },
            true
          )
        }
        if (data.length === 0 || !defaultCard) this.cardForPayment = {}
      }
    },
    changeCardForPayment(data) {
      this.cardForPayment = data
    },
    updateDataPayment(data, status) {
      this.dataPayment = data
      this.passValidFormPayment = status
    },
    updatePassValidFormPayment(status) {
      this.passValidFormPayment = status
    },
    async sendPhoneCardAuth(payload) {
      this.loadingCellphone = true
      try {
        const response = await apiService.authService.sendPhoneCard(payload)
        if (response.success) {
          this.tokenPhone = response.data.token
        }
      } finally {
        this.loadingCellphone = false
      }
    },
    async verifyCodePhoneCardAuth(payload) {
      this.loadingVerifyCodePhone = true
      try {
        const response = await apiService.authService.verifyPhoneCard(payload)
        if (response.success) {
          this.matchPhone = response.data.match
        }
      } finally {
        this.loadingVerifyCodePhone = false
      }
    },

    handleChangeVisibleModalUnLock(status) {
      this.visibleModalUnAuthCard = status
    },
    async unlockFavoriteCard(payload, id) {
      showGlobalLoading(true)
      try {
        const response = await apiService.creditCardService.unlockCard(payload, id)
        if (response.success) {
          this.getListCard(id)
        } else {
          this.modalAlertState = {
            showModal: true,
            descriptionModal: response.message
          }
        }
      } finally {
        showGlobalLoading(false)
        this.handleChangeVisibleModalUnLock(false)
      }
    },
    updateStatusConditionPinCode(data) {
      this.statusPinCode = data
    },
    handleChangeVisibleAuthCard(status) {
      this.visibleAuthCard = status
    },
    closeModalAuthRemove() {
      this.visibleAuthCard = false
      this.handleChangeVisibleModalUnLock(true)
    },
    resetStoreOrder() {
      this.addressList = []
      this.saleTaxOrder = 0
      this.listCards = []
      this.cardForPayment = {}
      this.dataPayment = {}
      this.passValidFormPayment = false

      this.tokenPhone = ''
      this.matchPhone = false

      this.statusPinCode = {
        create: false,
        match: false,
        pinCode: ''
      }

      this.listCoupons = []
      this.amountDiscountFromCoupon = 0
      this.listCouponsChoose = []
      this.pointInfo = {}
      this.totalPoint = null
    },
    async getListCoupons(params) {
      const response = await apiService.orderService.getCouponList(params)
      if (response.success) {
        this.listCoupons = response.data
      }
    },
    changeAmountDiscountFromCoupon(data) {
      this.amountDiscountFromCoupon = data
    },
    changeListCouponsChoose(data) {
      this.listCouponsChoose = data
    },
    async getPointOrder(id) {
      const response = await apiService.orderService.getPointOrder(id)
      if (response.success) {
        this.pointInfo = response.data
      }
    },
    changeTotalPoint(point) {
      this.totalPoint = point
    }
  }
})
