import {
  CELLPHONE_LENGTH,
  INQUIRY_PREFIX,
  MOBILE_MENUS,
  PUBLIC_KEY_ENCRYPT,
  S3_URL_IMAGE,
  STORAGE_REFERRAL_CODE,
  STORAGE_IP_ADDRESS,
  FORMAT_HOUR_MINUTE_SECOND,
  mappingImageS3
} from '@/helpers/constant'
import { checkFutureDate } from '@/helpers/date'
import {
  ALPHABETS,
  ESCAPE,
  REGEX_CELLPHONE,
  REGEX_FORMAT_CARD,
  REGEX_CLEANED_MATCH,
  VISA,
  AMEX,
  MASTERCARD,
  MASTERCARD_SECOND,
  DISCO_FIRST,
  DISCO_SECOND,
  DISCO_THIRD,
  DINERS,
  JCB,
  CUP_FIRST,
  CUP_SECOND,
  HTTPS_LINK
} from '@/helpers/regex'
import { VALIDATE_MESSAGE } from '@/helpers/validate-message'
import apiService from '@/http/api'
import JSEncrypt from 'jsencrypt'
import slugify from 'slugify'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { isBeautyPlanner } from '@/utils/role'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { formatCurrency } from '@/utils/currency'
import storage from '@/utils/storage'
import { CountryEnum, ProductRitualExploreEnum } from '@/helpers/enum'
import dayjs from 'dayjs'

export const formatPhoneNumber = (phoneNumberString) => {
  if (!phoneNumberString) return phoneNumberString
  if (!REGEX_CELLPHONE.test(phoneNumberString) && phoneNumberString.length === CELLPHONE_LENGTH) {
    const cleaned = ('' + phoneNumberString).replace(ALPHABETS, '')
    const match = cleaned.match(REGEX_CLEANED_MATCH)
    if (match) return `(${match[1]}) ${match[2]}-${match[3]}`
    return phoneNumberString
  } else return phoneNumberString
}

export const formatPhoneNumberHk = (phoneNumberString) => {
  if (!phoneNumberString) return phoneNumberString
  if (!REGEX_CELLPHONE.test(phoneNumberString) && phoneNumberString.length === CELLPHONE_LENGTH) {
    const cleaned = ('' + phoneNumberString).replace(ALPHABETS, '')
    const match = cleaned.match(REGEX_CLEANED_MATCH)
    if (match) return `(${match[1]}) ${match[2]}-${match[3]}`
    return phoneNumberString
  } else return phoneNumberString
}

export const formatCellphoneToSend = (cellphone) => {
  return cellphone.replace(ALPHABETS, '')
}

export const removeSpaces = (inputString) => {
  return inputString.replace(/ /g, '')
}

export const removeCharacterString = (string) => {
  return string?.replace(/\D/g, '')
}

export const formatNumberPhoneHk = (numberString) => {
  const digitsOnly = removeCharacterString(numberString)
  const part1 = digitsOnly.substring(0, 4)
  const part2 = digitsOnly.substring(4)
  return `${part1} ${part2}`
}

export const convertStringNumber = (string) => {
  return string.replace(/\D/g, '')
}

export const isValidDate = (year, month, day) => {
  const newYear = Number(year)
  const newMonth = Number(month)
  const newDay = Number(day)
  const date = new Date(newYear, newMonth - 1, newDay)
  return (
    !isNaN(date) &&
    date.getDate() === newDay &&
    date.getMonth() === newMonth - 1 &&
    date.getFullYear() === newYear
  )
}

export const checkAgeOfUser = (year, month, day, yearRequired) => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1 // Months are 0-based
  const currentDay = currentDate.getDate()

  let age = currentYear - Number(year)

  if (
    currentMonth < Number(month) ||
    (currentMonth === Number(month) && currentDay < Number(day))
  ) {
    age-- // Subtract 1 if birthdate hasn't occurred this year yet
  }

  return age >= yearRequired
}

export const shippingAddressDescriptionNonMember = (shippingAddress) => {
  const { country, city, state, zipcode, address, aptFloorSuite } = shippingAddress
  let result = ''
  if (country) result += country
  if (zipcode) result += ` [${zipcode}]`

  const extraAddress = []
  if (aptFloorSuite) extraAddress.push(aptFloorSuite)
  if (address) extraAddress.push(address)
  if (city) extraAddress.push(city)
  if (state) extraAddress.push(state)

  if (extraAddress.length) result += `\n${extraAddress.join(', ')}`

  return result
}

