export const ButtonSocialGroupEnum = {
  LOGIN: 'login',
  REGISTER: 'register'
}
export const AuthenticateTabEnum = {
  CONSUMER: 'consumer',
  PLANNER: 'beauty-planner'
}
export const AuthUserEnum = {
  CONSUMER: 'consumer',
  PLANNER: 'beauty-planner',
  CO_OPERATE: 'co_operate'
}
export const SNSEnum = {
  FACEBOOK: 'FACEBOOK',
  GOOGLE: 'GOOGLE'
}
export const CardEnum = {
  PLANNER: 'PERSONAL',
  CORPORATION: 'BUSINESS'
}
export const ProductDescriptionTabEnum = {
  HOW_TO: 'HOW TO',
  INGREDIENTS: 'INGREDIENTS',
  SUSTAINABILITY: 'SUSTAINABILITY'
}
export const OrderTypeEnum = {
  GENERAL_ORDER: 'GENERAL_ORDER',
  STANDARD_ORDER: 'STANDARD_ORDER',
  ALL: 'All',
  BAG_ORDER: 'BAG_ORDER',
  SUBSCRIBE_ORDER: 'SUBSCRIBE_ORDER'
}
export const UserStatusEnum = {
  WITHDRAWAL: 'WITHDRAWAL',
  ACTIVATED: 'ACTIVATED'
}
export const CalendarViewModeEnum = {
  GRID: 'GRID',
  LIST: 'LIST'
}

export const MenuLevel = {
  ONE: 1,
  TWO: 2,
  THREE: 3
}

export const MenuType = {
  CATEGORY: 'CATEGORY',
  PAGE: 'PAGE',
  RITUAL: 'RITUAL'
}

export const ProductClassEnum = {
  RITUAL: 'RITUAL'
}

export const ProductCombineEnum = {
  INDIVIDUAL: 'INDIVIDUAL',
  COMBINATION: 'COMBINATION'
}

export const ProductVariantEnum = {
  IMAGE: 'IMAGE',
  TEXT: 'TEXT',
  BUTTON: 'BUTTON',
  SELECT: 'SELECT'
}

export const BAG_STATUS = {
  OUT_OF_STOCK: 'OUT OF STOCK',
  CAN_NOT_BE_USED: 'UNAVAILABLE'
}

export const PRODUCT_STATUS = {
  SOLD_OUT: BAG_STATUS.OUT_OF_STOCK,
  PAUSE: BAG_STATUS.CAN_NOT_BE_USED
}

export const PRODUCT_STATUS_ENUM = {
  SOLD_OUT: 'SOLD_OUT',
  PAUSE: 'PAUSE'
}

export const NotifyEnum = {
  COUPON: 'COUPON',
  INQUIRY: 'INQUIRY',
  NOTICE: 'NOTICE',
  EVENT: 'EVENT',
  SALE: 'SALE',
  RETURN: 'RETURN',
  POINT: 'POINT',
  SUBSCRIPTION: 'SUBSCRIPTION'
}

export const InquiryFormType = {
  GENERAL_INQUIRY: 'GENERAL_INQUIRY',
  ORDER_INQUIRY: 'ORDER_INQUIRY'
}

export const InquiryStatusEnum = {
  COMPLETED: 'COMPLETED',
  RECEIPT: 'RECEIPT',
  TRANSFER: 'TRANSFER',
  CHECKING: 'CHECKING'
}

export const ProductSaleStatus = {
  ON_SALE: 'ON_SALE',
  PAUSE: 'PAUSE',
  SOLD_OUT: 'SOLD_OUT'
}

export const ProductSaleStatusText = {
  PAUSE: 'UNAVAILABLE',
  SOLD_OUT: 'OUT OF STOCK'
}

export const CouponStatusEnum = {
  PUBLISHED: 'Issued',
  USED: 'Used',
  EXPIRED: 'Expired',
  CANCELED: 'Canceled',
  DELETED: 'Deleted'
}

export const PaymentMethodEnum = {
  CREDIT_CARD: 'CREDIT_CARD',
  APPLE_PAY: 'applePayCyberSource'
}

export const CountryEnum = {
  US: { label: 'United States', value: 'US' },
  CA: { label: 'Canada', value: 'CA' },
  HK: { label: 'Hong Kong', value: 'HK' }
}

export const AutoshipRoundEnum = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3
}

export const RankUserEnum = {
  PLANNER: 'PLANNER'
}

export const NfrImportProductEnum = {
  NFR: 'NFR',
  IMPORT: 'Import'
}

export const CartTypeEnum = {
  STANDARD_ORDER: 'STANDARD_ORDER',
  NFR_IMPORT: 'NFR_IMPORT'
}

export const LevelUserEnum = {
  POOL: 'POOL',
  POOL_PLUS: 'POOL_PLUS',
  POOL_PREMIUM: 'POOL_PREMIUM',
  PLANNER: 'PLANNER',
  MANAGER: 'MANAGER',
  SENIOR_MANAGER: 'SENIOR_MANAGER',
  TEAM_LEADER: 'TEAM_LEADER',
  SENIOR_DIRECTOR: 'SENIOR_DIRECTOR',
  DIRECTOR: 'DIRECTOR',
  NATIONAL_DIRECTOR: 'NATIONAL_DIRECTOR',
  EXECUTIVE: 'EXECUTIVE'
}

