import { VALUE_BILLING } from '@/helpers/constant'

export const handlePaymentForm = (billingType, currentData, newData) => {
  if (billingType === VALUE_BILLING.default) {
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
    } = newData
    Object.assign(currentData, {
      billFirstName: firstName,
      billLastName: lastName,
      billAddress: address,
      billAptFloorSuite: aptFloorSuite,
      billCity: city,
      billState: state,
      billZipCode: zipcode,
      billCountry: country,
      billMobileNumber: phoneNumber,
      billHomePhone: homePhone
    })
  } else {
    Object.assign(currentData, {
      billFirstName: '',
      billLastName: '',
      billAddress: '',
      billAptFloorSuite: '',
      billCity: '',
      billState: null,
      billZipCode: '',
      billCountry: null,
      billMobileNumber: '',
      billHomePhone: ''
    })
  }
}
