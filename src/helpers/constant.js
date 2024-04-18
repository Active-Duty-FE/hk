import { AppRoutes } from '@/router/path'
import { LevelUserEnum, PaymentMethodEnum, FaqEnum } from '@/helpers/enum'
import Canada from '@assets/svgs/country/canada.svg?url'
import Taiwan from '@assets/svgs/country/taiwan.svg?url'
import USA from '@assets/svgs/country/usa.svg?url'
import Pool from '@/assets/images/avatar/pool.png'
import PoolPlus from '@/assets/images/avatar/pool-plus.png'
import PoolPremium from '@/assets/images/avatar/pool-premium.png'

export const BLOG_VISIBILITY = false

export const ACCESS_TOKEN = 'ACCESS_TOKEN'
export const PERMISSION = 'PERMISSION'
export const STORAGE_SNS_DATA = 'sns-data'
export const STORAGE_USER_TYPE = 'user-type'
export const STORAGE_USER_NUMBER = 'user-number'
export const STORAGE_ENTER_INFORMATION = 'enter-information'
export const STORAGE_ENTER_SHIPPING_DATA = 'enter-shipping-data'
export const STORAGE_ADS_POPUP = 'time-ads-popup'
export const STORAGE_SAVE_ACCOUNT = 'save-account'
export const STORAGE_AUTOMATIC_LOGIN = 'automatic-login'
export const STORAGE_USER_NUMBER_FIND_ACCOUNT = 'user-number-find-account'
export const STORAGE_ACCESS_TOKEN = 'access-token'
export const STORAGE_ACCESS_TOKEN_EXPIRE = 'access-token-expire'
export const STORAGE_REFRESH_TOKEN = 'refresh-token'
export const STORAGE_IS_LOGGED_IN = 'is-logged-in'
export const STORAGE_ID_REGISTER_SUCCESS = 'id_register_success'
export const STORAGE_REFERRAL_CODE = 'referrer-code'
export const STORAGE_IP_ADDRESS = 'ip-address'
export const STORAGE_MAINTAIN_POPUP = 'maintain-popup'
export const STORAGE_STEP_SKIN_QUIZ = 'step-skin-quiz'
export const STORAGE_BACK_SKIN_QUIZ = 'back-skin-quiz'
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
export const STATUS_SUCCESS = 'SUCCESS'
export const NO_SNS = 'NONE'
export const STORAGE_CURRENT_STEP = 'current-step-register'
export const STORAGE_INC_NUMBER = 'inc_number'
export const BIRTH_CUSTOMER_YEAR = 18
export const BIRTH_BEAUTY_PLANER_YEAR = 18
export const CELLPHONE_LENGTH = 8
export const MIN_POINT = 10
export const STORAGE_MENUS_FLAT = 'menu-flat'

export const SEND_EMAIL_FAILED = '4007'

export const TITLE_HEAD_REGISTER = 'Sign Up'
export const EXPONENT = '0'
export const TIME_OUT_FOR_AUTH_EMAIL = '5000'
export const VALUE_ISO = 'True'
export const RESPONSE_CODE_VALID_EMAIL = 'Valid'
export const PRODUCT_SHEET_CHECKOUT = 'product-sheet-checkout'
export const ROLE_CONVERSION = 'role-conversion'
export const CONVERSION_ENTER_INFORMATION = 'conversion_enter_information'
export const CONVERSION_SHIPPING = 'conversion_shipping'
export const MESSAGE_ERROR_CART_LIST = 'error'
export const VALID_CODE_ADDRESS_ORDER = '4000'
export const PREFIX_K_STORE = 'INC'
export const URL_LANDMARK = 'https://track.landmarkglobal.com/?search='
export const URL_OCEAN_BLUE = 'https://www.fedex.com/fedextrack/?trknbr='
export const MARKETING_TERM_ID = [4, 9]

export const CONTENT_TYPE_VIDEO = ['video/mp4']

export const TYPE_NAME = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  CARD_FIRST_NAME: 'cardFirstName',
  CARD_LAST_NAME: 'cardLastName'
}

export const TERMS_TYPE = 'USE_TERMS'
export const TERMS_USE_TYPE = {
  CONTACT_US: 'CONTACT_US',
  SHIPPING: 'SHIPPING',
  RETURN_POLICY: 'RETURN_POLICY'
}

export const RETURN_AGREEMENT_TERMS = [
  {
    label: 'Coupons are non-refundable.'
  },
  {
    label: 'Points that have expired cannot be redeposited.'
  },
  {
    label: 'Return shipping fees may apply depending on the reason for the return.'
  },
  {
    label: 'Return refund information is an estimate and may change upon final return processing.'
  }
]

