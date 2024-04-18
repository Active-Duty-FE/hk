<template>
  <div>
    <div>
      <div class="p-5">
        <r-heading title="Please enter the necessary information when converting to a planner" />
      </div>
      <div class="mb-10 flex justify-end px-5">
        <RStep v-model="pageState.step" :total-step="4" />
      </div>
      <div class="px-[20px] pb-5">
        <div class="border-1 border-black-50 border-solid">
          <div class="px-5 pt-[25px]">
            <r-checkbox-outlined v-model:checked="pageState.checkAll" @checked-change="onSelectAll">
              <template #content>
                <span class="text-gray-black ml-2.5 text-base leading-[22px]">
                  Agree to all policies.
                </span>
              </template>
            </r-checkbox-outlined>
          </div>
          <a-divider class="bg-black-50 !my-[25px]"></a-divider>
          <div class="px-5">
            <div v-for="term in listTerms" :key="term.termsId" class="mb-5">
              <div v-if="isDisplayPolicy(term)" class="mb-2">
                <r-checkbox-outlined
                  v-model:checked="term.checked"
                  @checked-change="(checked) => onCheckTermParent(checked, term)"
                >
                  <template #content>
                    <span
                      v-if="!isOrderTerm(term)"
                      class="font-475 cursor-pointer pl-2.5 text-base"
                      @click="doShowTermInfo(term)"
                    >
                      <span
                        :class="`${!MARKETING_TERM_ID.includes(term.termsId) ? 'underline' : ''}`"
                      >
                        {{ term.termsName }}
                      </span>
                      <span class="text-red-1000">
                        {{ term.agreeYn ? '*' : '' }}
                      </span>
                    </span>
                    <span v-else class="font-475 cursor-pointer pl-2.5 text-base">
                      <span v-if="term.groupItem?.length">
                        <span v-for="(group, index) in term.groupItem" :key="group.termsId">
                          <span class="underline" @click="doShowTermInfo(group)">{{
                            group.termsName
                          }}</span>
                          <span v-if="index < term.groupItem?.length - 1" class="mx-1">&</span>
                        </span>
                      </span>
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
      <span class="text-red-2 pl-5 text-[10px]">{{ pageState.messageValidTerms }}</span>

      <div>
        <div class="px-5">
          <p class="text-gray-14 mb-0 text-xs font-normal">
            If you agree, you can also receive discount coupons for new signups and various other
            event news!
          </p>
          <a-divider class="bg-gray-11 my-[30px]"></a-divider>
        </div>
        <div class="pb-20 md:pb-0">
          <select-options-for-fee
            :list-product-register="pageState.listProductRegister"
            :product-select="pageState.productSelect"
            :member-ship-fee="pageState.memberShipFee.amount"
            :tax-product="pageState.taxProduct"
            :total-amount="calculateTotalAmount"
            :shipping-fee="pageState.shippingFee"
            :currency="renderCurrencyCountry"
            @update-product-select="updateProductSelect"
          />
          <form-payment
            :update-data="updateDataPayment"
            :check-status-valid="checkStatusValidatePayment"
            :allow-valid="pageState.allowValid"
          />
        </div>
      </div>
      <div class="pb-15 hidden w-full px-5 pt-[62px] md:block">
        <r-button
          class-title="text-white"
          title="Complete"
          class="!bg-navy-6 !border-navy-6 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full"
          @click="gotoSelectRecommender"
        >
        </r-button>
      </div>
    </div>
    <div class="fixed bottom-0 left-0 w-full md:hidden">
      <div class="flex justify-center bg-white px-5 pb-8">
        <r-button
          class-title="text-white"
          title="Complete"
          class="!bg-navy-6 !border-navy-6 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full"
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
            OK
          </p>
        </div>
      </template>
    </RModalConfirm>
  </div>

  <RModalAlert
    v-model:visible="pageState.showModalErrorRegister"
    :width="270"
    text-btn="check"
    @confirm="() => (pageState.showModalErrorRegister = !pageState.showModalErrorRegister)"
  >
    <template #extraDescription>
      <div class="text-center">{{ pageState.messageRegisterError }}</div>
    </template>
  </RModalAlert>
</template>

