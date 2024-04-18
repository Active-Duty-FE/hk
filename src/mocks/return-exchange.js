export const notices = [
  'Partial return or exchange is not accepted for kit/set products. You must return or exchange the entire bundled product with included gift.'
]

export const items = {
  code: '2000',
  message: 'success',
  data: [
    {
      cartId: 318,
      productId: 22,
      quantity: 2,
      productNameInfo: {
        fullName: '인셀덤 아쿠아 프로텍션 선 젤 내수용',
        shortName: 'Incellderm Aqua Protection Sunscreen',
        engName: 'Incellderm Aqua Protection Sunscreen'
      },
      salesAmount: 30,
      bp: 27,
      thumbnailUrl:
        'https://dqmx7jipz0ukv.cloudfront.net/INCELLDERM/image/thumbnail/Aqua_Protection_Sunscreen_Thumbnail_1.jpg'
    },
    {
      cartId: 313,
      productId: 22,
      quantity: 2,
      productNameInfo: {
        fullName: '인셀덤 아쿠아 프로텍션 선 젤 내수용',
        shortName: 'Incellderm Aqua Protection Sunscreen',
        engName: 'Incellderm Aqua Protection Sunscreen'
      },
      salesAmount: 30,
      bp: 27,
      thumbnailUrl:
        'https://dqmx7jipz0ukv.cloudfront.net/INCELLDERM/image/thumbnail/Aqua_Protection_Sunscreen_Thumbnail_1.jpg'
    },
    {
      cartId: 314,
      productId: 23,
      quantity: 2,
      productNameInfo: {
        fullName: '인셀덤 아쿠아 프로텍션 선 젤 내수용',
        shortName: 'Incellderm Aqua Protection Sunscreen',
        engName: 'Incellderm Aqua Protection Sunscreen'
      },
      salesAmount: 30,
      bp: 27,
      thumbnailUrl:
        'https://dqmx7jipz0ukv.cloudfront.net/INCELLDERM/image/thumbnail/Aqua_Protection_Sunscreen_Thumbnail_1.jpg'
    },
    {
      cartId: 3142,
      productId: 24,
      quantity: 2,
      productNameInfo: {
        fullName: '인셀덤 아쿠아 프로텍션 선 젤 내수용',
        shortName: 'Incellderm Aqua Protection Sunscreen',
        engName: 'Incellderm Aqua Protection Sunscreen'
      },
      salesAmount: 30,
      bp: 27,
      thumbnailUrl:
        'https://dqmx7jipz0ukv.cloudfront.net/INCELLDERM/image/thumbnail/Aqua_Protection_Sunscreen_Thumbnail_1.jpg'
    }
  ],
  success: true,
  status: 200
}

