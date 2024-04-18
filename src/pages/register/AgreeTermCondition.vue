<template>
  <div
    class="lg:(flex py-auto) text-black-50 md:( h-full) mx-auto min-h-screen items-center pt-[115px]"
  >
    <div class="sm:(w-[600px]) md:(w-[500px]) mx-auto bg-white">
      <r-sub-navigation
        class="z-10 w-full bg-white"
        title="Sign Up"
        :is-hide-back-icon="false"
        @click="router.back()"
      />
      <div class="p-5">
        <r-heading
          :title="$t('auth.sign_up.agree_term_condition.review_policy')"
          class-title="text-2xl w-full !whitespace-normal"
        />
      </div>
      <div class="mb-10 flex justify-end px-5">
        <RStep v-model="pageState.step" :total-step="pageState.totalStep" />
      </div>
      <div class="px-[20px] pb-5">
        <div class="border-1 border-black-50 border-solid">
          <div class="px-5 pt-[25px]">
            <r-checkbox-outlined v-model:checked="pageState.checkAll" @checked-change="onSelectAll">
              <template #content>
                <span class="text-gray-black ml-2.5 text-base leading-[22px]">
                  {{ $t('auth.sign_up.agree_term_condition.agree_condition_all') }}
                </span>
              </template>
            </r-checkbox-outlined>
          </div>
          <a-divider class="bg-black-50 !my-[25px]"></a-divider>
          <div class="px-5">
            <div v-for="term in listTerms" :key="term.termsId" class="mb-5">
              <div class="mb-2">
                <r-checkbox-outlined
                  v-model:checked="term.checked"
                  @checked-change="(checked) => onCheckTermParent(checked, term)"
                >
                  <template #content>
                    <span
                      class="font-475 cursor-pointer pl-2.5 text-base"
                      @click="doShowTermInfo(term)"
                    >
                      <span
                        :class="`${!MARKETING_TERM_ID.includes(term.termsId) ? 'underline' : ''}`"
                      >{{ term.termsName }}</span
                      >
                      <span class="text-red-1000">
                        {{ term.agreeYn ? '*' : '' }}
                      </span>
                    </span>
                  </template>
                </r-checkbox-outlined>
              </div>
              <div class="pl-3">
                <span
                  v-for="childTerm in term.children"
                  :key="childTerm.termsId"
                  class="flex flex-col gap-[5px] px-3"
                >
                  <r-checkbox-outlined
                    v-model:checked="childTerm.checked"
                    @checked-change="(checked) => onCheckTermChild(checked, childTerm)"
                  >
                    <template #content>
                      <span class="cursor-pointer pl-2.5">
                        <span class="text-gray-14 text-xs">{{ childTerm.termsName }}</span>
                        <span class="text-red-1000">
                          {{ childTerm.agreeYn ? '*' : '' }}
                        </span>
                      </span>
                    </template>
                  </r-checkbox-outlined>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="onlyShowForBusiness()">
        <div class="px-5">
          <p class="font-medium">
            {{ $t('auth.sign_up.agree_term_condition.agree_condition_first') }}
          </p>
        </div>
        <div class="pb-20 md:pb-0">
          <select-options-for-fee
            :free_fee="true"
            :list-product-register="pageState.listProductRegister"
            :product-select="pageState.productSelect"
            :member-ship-fee="pageState.memberShipFee.amount"
            :currency="pageState.memberShipFee.currency"
            :tax-product="pageState.taxProduct"
            :total-amount="calculateTotalAmount"
            :shipping-fee="pageState.shippingFee"
            @update-product-select="updateProductSelect"
          />
          <form-payment-hk
            ref="refPaymentComp"
            :update-data="updateDataPayment"
            :data-payment="dataPayment"
            :check-status-valid="checkStatusValidatePayment"
            :check-term="pageState.isDisabled"
            @handle-payment="gotoSelectRecommender"
          />
        </div>
      </div>
      <div class="hidden w-full flex-col gap-5 px-5 pb-10 pt-5 md:flex">
        <r-button
          class-title="text-white"
          :title="$t('auth.sign_up.agree_term_condition.sign_up_complete')"
          class="!bg-navy-6 !border-navy-6 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full"
          :loading="isLoadingRegister"
          :disabled="disabledBtnSubmit"
          @click="gotoSelectRecommender"
        >
        </r-button>
      </div>
    </div>
    <div class="fixed bottom-0 left-0 w-full md:hidden">
      <div class="flex justify-center bg-white px-5 pb-3">
        <r-button
          class-title="text-white"
          :title="$t('auth.sign_up.agree_term_condition.sign_up_complete')"
          class="!bg-navy-6 !border-navy-6 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full"
          :loading="isLoadingRegister"
          :disabled="disabledBtnSubmit"
          @click="gotoSelectRecommender"
        >
        </r-button>
      </div>
    </div>
    <RModalConfirm
      v-model:visible="pageState.showModalTermInfo"
      :width="400"
      :mask-closable="true"
      :footer="false"
    >
      <template #extraTitle>
        <p class="text-navy-deep text-base font-medium">
          {{ pageState.currentTermInfo?.termsName }}
        </p>
      </template>
      <template #extraDescription>
        <div v-clean-html="pageState.currentTermInfo?.contents"></div>
        <div class="text-navy-deep pt-3 text-base font-medium">
          <p class="mb-0 cursor-pointer text-center" @click="pageState.showModalTermInfo = false">
            {{ $t('common.ok') }}
          </p>
        </div>
      </template>
    </RModalConfirm>
  </div>

  <RModalAlert
    v-model:visible="pageState.showModalErrorRegister"
    :width="270"
    :text-btn="$t('common.check')"
    @confirm="() => (pageState.showModalErrorRegister = !pageState.showModalErrorRegister)"
  >
    <template #extraDescription>
      <div class="text-center">{{ pageState.messageRegisterError }}</div>
    </template>
  </RModalAlert>

  <RModalConfirm
    v-model:visible="pageState.visibleAlert"
    :width="370"
    :text-ok="$t('auth.sign_up.agree_term_condition.use_address')"
    :text-cancel="$t('auth.sign_up.agree_term_condition.edit_address')"
    :mask-closable="false"
    @ok="gotoSelectRecommender"
    @cancel="pageState.visibleAlert = false"
  >
    <template #extraDescription>
      <span> {{ pageState.descriptionAlert }}</span>
    </template>
  </RModalConfirm>
