import SkinImage from '@/assets/images/carts/skin-category.webp'
import PersonalImage from '@/assets/images/carts/personal.webp'
import NutritionImage from '@/assets/images/carts/nutrition.webp'
import BestSellerImage from '@/assets/images/carts/best-seller.webp'

export const cartCategories = [
  {
    title: 'SKIN CARE',
    image: SkinImage,
    path: 'skincare'
  },
  {
    title: 'PERSONAL CARE',
    image: PersonalImage,
    path: 'personal-care'
  },
  {
    title: 'NUTRITION',
    image: NutritionImage,
    path: 'nutrition'
  },
  {
    title: 'BESTSELLERS',
    image: BestSellerImage,
    path: 'bestsellers'
  }
]

export const notices = [
  'Items registered in the shopping cart are stored for 90 days.',
  'Coupons and points are applied on the order/payment page.',
  'The product in the shopping cart is not a product that has been paid for, so it will not be exposed if it is out of stock depending on the stock situation.'
]
