import { REGEX_PASSWORD, REGEX_NAME, ALPHABETS, REGEX_SPACE } from './regex'
import { VALIDATE_MESSAGE, REQUIRED } from './validate-message'
import { TYPE_NAME } from './constant'

export const validateRequired = async (_rule, value) => {
  if (!value) {
    return Promise.reject(`${VALIDATE_MESSAGE.required} ${_rule.field} `)
  } else {
    return Promise.resolve()
  }
}

const returnMessageFirst = (type) => {
  return type === REQUIRED
    ? `${VALIDATE_MESSAGE.required} your first name`
    : `First name ${VALIDATE_MESSAGE.max20}`
}
const returnMessageLast = (type) => {
  return type === REQUIRED
    ? `${VALIDATE_MESSAGE.required} your last name`
    : `Last name ${VALIDATE_MESSAGE.max20}`
}

export const renderMessageName = (name, type) => {
  switch (name) {
    case TYPE_NAME.FIRST_NAME:
      return returnMessageFirst(type)
    case TYPE_NAME.CARD_FIRST_NAME:
      return returnMessageFirst(type)
    case TYPE_NAME.LAST_NAME:
      return returnMessageLast(type)
    case TYPE_NAME.CARD_LAST_NAME:
      return returnMessageLast(type)
    default:
      return 'name'
  }
}
export const validateInputName = async (_rule, value) => {
  if (!value || REGEX_SPACE.test(value)) {
    return Promise.reject(renderMessageName(_rule.field, REQUIRED))
  } else if (!REGEX_NAME.test(value)) {
    return Promise.reject(VALIDATE_MESSAGE.validateName)
  } else if (value.length > 20) {
    return Promise.reject(renderMessageName(_rule.field, 'max'))
  } else {
    return Promise.resolve()
  }
}

export const validatePassword = async (_rule, value) => {
  if (!value) {
    return Promise.reject(`${VALIDATE_MESSAGE.required} ${_rule.field}`)
  } else if (value.length < 8) {
    return Promise.reject(VALIDATE_MESSAGE.availablePassword)
  } else if (!REGEX_PASSWORD.test(value)) {
    return Promise.reject(VALIDATE_MESSAGE.availablePassword)
  } else {
    return Promise.resolve()
  }
}

export const formatNumberFromString = (string) => {
  return string?.replace(ALPHABETS, '')
}
