import { validateInputName, validateRequired } from './handle-validate'
import { ONLY_NUMBER } from './regex'

export const BILL_VALIDATE = {
  billCity: [
    {
      validator: validateRequired,
      trigger: 'change'
    }
  ],
  billState: [
    {
      validator: validateRequired,
      trigger: 'change'
    }
  ],
  billZipCode: [
    {
      validator: validateRequired,
      trigger: 'change'
    }
  ],
  billCountry: [
    {
      validator: validateRequired,
      trigger: 'change'
    }
  ],
  billFirstName: [
    {
      validator: validateRequired,
      trigger: 'change'
    }
  ],
  billLastName: [
    {
      validator: validateRequired,
      trigger: 'change'
    }
  ],
  billAddress: [
    {
      validator: validateRequired,
      trigger: 'change'
    }
  ],
  billMobileNumber: [
    {
      validator: validateRequired,
      trigger: 'change'
    }
  ],
  cardFirstName: [
    {
      validator: validateInputName,
      trigger: 'change'
    }
  ],
  cardLastName: [
    {
      validator: validateInputName,
      trigger: 'change'
    }
  ],
  cardNumber: [
    {
      validator: validateRequired,
      trigger: 'change'
    }
  ],
  cardCvc: [
    {
      required: true,
      message: 'Please input your cvc'
    },
    {
      pattern: new RegExp(ONLY_NUMBER),
      message: 'Please only enter number'
    }
  ],
  expiredMonth: [
    {
      validator: validateRequired,
      trigger: 'change'
    }
  ],
  expiredYear: [
    {
      validator: validateRequired,
      trigger: 'change'
    }
  ]
}
