import { ALPHABETS, REGEX_PASSWORD, REGEX_START_BINARY } from '@/helpers/regex'

export const minRule = (name = 'field', min = 0) => ({
  min,
  message: `${name} field min ${min} characters`
})

export const maxRule = (name = 'field', max = 255) => ({
  max,
  message: `${name} field max ${max} characters`
})

export const requiredRule = (name = 'field', label = 'is required field') => ({
  required: true,
  message: `${name} ${label}`
})

export const fileRule = (field, acceptExtension, size = 20) => {
  const validate = async (value) => {
    if (!value) return Promise.resolve()

    const extension = value.name.split('.').pop()?.toLowerCase()

    acceptExtension = acceptExtension.map((item) => item?.toLowerCase())

    if (acceptExtension.length && !acceptExtension.includes(`.${extension}`)) {
      return Promise.reject(`The ${field} field must have a valid file type`)
    }

    if (size && value.size > size * 1024 * 1024) {
      return Promise.reject(
        `Please upload only files that are 20MB or less / JPG, JPEG, PNG, GIF, and PDF`
      )
    }

    return Promise.resolve()
  }

  return {
    validator: (_, value) => validate(value)
  }
}

export const emailRule = (name) => ({
  type: 'email',
  message: `${name} field must be a valid email`
})

export const passwordRule = (name) => {
  const validate = async (value) => {
    if (!value) return Promise.resolve()

    if (!REGEX_PASSWORD.test(value)) {
      return Promise.reject(
        `${name} must consist of 8 or more letters, numbers and special characters`
      )
    }

    return Promise.resolve()
  }

  return {
    validator: (_, value) => validate(value)
  }
}

export const confirmPasswordRule = (name, valueCompare) => {
  const validate = async (value) => {
    if (value !== valueCompare.value) {
      return Promise.reject(`${name} does not match`)
    }

    return Promise.resolve()
  }

  return {
    validator: (_, value) => validate(value)
  }
}

export const phoneRule = (name) => {
  const validate = async (value = '') => {
    const phone = (value || '').replace(ALPHABETS, '')
    if (!phone) return Promise.resolve()

    if (!REGEX_START_BINARY.test(phone)) {
      return Promise.reject(`${name} can not start with 0, 1`)
    }

    return Promise.resolve()
  }

  return {
    validator: (_, value) => validate(value)
  }
}

export const blankRule = (name) => ({
  required: true,
  message: `Please enter your ${name}.`
})
