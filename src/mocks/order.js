import ProductImage1 from '@/assets/images/product-1.webp'
import ProductImage2 from '@/assets/images/product-2.webp'
import ProductImage3 from '@/assets/images/product-3.webp'

export const SavedAddressList = [
  {
    id: 1,
    description: 'HOMEHOMEHOMEHOMEHOMEHOMEHOMEHOMEHOMEHOMEHOMEHOMEHOMEHOMEHOMEHOMEHOMEHOMEHOMEHOME',
    firstNameReceiveShipping: 'Jenifer',
    lastNameReceiveShipping: 'Lopez',
    address: '1860 STE H',
    aptFloorSuite: '',
    city: 'STANTON',
    state: 'California',
    zipcode: '90680',
    country: 'US',
    phoneNumber: '110-1234-1234',
    homePhone: '123-1234-1235',
    deliveryMessage: '',
    defaultValue: true
  },
  {
    id: 2,
    description: 'Company',
    firstNameReceiveShipping: 'Victoria',
    lastNameReceiveShipping: 'Edwards',
    address: '285 Cordia Vista',
    aptFloorSuite: 'Suite 069',
    city: 'Littelfurt',
    state: 'North Dakota',
    zipcode: '72581',
    country: 'US',
    phoneNumber: '(367) 320-9580',
    homePhone: '(367) 320-9581',
    deliveryMessage: '',
    defaultValue: false
  }
]

export const AvailableCoupons = [
  {
    id: 1,
    name: '20% discount coupon for new signup',
    expirationPeriod: '2023-10-14',
    discount: '20%'
  },
  {
    id: 2,
    name: '$20 discount coupon',
    expirationPeriod: '2023-09-15',
    discount: '$20'
  },
  {
    id: 3,
    name: '$12 discount coupon',
    expirationPeriod: '2023-11-05',
    discount: '$12'
  },
  {
    id: 4,
    name: '$5 discount coupon',
    expirationPeriod: '2023-12-29',
    discount: '$5'
  }
]

export const OrderSummary = [
  {
    image: ProductImage1,
    name: 'DERMATOLOGY FIRST PACKAGE EX',
    unit: '0.68 oz.',
    quality: 1,
    price: 20
  },
  {
    image: ProductImage2,
    name: 'ACTIVE CREAM EX',
    unit: '0.68 oz.',
    quality: 1,
    price: 20
  },
  {
    image: ProductImage3,
    name: 'RADIANSOME™100 MICROFLUDIZED AMPOULE',
    unit: '0.68 oz.',
    quality: 1,
    price: 20
  }
]