</template>

<script setup>
import apiService from '@/http/api'
import { storage } from '@/utils/storage'
import {
  CURRENCY,
  FORMAT_FULL_YEAR,
  NO_SNS,
  STORAGE_ACCESS_TOKEN,
  STORAGE_CURRENT_STEP,
  STORAGE_ENTER_INFORMATION,
  STORAGE_ENTER_SHIPPING_DATA,
  STORAGE_ID_REGISTER_SUCCESS,
  STORAGE_INC_NUMBER,
  STORAGE_IS_LOGGED_IN,
  STORAGE_REFRESH_TOKEN,
  STORAGE_SNS_DATA,
  STORAGE_USER_NUMBER,
  STORAGE_USER_TYPE,
  VALUE_COUNTRY
} from '@helpers/constant'
import { AuthUserEnum, LevelUserEnum, OrderTypeEnum } from '@helpers/enum'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useMutation } from 'vue-query'
import { useRouter } from 'vue-router'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { handleRole } from '@/utils/role'
import { getRegisterStep } from '@/utils/authenticate'
import { AppRoutes } from '@/router/path'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { financial } from '@/utils/common'
import { getSaveTokenStorage } from '@/utils/auth'
import { formatDateTime } from '@/utils/datetime'
import { PlannerRegisterTermsEnum } from '@/helpers/enum'
import RSubNavigation from '@/components/navigation/RSubNavigation.vue'
import RHeading from '@/components/common/RHeading.vue'
import RStep from '@/components/common/RStep.vue'
import RCheckboxOutlined from '@/components/common/RCheckboxOutlined.vue'
import SelectOptionsForFee from '@/components/app/payment/SelectOptionsForFee.vue'
import RButton from '@/components/common/RButton.vue'
import RModalConfirm from '@/components/common/RModalConfirm.vue'
import RModalAlert from '@/components/common/RModalAlert.vue'
import FormPaymentHk from '@/components/app/payment/FormPaymentHk.vue'
import { renderCurrency } from '@/utils/currency'
import { MESSAGE } from '@/helpers/constant'
import { useNotification } from '@/composables/notification'