<script setup>
import apiService from '@/http/api'
import { storage } from '@/utils/storage'
import {
  CONVERSION_ENTER_INFORMATION,
  CONVERSION_SHIPPING,
  STORAGE_INC_NUMBER,
  CURRENCY,
  FORMAT_FULL_YEAR,
  VALUE_COUNTRY,
  ROLE_CONVERSION,
  PREFIX_K_STORE,
  MARKETING_TERM_ID,
  ROLES_BE
} from '@helpers/constant'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { handleCardType } from '@/utils/role'
import { AppRoutes } from '@/router/path'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { formatCellphoneToSend, financial } from '@/utils/common'
import { formatDateTime } from '@/utils/datetime'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { storeToRefs } from 'pinia'
import { OrderTypeEnum, NfrImportProductEnum, PlannerRegisterTermsEnum } from '@/helpers/enum'
import { useNotification } from '@/composables/notification'
import { VALIDATE_MESSAGE } from '@/helpers/validate-message'

const vCleanHtml = buildVueDompurifyHTMLDirective()
const router = useRouter()
const dataEnterInformation = storage.get(CONVERSION_ENTER_INFORMATION)
const dataEnterShipping = storage.get(CONVERSION_SHIPPING)
const dataIncNumber = storage.get(STORAGE_INC_NUMBER)
const roleConvert = storage.get(ROLE_CONVERSION)
const storeLoading = useGlobalLoadingStore()
const authUserStore = useAuthUserStore()
const domain = window.location.origin

const { currentAuthUser } = storeToRefs(authUserStore)
const { setCurrentAuthUser } = authUserStore

const { showGlobalLoading } = storeLoading
const { showNotification } = useNotification()

const pageState = reactive({
  checkAll: false,
  checkedList: [],
  step: 4,

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
  messageValidTerms: '',
  allowValid: false
})

const listTerms = ref([])
const formStatePayment = reactive({})
const passValidateFormPayment = ref(false)

const isOrderTerm = (term) => term?.termsCategory?.code === PlannerRegisterTermsEnum.ORDER_TERM

const isCompany = computed(() => {
  return storage.get(ROLE_CONVERSION) === ROLES_BE.corporation
})

const getProductRegister = async () => {
  showGlobalLoading(true)
  try {
    const response = await apiService.productService.getProductRegister({
      country: currentAuthUser.value?.nationalCode
    })
    if (response.success) {
      const newData = []
      response.data.map((e) => {
        if (
          (e.country === NfrImportProductEnum.NFR &&
            currentAuthUser.value.nationalCode === VALUE_COUNTRY.CA) ||
          currentAuthUser.value.nationalCode === e.country
        ) {
          newData.push(e)
        }
      })
      pageState.listProductRegister = newData
    }
  } finally {
    showGlobalLoading(false)
  }
}

const renderCurrencyCountry = computed(() => {
  return currentAuthUser.value.nationalCode === VALUE_COUNTRY.US ? CURRENCY.USD : CURRENCY.CAD
})

const getMemberShipFee = async () => {
  showGlobalLoading(true)
  try {
    const response = await apiService.authService.getMemberShipFee({
      type: roleConvert,
      currency: renderCurrencyCountry.value
    })
    if (response.success) pageState.memberShipFee = response.data
  } finally {
    showGlobalLoading(false)
  }
}

const getTaxProductFee = async (payload) => {
  showGlobalLoading(true)
  try {
    const response = await apiService.orderService.calculateTaxOrderForAuth(payload)
    if (response.success) pageState.taxProduct = response.data?.totalTaxAmount
  } finally {
    showGlobalLoading(false)
  }
}

const getListTerms = async () => {
  showGlobalLoading(true)
  try {
    const response = await apiService.authService.terms({
      type: roleConvert
    })
    const data =
      (response?.data || []).map((term) => ({
        ...term,
        groupItem: (
          (response?.data || [])?.filter((group) => group.termsGroup === term.termsId) || []
        )?.reverse()
      })) || []
    pageState.dataTerms = data
    return data
  } finally {
    showGlobalLoading(false)
  }
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
    case PlannerRegisterTermsEnum.RETURN:
      window.open(`${domain}${AppRoutes.policy.path}`, '_blank')
      break
    case PlannerRegisterTermsEnum.SHIPPING:
      window.open(`${domain}${AppRoutes.shipping.path}`, '_blank')
      break
    case PlannerRegisterTermsEnum.NOTICE:
      window.open(`${domain}${AppRoutes.privacy.policy.path}`, '_blank')
      break
    case PlannerRegisterTermsEnum.TERM_CONDITION:
      window.open(`${domain}${AppRoutes.privacy.terms.path}`, '_blank')
      break
    default:
      break
  }
}

