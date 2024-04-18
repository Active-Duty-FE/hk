export const VALIDATE_MESSAGE = {
  required: 'Please input',
  availableEmail: 'Email is not valid',
  availablePassword: 'Please check the password format',
  min: 'min',
  max: 'max',
  onlyNumber: 'Please enter numbers only.',
  personal_required: 'Please enter Personal ID.',
  invalidCellPhone: 'Invalid cellphone number: (NPA) NXX-XXXX ',
  invalidCellPhoneHk: 'Invalid cellphone number: XXXX-XXXX ',
  plannerAge: 'Planner subscription is not available for those under the age of 18',
  matchPassword: `Doesn't match password verification .`,
  notPasswordMatch: 'The password is different. Please enter again.',
  digits8: '8 digits could not be entered .',
  pastDate: 'The expiration date of the card must be greater than the current date',
  inValidMonth: 'Invalid expiration month.',
  requiredSelect: 'Please select',
  max20: 'cannot have more than 20 characters',
  validateName: `Only English, Chinese, special characters ' -  and space can be entered.`,
  withdrawal: 'Re-registration is possible after 30 days including the date of withdrawal',
  blankSsn: 'Please fill in your SSN.',
  equals9: 'Please enter 9 numbers',
  matchReferralNumberName: 'Referral information does not match . Please check again .',
  matchReferralCode: 'Please check your Membership Number again .',
  wrongIncNumber: 'Please check your INC Number again .',
  startBinary: 'Cell phone number can not start with 0',
  cellPhoneRequired: 'Please enter your Cell phone number',
  homePhoneStartBinary: 'Home phone number can not start with 0, 1',
  amexValid: 'Only 4 numbers are allowed with AMEX cards',
  agreeInfoCard: 'Please agree info card.',
  authCellphone: 'Please check your Cell phone again.',
  authAddress: 'Please check address again.',
  customerAge: 'Registration age cannot be less than 18',
  beautyAge: 'Registration age cannot be less than 18',
  sameCountry: 'You can not order products from different sites',
  sameCurrency: 'You can not order products with different currency',
  matchAddress: 'Please select an address that matches the country you are selecting',
  requiredPayment: 'Please complete all required fields.',
  agreeWithTerm: 'Please agree with term.',
  requiredPaymentDate: 'Please select a date for payment.',
  requiredReferral: `Please enter your referring Planner's Membership Number`,
  withdrawalMess: 'You can re-join after 180 days including the date of withdrawal .',
  invalidAddress: 'It appears this is not a valid address, do you want to use this address anyway?',
  invalidAddressOrder:
    'Are you sure you want to proceed with the unrecognized shipping address, which may disrupt your order delivery?',
  sameSsn: 'This SSN has already been registered.'
}

export const REQUIRED = 'required'
export const PASSWORD_MESSAGE = {
  passwordStrong: `That's a good password :)`,
  bothPassMatch: 'Both passwords match . :)'
}

export const RESET_PASSWORD = {
  mailSuccess:
    'A reset link has been sent to the email you entered. Please reset your password through the link.',
  systemError: 'Please double-check the e-mail form.',
  nameRequired: 'Please enter your name',
  mailRequired: 'Please enter your E-mail',
  idRequired: 'Please enter your User Number'
}

export const CHANGE_PASSWORD = {
  passErrorInline: 'A password is a required entry',
  passNotMatch: 'Passwords do not match',
  changeSuccess: 'Your password has been changed. Go to the login screen.',
  systemError: 'System displays correct message about Incorrect email / ID',
  passErrorAlert: 'A password is a required entry.'
}

export const AUTH_REQUIRED = {
  notAuth: 'Please login to continue.',
  logoutAlert: 'Do you want to logout ?'
}

export const FIND_ACCOUNT = {
  cellPhoneEmpty: 'Please enter your Cell phone number',
  cellPhoneInvalid: 'Please enter a valid cell phone',
  codeEmpty: 'Please enter verification number',
  codeInvalid: 'Verification number must be a number',
  sendPhoneSuccess: 'A verification code has been sent .',
  sendPhoneError: 'Please check your authentication number again .',
  confirmSuccess: 'Your authentication number has been confirmed .',
  noId: 'There are no matching IDs .'
}

export const CONCIERGE_MESSAGE = {
  phoneReservationSuccess: 'Phone reservation has been successfully received.',
  error: 'System error occurred. Later again Please try.',
  phoneNotMatch: 'Contact does not match',
  createInquirySuccess: 'The inquiry has been received successfully.',
  image: 'Please select up to three images',
  notAllowCreateTicket:
    'For any questions or concerns, please contact us via email at CS@RIMAN.com. Thank you!'
}

export const POINT_COUPON_MESSAGE = {
  minPoint: 'The number of points applied is at least 10',
  maxPoint: 'You cannot enter numbers exceeding the number of points you have.',
  maxPointWithSubTotal: 'You can not use points exceeding the total product cost. ',
  applyPoint: 'Point is applied .',
  balanceZero: `You don't have any balance left to apply any discounts or Reward Points`
}