const domain = window.location.origin
const MARKETING_TERM_ID = [4, 9]
const { showNotification } = useNotification()
const vCleanHtml = buildVueDompurifyHTMLDirective()
const router = useRouter()
const dataSns = storage.get(STORAGE_SNS_DATA)
const dataEnterInformation = storage.get(STORAGE_ENTER_INFORMATION)
const dataEnterShipping = storage.get(STORAGE_ENTER_SHIPPING_DATA)
const dataIncNumber = storage.get(STORAGE_INC_NUMBER)
const rolePlanner = [AuthUserEnum.CO_OPERATE, AuthUserEnum.PLANNER]
const storeLoading = useGlobalLoadingStore()
const refPaymentComp = ref(null)
const dataPayment = ref(null)
const { showGlobalLoading } = storeLoading

const pageState = reactive({
  checkAll: false,
  isPayment: false,
  checkedList: [],
  step: getRegisterStep(storage.get(STORAGE_USER_TYPE)?.userType),
  totalStep: getRegisterStep(storage.get(STORAGE_USER_TYPE)?.userType),
  isDisabled: computed(() => {
    return checkSelectedTerm()
  }),
  showModalTermInfo: false,
  currentTermInfo: {
    termsName: '',
    contents: ''
  },
  dataTerms: [],
  showModalErrorRegister: false,
  messageRegisterError: '',
  listProductRegister: [],
  productSelect: [],
  memberShipFee: {},
  taxProduct: 0,
  shippingFee: 0,
  visibleAlert: false,
  descriptionAlert: ''
})

const listTerms = ref([])
const formStatePayment = reactive({})
const passValidateFormPayment = ref(false)

const filterTerm = (data) => {
  return data?.filter((item) => {
    return ![PlannerRegisterTermsEnum.RETURN, PlannerRegisterTermsEnum.SHIPPING].includes(
      item.termsCategory?.code
    )
  })
}
const getListTerms = async () => {
  showGlobalLoading(true)
  try {
    const response = await apiService.authService.terms({
      type: handleRole(currentUserType.value, dataIncNumber)
    })
    const responseData = filterTerm(response?.data) || []
    pageState.dataTerms =
      responseData?.map((term) => ({
        ...term,
        groupItem: responseData.filter((group) => group.termsGroup === term.termsId).reverse()
      })) || []
  } finally {
    showGlobalLoading(false)
  }
}
const getProductRegister = async () => {
  showGlobalLoading(true)
  try {
    const response = await apiService.productService.getProductRegister({
      country: dataEnterInformation.country
    })
    if (response.success) {
      pageState.listProductRegister = response.data
    }
  } finally {
    showGlobalLoading(false)
  }
}

const getMemberShipFee = async () => {
  showGlobalLoading(true)
  try {
    const response = await apiService.authService.getMemberShipFee({
      type: handleRole(currentUserType.value, dataIncNumber),
      currency: CURRENCY.HKD
    })
    if (response.success) {
      pageState.memberShipFee = response.data
    }
  } finally {
    showGlobalLoading(false)
  }
}

