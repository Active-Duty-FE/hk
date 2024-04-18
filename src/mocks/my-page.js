export const points = [
  {
    date: '2023-01-01 11:11:11',
    amount: 1000000,
    increase: true,
    current: 3000000,
    historyNumber: 'M00001'
  },
  {
    date: '2023-11-11 11:11:11',
    amount: 1000000,
    increase: false,
    current: 2000000,
    historyNumber: 'M00002'
  }
]

export const morePoints = [
  {
    date: '2023-01-01 11:11:11',
    amount: 1000000,
    increase: true,
    current: 3000000,
    historyNumber: 'M00001'
  },
  {
    date: '2023-11-11 11:11:11',
    amount: 1000000,
    increase: false,
    current: 2000000,
    historyNumber: 'M00002'
  }
]

export const PURCHASE_STATUS = {
  subscriptionId: 1,
  paymentDay: 10,
  nextPaymentDay: '2023-11-07',
  turningTrain: 1,
  unShowTurningTrain: 1,
  totalPoint: 3000,
  skipCount: 0,
  userDeliveryId: 1,
  userPaymentId: 1,
  totalSalesAmount: 50000,
  turningTrainStatus: {
    code: 'BEFOR_PAYMENT',
    text: 'Trước khi thanh toán'
  },
  accrualRate: 15,
  accrualPoint: 15000,
  subscriptionProductDtoList: [
    {
      productId: 1,
      productOptionId: 1,
      name: 'Lifening Deep Tox',
      shortName: '-',
      subscriptionProductId: 1,
      salesAmount: 10000,
      salesAmountAfterDiscount: 10000,
      salesAmountDiscountAfterRank: 100,
      bp: 500,
      quantity: 2,
      isDiscontinued: false,
      thumbnailUrl: 'product/cream.png'
    },
    {
      productId: 1,
      productOptionId: 1,
      name: 'Inseldom Active Clean Up Powder (R)',
      shortName: 'active clean up powder',
      subscriptionProductId: 2,
      salesAmount: 10000,
      salesAmountAfterDiscount: 10000,
      salesAmountDiscountAfterRank: 100,
      bp: 2500,
      quantity: 2,
      isDiscontinued: false,
      thumbnailUrl: 'product/cream.png'
    }
  ],
  turningTrainDtoList: [
    {
      subscriptionTurningTrainId: 1,
      turningTrain: 1,
      unShowTurningTrain: 1,
      isSkip: false,
      turningTrainStatus: {
        code: 'COMPLETE_PAYMENT',
        text: 'Hoàn thành thanh toán'
      },
      paymentScheduleDate: '2023-11-07',
      totalPoint: 3000,
      roundGift: 1,
      hasGift: false
    },
    {
      subscriptionTurningTrainId: 2,
      turningTrain: 2,
      unShowTurningTrain: 2,
      isSkip: false,
      turningTrainStatus: {
        code: 'BEFOR_PAYMENT',
        text: 'Trước khi thanh toán'
      },
      paymentScheduleDate: '2023-11-07',
      totalPoint: 3000,
      roundGift: 1,
      hasGift: false
    },
    {
      subscriptionTurningTrainId: 3,
      turningTrain: 3,
      unShowTurningTrain: 3,
      isSkip: false,
      turningTrainStatus: {
        code: 'BEFOR_PAYMENT',
        text: 'Trước khi thanh toán'
      },
      paymentScheduleDate: '2023-11-07',
      totalPoint: 3000,
      roundGift: 1,
      hasGift: false
    }
  ],
  returnTurningTrainDtoList: [
    {
      returnTurningTrainId: 1,
      subscriptionTurningTrainId: 1,
      turningTrain: 1,
      totalReturnAmount: 30000
    },
    {
      returnTurningTrainId: 2,
      subscriptionTurningTrainId: 2,
      turningTrain: 2,
      totalReturnAmount: 30000
    }
  ]
}
