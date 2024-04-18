import { CURRENCY, CURRENCY_NEW } from '@/helpers/constant'
import { CurrencyPoint } from '@/helpers/enum'

export const convertNumber = (numberData) => {
  const decimalLength = numberData ? `${numberData}`.split('.')[1]?.length : 0
  if (decimalLength > 2) {
    numberData = numberData.toFixed(2)
  }

  return numberData >= 1000
    ? new Intl.NumberFormat({ maximumSignificantDigits: 3 }).format(numberData)
    : numberData
}

export const formatCurrency = (number) => {
  return Number(number).toLocaleString('en-US')
}

export function formatCurrencyUltra(amount, countryCode) {
  try {
    const amountNumber = Number(amount)
    const formatter = new Intl.NumberFormat(countryCode, {
      style: 'currency',
      currency: countryCode,
      maximumFractionDigits: 2
    })
    const formattedAmount = formatter.format(amountNumber)
    if (Number.isInteger(amountNumber)) {
      return formattedAmount.split('.')[0]
    } else {
      return formattedAmount
    }
  } catch (error) {
    console.error('Error occurred while formatting currency:', error)
    return 'Invalid country code'
  }
}

export const generateCurrencyPointUnit = (point) => {
  if (point === undefined || point === null) {
    return ''
  }
  return point?.code === CurrencyPoint.POINT ? 'Reward Points' : point?.text ?? ''
}

export const renderCurrency = (data) => {
  return CURRENCY_NEW[`${data}}`] || CURRENCY_NEW.HKD
}