export const AUTOSHIP_STATUS_ENUM = {
  BEFOR_PAYMENT: 'BEFOR_PAYMENT',
  COMPLETE_PAYMENT: 'COMPLETE_PAYMENT',
  CANCEL_PAYMENT: 'CANCEL_PAYMENT',
  RETURN_ORDER: 'RETURN_ORDER',
  PARTIAL_RETURN_ORDER: 'PARTIAL_RETURN_ORDER',
  MISS_ORDER: 'MISS_ORDER',
  FAIL_PAYMENT: 'FAIL_PAYMENT'
}

export const AppleStatusEnum = {
  CANCEL: 'ApplePaySessionCanceled',
  SUCCESS: 'success',
  LOADED: 'ApplePayLoaded'
}

export const ShoppingBagTabEnum = {
  STANDARD: 'STANDARD',
  AUTOSHIP: 'AUTOSHIP',
  NFR_IMPORT: 'NFR_IMPORT'
}

export const CouponPolicyDiscountEnum = {
  RATE: 'RATE_DISCOUNT',
  PRICE: 'AMOUNT_DISCOUNT',
  FREE: 'FREE_SUPPORT'
}

export const StatusChangeProductAutoShipEnum = {
  ADD: 'ADD',
  CHANGE: 'CHANGE'
}

export const CurrencyPoint = {
  POINT: 'POINT'
}

export const ImageActionEnum = {
  EDIT: 'EDIT',
  REMOVE: 'REMOVE',
  NONE: 'NONE'
}

export const MemberShipFeeEnum = {
  WAITING: 'WAITING',
  FREE: 'FREE'
}

export const CmsTypeEnum = {
  INGREDIENTS: 'INGREDIENTS',
  RITUAL: 'RITUAL'
}

export const CmsDisplayTypeEnum = {
  CONTENT: 'CONTENT',
  NONE: 'NONE',
  TITLE: 'TITLE',
  BANNER: 'BANNER',
  RELATED_PAGE: 'RELATED_PAGE'
}

export const IngredientsEnum = {
  TOP: 0,
  LEFT_FIRST: 1,
  LEFT_SECOND: 2,
  RIGHT: 3,
  TOTAL_A_BLOCK: 4
}

export const ExploreRimanNameEnum = {
  EXPLORE_RIMAN: 'explore riman'
}

export const FaqEnum = {
  ENROLLMENT: 'ENROLLMENT',
  BUSINESS_ENTITY: 'BUSINESS_ENTITY',
  TERMINATION: 'TERMINATION',
  E_WALLET: 'E_WALLET',
  COMMISSION: 'COMMISSION',
  ORDER_RETURN: 'ORDER_RETURN',
  AUTOSHIP: 'AUTOSHIP',
  POOL_REWARD_PROGRAM: 'POOL_REWARD_PROGRAM',
  PRODUCTS: 'PRODUCTS',
  BAG: 'BAG',
  COUPONS_PRODUCT_CREDITS: 'COUPONS_PRODUCT_CREDITS'
}

export const CountryPriceEnum = {
  USD: 'USD'
}

export const OrderTypeCouponEnum = {
  STANDARD_ORDER: 'STANDARD_ORDER',
  AUTO_SHIP: 'AUTO_SHIP',
  ALL: 'ALL'
}

export const TimeZoneEnum = {
  START_TIME: '00:00:00',
  END_TIME: '23:59:59'
}

export const PlannerTermsEnum = {
  PROCEDURE: 7,
  TERM_POLICIES: 8,
  NOTICE: 3,
  RETURN: 15,
  SHIPPING: 16
}

export const CustomerTermsEnum = {
  TERMS: 1,
  PERSONAL_INFORMATION: 2,
  NOTICE: 3
}

export const PlannerRegisterTermsEnum = {
  TERM: 'USE_FOR_ECOMMERCE',
  PERSONAL_INFORMATION: 'PERSONAL_INFO',
  NOTICE: 'NOTICE_TO_MEMBER',
  RETURN: 'RETURN_TERM',
  SHIPPING: 'SHIPPING_TERM',
  ORDER_TERM: 'ORDER_TERM',
  PROCEDURE: 'POLICE_PROCEDURE',
  TERM_CONDITION: 'TERM_CONDITION'
}

export const GNB_DISPLAY_TYPE = {
  HORIZONTAL: 'HORIZONTAL',
  VERTICAL: 'VERTICAL'
}

export const FONT_COLOR = {
  WHITE: 'WHITE',
  BLACK: 'BLACK'
}

export const ProductRitualExploreEnum = {
  CLEANSE: 'CLEANSE',
  HYDRATE: 'HYDRATE',
  PROTECT: 'PROTECT',
  SET: 'SET'
}

export const DisplayTypePolicyEnum = {
  RETURN_POLICY: 'RETURN_POLICY',
  SHIPPING: 'SHIPPING'
}

export const TypeServiceEnum = {
  POLICY: 'POLICY',
  NOTICE: 'NOTICE',
  ARCHIVE: 'ARCHIVE'
}

export const TypeCategoryEnum = {
  LOWER: 'Lower',
  UPPER: 'Upper'
}
