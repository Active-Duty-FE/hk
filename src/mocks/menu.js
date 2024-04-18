import SkinImage from '@/assets/images/introduce-product.png'
import NutriImage from '@/assets/images//categories/nutri-category.webp'
import RadianSome from '@/assets/images/categories/radiansome.webp'

export const FakeMenuLevel = {
  ONE: 1,
  TWO: 2,
  THREE: 3
}

export const MenuType = {
  CATEGORY: 'category',
  PAGE: 'page',
  RITUAL: 'ritual'
}

export const otherMenus = [
  {
    name: 'RADIANSOME™ Line',
    path: 'radiansome-line',
    image: RadianSome,
    isBold: true
  },
  {
    name: 'EX Line',
    path: 'ex-line',
    image: NutriImage,
    isBold: true,
    class: 'mb-[36px]'
  },
  {
    name: 'BESTSELLERS',
    path: 'bestsellers',
    image: SkinImage
  },
  {
    name: 'MONTHLY SPECIALS',
    path: 'monthly-specials',
    image: SkinImage
  },
  {
    name: 'TOOLS',
    path: 'tools',
    image: SkinImage
  }
]

export const sampleChildItems = [
  {
    id: 100,
    name: 'Cleaners & Exfoliators',
    path: 'cleansers-exfoliators',
    level: FakeMenuLevel.THREE
  },
  {
    id: 101,
    name: 'Moisturizers',
    path: 'moisturizers',
    level: FakeMenuLevel.THREE
  },
  {
    id: 102,
    name: 'Serums & Toners',
    path: 'serums-toners',
    level: FakeMenuLevel.THREE
  },
  {
    id: 103,
    name: 'Ampoules',
    path: 'ampoules',
    level: FakeMenuLevel.THREE
  },
  {
    id: 105,
    name: 'Makeup',
    path: 'makeup',
    level: FakeMenuLevel.THREE
  },
  {
    id: 106,
    name: 'Rituals',
    path: 'rituals',
    level: FakeMenuLevel.THREE
  },
  {
    id: 107,
    name: 'Shop All',
    path: 'shop-all',
    level: FakeMenuLevel.THREE
  },
  {
    id: 1000,
    name: 'Dryness',
    path: 'dryness',
    level: FakeMenuLevel.THREE
  },
  {
    id: 1010,
    name: 'Sensitivity & Redness',
    path: 'sensitivity-redness',
    level: FakeMenuLevel.THREE
  },
  {
    id: 1020,
    name: 'Darkness & Uneven Skin Tone',
    path: 'darkness-uneven-skin-tone',
    level: FakeMenuLevel.THREE
  },
  {
    id: 1030,
    name: 'Aging & Fine Lines',
    path: 'aging-fine-lines',
    level: FakeMenuLevel.THREE
  },
  {
    id: 10000,
    name: 'Hair Care',
    path: 'hair-care',
    level: FakeMenuLevel.THREE
  },
  {
    id: 10001,
    name: 'Body Care',
    path: 'body-care',
    level: FakeMenuLevel.THREE
  },
  {
    id: 100000,
    name: 'Food',
    path: 'food',
    level: FakeMenuLevel.THREE
  },
  {
    id: 100001,
    name: 'Supplement',
    path: 'Supplement',
    level: FakeMenuLevel.THREE
  }
]
