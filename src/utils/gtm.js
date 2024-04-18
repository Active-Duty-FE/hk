import { fullProducts } from '@/mocks/products'

export const getMocksDataProduct = (id) => {
  return fullProducts.find((item) => item.id === id)
}

// [GTM] Product Detail
export const gtmViewItem = (item) => {
  window.dataLayer?.push({
    event: 'view_item',
    ecommerce: {
      value: item.salesAmount,
      items: [
        {
          item_id: item?.productId,
          item_name: item?.productEnglishName,
          item_brand: item?.mainCategory || '', // need change when mapping api
          price: item?.salesAmount,
          quantity: 1
        }
      ]
    }
  })
}

// [GTM] cart
export const gtmAddToCart = (item, quantity = 1) => {
  window.dataLayer?.push({
    event: 'add_to_cart',
    ecommerce: {
      value: item?.salesAmount,
      items: [
        {
          item_id: item?.productId,
          item_name: item?.productEnglishName,
          item_brand: item?.mainCategory, // need change when mapping api
          price: item?.salesAmount,
          quantity: quantity
        }
      ]
    }
  })
}

// [GTM] input order form to pay
export const gtmCheckout = (item) => {
  const ecommerce = []

  item.forEach((n) => {
    ecommerce.push({
      item_id: n?.productBaseDto?.productId,
      item_name: n?.productNameDto?.engName,
      item_brand: n?.category || '', // need change when mapping api
      price: n?.purchaseAmountAfterRank,
      quantity: n?.productBaseDto?.quantity
    })
  })
  window.dataLayer?.push({
    event: 'begin_checkout',
    ecommerce: {
      items: ecommerce
    }
  })
}

// [GTM] Order Complete
export const gtmPurchase = (item) => {
  const ecommerce = []
  item.productList.forEach((n) => {
    ecommerce.push({
      item_id: n?.productId,
      item_name: n.productName,
      item_brand: n?.category || '', // need change when mapping api
      price: n?.saleAmount,
      quantity: n?.quantity
    })
  })

  window.dataLayer?.push({
    event: 'purchase',
    ecommerce: {
      transaction_id: item?.salesOrderNumber, // 주문번호
      shipping: item?.deliveryFeeAmount, // 배송비
      value: item?.totalAmount, // 총금액
      items: ecommerce
    }
  })
}