const getTaxProductFee = async (payload) => {
  showGlobalLoading(true)
  try {
    const response = await apiService.orderService.calculateTaxOrder(payload)
    if (response.success) pageState.taxProduct = response.data?.totalTaxAmount
  } finally {
    showGlobalLoading(false)
  }
}

onMounted(() => {
  getListTerms()
  if (rolePlanner.includes(currentUserType.value)) {
    getProductRegister()
    getMemberShipFee()
  }
})

const transformTerms = (defaultChecked = false) => {
  const data = []
  pageState.dataTerms.forEach((item) => {
    data.push({
      ...item,
      value: item.termsId,
      checked: defaultChecked,
      children: findChildrenTerm(item, pageState.dataTerms || [], defaultChecked)
    })
  })
  return data?.length ? data.filter((el) => !el.termsIdParent) : []
}

const onCheckTermParent = (checked, parentItem) => {
  parentItem?.children.forEach((child) => {
    child.checked = !checked
  })
  const checkedItem = [parentItem?.termsId, ...parentItem.children.map((el) => el.termsId)]

  pageState.checkedList = setPageCheckedList(!checked, checkedItem)
  listTerms.value = listTerms.value.map((e) => {
    if (e.termsId === parentItem?.termsId) {
      return {
        ...e,
        checked: !e.checked
      }
    } else return e
  })
}

const onCheckTermChild = (checked, childItem) => {
  const parentItem = listTerms.value?.find((item) => item.children.includes(childItem))

  const newData = listTerms.value.map((e) => {
    if (e.termsId === parentItem.termsId) {
      return {
        ...e,
        children: e.children.map((child) => {
          if (child.termsId === childItem.termsId) {
            return { ...child, checked: !child.checked }
          }
          return child
        })
      }
    } else return e
  })
  listTerms.value = newData

  const parentCompareData = newData.find((item) => item.termsId === parentItem?.termsId)
  parentItem.checked = parentCompareData.children.some((child) => child.checked)

  listTerms.value = newData.map((e) => {
    if (e.termsId === parentItem.termsId) {
      return {
        ...e,
        checked: parentItem.checked
      }
    } else return e
  })

  const checkedItem = parentItem.checked
    ? [parentItem.termsId, ...parentItem.children.map((el) => el.termsId)]
    : [
      parentItem.termsId,
      ...parentItem.children.filter((el) => !el.checked).map((el) => el.termsId)
    ]
  pageState.checkedList = setPageCheckedList(parentItem.checked, checkedItem)
}

const setPageCheckedList = (isChecked, checkedItem) => {
  if (isChecked) {
    return [...new Set([...pageState.checkedList, ...checkedItem])]
  } else {
    return [...new Set(pageState.checkedList.filter((el) => !checkedItem.includes(el)))]
  }
}

const { mutate: mutateRegister, isLoading: isLoadingRegister } = useMutation(
  async (payload) => {
    showGlobalLoading(true)
    return await apiService.authService.register(payload)
  },
  {
    onSuccess: (response) => {
      showGlobalLoading(false)
      storage.set(STORAGE_USER_NUMBER, response.data.userNumber)
      storage.set(STORAGE_ID_REGISTER_SUCCESS, response.data.userId)
      if (response.data.registerCode === MESSAGE.SUCCESS.toLocaleUpperCase()) {
        const { access_token, refresh_token } = response.data.auth
        const routePush = `${AppRoutes.register.path}/${AppRoutes.register.complete.path}`
        router.push(routePush)
        const saveStorage = getSaveTokenStorage()
        storage.set(STORAGE_CURRENT_STEP, [...storage.get(STORAGE_CURRENT_STEP), routePush])
        storage.set(STORAGE_ACCESS_TOKEN, access_token, saveStorage)
        storage.set(STORAGE_REFRESH_TOKEN, refresh_token, saveStorage)
        storage.set(STORAGE_IS_LOGGED_IN, true, saveStorage)
      } else {
        pageState.messageRegisterError = response.message
        pageState.showModalErrorRegister = true
      }
    }
  }
)

