import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import storage from '@/utils/storage'
import { STORAGE_IP_ADDRESS } from '@/helpers/constant'
import { CountryEnum } from '@/helpers/enum'

const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading

const KEY_FORM = [
  'userAddressId',
  'addressDescription',
  'firstName',
  'lastName',
  'address',
  'aptFloorSuite',
  'city',
  'state',
  'zipcode',
  'country',
  'deliveryMessage',
  'phoneNumber',
  'homePhone',
  'defaultValue'
]

export const convertDataAddress = (item) => {
  return {
    userAddressId: item.userAddressId,
    addressDescription: item.addressName,
    firstName: item.firstName,
    lastName: item.lastName,
    address: item.address1,
    aptFloorSuite: item.address2,
    city: item.city,
    state: item.state,
    zipcode: item.zipcode,
    country: item.country,
    deliveryMessage: item.deliveryMessage,
    phoneNumber: item.mobileNumber,
    homePhone: item.telNumber,
    defaultValue: item.defaultValue
  }
}

export const setShippingAddress = (parent, data) => {
  for (const key of KEY_FORM) {
    parent[key] = data[key]
    if (key === 'defaultValue') {
      parent[key] = !!data[key]
    }
  }
}

export const getAddressList = async () => {
  showGlobalLoading(true)
  const { data, success } = await apiService.addressService.getAddressSavedList()

  let addresses = []
  if (!success) {
    showGlobalLoading(false)
    return addresses
  }
  addresses = (data || []).map((item) => convertDataAddress(item))

  let addressDefault, addressDefaultIndex

  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i]
    if (address.defaultValue) {
      addressDefault = address
      addressDefaultIndex = i
      break
    }
  }

  if (addressDefault) {
    addresses.splice(addressDefaultIndex, 1)
    addresses.unshift(addressDefault)
  }

  showGlobalLoading(false)
  return addresses
}

export const getChosenCountry = () => {
  const country = storage.get(STORAGE_IP_ADDRESS, 'localStorage')
  return !country || country === CountryEnum.US.value
}

export const getCurrentCountry = () => {
  const country = storage.get(STORAGE_IP_ADDRESS, 'localStorage')
  return country
}