export const CHOOSE_CARD = {
  AVAILABLE_CARD: 1,
  ENTER_CARD: 2
}

export const RETURN_AGREEMENT_STATE = {
  ESTIMATED_REFUND: 'ESTIMATED_REFUND',
  RETURN_REFUND: 'RETURN_REFUND'
}

export const INVALID_DATE = 'Invalid Date'

export const LIST_TYPE_COMPANY = [
  {
    value: 'COMPANY',
    label: 'COMPANY'
  },
  {
    value: 'LIMITED',
    label: 'LIMITED'
  }
]

export const STATUS_CODE_VERIFY_MAIL = {
  INVALID: 'INVALID',
  EXPIRED: 'EXPIRED'
}

export const PAYMENT_TYPE = {
  CREDIT_CARD: 'CREDIT_CARD',
  SIMPLE_PAYMENT: 'SIMPLE_PAYMENT',
  AUTO_PAYMENT: 'AUTO_PAYMENT',
  POINT: 'POINT',
  APPLE_PAY: 'APPLE_PAY'
}
export const SALE_ORDER_PAYMENT = {
  GENERAL_ORDER: 'GENERAL_ORDER',
  SUBSCRIBE_ORDER: 'SUBSCRIBE_ORDER',
  SUBSCRIBE_IMMEDIATE_PAYMENT: 'SUBSCRIBE_IMMEDIATE_PAYMENT',
  SUBSCRIBE_ADDITIONAL_ORDER: 'SUBSCRIBE_ADDITIONAL_ORDER'
}

export const AUTO_SHIP_TYPE_ORDER = [
  SALE_ORDER_PAYMENT.SUBSCRIBE_ORDER,
  SALE_ORDER_PAYMENT.SUBSCRIBE_IMMEDIATE_PAYMENT,
  SALE_ORDER_PAYMENT.SUBSCRIBE_ADDITIONAL_ORDER
]

export const MESSAGE = {
  SUCCESS: 'success',
  ERROR: 'error',
  COMPLETED: 'COMPLETE',
  OK: 'OK'
}

export const SIZE_CHECKBOX = {
  SMALL: 'small',
  LARGE: 'large'
}

export const ROLES_BE = {
  consumer: 'BEAUTY_CONSUMER',
  no_referral_consumer: 'NON_REF_CUSTOMER',
  planner: 'SOLE_PROPRIETORSHIP',
  corporation: 'COMPANY'
}

export const GRID_VALUE = {
  ONE: 'one',
  FOUR: 'four'
}

export const GENDER_OPTIONS = [
  {
    label: 'Male',
    value: 'MALE'
  },
  {
    label: 'Female',
    value: 'FEMALE'
  },
  {
    label: 'Prefer Not to Disclose',
    value: 'OTHER'
  }
  // {
  //   label: 'Other',
  //   value: 'NONE'
  // }
]

export const VALUE_COUNTRY = {
  US: 'US',
  CA: 'CA',
  HK: 'HK'
}

export const COUNTRY_OPTIONS = [
  {
    label: VALUE_COUNTRY.HK,
    value: VALUE_COUNTRY.HK
  }
]
export const VALID_PHONE_SUCCESS = 'Yes'

export const CA_STATE_OPTIONS = [
  { label: 'Alberta', value: 'AB' },
  { label: 'British Columbia', value: 'BC' },
  { label: 'Manitoba', value: 'MB' },
  { label: 'New Brunswick', value: 'NB' },
  { label: 'Newfoundland Labrador', value: 'NL' },
  { label: 'Nova Scotia', value: 'NS' },
  { label: 'Northwest Territories', value: 'NT' },
  { label: 'Nunavut', value: 'NU' },
  { label: 'Ontario', value: 'ON' },
  { label: 'Edward', value: 'PE' },
  { label: 'Québec', value: 'QC' },
  { label: 'Saskatchewan', value: 'SK' },
  { label: 'Yukon', value: 'YT' }
]