const { mutate: mutateRegisterInit } = useMutation(
  async (payload) => {
    showGlobalLoading(true)
    return await apiService.authService.registerInit(payload)
  },
  {
    onSuccess: async (response) => {
      if (response.message === MESSAGE.SUCCESS) {
        const payloadGenUrl = {
          tokenUser: response.data.registerCompleteToken,
          redirectUrl: 'https://dev-mall.riman.tw/event-payment?event=REGISTER',
          paymentMethod: 'CREDIT_CARD',
          prime: '4c02ecde1a454ec14b38344c7d0d1efd2b140fc18ca4bf94109aec462738be8c'
        }
        const res = await apiService.authService.genUrlCreditCard(payloadGenUrl)
        if (res.message === MESSAGE.SUCCESS) {
          dataPayment.value = response.data
          refPaymentComp.value.handleOpenModal()
        } else {
          showNotification({ type: 'error', duration: 3, message: res.message })
        }
      } else {
        dataPayment.value = null
      }
      showGlobalLoading(false)
    }
  }
)

const findChildrenTerm = (childItem, listItems, defaultChecked = false) => {
  if (!listItems.length) return []
  const childItems = []
  listItems.forEach((item) => {
    if (item.termsIdParent === childItem.termsId) {
      childItems.push({ ...item, checked: defaultChecked })
    }
  })

  return childItems
}

const requiredTerms = computed(() =>
  pageState.dataTerms.filter((item) => item.agreeYn)?.map((el) => el.termsId)
)
const labelValueOptions = computed(() => pageState.dataTerms.map((item) => item.termsId))
const currentUserType = ref(storage.get(STORAGE_USER_TYPE)?.userType)

const onlyShowForBusiness = () => {
  if (!currentUserType.value) return false
  return currentUserType.value !== AuthUserEnum.CONSUMER
}

const doShowTermInfo = (term) => {
  redirectToPolicy(term?.termsCategory?.code || '')
}

const redirectToPolicy = (id) => {
  switch (id) {
    case PlannerRegisterTermsEnum.PROCEDURE:
    case PlannerRegisterTermsEnum.TERM:
      window.open(`${domain}${AppRoutes.privacy.policiesAndProcedure.path}`, '_blank')
      break
    case PlannerRegisterTermsEnum.PERSONAL_INFORMATION:
      window.open(`${domain}${AppRoutes.privacy.terms.path}`, '_blank')
      break
    case PlannerRegisterTermsEnum.NOTICE:
      window.open(`${domain}${AppRoutes.privacy.policy.path}`, '_blank')
      break
    case PlannerRegisterTermsEnum.RETURN:
      window.open(`${domain}${AppRoutes.policy.path}`, '_blank')
      break
    case PlannerRegisterTermsEnum.SHIPPING:
      window.open(`${domain}${AppRoutes.shipping.path}`, '_blank')
      break
    case PlannerRegisterTermsEnum.TERM_CONDITION:
      window.open(`${domain}${AppRoutes.privacy.terms.path}`, '_blank')
      break
    default:
      break
  }
}

const isDisplayPolicy = (term) => {
  return ![PlannerRegisterTermsEnum.RETURN, PlannerRegisterTermsEnum.SHIPPING].includes(
    term?.termsCategory?.code || ''
  )
}

const isOrderTerm = (term) => term?.termsCategory?.code === PlannerRegisterTermsEnum.ORDER_TERM

const onSelectAll = (e) => {
  pageState.checkedList = getCheckedItemForAll(!e)
}

const getCheckedItemForAll = (isChecked) => {
  listTerms.value = transformTerms(isChecked)
  return isChecked ? labelValueOptions?.value : []
}