export const returnOrderDetailsResponse = {
  returnOrderBaseInfo: {
    returnExchangeType: {
      code: 'RETURN',
      text: 'Return'
    },
    returnOrderId: 1,
    returnOrderNumber: 'RP20230314003902',
    salesOrderId: 1,
    salesOrderNumber: 'P20231103009902',
    receptionDatetime: '2023-11-25 06:49:17',
    receptionCompletionDatetime: '2023-11-25 06:49:17',
    returnOrderStatus: {
      code: 'RETURN_REQUEST',
      text: 'Return request'
    },
    isReturnOrderAgree: true,
    isReceptionApproval: true,
    receptionApprovalDatetime: '+1000000000-01-01 00:00:00',
    returnOrderAgreeDatetime: '2023-11-25 06:49:17'
  },
  requestInfo: {
    returnOrderRequestId: 1,
    returnOrderId: 1,
    returnOrderReasonType: {
      code: 'MISTAKE',
      text: 'I placed my order by mistake'
    },
    returnOrderReasonDetail: 'Return detailed reason',
    returnOrderReasonOtherDetail: 'other reason',
    images: [
      {
        originalImageFileName: 'Screenshot : 2023-03-11 AM 11.48.27.png',
        imageFileName: '8b724c71-9e3c-4b25-8704-879869dcf857',
        imageFileUrl: 'order/8b724c71-9e3c-4b25-8704-879869dcf857',
        contentType: 'image/png'
      }
    ]
  },
  deliveryInfo: {
    receiverName: 'Hong Jidong',
    receiverPhoneNumber: '010-111-2222',
    receiverHomePhone: '0351-822259',
    zipcode: '12345',
    address: 'Gangnam-dong, Gangnam-gu, Seoul',
    addressDetail: 'first floor'
  },
  paymentInfo: {
    paymentAmount: 1000,
    returnShipping: 100,
    restockingFee: 100,
    rebate: 100,
    smCommision: 100,
    etc: 10,
    refundMethod: {
      code: 'CREDIT_CARD',
      text: 'Credit Card'
    },
    cardNumber: '4444-****-****-1111',
    cardName: 'Alex',
    total: 960,
    redepositPoints: 10,
    redemptionCancellationPoints: -20
  },
  returnOrderProductList: [
    {
      productId: 1,
      productName: 'test product',
      optionValues: [
        {
          optionName: 'test',
          type: {
            code: 'IMAGE',
            text: 'Image'
          },
          imageName: 'test.img',
          optionValue: 'test'
        }
      ],
      quantity: 1,
      thumbnailUrl: 'product/gjheorgoeijgoergjoregj',
      saleAmount: 1000,
      bp: 1000,
      trackingNumber: 'test',
      warehouse: 'testwarehouse'
    },
    {
      productId: 2,
      productName: 'test product2',
      optionValues: [
        {
          optionName: 'test',
          type: {
            code: 'IMAGE',
            text: 'Image'
          },
          imageName: 'test.img',
          optionValue: 'test'
        }
      ],
      quantity: 1,
      thumbnailUrl: 'product/gjheorgoeijgoergjoregj',
      saleAmount: 1200,
      bp: 1200,
      trackingNumber: 'test2',
      warehouse: 'testwarehouse2'
    }
  ]
}

export const historyResponse = {
  pageSize: 20,
  pageNumber: 1,
  totalPageNumber: 1,
  totalSize: 2,
  list: [
    {
      returnOrderBaseInfo: {
        returnExchangeType: {
          code: 'RETURN',
          text: 'Return'
        },
        returnOrderId: 1,
        returnOrderNumber: 'RP20230314003902',
        salesOrderId: 1,
        salesOrderNumber: 'P20230314003902',
        receptionDatetime: '2023-11-25 06:49:17',
        receptionCompletionDatetime: '2023-11-25 06:49:17',
        returnOrderStatus: {
          code: 'RETURN_REQUEST',
          text: 'Return request'
        },
        isReturnOrderAgree: true,
        isReceptionApproval: true,
        receptionApprovalDatetime: '+1000000000-01-01 00:00:00',
        returnOrderAgreeDatetime: '2023-11-25 06:49:17'
      },
      requestInfo: {
        returnOrderRequestId: 1,
        returnOrderId: 1,
        returnOrderReasonType: {
          code: 'MISTAKE',
          text: 'I placed my order by mistake'
        },
        returnOrderReasonDetail: 'Return detailed reason',
        returnOrderReasonOtherDetail: 'Other Return detailed reason',
        images: []
      },
      returnOrderProductList: [
        {
          productId: 1,
          productName: 'test product',
          optionValues: [
            {
              optionName: 'test',
              type: {
                code: 'IMAGE',
                text: 'Image'
              },
              imageName: 'test.img',
              optionValue: 'test'
            }
          ],
          quantity: 1,
          thumbnailUrl: 'product/gjheorgoeijgoergjoregj',
          saleAmount: 1000,
          bp: 1000,
          trackingNumber: 'test',
          warehouse: 'testwarehouse'
        },
        {
          productId: 1,
          productName: 'test product',
          optionValues: [
            {
              optionName: 'test',
              type: {
                code: 'IMAGE',
                text: 'Image'
              },
              imageName: 'test.img',
              optionValue: 'test'
            }
          ],
          quantity: 1,
          thumbnailUrl: 'product/gjheorgoeijgoergjoregj',
          saleAmount: 1000,
          bp: 1000,
          trackingNumber: 'test',
          warehouse: 'testwarehouse'
        }
      ]
    }
  ]
}
