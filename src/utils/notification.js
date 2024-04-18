import { NotifyEnum } from '@/helpers/enum'
import router from '@/router'
import { AppRoutes } from '@/router/path'

export const gotoSpecificPageByNotify = (type) => {
  let page = ''
  switch (type) {
    case NotifyEnum.COUPON: {
      page = AppRoutes.myPage.coupon.path
      break
    }
    case NotifyEnum.EVENT: {
      // need change
      break
    }
    case NotifyEnum.INQUIRY: {
      page = AppRoutes.myPage.myInquiry.path
      break
    }
    case NotifyEnum.NOTICE: {
      // need change to list notice
      break
    }
    case NotifyEnum.POINT: {
      page = AppRoutes.myPage.point.path
      break
    }
    case NotifyEnum.RETURN: {
      page = AppRoutes.returnExchange.path
      break
    }
    case NotifyEnum.SALE: {
      // need change
      break
    }
    case NotifyEnum.SUBSCRIPTION: {
      page = AppRoutes.cart.list.path
      break
    }
  }
  if (page) router.push(page)
}