export const US_STATE_OPTIONS = [
  { label: 'Alaska', value: 'AK' },
  { label: 'Alabama', value: 'AL' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'American Samoa', value: 'AS' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Washington', value: 'DC' },
  { label: 'Delaware', value: 'DE' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Guam', value: 'GU' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Maine', value: 'ME' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Northern Mariana Islands', value: 'MP' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Montana', value: 'MT' },
  { label: 'NorthCarolina', value: 'NC' },
  { label: 'NorthDakota', value: 'ND' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'NewHampshire', value: 'NH' },
  { label: 'NewJersey', value: 'NJ' },
  { label: 'NewMexico', value: 'NM' },
  { label: 'Nevada', value: 'NV' },
  { label: 'NewYork', value: 'NY' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Puerto Rico', value: 'PR' },
  { label: 'RhodeIsland', value: 'RI' },
  { label: 'SouthCarolina', value: 'SC' },
  { label: 'SouthDakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Washington', value: 'WA' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'WestVirginia', value: 'WV' },
  { label: 'Wyoming', value: 'WY' }
]

export const VALUE_BILLING = {
  default: 1,
  enter: 2
}

export const BILLING_OPTIONS = [
  {
    label: 'Same as shipping address',
    value: VALUE_BILLING.default
  },
  {
    label: 'Use a different billing address',
    value: VALUE_BILLING.enter
  }
]

export const CARD_OPTIONS = [
  {
    label: 'Credit Card',
    value: PaymentMethodEnum.CREDIT_CARD
  },
  {
    label: 'Apple pay',
    value: PaymentMethodEnum.APPLE_PAY
  }
]
export const BILLING_ORDER_OPTIONS = [
  {
    label: 'Same as shipping address',
    value: VALUE_BILLING.default,
    subText: 'US [90680]\n1860 BEACH BLVD STE H, STANTON, California'
  },
  {
    label: 'Use a different billing address',
    value: VALUE_BILLING.enter
  }
]

export const MONTH_OPTIONS = [
  { label: 'January', value: '01' },
  { label: 'February', value: '02' },
  { label: 'March', value: '03' },
  { label: 'April', value: '04' },
  { label: 'May', value: '05' },
  { label: 'June', value: '06' },
  { label: 'July', value: '07' },
  { label: 'August', value: '08' },
  { label: 'September', value: '09' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' }
]
export const SORT_OPTIONS = [
  {
    label: 'Best Selling',
    value: 'BEST_SELLING'
  },
  {
    label: 'Newest',
    value: 'NEWEST'
  },
  {
    label: 'A-Z',
    value: 'ALPHABET_ASC'
  },
  {
    label: 'Z-A',
    value: 'ALPHABET_DESC'
  },
  {
    label: 'Price (low to high)',
    value: 'PRICE_LOW_TO_HIGH'
  },
  {
    label: 'Price (high to low)',
    value: 'PRICE_HIGH_TO_LOW'
  }
]

export const RETURN_ORDER_REASON_TYPE = {
  DAMAGED: 'DAMAGED',
  DEFECTIVE: 'DEFECTIVE',
  DISSATISFIED: 'DISSATISFIED',
  TIMELY: 'TIMELY',
  MISTAKE: 'MISTAKE'
}

export const DEFAULT_REASONS = {
  ids: Object.values(RETURN_ORDER_REASON_TYPE),
  entities: {
    [RETURN_ORDER_REASON_TYPE.DAMAGED]: {
      label: 'The Product(s) is damaged.',
      option: [
        { label: 'The outer box is damaged.', value: 'The outer box is damaged.' },
        {
          label: 'The product container(s) is broken or dysfunctional.',
          value: 'The product container(s) is broken or dysfunctional.'
        },
        { label: 'Other', value: 'Other' }
      ],
      value: RETURN_ORDER_REASON_TYPE.DAMAGED,
      showOnExchange: false
    },
    [RETURN_ORDER_REASON_TYPE.DEFECTIVE]: {
      label: 'The Product(s) is defective.',
      option: [
        {
          label: 'The product has an odd appearance or smell.',
          value: 'The product has an odd appearance or smell.'
        },
        { label: 'Other', value: 'Other' }
      ],
      value: RETURN_ORDER_REASON_TYPE.DEFECTIVE,
      showOnExchange: false
    },
    [RETURN_ORDER_REASON_TYPE.DISSATISFIED]: {
      label: 'I am dissatisfied with the Product(s)',
      option: [
        { label: 'I have had an allergic reaction.', value: 'I have had an allergic reaction.' },
        {
          label: 'The product(s) isn’t providing the results I expected.',
          value: 'The product(s) isn’t providing the results I expected.'
        },
        { label: 'Other', value: 'Other' }
      ],
      value: RETURN_ORDER_REASON_TYPE.DISSATISFIED,
      showOnExchange: false
    },
    [RETURN_ORDER_REASON_TYPE.TIMELY]: {
      label: 'The product(s) didn’t arrive in a timely manner.',
      option: [],
      value: RETURN_ORDER_REASON_TYPE.TIMELY,
      showOnExchange: false
    },
    [RETURN_ORDER_REASON_TYPE.MISTAKE]: {
      label: 'I placed my order by mistake.',
      option: [
        {
          label: 'I’d like to change the quantity I ordered.',
          value: 'I’d like to change the quantity I ordered.'
        },
        {
          label: 'I’d like to cancel my order completely.',
          value: 'I’d like to cancel my order completely.'
        },
        { label: 'Other', value: 'Other' }
      ],
      value: RETURN_ORDER_REASON_TYPE.MISTAKE,
      showOnExchange: true
    }
  }
}

export const RETURN_EXCHANGE_TABS = [
  {
    label: 'Return',
    value: 0
  },
  {
    label: 'Exchange',
    value: 1
  }
]

export const TYPE_OF_BUSINESS = [
  {
    label: 'Company',
    value: 'CORPORATION'
  },
  {
    label: 'Limited Liability Company (LLC)',
    value: 'LIMITED_LIABILITY_COMPANY'
  },
  {
    label: 'Partnership',
    value: 'PARTNERSHIP'
  },
  {
    label: 'Trust',
    value: 'TRUST'
  }
]

export const OTHER_MENUS = [
  {
    id: 6,
    categoryId: 6,
    name: 'Bestsellers',
    path: 'bestsellers',
    children: []
  },
  {
    id: 7,
    categoryId: 7,
    name: 'Monthly Specials',
    path: 'monthly-specials',
    children: []
  },
  {
    id: 8,
    categoryId: 8,
    name: 'Tools',
    path: 'tools',
    children: []
  }
]

export const MOBILE_MENUS = [
  {
    id: 4,
    categoryId: 4,
    name: 'FIND YOUR RITUAL',
    path: '/skin-quiz',
    children: [],
    shouldStop: true,
    others: [],
    isExternal: true,
    isSkinQuiz: true
  },
  {
    id: 5,
    categoryId: 5,
    name: 'EXPLORE RIMAN',
    path: '/about-us',
    children: [
      {
        id: 40,
        name: 'Explore RIMAN',
        path: 'cleansers-exfoliators',
        children: [
          {
            id: 100,
            name: 'About Us',
            path: '/about-us',
            isExternal: true
          },
          {
            id: 101,
            name: 'Sustainability',
            path: '/sustainability',
            isExternal: true
          },
          {
            id: 102,
            name: 'Ingredients',
            path: '/ingredients',
            isExternal: true
          },
          {
            id: 103,
            name: 'Rituals',
            path: '/ritual',
            isExternal: true
          },
          {
            id: 105,
            name: 'Blog',
            path: '/blogs',
            isExternal: true
          }
        ]
      },
      {
        id: 41,
        name: 'The BYoungPool',
        path: 'cleansers-exfoliators',
        children: [
          {
            id: 100,
            name: 'Business Opportunity',
            path: '/byoung-pool-business',
            isExternal: true
          },
          {
            id: 101,
            name: 'Events',
            path: '/events',
            isExternal: true
          },
          {
            id: 102,
            name: 'RIMAN Retreats',
            path: '/byoung-pool-retreat',
            isExternal: true
          }
        ]
      }
    ],
    shouldStop: false,
    isExternal: true,
    others: []
  }
]

export const NAVIGATION_BLACK_LISTS = [
  AppRoutes.login.name,
  AppRoutes.findAccount.name,
  AppRoutes.register.complete.name,
  AppRoutes.resetPassword.name,
  AppRoutes.changePassword.name,
  AppRoutes.register.onBoarding.name
]
export const ICON_BACK_NAVIGATION_BLACK_LISTS = [AppRoutes.register.complete]

export const GNB_BLACK_LISTS = [AppRoutes.skinQuiz.name]

export const ID_ORDER_CHECKOUT = {
  SHIPPING: 1,
  PAYMENT: 2,
  COUPONS: 3,
  SUMMARY: 4
}
export const ORDER_CHECKOUT_LISTS = [
  {
    id: ID_ORDER_CHECKOUT.SHIPPING,
    title: 'Shipping Address'
  },
  {
    id: ID_ORDER_CHECKOUT.PAYMENT,
    title: 'Payment Method'
  },
  {
    id: ID_ORDER_CHECKOUT.COUPONS,
    title: 'Points & Coupons'
  },
  {
    id: ID_ORDER_CHECKOUT.SUMMARY,
    title: 'Order Information'
  }
]
export const ID_ORDER_DETAIL = {
  PAYMENT: 1,
  SHIPPING: 2,
  REFUND: 3,
  RETURN: 4
}
export const ORDER_DETAIL_LISTS = [
  {
    id: ID_ORDER_DETAIL.PAYMENT,
    title: 'Payment Information'
  },
  {
    id: ID_ORDER_DETAIL.SHIPPING,
    title: 'Shipping Information'
  }
  // {
  //   id: ID_ORDER_DETAIL.REFUND,
  //   title: 'Refund Information'
  // },
  // {
  //   id: ID_ORDER_DETAIL.RETURN,
  //   title: 'Return History'
  // }
]

export const ID_ORDER_CHECKOUT_NON_MEMBER = {
  SHIPPING: 1,
  PAYMENT: 2,
  SUMMARY: 3
}
export const ORDER_CHECKOUT_NON_MEMBER_LISTS = [
  {
    id: ID_ORDER_CHECKOUT_NON_MEMBER.SHIPPING,
    title: 'Address'
  },
  {
    id: ID_ORDER_CHECKOUT_NON_MEMBER.PAYMENT,
    title: 'Payment Method'
  },
  {
    id: ID_ORDER_CHECKOUT_NON_MEMBER.SUMMARY,
    title: 'Order Summary'
  }
]

export const ID_AUTO_SHIP_CHECKOUT = {
  SHIPPING: 1,
  DATE: 2,
  PAYMENT: 3,
  COUPONS: 4,
  SUMMARY: 5
}
export const ORDER_AUTO_SHIP_CHECKOUT_LISTS = [
  {
    id: ID_AUTO_SHIP_CHECKOUT.SHIPPING,
    title: 'Shipping Address'
  },
  {
    id: ID_AUTO_SHIP_CHECKOUT.DATE,
    title: 'Payment Date'
  },
  {
    id: ID_AUTO_SHIP_CHECKOUT.PAYMENT,
    title: 'Payment Method'
  },
  {
    id: ID_AUTO_SHIP_CHECKOUT.COUPONS,
    title: 'Points & Coupons'
  },
  {
    id: ID_AUTO_SHIP_CHECKOUT.SUMMARY,
    title: 'Order Summary'
  }
]

export const ORDER_TYPES_VALUE = {
  PERSONAL: 1,
  CUSTOMER: 2
}
export const ORDER_TYPES = [
  { label: 'Personal order', value: ORDER_TYPES_VALUE.PERSONAL },
  { label: 'Customer order', value: ORDER_TYPES_VALUE.CUSTOMER }
]
export const DEFAULT_PIN_LENGTH = 6
export const STORAGE_CHECKED_ITEM = 'checked-item'

export const STATUS_PAYMENT = {
  CREATE_CARD: 'CREDIT_CARD',
  PAYMENT_ONE: 'PAYMENT_ONE'
}

export const LOGIN_ERROR_CODE = {
  USER_NUMBER_NOT_FOUND: 1100,
  PASSWORD_NOT_MATCH: 1101,
  FAIL_5_TIME: 1102,
  FAIL_GE_5_TIME: 1103
}

export const MONTH_LISTS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

export const FORMAT_DATE_USE_DOT = 'YY.MM.DD'
export const FORMAT_FULL_YEAR_USE_DOT = 'YYYY.MM.DD'
export const FORMAT_ONLY_WEEK_DAY = 'ddd'
export const FORMAT_SHORT_DAY = 'D'
export const FORMAT_SHORT_MONTH = 'M'
export const FORMAT_MONTH_YEAR = 'M-YYYY'
export const FORMAT_HOUR_MINUTE = 'HH:mm'
export const FORMAT_SHORT_YEAR_MONTH_DAY = 'D-M-YYYY'
export const FORMAT_FULL_YEAR = 'YYYY-MM-DD'
export const FORMAT_FULL_DATE_MIN = 'YYYY-MM-DD 00:00:00'
export const FORMAT_HOUR_MINUTE_SECOND = 'HH:mm:ss'
export const FORMAT_FIRST_DAY = 'YYYY-MM-01'
export const FORMAT_USER_DISPLAY = 'MMM DD, YYYY'
export const FORMAT_DATETIME = 'YYYY-MM-DD HH:mm:ss'
export const FORMAT_FULL_DATE_USE_DOT = 'YYYY.MM.DD HH:mm:ss'

export const EVENT_COLORS_LIST = ['#757575', '#BEB08F', '#A1A56A', '#6A81A5', '#9C6AA5']
export const SEARCH_PRODUCT_SIZE = 12
export const SEARCH_BLOG_SIZE = 8
export const LIST_PRODUCT_SIZE = 4

export const INQUIRY_OPTIONS = [
  {
    label: 'Order/Payment',
    value: 'Order/Payment',
    enum: 'ORDER_PAYMENT'
  },
  {
    label: 'Cancel/Refund',
    value: 'Cancel/Refund',
    enum: 'CANCEL_REFUNDMENT'
  },
  {
    label: 'Shipping/Returns',
    value: 'Shipping/Returns',
    enum: 'DELIVERY_RETURN'
  },
  {
    label: 'Autoship subscription',
    value: 'Autoship subscription',
    enum: 'SUBSCRIBE_ORDER'
  },
  {
    label: 'Points/Coupons',
    value: 'Points/Coupons',
    enum: 'POINT_COUPON'
  },
  {
    label: 'Product inquiry',
    value: 'Product inquiry',
    enum: 'PRODUCT'
  },
  {
    label: 'Event',
    value: 'Event',
    enum: 'EVENT'
  },
  {
    label: 'Member inquiry',
    value: 'Member inquiry',
    enum: 'MEMBER'
  },
  {
    label: 'Etc',
    value: 'Etc',
    enum: 'ETC'
  }
]
export const FAQ_OPTIONS = [
  {
    label: 'Enrollment',
    value: 'Enrollment',
    enum: FaqEnum.ENROLLMENT
  },
  {
    label: 'Business Entity',
    value: 'Business Entity',
    enum: FaqEnum.BUSINESS_ENTITY
  },
  {
    label: 'Termination',
    value: 'Termination',
    enum: FaqEnum.TERMINATION
  },
  {
    label: 'E-Wallet',
    value: 'E-Wallet',
    enum: FaqEnum.E_WALLET
  },
  {
    label: 'Commission',
    value: 'Commission',
    enum: FaqEnum.COMMISSION
  },
  {
    label: 'Order/Return',
    value: 'Order/Return',
    enum: FaqEnum.ORDER_RETURN
  },
  {
    label: 'Autoship',
    value: 'Autoship',
    enum: FaqEnum.AUTOSHIP
  },
  {
    label: 'Pool/Reward Program',
    value: 'Pool/Reward Program',
    enum: FaqEnum.POOL_REWARD_PROGRAM
  },
  {
    label: 'Products',
    value: 'Products',
    enum: FaqEnum.PRODUCTS
  },
  {
    label: 'Bag(old Myshop)',
    value: 'Bag(old Myshop)',
    enum: FaqEnum.BAG
  },
  {
    label: 'Coupons/Product Credits',
    value: 'Coupons/Product Credits',
    enum: FaqEnum.COUPONS_PRODUCT_CREDITS
  }
]

export const RETURN_AGREEMENT_CAUTIONS = {
  RETURN_AVAILABLE: [
    {
      label:
        'Upon completion of the return of the order, the grade will be downgraded as it does not meet the grade maintenance conditions.'
    },
    {
      label: 'To maintain your rating, please cancel your return.'
    }
  ],
  RETURN_UNAVAILABLE: [
    {
      label: 'If the expected refund amount is negative, returns cannot be processed.'
    }
  ]
}

export const RETURN_DETAILS_PREVIEW_IMAGE = [
  {
    url: 'https://dqmx7jipz0ukv.cloudfront.net/INCELLDERM/image/thumbnail/Aqua_Protection_Sunscreen_Thumbnail_1.jpg'
  },
  {
    url: 'https://dqmx7jipz0ukv.cloudfront.net/INCELLDERM/image/thumbnail/Aqua_Protection_Sunscreen_Thumbnail_1.jpg'
  },
  {
    url: 'https://dqmx7jipz0ukv.cloudfront.net/INCELLDERM/image/thumbnail/Aqua_Protection_Sunscreen_Thumbnail_1.jpg'
  },
  {
    url: 'https://dqmx7jipz0ukv.cloudfront.net/INCELLDERM/image/thumbnail/Aqua_Protection_Sunscreen_Thumbnail_1.jpg'
  }
]

export const RETURN_DETAILS_SAMPLE_ADDRESS = {
  name: 'John Doe',
  address: 'US [90680] 1860 BEACH BLVD STE H, STANTON, California',
  phone: '010-1234-5678',
  homePhone: '010-1234-5678'
}

export const RETURN_DETAILS_SAMPLE_PRODUCTS = [
  {
    cartId: 1,
    productId: 1,
    quantity: 1,
    productNameInfo: {
      fullName: 'Full name',
      shortName: 'Short name',
      engName: 'DERMATOLOGY FIRST PACKAGE EX'
    },
    salesAmount: 27500,
    bp: 25000,
    thumbnailUrl:
      'https://dqmx7jipz0ukv.cloudfront.net/INCELLDERM/image/thumbnail/Aqua_Protection_Sunscreen_Thumbnail_1.jpg'
  },
  {
    cartId: 2,
    productId: 2,
    quantity: 2,
    productNameInfo: {
      fullName: 'Full name',
      shortName: 'Short name',
      engName: 'DERMATOLOGY FIRST PACKAGE EX'
    },
    salesAmount: 27500,
    bp: 25000,
    thumbnailUrl:
      'https://dqmx7jipz0ukv.cloudfront.net/INCELLDERM/image/thumbnail/Aqua_Protection_Sunscreen_Thumbnail_1.jpg'
  }
]

export const REFUND_AMOUNT_SAMPLE = [
  {
    label: 'Payment Amount',
    value: 'paymentAmount'
  },
  {
    label: 'Return Shipping',
    value: 'returnShipping'
  },
  {
    label: 'Restocking Fee',
    value: 'restockingFee'
  },
  {
    label: 'Rebate',
    value: 'rebate'
  },
  {
    label: 'SM Commission',
    value: 'smCommision'
  }
]

export const POINT_INFO_SAMPLE = [
  {
    label: 'Redeposit Points',
    value: 'redepositPoints'
  },
  {
    label: 'Redemption Cancellation Points',
    value: 'redemptionCancellationPoints'
  }
]

export const RETURN_EXCHANGE_TYPE = {
  RETURN: 'RETURN',
  EXCHANGE: 'EXCHANGE'
}

export const PUBLIC_KEY_ENCRYPT = import.meta.env.VITE_PUBLIC_KEY_CARD

export const MESSAGE_PINCODE = {
  PASSCODE: {
    title: 'Passcode Set-Up',
    content: 'Please set-up a six digit passcode for security verification purposes.',
    contentSecond: 'Please re-enter the security passcode.'
  },
  PAYMENT: {
    title: 'Enter payment passcode',
    content: 'Please enter your six digit security passcode.',
    error: 'Passcode is incorrect'
  }
}

export const S3_URL_IMAGE = import.meta.env.VITE_S3_URL
export const SAVE_URL_IMAGE = import.meta.env.VITE_IMAGE_URL
export const TW_PAGE_URL = import.meta.env.VITE_TW_PAGE_URL
export const SHOP_LOGIN_KEY = import.meta.env.VITE_SHOP_LOGIN_KEY

export const CURRENCY = {
  USD: 'USD',
  CAD: 'CAD',
  DOLLAR: '$',
  HKD: 'HKD',
  HK: 'HK'
}

export const CURRENCY_NEW = {
  HKD: {
    title: 'HK',
    value: 'HKD'
  },
  HK: {
    title: 'HK',
    value: 'HKD'
  }
}

export const ARRAY_DATE_AUTO_SHIP = Array.from(Array(31), (_, index) => index + 1)
export const PAYLOAD_LOGIN_DEFAULT = {
  username: null,
  password: null,
  grant_type: 'password',
  scope: 'write',
  region_code: 'US',
  service_type: null,
  token_social: null
}

export const INQUIRY_PREFIX = import.meta.env.VITE_INQUIRY_PREFIX

export const SHIP_OPTION_ENUM = {
  ONE_TIME: 'ONE_TIME',
  AUTO_SHIP: 'AUTO_SHIP'
}

export const OPTIONS_GLOBE = [
  {
    url: USA,
    text: 'USA',
    value: 'US'
  },
  {
    url: Canada,
    text: 'CANADA',
    value: 'CA'
  },
  {
    url: Taiwan,
    text: 'TAIWAN',
    value: 'TAIWAN'
  }
]

export const MIN_DATE_ORDER = 1
export const MAX_DATE_ORDER = 26
export const WHITE_LIST_CAN_ACCESS = [AppRoutes.phoneInquiry.path, AppRoutes.customerFaq.path]

export const DETAIL_VIEW_LEVEL = [
  {
    id: LevelUserEnum.PLANNER,
    title: 'Planner',
    firstContent: 'When you Go through the enrollment process.'
  },
  {
    id: LevelUserEnum.MANAGER,
    title: 'Manager',
    firstContent:
      '3,000 BP from Personal Team Sales volume in most recent <span class="underline">3 months. </span>',
    subFirstContent: '* A 1st Level Planner volume may count up to 1,500 BP.'
  },
  {
    id: LevelUserEnum.SENIOR_MANAGER,
    title: 'Senior Manager',
    firstContent: '6,000 BP from Personal Team Sales volume in most recent 3 months.',
    subFirstContent: '* A 1st Level Planner volume may count up to 3,000 BP.'
  },
  {
    id: LevelUserEnum.TEAM_LEADER,
    title: 'Team Leader',
    headingFirst: '[Sales Volume Requirement]',
    firstContent:
      '50,000 BP from Team Group Sales volume in most recent <span class="underline">5 months</span> .',
    subFirstContent:
      '* A single Team Group Leg volume may count up to 25,000 BP.<br/>* Personal Sales volume may count up to 20,000 BP ',
    headingSecond: '[Position Requirement] ',
    secondContent:
      '1) 3 Senior Manager legs<br/>2) 10 Managers or Higher <br/>(including 3 SM above)',
    subSecondContent:
      '* Total of 5 managers or above from a single leg in your Team Group will be counted towards 10 Managers or above requirement.'
  },
  {
    id: LevelUserEnum.DIRECTOR,
    title: 'Director',
    headingFirst: '[Sales Volume Requirement]',
    firstContent:
      '600,000 BP from Downline Group Sales volume in most recent <span class="underline">6 months</span> .',
    subFirstContent: '* A single Leg volume may count up to 300,000 BP.',
    headingSecond: '[Position Requirement] ',
    secondContent: '3 Team Leader Legs'
  },
  {
    id: LevelUserEnum.SENIOR_DIRECTOR,
    title: 'Senior Director',
    headingFirst: '[Sales Volume Requirement]',
    firstContent:
      '300,000 BP between Director Group and 1st Generation Director Group in a calendar month.',
    subFirstContent: '* A single 1st generation Director Group volume may count up to 100,000 BP.',
    headingSecond: '[Position Requirement] ',
    secondContent: '2 Director Legs'
  },
  {
    id: LevelUserEnum.NATIONAL_DIRECTOR,
    title: 'National Director',
    headingFirst: '[Sales Volume Requirement]',
    firstContent:
      '500,000 BP between Director Group and 1st Generation Director Group in a calendar month.',
    subFirstContent: '* A single 1st generation Director Group volume may count up to 100,000 BP.',
    headingSecond: '[Position Requirement] ',
    secondContent: '4 Director Legs'
  },
  {
    id: LevelUserEnum.EXECUTIVE,
    title: 'Executive',
    firstContent: 'LAS points higher than 20',
    subFirstContent: '*Approved after leadership evaluation'
  }
]

export const DETAIL_LEVEL_CUSTOMER = [
  {
    id: LevelUserEnum.POOL,
    logo: Pool,
    content: '-',
    activeDate: '-'
  },
  {
    id: LevelUserEnum.POOL_PLUS,
    logo: PoolPlus,
    content: 'Over to $1,000',
    activeDate: '-'
  },
  {
    id: LevelUserEnum.POOL_PREMIUM,
    logo: PoolPremium,
    content: 'Over to $3,000',
    activeDate: '-'
  }
]

export const URL_NEXIO = 'https://api.nexiopaysandbox.com'
export const HK_MALL_URL = import.meta.env.VITE_HK_MALL_URL
export const MAX_BAG_LENGTH = 10
export const VITE_APP_RBO_API_BASE_URL = import.meta.env.VITE_APP_RBO_API_BASE_URL
export const VITE_APP_RBO_LOGIN_URL = import.meta.env.VITE_APP_RBO_LOGIN_URL
export const VITE_RBO_TOKEN = import.meta.env.VITE_RBO_TOKEN
export const VITE_RBO_CLIENT_ID = import.meta.env.VITE_RBO_CLIENT_ID
export const IP_DETECT_URL = 'https://api.ipify.org?format=json'
export const VITE_S3_IMAGE = import.meta.env.VITE_S3_URL
export const VUE_APP_POSITION = import.meta.env.VITE_POSITION
export const isNTQEnv = VUE_APP_POSITION === 'ntq'
export const mappingImageS3 = (image, bucketPath = 'hk-product') => {
  return !isNTQEnv ? `${VITE_S3_IMAGE}${image}` : `${VITE_S3_IMAGE}/${bucketPath}/${image}`
}
export const ITEM_SLIDE_NUMBER = 5
