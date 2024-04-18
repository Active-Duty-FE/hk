export const AppRoutes = {
  home: {
    path: '/',
    name: 'Home'
  },
  login: {
    path: '/login',
    name: 'login'
  },
  qrLogin: {
    path: '/qr-login',
    name: 'qr-login'
  },
  main: {
    path: '/main',
    name: 'main',
    default: { path: 'default', name: 'default' }
  },
  findAccount: {
    path: '/find-account',
    name: 'find-account'
  },
  register: {
    path: '/register',
    name: 'register',
    onBoarding: { path: 'on-boarding', name: 'on-boarding' },
    agreeTerm: { path: 'agree-term', name: 'agree-term' },
    selectRecommender: { path: 'select-recommender', name: 'select-recommender' },
    enterSubscription: { path: 'payment', name: 'payment' },
    enterInformation: { path: 'enter-information', name: 'enter-information' },
    enterShipping: { path: 'enter-shipping', name: 'enter-shipping' },
    businessInformation: { path: 'business-information', name: 'business-information' },
    complete: { path: 'complete', name: 'register-complete' }
  },
  resetPassword: {
    path: '/reset-password',
    name: 'reset-password'
  },
  changePassword: {
    path: '/findpw/result',
    name: 'change-password'
  },
  product: {
    path: '/products',
    name: 'products',
    detail: { path: '/products/:productId', name: 'product-detail' },
    productCategory: {
      path: '/product-category/:category',
      name: 'product-by-category'
    },
    ritual: {
      path: 'product-ritual/:category',
      name: 'product-ritual'
    }
  },
  cart: {
    path: '/carts',
    name: 'carts',
    requiredAuth: true,
    list: {
      path: '/carts/list',
      name: 'cart-list',
      requiredAuth: true
    },
    detail: { path: '/products/:productId', name: 'product-detail' },
    placeOrder: {
      path: '/carts/checkout/:identification',
      name: 'cart-checkout',
      requiredAuth: true
    }
  },
  order: {
    path: '/order',
    name: 'order',
    complete: { path: 'complete/:id', name: 'order-complete' }
  },
  autoShip: {
    autoShipCheckout: {
      path: '/auto-ship/checkout/:identification',
      name: 'auto-ship-checkout'
    },
    autoShipComplete: {
      path: '/auto-ship/complete',
      name: 'auto-ship-complete'
    }
  },
  myProfile: {
    path: '/my-profile',
    name: 'my profile'
  },
  aboutUs: {
    path: '/about-us',
    name: 'about-us'
  },
  ingredient: {
    path: '/ingredients',
    name: 'ingredients'
  },
  skinQuiz: {
    path: '/skin-quiz',
    name: 'skin-quiz'
  },
  byoungPoolRetreat: {
    path: '/byoung-pool-retreat',
    name: 'byoung-pool-retreat'
  },
  byoungPoolBusiness: {
    path: '/byoung-pool-business',
    name: 'byoung-pool-business'
  },
  sustainability: {
    path: '/sustainability',
    name: 'sustainability'
  },
  ritual: {
    path: '/ritual',
    name: 'ritual'
  },
  events: {
    path: '/events',
    name: 'events'
  },
  blog: {
    path: '/blogs',
    name: 'blogs',
    detail: {
      path: '/blogs/:id',
      name: 'blog-detail'
    }
  },
  search: {
    path: '/search',
    name: 'search'
  },
  contactUs: {
    path: '/contact-us',
    name: 'contact-us'
  },
  shipping: {
    path: '/shipping',
    name: 'shipping'
  },
  policy: {
    path: '/policy',
    name: 'policy'
  },
  faq: {
    path: '/faq',
    name: 'faq'
  },
  privacy: {
    terms: {
      path: '/privacy/terms-and-conditions',
      name: 'privacyTermsAndConditions'
    },
    policy: {
      path: '/privacy/policy',
      name: 'privacyPolicy'
    },
    policiesAndProcedure: {
      path: '/privacy/policies-and-procedure',
      name: 'privacyPoliciesAndProcedure'
    },
    code: {
      path: '/privacy/code-of-business-ethics',
      name: 'privacyCodeOfBusinessEthics'
    }
  },
  myPage: {
    path: '/my-page',
    name: 'my-page',
    shippingAddressManagement: {
      path: '/my-page/shipping-address',
      name: 'my-page-shipping-address'
    },
    addShippingAddress: {
      path: '/my-page/shipping-address/add',
      name: 'my-page-add-shipping-address'
    },
    editShippingAddress: {
      path: '/my-page/shipping-address/edit/:id',
      name: 'my-page-edit-shipping-address'
    },
    myProfile: {
      path: '/my-page/my-profile',
      name: 'my-page-my-profile'
    },
    point: {
      path: '/my-page/points',
      name: 'point'
    },
    coupon: {
      path: '/my-page/coupons',
      name: 'coupon'
    },
    myInquiry: {
      path: '/my-page/my-inquiry',
      name: 'my ticket'
    },
    addInquiry: {
      path: '/my-page/my-inquiry/write',
      name: 'write ticket'
    },
    editInquiry: {
      path: '/my-page/my-inquiry/edit/:id',
      name: 'edit ticket'
    },
    creditCard: {
      path: '/my-page/credit-card',
      name: 'credit-card'
    },
    createCreditCard: {
      path: '/my-page/credit-card/create',
      name: 'create-credit-card'
    },
    alarm: {
      path: '/my-page/alarms',
      name: 'alarm list'
    },
    changePassword: {
      path: '/my-page/change-password',
      name: 'my-page-change-password'
    },
    withdrawal: {
      path: '/my-page/withdrawal',
      name: 'my-page-withdrawal'
    },
    orderHistory: {
      path: '/my-page/order-history',
      name: 'my-page-history'
    },
    orderHistoryDetail: {
      path: '/my-page/order-history/:id',
      name: 'my-page-order-history-detail'
    },
    myReview: {
      path: '/my-page/my-review',
      name: 'my-page-my-review'
    },
    bagManagement: {
      list: {
        path: '/my-page/bag-management',
        name: 'my-page-bag-management'
      },
      detail: {
        path: '/my-page/bag-management/:id',
        name: 'my-page-bag-management-detail'
      },
      create: {
        path: '/my-page/bag-management/create',
        name: 'my-page-bag-management-create'
      }
    },
    autoshipManagement: {
      path: '/my-page/autoship-management/:id',
      name: 'my-page-autoship-management'
    },
    cancelAutoShip: {
      path: '/my-page/cancel-autoship',
      name: 'my-page-cancel-autoship'
    },
    cancelAutoShipComplete: {
      path: '/my-page/cancel-autoship/complete',
      name: 'my-page-cancel-autoship/complete'
    },
    memberShipFee: {
      path: '/my-page/member-ship-fee',
      name: 'my-page-member-ship-fee'
    },
    memberShipPayment: {
      path: '/my-page/member-ship-payment',
      name: 'my-page-member-ship-payment'
    },
    businessInformation: {
      path: '/my-page/business-information',
      name: 'my-page-business-information'
    },
    archive: {
      list: {
        path: '/my-page/archive',
        name: 'my-page-archive-list'
      },
      detail: {
        path: '/my-page/archive/:id',
        name: 'my-page-archive-detail'
      }
    },
    conversionOnBoarding: {
      path: '/my-page/conversion-to-planner/on-boarding',
      name: 'my-page-conversion-to-planner-on-boarding'
    },
    conversionReferral: {
      path: '/my-page/conversion-to-planner/referral',
      name: 'my-page-conversion-to-planner/referral'
    },
    conversionEnterInformation: {
      path: '/my-page/conversion-to-planner/enter-information',
      name: 'my-page-conversion-to-planner/enter-information'
    },
    conversionShipping: {
      path: '/my-page/conversion-to-planner/enter-shipping',
      name: 'my-page-conversion-to-planner-enter-shipping'
    },
    conversionToPlanner: {
      path: '/my-page/conversion-to-planner',
      name: 'my-page-conversion-to-planner'
    },
    personalMall: {
      path: '/my-page/personal-mall',
      name: 'my-page-personal-mall'
    },
    snsAccount: {
      path: '/my-page/sns-account',
      name: 'my-page-sns-account'
    },
    notice: {
      list: {
        path: '/my-page/notice',
        name: 'my-page-notice-list'
      },
      detail: {
        path: '/my-page/notice/:id',
        name: 'my-page-notice-detail'
      }
    }
  },
  customerFaq: {
    path: '/customer-faq',
    name: 'customer Faq'
  },
  phoneInquiry: {
    path: '/phone-inquiry',
    name: 'phone inquiry'
  },
  oneOneInquiry: {
    path: '/one-one-inquiry',
    name: 'one one inquiry'
  },
  returnExchange: {
    path: '/return-exchange/:salesOrderId',
    name: 'return-exchange',
    returnAgreement: {
      path: '/return-exchange/agreement',
      name: 'return-agreement'
    },
    returnDetails: {
      path: '/return-exchange/return-exchange-details/:id',
      name: 'return-exchange-details'
    },
    returnLabel: {
      path: '/return/label',
      name: 'return-label'
    },
    returnHistory: {
      path: '/return-exchange/history',
      name: 'return-history'
    }
  },
  orderNonMember: {
    orderCheckout: {
      path: '/non-member/checkout/:identification',
      name: 'non member checkout'
    },
    orderComplete: {
      path: '/non-member/order-complete/:id',
      name: 'non member order complete'
    },
    orderDetail: {
      path: '/non-member/order-detail/:id',
      name: 'non member order detail'
    }
  },
  bag: {
    detail: {
      path: 'beauty-planner/bag/:id',
      name: 'beauty-planner-bag'
    },
    preview: {
      path: 'bag/preview/:id',
      name: 'bag-preview'
    }
  },
  memberShip: {
    name: 'member-ship',
    path: '/member-ship'
  }
}