const handleDataAgreeTerm = (data) => {
  const newData = []
  listTerms.value?.map((item) => {
    newData.push({
      termId: item?.termsId,
      termType: item?.termsType?.code,
      termVersion: item?.version,
      agree: item?.checked
    })
    if (item?.children?.length) {
      item.children.map((e) => {
        newData.push({
          termId: e?.termsId,
          termType: e?.termsType?.code,
          termVersion: e?.version,
          agree: e?.checked
        })
      })
    }
  })

  return newData
}

// handle data flow role register
const gotoSelectRecommender = () => {
  pageState.visibleAlert = false
  const {
    firstName,
    lastName,
    gender,
    password,
    birthDay,
    birthMonth,
    birthYear,
    personalId,
    email,
    ssn,
    cellphone,
    country
  } = dataEnterInformation
  const dataSubmit = {
    lastName,
    firstName,
    userType: handleRole(currentUserType.value, dataIncNumber),
    serviceType: dataSns ? dataSns.snsType : NO_SNS,
    email,
    personalId,
    userPassword: password,
    birthDate: birthYear ? `${birthYear}-${birthMonth}-${birthDay}` : `${birthMonth}-${birthDay}`,
    gender,
    agreements: handleDataAgreeTerm(pageState.checkedList),
    globalRefererRegionCode: dataIncNumber?.globalRefererRegionCode,
    globalRefererUserNumber: dataIncNumber?.globalRefererUserNumber,
    kStoreReferrerCode: dataIncNumber?.kStoreReferrerCode,
    country,
    phoneNumber: cellphone?.replace(/\s/g, '')
  }

  if (!dataIncNumber) {
    delete dataSubmit?.globalRefererRegionCode
    delete dataSubmit?.globalRefererUserNumber
  }
  if (dataSns) dataSubmit.tokenSocial = dataSns.snsToken
  if (currentUserType.value === AuthUserEnum.CONSUMER) {
    mutateRegister(dataSubmit)
  } else {
    const { firstName, lastName, city, address1, address2, phoneNumber, area } =
      dataEnterShipping.shipping
    dataSubmit.shipping = {
      firstName,
      lastName,
      phoneNumber,
      address1,
      address2,
      city,
      country,
      area
    }
    dataSubmit.memberShipId = pageState.memberShipFee?.membershipId
    if (onlyShowForBusiness()) {
      dataSubmit.productList = pageState.productSelect.map((item) => {
        return {
          productId: item.productId,
          quantity: 1
        }
      })
      let money = 0
      pageState.productSelect.map((item) => (money += item.salesAmount))
      dataSubmit.shipAmount = pageState?.shippingFee
      dataSubmit.membershipTaxAmount = 0
      dataSubmit.productAmount = money
      dataSubmit.userRank = LevelUserEnum.PLANNER
      dataSubmit.productTaxAmount = pageState.taxProduct
      dataSubmit.currency = renderCurrency(country)?.value
    }
    if (currentUserType.value === AuthUserEnum.PLANNER) {
      if (country === VALUE_COUNTRY.US) dataSubmit.ssnNumber = ssn
      mutateRegister(dataSubmit)
    }
    if (currentUserType.value === AuthUserEnum.CO_OPERATE) {
      mutateRegister(dataSubmit)
    }
  }
}

const checkSelectedTerm = () => {
  if (!requiredTerms?.value?.length) return false
  return !(
    pageState.checkAll ||
    (requiredTerms?.value ?? [])?.every((item) =>
      [...(pageState.checkedList ?? [])]?.sort((a, b) => a - b).includes(item)
    )
  )
}

const handleCheckAgreeAll = (listTerms) => {
  return listTerms.every(
    (el) => el.checked && (el.children ? el.children.every((child) => child.checked) : true)
  )
}

watch(
  () => [listTerms.value],
  () => {
    pageState.checkAll = handleCheckAgreeAll(listTerms.value)
  }
)

