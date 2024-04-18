export const ORDER_STATUS = {
  IN_TRANSIT: 'ON_ROUTE',
  SALES_ORDER_COMPLETE: 'SALES_ORDER_COMPLETE',
  SALES_ORDER_CANCEL: 'SALES_ORDER_CANCEL',
  PURCHASE_CONFIRM: 'PURCHASE_CONFIRM',
  INFORMATION_RECEIVED: 'INFORMATION_RECEIVED',
  DELIVERED: 'DELIVERED'
}

export const RETURN_STATUS = {
  RETURN_REQUEST: 'RETURN_REQUEST',
  EXCHANGE_REQUEST: 'EXCHANGE_REQUEST',
  RETURN_REQUEST_APPROVED: 'RETURN_REQUEST_APPROVED',
  PRODUCT_COLLECTION_COMPLETED: 'PRODUCT_COLLECTION_COMPLETED',
  PRODUCT_RECEIVED_COMPLETED: 'PRODUCT_RECEIVED_COMPLETED',
  RETURN_INBOUND_COMPLETE: 'RETURN_INBOUND_COMPLETE',
  RETURN_COMPLETE: 'RETURN_COMPLETE',
  RETURN_CANCEL: 'RETURN_CANCEL',
  RETURN_REJECT: 'RETURN_REJECT',
  EXCHANGE_REJECT: 'EXCHANGE_REJECT',
  EXCHANGE_PROGRESS: 'EXCHANGE_PROGRESS',
  RETURN_REFUND: 'RETURN_REFUND',
  SKIP_INFORMATION_RECEIVED: 'SKIP_INFORMATION_RECEIVED',
  INFORMATION_RECEIVED: 'INFORMATION_RECEIVED',
  RETRIEVED: 'RETRIEVED',
  RETURN_REQUEST_COMPLETE: 'RETURN_REQUEST_COMPLETE',
  RETURN_REQUEST_CANCEL: 'RETURN_REQUEST_CANCE'
}

export const ACTIONS_BUTTON_RETURN = {
  CANCEL: 'CANCEL',
  CHECK_REASON: 'CHECK_REASON',
  DELIVERY_TRACKING: 'DELIVERY_TRACKING'
}

export const VALIDATION_STATUS_ORDER_HISTORY = {
  OCEAN_BLUE: 'OCEAN_BLUE',
  LANDMARK: 'LANDMARK',
  INVALID: 'INVALID',
  NONE: 'NONE'
}

export const IS_VALID_OPTIONS = [
  {
    label: 'All',
    value: ''
  },
  {
    label: 'Standard Order',
    value: 'GENERAL_ORDER'
  },
  {
    label: 'Autoship Order',
    value: 'REGULAR_DELIVERY_ORDER'
  },
  {
    label: 'Bag Order',
    value: 'BAG_ORDER'
  }
]

export const RETURN_EXCHANGE_OPTIONS = [
  {
    label: 'All',
    value: 'ALL'
  },
  {
    label: 'Return',
    value: 'RETURN'
  },
  {
    label: 'Exchange',
    value: 'EXCHANGE'
  }
]

export const REASON_CANCEL_OPTIONS = [
  {
    label: 'Change of mind',
    value: 'SIMPLE_CHANGE_MIND'
  },
  {
    label: 'Plan to add more items in my order.',
    value: 'SUBSCRIBE_CANCEL'
  },
  {
    label: 'Admin cancel',
    value: 'ADMIN_CANCEL'
  },
  {
    label: 'Order mistake',
    value: 'ORDER_MISTAKE'
  },
  {
    label: 'Repayment',
    value: 'REPAYMENT'
  }
]

export const ACTIONS_BUTTON_ORDER = {
  TRACKING: 1,
  CANCEL: 2,
  VIEW_DETAIL: 3,
  WRITE_REVIEW: 4,
  RETURN_REQUEST: 5
}