export const shippingAddressDescription = (shippingAddress) => {
  const { userAddressId } = shippingAddress
  if (!userAddressId) return ''

  return shippingAddressDescriptionNonMember(shippingAddress)
}

export const formatCardNumber = (value) => {
  const pattern = new RegExp(`(${ALPHABETS}|${ESCAPE})`)
  return value.replace(pattern, '').replace(REGEX_FORMAT_CARD, '$1 ')
}

export const renderMessageErrorDateExpired = (year, month) => {
  if (!year || !month) return ''
  if (month > 12) return VALIDATE_MESSAGE.inValidMonth
  return checkFutureDate(year, month) ? '' : VALIDATE_MESSAGE.pastDate
}

export const randomNumber = (max, min) => {
  const cryptoObj = window.crypto || window.msCrypto
  if (cryptoObj) {
    const array = new Uint32Array(1)
    cryptoObj.getRandomValues(array)
    return Math.floor((array[0] / 0xffffffff) * (max - min + 1)) + min
  }

  return 1
}

export const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export const getAlphabets = () => {
  const result = []
  for (let i = 65; i <= 90; i++) {
    result.push(String.fromCharCode(i)) // Uppercase letters (A-Z)
  }
  return result
}

export const getProductLists = async (params) => {
  return await apiService.productService.getListProducts(params)
}

export const transformNestedMenu = (arr, parentId = null) => {
  const nestedArr = []

  for (const item of arr) {
    const data = {
      path: textToSlug(item.categoryName),
      name: item.categoryName
    }
    if (item.parentId === parentId) {
      const children = transformNestedMenu(arr, item.categoryId)
      if (children.length) {
        item.children = children
      }
      nestedArr.push({ ...item, ...data })
    }
  }

  return nestedArr.filter((el) => el.categoryName !== '').map((el) => ({ ...el, others: [] }))
}

export const getListMenus = async () => {
  const params = {
    country: CountryEnum.US.value
  }
  const response = await apiService.menuService.getListMenus(params)
  return response?.success && response?.data
    ? { fromApi: true, data: response.data }
    : { fromApi: false, data: MOBILE_MENUS }
}

export const textToSlug = (text = '') => {
  return slugify(text, {
    replacement: '-',
    lower: true,
    strict: false,
    locale: 'en',
    trim: true
  })
}

export const getParentCategoryByChild = (child, arr) => {
  let listArr = [child]
  const firstParent = findCategoryParentByChild(child, arr)
  const lastParent = findCategoryParentByChild(firstParent, arr)
  if (firstParent && lastParent) listArr = [firstParent, lastParent, ...listArr]

  return listArr.sort((a, b) => a.level - b.level)
}

export const findCategoryParentByChild = (child, arr) => {
  return arr.find((el) => el.categoryId === child?.parentId)
}

export const findOtherMenus = (menu) => {
  const others = menu.others
  const categoryNotHaveChild = menu?.children?.length
    ? menu?.children?.filter((el) => !el?.children?.length)?.map((el) => ({ ...el, isBold: true }))
    : []
  return [...categoryNotHaveChild, ...others]
}

export const copyText = (text) => {
  navigator.clipboard.writeText(text)
}

export const encryptCard = (value) => {
  const crypt = new JSEncrypt()

  crypt.setKey(PUBLIC_KEY_ENCRYPT)
  const encryptedNumber = crypt.encrypt(value)

  return encryptedNumber
}

export const creditCardType = (cc) => {
  if (VISA.test(cc)) {
    return 'VISA'
  }
  if (AMEX.test(cc)) {
    return 'AMEX'
  }
  if (MASTERCARD.test(cc) || MASTERCARD_SECOND.test(cc)) {
    return 'MASTERCARD'
  }
  if (DISCO_FIRST.test(cc) || DISCO_SECOND.test(cc) || DISCO_THIRD.test(cc)) {
    return 'DISCOVER'
  }
  if (DINERS.test(cc)) {
    return 'DINERS'
  }
  if (JCB.test(cc)) {
    return 'JCB'
  }
  if (CUP_FIRST.test(cc) || CUP_SECOND.test(cc)) {
    return 'CHINA_UNION_PAY'
  }
  return undefined
}