onMounted(() => {
  getListTerms()
  getProductRegister()
  getMemberShipFee()
})

const doShowTermInfo = (term) => {
  redirectToPolicy(term?.termsCategory?.code || '')
}
const onCheckTermChild = (checked, childItem) => {
  const parentItem = listTerms.value?.find((item) => item.children.includes(childItem))

  const newCheckData = listTerms.value.map((e) => {
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
  listTerms.value = newCheckData

  const parentCompareData = newCheckData.find((item) => item.termsId === parentItem?.termsId)
  parentItem.checked = parentCompareData?.children.some((child) => child.checked)

  listTerms.value = newCheckData.map((e) => {
    return e.termsId === parentItem.termsId
      ? {
        ...e,
        checked: parentItem.checked
      }
      : e
  })
  const checkedItem = parentItem.checked
    ? [parentItem.termsId, ...parentItem.children.map((el) => el.termsId)]
    : [
      parentItem.termsId,
      ...parentItem.children.filter((el) => !el.checked).map((el) => el.termsId)
    ]
  pageState.checkedList = setPageCheckedList(parentItem.checked, checkedItem)
}

const isDisplayPolicy = (term) =>
  ![PlannerRegisterTermsEnum.RETURN, PlannerRegisterTermsEnum.SHIPPING].includes(
    term?.termsCategory?.code || ''
  )

const convertToPlanner = async (payload) => {
  showGlobalLoading(true)
  try {
    const response = isCompany.value
      ? await apiService.myPageService.convertToCorporation(payload)
      : await apiService.myPageService.convertToIndividual(payload)

    if (response.success) {
      const { data, success } = await apiService.authService.me()
      if (success) {
        setCurrentAuthUser(data)
      }
      router.push(AppRoutes.myPage)
      storage.remove(CONVERSION_SHIPPING)
      storage.remove(CONVERSION_ENTER_INFORMATION)
      storage.remove(ROLE_CONVERSION)
      storage.remove(STORAGE_INC_NUMBER)
    } else {
      pageState.messageRegisterError = response.message

      pageState.showModalErrorRegister = true
    }
  } finally {
    showGlobalLoading(false)
  }
}

const setPageCheckedList = (isChecked, checkedItem) => {
  if (isChecked) {
    return [...new Set([...pageState.checkedList, ...checkedItem])]
  } else {
    return [...new Set(pageState.checkedList.filter((el) => !checkedItem.includes(el)))]
  }
}

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

const onSelectAll = (e) => {
  pageState.checkedList = getCheckedItemForAll(!e)
}

const handleDataAgreeTerm = (data) => {
  const newData = []
  data.map((item) => {
    const match = listTerms.value.find((terms) => terms.termsId === item)
    if (match) {
      newData.push({
        termId: match.termsId,
        termType: match.termsType.code,
        termVersion: match.version,
        agree: true
      })
    }
  })
  return newData
}

const getCheckedItemForAll = (isChecked) => {
  listTerms.value = transformTerms(isChecked)
  return isChecked ? labelValueOptions?.value : []
}

const handleCheckAgreeAll = (listTerms) => {
  return !listTerms.find((el) => {
    if (!el.checked) return true
    if (el.children.find((child) => !child.checked)) return true
  })
}

const gotoSelectRecommender = () => {
  if (disabledBtnSubmit.value) {
    showNotification({
      type: 'error',
      message: VALIDATE_MESSAGE.requiredPayment
    })
    if (isDisabled.value) {
      pageState.messageValidTerms = VALIDATE_MESSAGE.agreeWithTerm
    }
    if (!passValidateFormPayment.value) {
      pageState.allowValid = true
    }
    return
  }
  const { birthDay, birthMonth, birthYear, ssn, cellphone, companyName } = dataEnterInformation

  const {
    firstName,
    lastName,
    city,
    address,
    addressDescription,
    aptFloorSuite,
    message,
    state,
    zipcode,
    phoneNumber,
    homePhone,
    defaultShip,
    country
  } = dataEnterShipping
  let money = 0
  pageState.productSelect.map((item) => (money += item.salesAmount))
  const dataSubmit = {
    globalRefererRegionCode: dataIncNumber?.globalRefererRegionCode,
    globalRefererUserNumber: dataIncNumber?.globalRefererUserNumber,
    phoneNumber: formatCellphoneToSend(cellphone),
    birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
    shipping: {
      firstName,
      lastName,
      phoneNumber: formatCellphoneToSend(phoneNumber),
      address,
      aptFloorSuite,
      city,
      state,
      zipCode: zipcode,
      country,
      message,
      telPhone: homePhone && formatCellphoneToSend(homePhone),
      addressDescription,
      defaultShipping: defaultShip || false
    },
    creditCard: {
      ...formStatePayment,
      cardType: handleCardType(roleConvert),
      userType: roleConvert,
      cardNumber: formStatePayment.cardNumber.replaceAll(' ', ''),
      email: currentAuthUser.value.email
    },
    agreements: handleDataAgreeTerm(pageState.checkedList),
    ssnNumber: ssn,

    productInfo: {
      productList: pageState.productSelect.map((item) => {
        return {
          productId: item.productId,
          quantity: 1
        }
      }),
      productAmount: money,
      shipAmount: pageState?.shippingFee,
      productTaxAmount: pageState.taxProduct
    }
  }

  if (dataIncNumber.kStoreReferrerCode) {
    dataSubmit.kStoreReferrerCode = dataIncNumber.kStoreReferrerCode.split(PREFIX_K_STORE)[1]
  }
  if (isCompany.value) {
    dataSubmit.companyName = companyName
    delete dataSubmit.ssnNumber
  }
  if (currentAuthUser.value?.nationalCode === VALUE_COUNTRY.CA) {
    delete dataSubmit.ssnNumber
  }

  convertToPlanner(dataSubmit)
}

const checkSelectedTerm = () => {
  if (!requiredTerms?.value?.length) return false
  return !(
    pageState.checkAll ||
    [...pageState.checkedList]
      .sort((a, b) => a - b)
      .toString()
      .includes(requiredTerms?.value.toString())
  )
}

const isDisabled = computed(() => {
  return checkSelectedTerm()
})

watch(
  () => isDisabled.value,
  (val) => {
    if (!val) pageState.messageValidTerms = ''
  }
)

watch(
  () => pageState.dataTerms,
  (val) => {
    listTerms.value = transformTerms(false)
  }
)

const disabledBtnSubmit = computed(() => {
  return isDisabled.value || !passValidateFormPayment.value
})

watch(
  () => listTerms.value,
  () => {
    pageState.checkAll = handleCheckAgreeAll(listTerms.value)
  }
)

const updateDataPayment = (newVal) => {
  Object.assign(formStatePayment, newVal)
}
const checkStatusValidatePayment = (status) => {
  passValidateFormPayment.value = status
}

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
    if (value.length) {
      handleGetInfoShipAndTax(value)
    } else {
      pageState.taxProduct = 0
      pageState.shippingFee = 0
    }
  },
  {
    deep: true,
    immediate: true
  }
)

