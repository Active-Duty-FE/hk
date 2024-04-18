import AuthLayout from '@/layouts/AuthLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import LoginLayout from '@/layouts/LoginLayout.vue'
import NonMemberLayout from '@/layouts/NonMemberLayout.vue'
import CartLayout from '@/layouts/CartLayout.vue'
import middlewareRegister from '@/middleware/register'
import middlewareSkinQuiz from '@/middleware/skin-quiz'
import { AppRoutes, AppSubNavTitles, AppTitle } from './path'

export default [
  {
    path: '',
    meta: {
      title: AppTitle.home
    },
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: AppRoutes.home.name,
        meta: {
          title: AppTitle.home
        },
        component: () => import(/* webpackChunkName: "Home" */ '@pages/home/HomePage.vue')
      },
      {
        path: AppRoutes.product.path,
        name: AppRoutes.product.name,
        meta: {
          title: AppTitle.product.title
        },
        component: () =>
          import(/* webpackChunkName: "ProductList" */ '@pages/products/ProductList.vue')
      },
      {
        path: AppRoutes.product.detail.path,
        name: AppRoutes.product.detail.name,
        meta: {
          title: AppTitle.product.detail
        },
        component: () =>
          import(/* webpackChunkName: "ProductDetail" */ '@pages/products/ProductDetail.vue')
      },
      {
        path: AppRoutes.product.productCategory.path,
        name: AppRoutes.product.productCategory.name,
        meta: {
          title: AppTitle.product.productCategory
        },
        component: () =>
          import(
            /* webpackChunkName: "ProductByCategory" */ '@pages/products/ProductByCategory.vue'
          )
      },
      {
        path: AppRoutes.product.ritual.path,
        name: AppRoutes.product.ritual.name,
        meta: {
          title: AppTitle.product.ritual
        },
        component: () =>
          import(/* webpackChunkName: "ProductRitual" */ '@pages/products/ProductRitual.vue')
      },
      {
        path: AppRoutes.aboutUs.path,
        name: AppRoutes.aboutUs.name,
        meta: {
          title: AppTitle.aboutUs
        },
        component: () =>
          import(/* webpackChunkName: "AboutUs" */ '@pages/explore/about-us/AboutUs.vue')
      },
      {
        path: AppRoutes.ingredient.path,
        name: AppRoutes.ingredient.name,
        meta: {
          title: AppTitle.ingredient
        },
        component: () =>
          import(
            /* webpackChunkName: "IngredientPage" */ '@pages/explore/ingredients/IngredientPage.vue'
          )
      },
      {
        path: AppRoutes.skinQuiz.path,
        name: AppRoutes.skinQuiz.name,
        meta: {
          title: AppTitle.skinQuiz
        },
        component: () => import(/* webpackChunkName: "SkinQuiz" */ '@pages/SkinQuiz.vue')
      },
      {
        path: AppRoutes.byoungPoolRetreat.path,
        name: AppRoutes.byoungPoolRetreat.name,
        meta: {
          title: AppTitle.byoungPoolRetreat
        },
        component: () =>
          import(
            /* webpackChunkName: "ByoungPoolRetreat" */ '@pages/explore/byoung/ByoungRetreat.vue'
          )
      },
      {
        path: AppRoutes.byoungPoolBusiness.path,
        name: AppRoutes.byoungPoolBusiness.name,
        meta: {
          title: AppTitle.byoungPoolBusiness
        },
        component: () =>
          import(
            /* webpackChunkName: "ByoungPoolBusiness" */ '@pages/explore/byoung/ByoungBusiness.vue'
          )
      },
      {
        path: AppRoutes.sustainability.path,
        name: AppRoutes.sustainability.name,
        meta: {
          title: AppTitle.sustainability
        },
        component: () =>
          import(/* webpackChunkName: "Sustain" */ '@pages/explore/sustainability/SustainPage.vue')
      },
      {
        path: AppRoutes.ritual.path,
        name: AppRoutes.ritual.name,
        meta: {
          title: AppTitle.ritual
        },
        component: () =>
          import(/* webpackChunkName: "ExploreRitual" */ '@pages/explore/RitualPage.vue')
      },
      {
        path: AppRoutes.events.path,
        name: AppRoutes.events.name,
        meta: {
          title: AppTitle.events
        },
        component: () =>
          import(/* webpackChunkName: "BYoungEvent" */ '@pages/explore/events/BYoungEventPage.vue')
      },
      {
        path: AppRoutes.blog.path,
        name: AppRoutes.blog.name,
        meta: {
          title: AppTitle.blog.list
        },
        component: () =>
          import(/* webpackChunkName: "BlogList" */ '@/pages/explore/blog/BlogList.vue')
      },
      {
        path: AppRoutes.blog.detail.path,
        name: AppRoutes.blog.detail.name,
        meta: {
          title: AppTitle.blog.detail
        },
        component: () =>
          import(/* webpackChunkName: "BlogDetail" */ '@/pages/explore/blog/BlogDetail.vue')
      },
      {
        path: AppRoutes.shipping.path,
        name: AppRoutes.shipping.name,
        meta: {
          title: AppTitle.shipping
        },
        component: () =>
          import(/* webpackChunkName: "Shipping" */ '@/pages/customer-service/ShippingPage.vue')
      },
      {
        path: AppRoutes.policy.path,
        name: AppRoutes.policy.name,
        meta: {
          title: AppTitle.policy
        },
        component: () =>
          import(/* webpackChunkName: "Policy" */ '@/pages/customer-service/ReturnsPage.vue')
      },
      {
        path: AppRoutes.search.path,
        name: AppRoutes.search.name,
        meta: {
          title: AppTitle.search
        },
        component: () => import(/* webpackChunkName: "SearchPage" */ '@pages/search/ResultPage.vue')
      },
      {
        path: AppRoutes.contactUs.path,
        name: AppRoutes.contactUs.name,
        meta: {
          title: AppTitle.contactUs
        },
        component: () => import(/* webpackChunkName: "ContactUs" */ '@pages/ContactUs.vue')
      },
      {
        path: AppRoutes.faq.path,
        name: AppRoutes.faq.name,
        meta: {
          title: AppTitle.faq
        },
        component: () => import(/* webpackChunkName: "FAQPage" */ '@/pages/FAQ.vue')
      },
      {
        path: AppRoutes.privacy.terms.path,
        name: AppRoutes.privacy.terms.name,
        meta: {
          title: AppTitle.privacy.terms
        },
        component: () => import(/* webpackChunkName: "FAQPage" */ '@/pages/privacy/TermPage.vue')
      },
      {
        path: AppRoutes.privacy.policy.path,
        name: AppRoutes.privacy.policy.name,
        meta: {
          title: AppTitle.privacy.policy
        },
        component: () => import(/* webpackChunkName: "FAQPage" */ '@/pages/privacy/PolicyPage.vue')
      },
      {
        path: AppRoutes.privacy.code.path,
        name: AppRoutes.privacy.code.name,
        meta: {
          title: AppTitle.privacy.code
        },
        component: () => import(/* webpackChunkName: "FAQPage" */ '@/pages/privacy/CodePage.vue')
      },
      {
        path: AppRoutes.privacy.policiesAndProcedure.path,
        name: AppRoutes.privacy.policiesAndProcedure.name,
        meta: {
          title: AppTitle.privacy.procedure
        },
        component: () =>
          import(/* webpackChunkName: "FAQPage" */ '@/pages/privacy/ProcedurePage.vue')
      }
    ]
  },
  {
    meta: {
      title: AppTitle.orderNonMember.default
    },
    component: NonMemberLayout,
    children: [
      {
        path: AppRoutes.orderNonMember.orderCheckout.path,
        name: AppRoutes.orderNonMember.orderCheckout.name,
        meta: {
          title: AppTitle.orderNonMember.orderCheckout
        },
        component: () =>
          import(
            /* webpackChunkName: "OrderCheckoutNonMemberPage" */ '@/pages/order-non-member/OrderCheckout.vue'
          )
      },
      {
        path: AppRoutes.orderNonMember.orderComplete.path,
        name: AppRoutes.orderNonMember.orderComplete.name,
        meta: {
          title: AppTitle.orderNonMember.orderComplete
        },
        component: () =>
          import(
            /* webpackChunkName: "OrderCompleteNonMemberPage" */ '@/pages/order-non-member/OrderComplete.vue'
          )
      },
      {
        path: AppRoutes.orderNonMember.orderDetail.path,
        name: AppRoutes.orderNonMember.orderDetail.name,
        meta: {
          title: AppTitle.orderNonMember.orderDetail
        },
        component: () =>
          import(
            /* webpackChunkName: "OrderDetailNonMemberPage" */ '@/pages/order-non-member/OrderDetail.vue'
          )
      }
    ]
  },
  {
    path: AppRoutes.register.path,
    name: AppRoutes.register.name,
    meta: {
      title: AppTitle.register.title,
      subNavTitle: AppSubNavTitles.register.default,
      authRoute: true
    },
    component: AuthLayout,
    children: [
      {
        path: AppRoutes.register.onBoarding.path,
        name: AppRoutes.register.onBoarding.name,
        meta: {
          title: AppTitle.register.onBoarding,
          subNavTitle: AppSubNavTitles.register.default
        },
        beforeEnter: middlewareRegister,
        component: () =>
          import(/* webpackChunkName: "OnBoardingRegister" */ '@pages/register/OnBoarding.vue')
      },
      {
        path: AppRoutes.register.enterInformation.path,
        name: AppRoutes.register.enterInformation.name,
        meta: {
          title: AppTitle.register.enterInformation,
          subNavTitle: AppSubNavTitles.register.default
        },
        beforeEnter: middlewareRegister,

        component: () =>
          import(/* webpackChunkName: "EnterInformation" */ '@pages/register/EnterInformation.vue')
      },
      {
        path: AppRoutes.register.enterShipping.path,
        name: AppRoutes.register.enterShipping.name,
        beforeEnter: middlewareRegister,
        meta: {
          title: AppTitle.register.enterShipping,
          subNavTitle: AppSubNavTitles.register.default
        },
        component: () =>
          import(/* webpackChunkName: "EnterShipping" */ '@pages/register/EnterShipping.vue')
      },
      {
        path: AppRoutes.register.businessInformation.path,
        name: AppRoutes.register.businessInformation.name,
        meta: {
          title: AppTitle.register.businessInformation,
          subNavTitle: AppSubNavTitles.register.businessInformation
        },
        component: () =>
          import(
            /* webpackChunkName: "BusinessInformation" */ '@pages/register/BusinessInformation.vue'
          )
      },
      {
        path: AppRoutes.register.complete.path,
        name: AppRoutes.register.complete.name,
        beforeEnter: middlewareRegister,
        component: () =>
          import(/* webpackChunkName: "RegisterComplete" */ '@pages/register/RegisterComplete.vue')
      },
      {
        path: AppRoutes.register.agreeTerm.path,
        name: AppRoutes.register.agreeTerm.name,
        meta: {
          title: AppTitle.register.agreeTerm,
          subNavTitle: AppSubNavTitles.register.default
        },
        beforeEnter: middlewareRegister,
        component: () =>
          import(/* webpackChunkName: "AgreeTerm" */ '@pages/register/AgreeTermCondition.vue')
      },
      {
        path: AppRoutes.register.selectRecommender.path,
        name: AppRoutes.register.selectRecommender.name,
        meta: {
          title: AppTitle.register.selectRecommender,
          subNavTitle: AppSubNavTitles.register.default
        },
        beforeEnter: middlewareRegister,
        component: () =>
          import(
            /* webpackChunkName: "SelectRecommender" */ '@pages/register/SelectRecommender.vue'
          )
      }
    ]
  },
  {
    path: '',
    meta: {
      authRoute: true
    },
    component: LoginLayout,
    children: [
      {
        path: AppRoutes.login.path,
        name: AppRoutes.login.name,
        meta: {
          title: AppTitle.login
        },
        component: () => import(/* webpackChunkName: "Login" */ '@pages/LoginPage.vue')
      },
      {
        path: AppRoutes.resetPassword.path,
        name: AppRoutes.resetPassword.name,
        meta: {
          title: AppTitle.resetPassword,
          subNavTitle: AppSubNavTitles.resetPassword
        },
        component: () => import(/* webpackChunkName: "ResetPassword" */ '@pages/ResetPassword.vue')
      },
      {
        path: AppRoutes.changePassword.path,
        name: AppRoutes.changePassword.name,
        meta: {
          title: AppTitle.changePassword,
          subNavTitle: AppSubNavTitles.changePassword
        },
        component: () =>
          import(/* webpackChunkName: "ChangePassword" */ '@pages/ChangePassword.vue')
      }
    ]
  },
  {
    path: AppRoutes.findAccount.path,
    component: AuthLayout,
    children: [
      {
        path: AppRoutes.findAccount.path,
        name: AppRoutes.findAccount.name,
        meta: {
          title: AppTitle.findAccount
        },
        component: () => import(/* webpackChunkName: "FindAccount" */ '@pages/FindAccount.vue')
      }
    ]
  },
  {
    path: AppRoutes.cart.path,
    meta: {
      title: AppTitle.cart.default,
      subNavTitle: AppSubNavTitles.cart.default
    },
    component: CartLayout,
    children: [
      {
        path: AppRoutes.cart.list.path,
        name: AppRoutes.cart.list.name,
        meta: {
          title: AppTitle.cart.list,
          subNavTitle: AppSubNavTitles.cart.list,
          requiredAuth: AppRoutes.cart.list.requiredAuth
        },
        component: () => import(/* webpackChunkName: "CartList" */ '@pages/carts/CartList.vue')
      },
      {
        path: AppRoutes.cart.placeOrder.path,
        name: AppRoutes.cart.placeOrder.name,
        meta: {
          title: AppTitle.cart.placeOrder,
          subNavTitle: AppSubNavTitles.cart.placeOrder,
          requiredAuth: AppRoutes.cart.placeOrder.requiredAuth
        },
        component: () => import(/* webpackChunkName: "CheckoutPage" */ '@pages/order/OrderPage.vue')
      },
      {
        path: AppRoutes.autoShip.autoShipCheckout.path,
        name: AppRoutes.autoShip.autoShipCheckout.name,
        meta: {
          title: AppTitle.autoShip.autoShipCheckout
        },
        component: () =>
          import(
            /* webpackChunkName: "AutoShipCheckout" */ '@/pages/my-page/auto-ship/AutoShipCheckout.vue'
          )
      },
      {
        path: AppRoutes.autoShip.autoShipComplete.path,
        name: AppRoutes.autoShip.autoShipComplete.name,
        meta: {
          title: AppTitle.autoShip.autoShipComplete
        },
        component: () =>
          import(
            /* webpackChunkName: "AutoShipComplete" */ '@/pages/my-page/auto-ship/AutoShipComplete.vue'
          )
      }
    ]
  },
  {
    path: AppRoutes.order.path,
    name: AppRoutes.order.name,
    component: CartLayout,
    children: [
      {
        path: AppRoutes.order.complete.path,
        name: AppRoutes.order.complete.name,
        meta: {
          title: AppTitle.order.complete,
          subNavTitle: AppSubNavTitles.order.complete
        },
        component: () =>
          import(/* webpackChunkName: "OrderComplete" */ '@pages/order/OrderComplete.vue')
      }
    ]
  },

  // My Page Layout
  {
    component: () => import('@/layouts/MyPageLayout.vue'),
    meta: {
      requiredAuth: true
    },
    children: [
      {
        path: AppRoutes.myPage.path,
        name: AppRoutes.myPage.name,
        meta: {
          title: AppTitle.myPage.myPage,
          hideBackIcon: true
        },
        component: () => import(/* webpackChunkName: "MyPage" */ '@/pages/my-page/MyPage.vue')
      },
      {
        path: AppRoutes.myPage.shippingAddressManagement.path,
        name: AppRoutes.myPage.shippingAddressManagement.name,
        meta: {
          title: AppTitle.myPage.shippingAddressManagement
        },
        component: () =>
          import(
            /* webpackChunkName: "ShippingAddressManagement" */ '@/pages/my-page/ShippingAddressManagement.vue'
          )
      },
      {
        path: AppRoutes.myPage.addShippingAddress.path,
        name: AppRoutes.myPage.addShippingAddress.name,
        meta: {
          title: AppTitle.myPage.addShippingAddress
        },
        component: () =>
          import(
            /* webpackChunkName: "AddShippingAddress" */ '@/pages/my-page/ShippingAddressForm.vue'
          )
      },
      {
        path: AppRoutes.myPage.editShippingAddress.path,
        name: AppRoutes.myPage.editShippingAddress.name,
        meta: {
          title: AppTitle.myPage.editShippingAddress
        },
        component: () =>
          import(
            /* webpackChunkName: "EditShippingAddress" */ '@/pages/my-page/ShippingAddressForm.vue'
          )
      },
      {
        path: AppRoutes.myPage.creditCard.path,
        name: AppRoutes.myPage.creditCard.name,
        meta: {
          title: AppTitle.myPage.creditCard
        },
        component: () =>
          import(
            /* webpackChunkName: "CreditCard" */ '@/pages/my-page/credit-card/CreditCardList.vue'
          )
      },
      {
        path: AppRoutes.myPage.createCreditCard.path,
        name: AppRoutes.myPage.createCreditCard.name,
        meta: {
          title: AppTitle.myPage.creditCard
        },
        component: () =>
          import(
            /* webpackChunkName: "CreateCreditCard" */ '@/pages/my-page/credit-card/CreditCardCreate.vue'
          )
      },
      {
        path: AppRoutes.myPage.myProfile.path,
        name: AppRoutes.myPage.myProfile.name,
        meta: {
          title: AppTitle.myPage.myProfile
        },
        component: () => import(/* webpackChunkName: "MyProfile" */ '@/pages/my-page/MyProfile.vue')
      },
      {
        path: AppRoutes.myPage.point.path,
        name: AppRoutes.myPage.point.name,
        meta: {
          title: AppTitle.myPage.point
        },
        component: () => import(/* webpackChunkName: "PointPage" */ '@/pages/my-page/MyPoint.vue')
      },
      {
        path: AppRoutes.myPage.coupon.path,
        name: AppRoutes.myPage.coupon.name,
        meta: {
          title: AppTitle.myPage.coupon
        },
        component: () => import(/* webpackChunkName: "CouponPage" */ '@/pages/my-page/MyCoupon.vue')
      },
      {
        path: AppRoutes.myPage.myInquiry.path,
        name: AppRoutes.myPage.myInquiry.name,
        meta: {
          title: AppTitle.myPage.myInquiry
        },
        component: () =>
          import(/* webpackChunkName: "MyInquiryPage" */ '@/pages/my-page/MyInquiry.vue')
      },
      {
        path: AppRoutes.myPage.addInquiry.path,
        name: AppRoutes.myPage.addInquiry.name,
        meta: {
          title: AppTitle.myPage.myInquiry
        },
        component: () =>
          import(/* webpackChunkName: "WriteInquiryPage" */ '@/pages/my-page/WriteInquiry.vue')
      },
      {
        path: AppRoutes.myPage.editInquiry.path,
        name: AppRoutes.myPage.editInquiry.name,
        meta: {
          title: AppTitle.myPage.myInquiry
        },
        component: () =>
          import(/* webpackChunkName: "EditInquiryPage" */ '@/pages/my-page/WriteInquiry.vue')
      },
      {
        path: AppRoutes.myPage.alarm.path,
        name: AppRoutes.myPage.alarm.name,
        meta: {
          title: AppTitle.myPage.alarm
        },
        component: () => import(/* webpackChunkName: "AlarmPage" */ '@/pages/my-page/MyAlarm.vue')
      },
      {
        path: AppRoutes.myPage.changePassword.path,
        name: AppRoutes.myPage.changePassword.name,
        meta: {
          title: AppTitle.myPage.changePassword
        },
        component: () =>
          import(
            /* webpackChunkName: "MyPageChangePassword" */ '@/pages/my-page/ChangePassword.vue'
          )
      },
      {
        path: AppRoutes.myPage.withdrawal.path,
        name: AppRoutes.myPage.withdrawal.name,
        meta: {
          title: AppTitle.myPage.withdrawal
        },
        component: () =>
          import(/* webpackChunkName: "MyPageWithdrawal" */ '@/pages/my-page/WithdrawalPage.vue')
      },
      {
        path: AppRoutes.myPage.orderHistory.path,
        name: AppRoutes.myPage.orderHistory.name,
        meta: {
          title: AppTitle.myPage.orderHistory
        },
        component: () =>
          import(
            /* webpackChunkName: "OrderHistory" */ '@/pages/my-page/order-history/OrderHistory.vue'
          )
      },
      {
        path: AppRoutes.myPage.orderHistoryDetail.path,
        name: AppRoutes.myPage.orderHistoryDetail.name,
        meta: {
          title: AppTitle.myPage.orderHistoryDetail
        },
        component: () =>
          import(
            /* webpackChunkName: "OrderHistoryDetail" */ '@/pages/my-page/order-history/OrderHistoryDetail.vue'
          )
      },
      {
        path: AppRoutes.myPage.myReview.path,
        name: AppRoutes.myPage.myReview.name,
        meta: {
          title: AppTitle.myPage.myReview
        },
        component: () =>
          import(/* webpackChunkName: "MyPageMyReview" */ '@/pages/my-page/MyReview.vue')
      },
      {
        path: AppRoutes.myPage.bagManagement.list.path,
        name: AppRoutes.myPage.bagManagement.list.name,
        meta: {
          title: AppTitle.myPage.bagManagement.list,
          backRouter: AppRoutes.myPage.name
        },
        component: () =>
          import(
            /* webpackChunkName: "MyPageBagManagementList" */ '@/pages/my-page/bag/BagList.vue'
          )
      },
      {
        path: AppRoutes.myPage.bagManagement.detail.path,
        name: AppRoutes.myPage.bagManagement.detail.name,
        meta: {
          title: AppTitle.myPage.bagManagement.detail,
          backRouter: AppRoutes.myPage.bagManagement.list.name
        },
        component: () =>
          import(
            /* webpackChunkName: "MyPageBagManagementDetail" */ '@/pages/my-page/bag/BagDetail.vue'
          )
      },
      {
        path: AppRoutes.myPage.bagManagement.create.path,
        name: AppRoutes.myPage.bagManagement.create.name,
        meta: {
          title: AppTitle.myPage.bagManagement.create,
          backRouter: AppRoutes.myPage.bagManagement.list.name
        },
        component: () =>
          import(
            /* webpackChunkName: "MyPageBagManagementCreate" */ '@/pages/my-page/bag/CreateBag.vue'
          )
      },
      {
        path: AppRoutes.myPage.autoshipManagement.path,
        name: AppRoutes.myPage.autoshipManagement.name,
        meta: {
          title: AppTitle.myPage.autoshipManagement,
          backRouter: AppRoutes.myPage.name
        },
        component: () =>
          import(
            /* webpackChunkName: "MyPageAutoshipManagement" */ '@/pages/my-page/AutoshipSubscriptionManagement.vue'
          )
      },
      {
        path: AppRoutes.myPage.cancelAutoShip.path,
        name: AppRoutes.myPage.cancelAutoShip.name,
        meta: {
          title: AppTitle.myPage.cancelAutoShip,
          backRouter: AppRoutes.myPage.name
        },
        component: () =>
          import(
            /* webpackChunkName: "MyPageCancelAutoShip" */ '@/pages/my-page/CancelAutoship.vue'
          )
      },
      {
        path: AppRoutes.myPage.cancelAutoShipComplete.path,
        name: AppRoutes.myPage.cancelAutoShipComplete.name,
        meta: {
          title: AppTitle.myPage.cancelAutoShipComplete,
          backRouter: AppRoutes.myPage.name
        },
        component: () =>
          import(
            /* webpackChunkName: "MyPageCancelAutoShipComplete" */ '@/pages/my-page/CancelAutoshipComplete.vue'
          )
      },
      {
        path: AppRoutes.myPage.memberShipFee.path,
        name: AppRoutes.myPage.memberShipFee.name,
        meta: {
          title: AppTitle.myPage.memberShipFee
        },
        component: () =>
          import(
            /* webpackChunkName: "MyPageMemberShipFee" */ '@/pages/my-page/member-ship-fee/MemberShipFee.vue'
          )
      },
      {
        path: AppRoutes.myPage.memberShipPayment.path,
        name: AppRoutes.myPage.memberShipPayment.name,
        meta: {
          title: AppTitle.myPage.memberShipPayment
        },
        component: () =>
          import(
            /* webpackChunkName: "MyPageMemberShipPayment" */ '@/pages/my-page/member-ship-fee/MemberShipPayment.vue'
          )
      },
      {
        path: AppRoutes.myPage.snsAccount.path,
        name: AppRoutes.myPage.snsAccount.name,
        meta: {
          title: AppTitle.myPage.snsAccount,
          backRouter: AppRoutes.myPage.name
        },
        component: () =>
          import(
            /* webpackChunkName: "MyPageCancelAutoShipComplete" */ '@/pages/my-page/SNSAccount.vue'
          )
      },
      {
        path: AppRoutes.myPage.businessInformation.path,
        name: AppRoutes.myPage.businessInformation.name,
        meta: {
          title: AppTitle.myPage.businessInformation
        },
        component: () =>
          import(
            /* webpackChunkName: "MyPageBusinessInformation" */ '@/pages/my-page/MyPageBusinessInformation.vue'
          )
      },
      {
        path: AppRoutes.myPage.conversionOnBoarding.path,
        name: AppRoutes.myPage.conversionOnBoarding.name,
        meta: {
          title: AppTitle.myPage.conversionOnBoarding
        },
        component: () =>
          import(
            /* webpackChunkName: "MyPageConversionOnBoarding" */ '@/pages/my-page/conversion-to-planner/ConversionOnBoarding.vue'
          )
      },
      {
        path: AppRoutes.myPage.conversionReferral.path,
        name: AppRoutes.myPage.conversionReferral.name,
        meta: {
          title: AppTitle.myPage.conversionOnBoarding
        },
        component: () =>
          import(
            /* webpackChunkName: "MyPageConversionReferral" */ '@/pages/my-page/conversion-to-planner/ConversionReferral.vue'
          )
      },
      {
        path: AppRoutes.myPage.conversionEnterInformation.path,
        name: AppRoutes.myPage.conversionEnterInformation.name,
        meta: {
          title: AppTitle.myPage.conversionEnterInformation
        },
        component: () =>
          import(
            /* webpackChunkName: "MyPageConversionEnterInformation" */ '@/pages/my-page/conversion-to-planner/ConversionEnterInformation.vue'
          )
      },
      {
        path: AppRoutes.myPage.conversionShipping.path,
        name: AppRoutes.myPage.conversionShipping.name,
        meta: {
          title: AppTitle.myPage.conversionShipping
        },
        component: () =>
          import(
            /* webpackChunkName: "MyPageConversionShipping" */ '@/pages/my-page/conversion-to-planner/ConversionShipping.vue'
          )
      },
      {
        path: AppRoutes.myPage.conversionToPlanner.path,
        name: AppRoutes.myPage.conversionToPlanner.name,
        meta: {
          title: AppTitle.myPage.conversionToPlanner
        },
        component: () =>
          import(
            /* webpackChunkName: "MyPageConversionToPlanner" */ '@/pages/my-page/conversion-to-planner/ConversionToPlanner.vue'
          )
      },
      {
        path: AppRoutes.myPage.personalMall.path,
        name: AppRoutes.myPage.personalMall.name,
        meta: {
          title: AppTitle.myPage.personalMall,
          backRouter: AppRoutes.myPage.name
        },
        component: () =>
          import(/* webpackChunkName: "MyPersonalMall" */ '@/pages/my-page/MyPersonalMall.vue')
      },
      {
        path: AppRoutes.myPage.notice.list.path,
        name: AppRoutes.myPage.notice.list.name,
        meta: {
          title: AppTitle.myPage.notice.list
        },
        component: () =>
          import(/* webpackChunkName: "MyPageNoticeList" */ '@/pages/my-page/notice/NoticeList.vue')
      },
      {
        path: AppRoutes.myPage.notice.detail.path,
        name: AppRoutes.myPage.notice.detail.name,
        meta: {
          title: AppTitle.myPage.notice.detail
        },
        component: () =>
          import(
            /* webpackChunkName: "MyPageNoticeDetail" */ '@/pages/my-page/notice/NoticeDetail.vue'
          )
      },
      {
        path: AppRoutes.myPage.archive.list.path,
        name: AppRoutes.myPage.archive.list.name,
        meta: {
          title: AppTitle.myPage.archive.list,
          backRouter: AppRoutes.myPage.name
        },
        component: () =>
          import(
            /* webpackChunkName: "MyPageArchiveList" */ '@/pages/my-page/archive/ArchiveList.vue'
          )
      },
      {
        path: AppRoutes.myPage.archive.detail.path,
        name: AppRoutes.myPage.archive.detail.name,
        meta: {
          title: AppTitle.myPage.archive.detail,
          backRouter: AppRoutes.myPage.archive.list.name
        },
        component: () =>
          import(
            /* webpackChunkName: "MyPageArchiveDetail" */ '@/pages/my-page/archive/ArchiveDetail.vue'
          )
      }
    ]
  },

  {
    component: () => import('@/layouts/PrimaryLayout.vue'),
    meta: {
      requiredAuth: true
    },
    children: [
      {
        path: AppRoutes.returnExchange.path,
        name: AppRoutes.returnExchange.name,
        meta: {
          title: AppTitle.returnExchange.returnExchange
        },
        component: () =>
          import(/* webpackChunkName: "MyPage" */ '@/pages/return-exchange/RERequest.vue')
      },
      {
        path: AppRoutes.returnExchange.returnAgreement.path,
        name: AppRoutes.returnExchange.returnAgreement.name,
        meta: {
          title: AppTitle.returnExchange.returnAgreement
        },
        component: () =>
          import(/* webpackChunkName: "MyPage" */ '@/pages/return-exchange/REAgreement.vue')
      },
      {
        path: AppRoutes.returnExchange.returnDetails.path,
        name: AppRoutes.returnExchange.returnDetails.name,
        meta: {
          title: AppTitle.returnExchange.returnDetails
        },
        component: () =>
          import(/* webpackChunkName: "MyPage" */ '@/pages/return-exchange/RDetails.vue')
      },
      {
        path: AppRoutes.returnExchange.returnHistory.path,
        name: AppRoutes.returnExchange.returnHistory.name,
        meta: {
          title: AppTitle.returnExchange.returnHistory
        },
        component: () =>
          import(/* webpackChunkName: "MyPage" */ '@/pages/return-exchange/REHistory.vue')
      }
    ]
  },
  {
    component: () => import('@/layouts/ConciergeLayout.vue'),
    children: [
      {
        path: AppRoutes.phoneInquiry.path,
        name: AppRoutes.phoneInquiry.name,
        meta: {
          title: AppTitle.phoneInquiry
        },
        component: () =>
          import(
            /* webpackChunkName: "PhoneInquiryPage" */ '@/pages/concierge/PhoneInquiryPage.vue'
          )
      },
      {
        path: AppRoutes.oneOneInquiry.path,
        name: AppRoutes.oneOneInquiry.name,
        meta: {
          title: AppTitle.oneOneInquiry
        },
        component: () =>
          import(/* webpackChunkName: "oneOneInquiryPage" */ '@/pages/concierge/OneOneInquiry.vue')
      },
      {
        path: AppRoutes.customerFaq.path,
        name: AppRoutes.customerFaq.name,
        meta: {
          title: AppTitle.customerFaq
        },
        component: () =>
          import(/* webpackChunkName: "CustomerFAQPage" */ '@/pages/concierge/CustomerFaqPage.vue')
      }
    ]
  },

  // Blank Layout
  {
    path: '',
    component: () => import('@/layouts/BlankLayout.vue'),
    children: [
      {
        path: AppRoutes.bag.detail.path,
        name: AppRoutes.bag.detail.name,
        component: () => import(/* webpackChunkName: "BagDetail" */ '@/pages/bag/BagPage.vue')
      },
      {
        path: AppRoutes.bag.preview.path,
        name: AppRoutes.bag.preview.name,
        component: () => import(/* webpackChunkName: "BagPreview" */ '@/pages/bag/BagPage.vue')
      }
    ]
  },
  {
    path: '/test-scroll',
    name: 'haha',
    meta: {
      title: AppTitle.home
    },
    component: () => import(/* webpackChunkName: "Home" */ '@components/common/RWheelScroll.vue')
  },
  // Member ship page
  {
    path: AppRoutes.memberShip.path,
    name: AppTitle.memberShip,
    meta: {
      title: AppTitle.memberShip
    },
    component: () =>
      import(/* webpackChunkName: "MemberShipChecking" */ '@/pages/member-ship/TrackingInfo.vue')
  },
  {
    path: AppRoutes.qrLogin.path,
    name: AppTitle.qrLogin,
    meta: {
      title: AppTitle.qrLogin
    },
    component: () => import(/* webpackChunkName: "QrLogin" */ '@pages/QrLogin.vue')
  }
]