export const handleRenderTextOrder = (status) => {
  switch (status) {
    case ORDER_STATUS.IN_TRANSIT:
      return {
        textBtn: 'Delivery Tracking',
        textStatus: 'On Route'
      }
    case ORDER_STATUS.SALES_ORDER_COMPLETE:
      return {
        textBtn: 'Cancel Order',
        textStatus: 'Order complete'
      }
    case ORDER_STATUS.DELIVERED:
      return {
        textBtn: 'Write a Review',
        textBtnSecond: 'Return Request',
        textStatus: 'Delivered'
      }
    case ORDER_STATUS.SALES_ORDER_CANCEL:
      return {
        textBtn: 'View Details',
        textStatus: 'Cancel Order'
      }
    default:
      return {
        textBtn: 'Cancel Order',
        textStatus: 'Order complete'
      }
  }
}

export const checkStatusOrder = (status, deliveryStatus, trackingNumber) => {
  if (trackingNumber) {
    if (deliveryStatus?.code === ORDER_STATUS.IN_TRANSIT) {
      return {
        textBtn: 'Delivery Tracking',
        textStatus: 'On Route',
        action: ACTIONS_BUTTON_ORDER.TRACKING
      }
    }
    if (deliveryStatus?.code === ORDER_STATUS.DELIVERED) {
      return {
        textBtnFirst: 'Write a Review',
        textBtnSecond: 'Return Request',
        textStatus: 'Delivered Completed',
        actionFirst: ACTIONS_BUTTON_ORDER.WRITE_REVIEW,
        actionSecond: ACTIONS_BUTTON_ORDER.RETURN_REQUEST
      }
    }
  }
  if (status === ORDER_STATUS.SALES_ORDER_COMPLETE) {
    if (deliveryStatus) {
      return {
        textStatus: 'In Progress'
      }
    }
    return {
      textBtn: 'Cancel Order',
      textStatus: 'Order Complete',
      action: ACTIONS_BUTTON_ORDER.CANCEL
    }
  }
  if (status === ORDER_STATUS.SALES_ORDER_CANCEL) {
    return {
      textBtn: 'View Details',
      textStatus: 'Order Cancelled',
      action: ACTIONS_BUTTON_ORDER.VIEW_DETAIL
    }
  }
  return {
    textBtnFirst: 'Write a Review',
    textBtnSecond: 'Return Request',
    textStatus: 'Delivered',
    actionFirst: ACTIONS_BUTTON_ORDER.WRITE_REVIEW,
    actionSecond: ACTIONS_BUTTON_ORDER.RETURN_REQUEST
  }
}
export const checkStatusReturn = (status) => {
  if ([RETURN_STATUS.RETURN_REQUEST, RETURN_STATUS.EXCHANGE_REQUEST].includes(status)) {
    return {
      textBtn: `Cancel ${RETURN_STATUS.RETURN_REQUEST === status ? 'Return' : 'Exchange'} Request`,
      textStatus: `${RETURN_STATUS.RETURN_REQUEST === status ? 'Return' : 'Exchange'} Requested`,
      action: ACTIONS_BUTTON_RETURN.CANCEL
    }
  }
  if ([RETURN_STATUS.RETURN_REJECT, RETURN_STATUS.EXCHANGE_REJECT].includes(status)) {
    return {
      textBtn: 'Check Reason for Reject',
      textStatus: `${RETURN_STATUS.RETURN_REJECT === status ? 'Return' : 'Exchange'} Reject`,
      action: ACTIONS_BUTTON_RETURN.CHECK_REASON
    }
  }
  if ([RETURN_STATUS.EXCHANGE_PROGRESS].includes(status)) {
    return {
      textBtn: 'Delivery Tracking',
      textStatus: `Exchange in progress`,
      action: ACTIONS_BUTTON_RETURN.DELIVERY_TRACKING
    }
  }
  return {
    textBtn: '',
    textStatus: '',
    action: ''
  }
}