const handleGetInfoShipAndTax = async (value) => {
  const salesOrderProductList = value.map((item) => {
    return { productId: item.productId, quantity: 1, productOptionId: item?.productOptionId }
  })

  const {
    firstName,
    lastName,
    address,
    aptFloorSuite,
    city,
    state,
    zipcode,
    country,
    phoneNumber,
    homePhone
  } = dataEnterShipping
  const shippingAddress = {
    firstName,
    lastName,
    address1: address,
    address2: aptFloorSuite,
    city,
    state,
    zipCode: zipcode,
    country,
    cellPhone: formatCellphoneToSend(phoneNumber),
    homePhone: homePhone ? formatCellphoneToSend(homePhone) : ''
  }

  await getShippingFee({ salesOrderProductList, billingAddressInfo: shippingAddress })
  getTaxProductFee({
    salesOrderProductList,
    deliveryFeeAmount: pageState?.shippingFee,
    billingAddressInfo: {
      ...shippingAddress
    },
    shipToRequest: {
      ...shippingAddress
    },
    requestDate: formatDateTime(new Date(), FORMAT_FULL_YEAR),
    currencyCode: country === VALUE_COUNTRY.US ? CURRENCY.USD : CURRENCY.CAD,
    salesOrderType: OrderTypeEnum.GENERAL_ORDER,
    couponList: [],
    totalPoint: 0
  })
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

const onCheckTermParent = (checked, parentItem) => {
  parentItem?.children.forEach((child) => {
    child.checked = !checked
  })
  const checkedItem = [parentItem?.termsId, ...parentItem.children.map((el) => el.termsId)]
  pageState.checkedList = setPageCheckedList(!checked, checkedItem)
  listTerms.value = listTerms.value.map((item) => {
    return item.termsId === parentItem?.termsId
      ? {
        ...item,
        checked: !item.checked
      }
      : item
  })
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