export const AppTitle = {
  notFound: 'Not Found',
  home: 'Home',
  login: 'Login',
  qrLogin: 'QR Login',
  main: 'Main',
  findAccount: 'Find Account',
  register: {
    title: 'Register',
    onBoarding: 'On Boarding',
    agreeTerm: 'AgreeTerm',
    selectRecommender: 'Select Recommender',
    enterSubscription: 'Payment',
    enterInformation: 'Enter Information',
    enterShipping: 'Enter Shipping',
    businessInformation: 'Business Information',
    complete: 'Member registration complete'
  },
  resetPassword: 'Reset Password',
  changePassword: 'Change Password',
  product: {
    title: 'Products',
    detail: 'Product Detail',
    productCategory: 'Products',
    ritual: 'Ritual'
  },
  cart: {
    default: 'Cart',
    list: 'Shopping Bag',
    detail: 'Cart Detail',
    placeOrder: 'Checkout'
  },
  autoShip: {
    autoShipCheckout: 'Autoship Subscription Order Form',
    autoShipComplete: 'Autoship Subscription Order Complete'
  },
  order: {
    title: 'Order',
    complete: 'Order complete'
  },
  myProfile: 'My Profile',
  aboutUs: 'About US',
  ingredient: 'Ingredients',
  skinQuiz: 'Skin Quiz',
  byoungPoolRetreat: 'Byoung Pool Retreat',
  byoungPoolBusiness: 'Byoung Pool Business',
  sustainability: 'Sustainability',
  ritual: 'Ritual',
  events: 'Events',
  blog: {
    list: 'Blog',
    detail: 'Blog View'
  },
  search: 'Search',
  contactUs: 'Contact Us',
  shipping: 'Shipping',
  policy: 'Policy',
  faq: 'FAQ',
  myPage: {
    myPage: 'My Page',
    shippingAddressManagement: 'Shipping Address Management',
    addShippingAddress: 'Add Shipping Address',
    editShippingAddress: 'Edit Shipping Address',
    creditCard: 'My Credit Card',
    myProfile: 'My Profile',
    point: 'Points',
    coupon: 'Coupons',
    myInquiry: 'My Ticket',
    alarm: 'Alarm',
    changePassword: 'Change Password',
    withdrawal: 'Withdrawal',
    orderHistory: 'Order History',
    myReview: 'My Review',
    orderHistoryDetail: 'Order Details',
    bagManagement: {
      list: 'Bag',
      detail: 'Bag Detail',
      create: 'Create Bag'
    },
    autoshipManagement: 'Autoship Subscription Management',
    cancelAutoShip: 'Cancel Autoship Subscription',
    cancelAutoShipComplete: 'Cancel Autoship Subscription',
    memberShipFee: 'Membership Fee',
    memberShipPayment: 'Membership Fee',
    businessInformation: 'Enter business information',
    archive: {
      list: 'Archive',
      detail: 'Archive Detail'
    },
    conversionOnBoarding: 'Conversion to Planner',
    conversionReferral: 'Conversion to Planner',
    conversionEnterInformation: 'Conversion to Planner',
    conversionShipping: 'Conversion to Planner',
    conversionToPlanner: 'Conversion to Planner',
    personalMall: 'My Personal Mall',
    snsAccount: 'SNS account',
    notice: {
      list: 'Notice',
      detail: 'Notice Detail'
    }
  },
  customerFaq: 'Customer Service Center',
  phoneInquiry: 'Phone Reservation',
  returnExchange: {
    returnExchange: 'Return/Exchange Request',
    returnAgreement: 'Return Agreement',
    returnDetails: 'Return Details',
    exchangeDetails: 'Exchange Details',
    returnLabel: 'Return Label',
    returnHistory: 'Return/Exchange History'
  },
  oneOneInquiry: 'Customer Support Ticket',
  orderNonMember: {
    default: 'Non Member',
    orderCheckout: 'Order Form',
    orderComplete: 'Order Complete',
    orderDetail: 'Order Detail'
  },
  memberShip: 'Membership',
  privacy: {
    terms: 'terms',
    procedure: 'procedure',
    policy: 'policy',
    code: 'code'
  }
}

export const AppSubNavTitles = {
  register: {
    default: 'Sign Up',
    complete: 'Success',
    businessInformation: 'Enter business information'
  },
  resetPassword: 'Reset Password',
  changePassword: 'Change Password',
  cart: {
    default: 'Cart',
    list: 'Shopping Bag',
    placeOrder: 'Checkout'
  },
  order: {
    default: 'Order',
    complete: 'Order complete',
    placeOrder: 'Checkout'
  }
}