export const renderDataCardSubmit = (formState) => {
  const {
    cardFirstName,
    cardLastName,
    cardNumber,
    expiredMonth,
    expiredYear,
    cardCvc,
    billFirstName,
    billLastName,
    billAddress,
    billAptFloorSuite,
    billCity,
    billState,
    billZipCode,
    billCountry,
    billMobileNumber,
    defaultCard
  } = formState
  const dataCardSubmit = {
    cardHolderName: `${cardFirstName} ${cardLastName}`,
    cardNumber: encryptCard(formatCellphoneToSend(cardNumber)),
    expiredMonth,
    expiredYear,
    cardCvc,
    cardType: creditCardType(formatCellphoneToSend(cardNumber)),
    isDefault: defaultCard,
    billingAddress: {
      firstName: billFirstName,
      lastName: billLastName,
      address1: billAddress,
      address2: billAptFloorSuite,
      city: billCity,
      state: billState,
      zipCode: billZipCode,
      country: billCountry,
      cellPhone: formatCellphoneToSend(billMobileNumber)
    }
  }

  return dataCardSubmit
}

export const addPrefixForImage = (url) => {
  if (HTTPS_LINK.test(url)) return url
  return `${S3_URL_IMAGE}/${url}`
}

export const addPrefixForImageInquiry = (url) => `${INQUIRY_PREFIX}${url}`

export const financial = (x) => {
  return Number.parseFloat(x).toFixed(2)
}

export const formatNumberDivide = (data, divide, exponent) => {
  return formatCurrency(Number(data / divide).toFixed(exponent))
}

export const showWelcomeReferral = computed(() => {
  const { currentAuthUser, referralInfo } = storeToRefs(useAuthUserStore())
  const referralCode = storage.get(STORAGE_REFERRAL_CODE)
  const checkRef = Boolean(
    currentAuthUser?.value && currentAuthUser.value?.referralFirstName && !isBeautyPlanner?.value
  )
  return (!currentAuthUser?.value && referralInfo?.value && referralCode) || checkRef
})

export const showWelcomeReferralBeauty = computed(() => {
  const { currentAuthUser, referralInfo } = storeToRefs(useAuthUserStore())
  const checkRef = Boolean(
    currentAuthUser?.value && currentAuthUser.value?.referralFirstName && isBeautyPlanner?.value
  )
  return (!currentAuthUser?.value && referralInfo?.value) || checkRef
})

export const getBetweenDays = (preDay, currDay) => {
  const preDate = new Date(preDay)
  const currDate = new Date(currDay)
  const ms1 = preDate.getTime()
  const ms2 = currDate.getTime()
  return Math.ceil((ms2 - ms1) / (24 * 60 * 60 * 1000))
}

export const caculateNfrCartBadge = (nfrData) => {
  return nfrData.reduce((sum, item) => {
    return sum + item.quantity
  }, 0)
}

export const convertCartADisplay = (item) => {
  return item ? (item < 100 ? item : '99+') : '0'
}

export const handleStyleFontColor = (color) => {
  return color ? 'text-white' : 'text-black-50'
}

export const countryLocalStorage =
  storage.get(STORAGE_IP_ADDRESS, 'localStorage') || CountryEnum.US.value

export const renderRitualTypeProduct = (data, title) => {
  const listCleanse = data.filter((item) => item.type === ProductRitualExploreEnum.CLEANSE)
  const listHydrate = data.filter((item) => item.type === ProductRitualExploreEnum.HYDRATE)
  const listProtect = data.filter((item) => item.type === ProductRitualExploreEnum.PROTECT)
  const listSet = data.filter((item) => item.type === ProductRitualExploreEnum.SET)
  switch (title) {
    case ProductRitualExploreEnum.CLEANSE:
      return listCleanse
    case ProductRitualExploreEnum.HYDRATE:
      return listHydrate
    case ProductRitualExploreEnum.PROTECT:
      return listProtect
    case ProductRitualExploreEnum.SET:
      return listSet

    default:
      return listCleanse
  }
}

export const joinDateTimeUser = computed(() => {
  const { currentAuthUser } = storeToRefs(useAuthUserStore())
  return currentAuthUser.value?.joinDatetime
})

export const checkBuyPeriod = (productDetail, joinDate) => {
  const joinDateTime = dayjs(new Date(joinDate || joinDateTimeUser.value))
  const buyPeriodLimitDay = productDetail?.setBuyPeriodLimitDay

  if (productDetail?.validBuySignUp) {
    return false
  }
  const currentDate = dayjs.utc(new Date())

  const targetTime = joinDateTime.add(buyPeriodLimitDay, 'day')

  if (currentDate.isSame(targetTime, 'day')) {
    return (
      dayjs(currentDate).format(FORMAT_HOUR_MINUTE_SECOND) >
      dayjs(targetTime).format(FORMAT_HOUR_MINUTE_SECOND)
    )
  }

  return currentDate > targetTime
}

export const addPrefixForImageNew = (url) => {
  if (HTTPS_LINK.test(url)) return url
  return mappingImageS3(url)
}
