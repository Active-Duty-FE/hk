import apiService from '@/http/api'
import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { useGlobalLoadingStore } from './loading'

export const useOrderHistory = defineStore('order-history', () => {
  const globalLoadingStore = useGlobalLoadingStore()
  const { showGlobalLoading } = globalLoadingStore
  const listOrderHistory = ref([])
  const detailOrderHistory = ref({})

  const DEFAULT_DATA = {
    pageNumber: 1,
    pageSize: 10,
    totalSize: 0,
    salesOrderType: ''
  }
  const pageState = reactive({
    visibleCancelOrder: false,
    itemOrderHistory: {},
    ...DEFAULT_DATA,
    startDate: '',
    endDate: '',
    showModalAlert: false,
    descriptionAlert: ''
  })

  const getOrderHistory = async (params) => {
    showGlobalLoading(true)
    try {
      const response = await apiService.myPageService.getOrderHistory(params)
      if (response.success) {
        const data = response.data?.list || []
        if (params?.pageNumber === 1) listOrderHistory.value = data
        else {
          listOrderHistory.value.push(...data)
        }

        pageState.totalSize = response.data?.totalSize
      }
    } finally {
      showGlobalLoading(false)
    }
  }

  const getOrderHistoryDetail = async (id) => {
    showGlobalLoading(true)
    try {
      const response = await apiService.myPageService.getDetailOrder(id)
      if (response.success) {
        detailOrderHistory.value = response.data
      }
    } finally {
      showGlobalLoading(false)
    }
  }
  const updatePageStateOrderHistory = (data) => {
    Object.assign(pageState, data)
  }

  const handleStatusModalAlert = (status, content) => {
    pageState.showModalAlert = status
    pageState.descriptionAlert = content
  }

  const handleWhenCancelSuccess = (id, response, isDetail) => {
    if (response.success) {
      updatePageStateOrderHistory({
        ...pageState,
        ...DEFAULT_DATA
      })
      if (!isDetail) {
        getOrderHistory({
          pageNumber: 1,
          pageSize: 10,
          salesOrderType: '',
          startDate: pageState.startDate,
          endDate: pageState.endDate
        })
      } else {
        getOrderHistoryDetail(id)
      }
      handleStatusModalAlert(true, 'Cancellation request has been completed .')
    } else {
      handleStatusModalAlert(true, response.message)
    }
    pageState.visibleCancelOrder = false
  }

  const cancelOrderHistory = async (id, payload, isDetail) => {
    showGlobalLoading(true)
    try {
      const response = await apiService.myPageService.cancelOrderHistory(id, payload)
      handleWhenCancelSuccess(id, response, isDetail)
    } finally {
      showGlobalLoading(false)
    }
  }
  const cancelOrderAutoShipHistory = async (id, isDetail) => {
    showGlobalLoading(true)
    try {
      const response = await apiService.orderService.cancelAutoShipHistory(id)
      handleWhenCancelSuccess(id, response, isDetail)
    } finally {
      showGlobalLoading(false)
    }
  }

  const resetData = () => {
    pageState.pageNumber = 1
    pageState.pageSize = 10
    pageState.totalSize = 0
    pageState.salesOrderType = ''
    listOrderHistory.value = []
  }

  const closeCancelOrder = () => {
    pageState.visibleCancelOrder = false
  }
  return {
    listOrderHistory,
    getOrderHistory,
    pageState,
    updatePageStateOrderHistory,
    cancelOrderHistory,
    handleStatusModalAlert,
    getOrderHistoryDetail,
    detailOrderHistory,
    cancelOrderAutoShipHistory,
    resetData,
    closeCancelOrder
  }
})
