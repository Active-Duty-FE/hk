export const REGEX_PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=?.,~-])[A-Za-z\d!@#$%^&*()_+=?.,~-]{8,16}$/
export const ONLY_NUMBER = /^\d*$/
export const ALPHABETS = /\D/g
export const ESCAPE = /\s/g
export const REGEX_FORMAT_CARD = /(\d{4})(?=\d)/g
export const REGEX_CELLPHONE = /^\((\d{3})\)\s(\d{3})-(\d{4})$/
export const REGEX_CELLPHONE_HK = /^\d{4}\s\d{4}$/
export const REGEX_NAME = /^[\u0041-\u005A\u0061-\u007A\u4E00-\u9FFF\u3400-\u4DBF'①②③\s-]+$/
export const REGEX_SPACE = /^\s+$/
export const REGEX_START_BINARY = /^[^0]/
export const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
export const REGEX_CLEANED_MATCH = /^(\d{3})(\d{3})(\d{4})$/
export const AMEX = /^3[47]\d{13}$/
export const VISA = /^4\d{12}(?:\d{3})?$/
export const CUP_FIRST = /^62\d{14}\d*$/
export const CUP_SECOND = /^81\d{14}\d*$/
export const MASTERCARD = /^5[1-5]\d{14}$/
export const MASTERCARD_SECOND = /^2[2-7]\d{14}$/
export const DISCO_FIRST = /^6011\d{12}\d*$/
export const DISCO_SECOND = /^62[24568]\d{13}\d*$/
export const DISCO_THIRD = /^6[45]\d{14}\d*$$/
export const DINERS = /^3[0689]\d{12}\d*$/
export const JCB = /^35\d{14}\d*$/
export const HTTPS_LINK = /^https:\/\/[^\s/$.?#].[^\s]*$/i