watch(
  () => pageState.dataTerms,
  (val) => {
    listTerms.value = transformTerms(false)
  }
)

const disabledBtnSubmit = computed(() => {
  if (currentUserType.value !== AuthUserEnum.CONSUMER) {
    return pageState.isDisabled
  }
  return pageState.isDisabled
})

const updateDataPayment = (newVal) => {
  Object.assign(formStatePayment, newVal)
}
const checkStatusValidatePayment = (status) => {
  passValidateFormPayment.value = status
}

const calculateTotalAmount = computed(() => {
  if (pageState.productSelect.length === 0) {
    return Number(financial(pageState.memberShipFee?.amount || 0))
  } else {
    let money = 0
    pageState.productSelect.map((item) => (money += item.salesAmount))
    return Number(
      financial(
        money +
          (pageState.memberShipFee?.amount || 0) +
          pageState.taxProduct +
          pageState?.shippingFee
      )
    )
  }
})

watch(
  () => pageState.productSelect,
  (value) => {
    if (!value.length) {
      pageState.taxProduct = 0
      pageState.shippingFee = 0
    }
  },
  {
    deep: true,
    immediate: true
  }
)

const getShippingFee = async (payload) => {
  showGlobalLoading(true)
  try {
    const response = await apiService.orderService.getShippingFeePublicOrder(payload)
    if (response.success) pageState.shippingFee = response.data?.deliveryFeeAmount
    else {
      pageState.showModalErrorRegister = true
      pageState.messageRegisterError = response?.message
    }
  } finally {
    showGlobalLoading(false)
  }
}

const handleGetInfoShipAndTax = async (value) => {
  const {
    firstName,
    lastName,
    address,
    aptFloorSuite,
    city,
    state,
    zipCode,
    country,
    phoneNumber,
    homePhone
  } = dataEnterShipping.shipping
  const shippingAddress = {
    firstName,
    lastName,
    address1: address,
    address2: aptFloorSuite,
    city,
    state,
    zipCode,
    country,
    cellPhone: phoneNumber,
    homePhone: homePhone
  }

  const salesOrderProductList = value.map((item) => {
    return { productId: item.productId, quantity: 1, productOptionId: item?.productOptionId }
  })

  await getShippingFee({ salesOrderProductList, billingAddressInfo: { ...shippingAddress } })
  const payload = {
    salesOrderProductList,
    deliveryFeeAmount: pageState?.shippingFee,
    billingAddressInfo: {
      ...shippingAddress
    },
    shipToRequest: {
      ...shippingAddress
    },
    requestDate: formatDateTime(new Date(), FORMAT_FULL_YEAR),
    currencyCode: renderCurrency(country)?.value,
    salesOrderType: OrderTypeEnum.GENERAL_ORDER,
    couponList: [],
    totalPoint: 0
  }
  getTaxProductFee(payload)
}

const updateProductSelect = (data) => {
  const dataMatch = pageState.productSelect?.find((item) => item.productId === data?.productId)
  if (!dataMatch) {
    pageState.productSelect.push(data)
  } else {
    pageState.productSelect = pageState.productSelect.filter(
      (item) => item.productId !== data?.productId
    )
  }
}
</script>

<style lang="scss" scoped>
.checkbox {
  &__note {
    color: #212221;
    @apply font-medium;

    &-optional {
      color: #7a7a7a;
    }
  }

  &__text {
    color: #7a7a7a;
  }
}

:deep(.ant-checkbox-group) {
  @apply flex w-fit flex-col;
}

:deep(.ant-checkbox-wrapper) {
  @apply ml-0 pb-2;
}

:deep(.ant-checkbox-checked) {
  &::after {
    border-color: #123250 !important;
  }

  .ant-checkbox-inner {
    @apply bg-navy-1;
  }
}

:deep(.ant-checkbox-inner) {
  border-color: #d3d3d3 !important;
}
</style>
