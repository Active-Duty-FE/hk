import RITUAL_BANNER_IMAGE from '@/assets/images/ritual/ritual-banner.webp'

import RITUAL_CLEANSE from '@/assets/images/ritual/ritual-cleanse.png'
import RITUAL_CLEANSE_ICON from '@/assets/images/ritual/ritual-cleanse-icon.png'
import RITUAL_CLEANSE_STEP1 from '@/assets/images/ritual/ritual-cleanse-step-1.webp'
import RITUAL_CLEANSE_STEP2 from '@/assets/images/ritual/ritual-cleanse-step-2.webp'
import RITUAL_CLEANSE_STEP3 from '@/assets/images/ritual/ritual-cleanse-step-3.webp'

import RITUAL_HYDRATE from '@/assets/images/ritual/ritual-hydrate.png'
import RITUAL_HYDRATE_ICON from '@/assets/images/ritual/ritual-hydrate-icon.svg?url'
import RITUAL_HYDRATE_STEP1 from '@/assets/images/ritual/ritual-hydrate-step-1.webp'
import RITUAL_HYDRATE_STEP2 from '@/assets/images/ritual/ritual-hydrate-step-2.webp'
import RITUAL_HYDRATE_STEP3 from '@/assets/images/ritual/ritual-hydrate-step-3.webp'
import RITUAL_HYDRATE_STEP4 from '@/assets/images/ritual/ritual-hydrate-step-4.webp'

import RITUAL_PROTECT from '@/assets/images/ritual/ritual-protect.png'
import RITUAL_PROTECT_ICON from '@/assets/images/ritual/ritual-protect-icon.svg?url'
import RITUAL_PROTECT_STEP1 from '@/assets/images/ritual/ritual-protect-step-1.webp'

import RITUAL_BLOG_1 from '@/assets/images/ritual/ritual-blog-1.webp'
import RITUAL_BLOG_2 from '@/assets/images/ritual/ritual-blog-2.webp'
import RITUAL_BLOG_3 from '@/assets/images/ritual/ritual-blog-3.webp'

import RITUAL_PRODUCT_1 from '@/assets/images/ritual/ritual-product-1.webp'
import RITUAL_PRODUCT_2 from '@/assets/images/ritual/ritual-product-2.webp'
import RITUAL_PRODUCT_3 from '@/assets/images/ritual/ritual-product-3.webp'
import RITUAL_PRODUCT_4 from '@/assets/images/ritual/ritual-product-4.webp'

export const RITUAL_BANNER = {
  image: RITUAL_BANNER_IMAGE,
  subtitle: 'RITUALS',
  title: 'YOUR RADIANCE,\nYOUR RITUAL',
  description:
    'Our patented ingredients, technologies, and testing methods ensure that each core step of our ritual is as exceptional as your skin.'
}

export const RITUAL_CONTENT_US = [
  {
    subTabs: [],
    title: 'CLEANSE',
    image: RITUAL_CLEANSE,
    icon: RITUAL_CLEANSE_ICON,
    description:
      'At Riman, we understand the importance of this step as the “prep” for future skin care ingredients to work off of. This is why our “double-cleansing” offerings are rich in natural ingredients and designed for deep and efficacious cleansing so that your skin is primed for the rest of your routine.',
    tabs: ['HYDRATE', 'PROTECT'],
    steps: [
      {
        id: 254,
        subtitle: 'STEP 1',
        title: 'PURECELL CLEANSING OIL',
        image: RITUAL_CLEANSE_STEP1,
        description:
          'Our cleansing oil contains 75% natural oils for an effective breakdown of sunscreen, makeup, and oil-based impurities on the skin. This specialized blend of ingredients ensures that cleansing doesn’ t strip your skin, only enhances it',
        price: 30,
        point: 1.5
      },
      {
        id: 266,
        subtitle: 'STEP 2',
        title: 'SNOW ENZYME CLEANSER Ex',
        image: RITUAL_CLEANSE_STEP2,
        description:
          'Complete your cleanse with our water-based cleanser. Wash away any remaining impurities with the formula’s papain enzyme to mildly exfoliate away dead skin cells, leaving radiant skin behind.',
        price: 25,
        point: 1.25
      },
      {
        id: 24,
        subtitle: 'ALT. STEP 2',
        title: 'ACTIVE CLEAN-UP POWDER',
        image: RITUAL_CLEANSE_STEP3,
        description:
          'Gently exfoliate your skin with our mild, sub-acid powder cleanser to remove stubborn dead skin and deep clean your pores without compromising your moisture barrier. Exfoliation should be done 2-3 times a week.',
        price: 30,
        point: 1.5
      }
    ]
  },
  {
    subTabs: ['CLEANSE'],
    title: 'HYDRATE',
    image: RITUAL_HYDRATE,
    icon: RITUAL_HYDRATE_ICON,
    description:
      "Achieving healthy and glowing skin requires more than just treating visible imperfections; it also involves protecting your skin against external aggressors to prevent issues in the future. Protection is the third and final focus of K-beauty and an essential tenant for healthy, happy skin. SPF coverage, barrier reinforcement, and antioxidant protection are all crucial in the inhibition of various skin issues. At RIMAN, our skincare line offers more than just coverage for blemishes; it offers treatments such that you'll look your best without anything on at all. Whatever product you choose to utilize to finish off your RIMAN ritual, whether it be the BB cream or compact cushion, you'll not only get lightweight, dewy coverage, you'll also get skin protecting and reinforcing ingredients that work all day long, so you look just as beautiful when you wash your face at the end of the day.",
    tabs: ['PROTECT'],
    steps: [
      {
        id: 3321,
        subtitle: 'STEP 3',
        title: 'VIETON OIL MIST',
        image: RITUAL_HYDRATE_STEP1,
        description:
          'Provide inner radiance with this rich, hydrating vitamin mist to heal and nourish your skin. Optimized for quick absorption to prevent water from escaping lower layers of the skin. ',
        price: 35,
        point: 1.75
      },
      {
        id: 169,
        subtitle: 'ALT. STEP 4',
        title: 'RADIANSOME™ 100 AMPOULE',
        image: RITUAL_HYDRATE_STEP2,
        description:
          'Soothe redness and irritation from cleansing calming gel with a specialized hyaluronic acid complex and rose water. Proven to retain moisture for up to 72 hours.',
        price: 100,
        point: 5.5
      },
      {
        id: 3318,
        subtitle: 'STEP 5, 6, 7',
        title: 'DERMATOLOGY FIRST PACKAGE EX',
        image: RITUAL_HYDRATE_STEP3,
        description:
          'The cult favorite Boo-Se-Boo. Boost your skin barrier with peptides in the Dermatology Booster EX, combat impurities with actives in the Dermatology Serum EX, and lock in moisture and hydration by layering Dermatology Booster EX again on top.',
        price: 90,
        point: 4.5
      },
      {
        id: 173,
        subtitle: 'STEP 8',
        title: 'CALMING BALANCE GEL',
        image: RITUAL_HYDRATE_STEP4,
        description:
          'Moisturize the deepest layers of your skin for proven, visible results. Composed of over 50% Korean-grown pure Byungpool leaf water, EZ-COM-6 botanical complex to brighten and sooth, and antioxidant NBP-Complex™.',
        price: 35,
        point: 1.75
      }
    ]
  },
  {
    subTabs: ['CLEANSE', 'HYDRATE'],
    title: 'PROTECT',
    image: RITUAL_PROTECT,
    icon: RITUAL_PROTECT_ICON,
    description:
      'The heart of Korean skincare is hydration. While the aesthetic benefits of well-hydrated skin are undeniable (skin looks plump, dewy, and reflective), hydration is essential for your overall skin health and well-being. By working with your skin to enhance its innate hydration and strength, you create the perfect base for other skincare products to work their magic. We embrace the importance of hydration in every formula we create - with layering of our products in each RIMAN ritual, you are getting a high dose of hydrating ingredients  with exceptional bioavailability for skin that feels and looks refreshed.',
    tabs: [],
    steps: [
      {
        id: 22,
        subtitle: 'STEP 9',
        title: 'AQUA PROTECTION SUNSCREEN',
        image: RITUAL_PROTECT_STEP1,
        description:
          'A plant derived, powder-based cleanser that gently whisks away dead skin cells and impurities, leaving clear, moist skin.',
        price: 30,
        point: 1.5
      }
    ]
  }
]

export const RITUAL_CONTENT_CA = [
  {
    subTabs: [],
    title: 'CLEANSE',
    image: RITUAL_CLEANSE,
    icon: RITUAL_CLEANSE_ICON,
    description:
      'At Riman, we understand the importance of this step as the “prep” for future skin care ingredients to work off of. This is why our “double-cleansing” offerings are rich in natural ingredients and designed for deep and efficacious cleansing so that your skin is primed for the rest of your routine.',
    tabs: ['HYDRATE', 'PROTECT'],
    steps: [
      {
        id: 3391,
        subtitle: 'STEP 1',
        title: 'PURECELL CLEANSING OIL',
        image: RITUAL_CLEANSE_STEP1,
        description:
          'Our cleansing oil contains 75% natural oils for an effective breakdown of sunscreen, makeup, and oil-based impurities on the skin. This specialized blend of ingredients ensures that cleansing doesn’ t strip your skin, only enhances it',
        price: 42,
        point: 2.1,
        country: ''
      },
      {
        id: 3393,
        subtitle: 'STEP 2',
        title: 'SNOW ENZYME CLEANSER Ex',
        image: RITUAL_CLEANSE_STEP2,
        description:
          'Complete your cleanse with our water-based cleanser. Wash away any remaining impurities with the formula’s papain enzyme to mildly exfoliate away dead skin cells, leaving radiant skin behind.',
        price: 35,
        point: 1.75
      },
      {
        id: 3379,
        subtitle: 'ALT. STEP 2',
        title: 'ACTIVE CLEAN-UP POWDER',
        image: RITUAL_CLEANSE_STEP3,
        description:
          'Gently exfoliate your skin with our mild, sub-acid powder cleanser to remove stubborn dead skin and deep clean your pores without compromising your moisture barrier. Exfoliation should be done 2-3 times a week.',
        price: 42,
        point: 2.1
      }
    ]
  },
  {
    subTabs: ['CLEANSE'],
    title: 'HYDRATE',
    image: RITUAL_HYDRATE,
    icon: RITUAL_HYDRATE_ICON,
    description:
      "Achieving healthy and glowing skin requires more than just treating visible imperfections; it also involves protecting your skin against external aggressors to prevent issues in the future. Protection is the third and final focus of K-beauty and an essential tenant for healthy, happy skin. SPF coverage, barrier reinforcement, and antioxidant protection are all crucial in the inhibition of various skin issues. At RIMAN, our skincare line offers more than just coverage for blemishes; it offers treatments such that you'll look your best without anything on at all. Whatever product you choose to utilize to finish off your RIMAN ritual, whether it be the BB cream or compact cushion, you'll not only get lightweight, dewy coverage, you'll also get skin protecting and reinforcing ingredients that work all day long, so you look just as beautiful when you wash your face at the end of the day.",
    tabs: ['PROTECT'],
    steps: [
      {
        id: 3360,
        subtitle: 'STEP 3',
        title: 'VIETON OIL MIST',
        image: RITUAL_HYDRATE_STEP1,
        description:
          'Provide inner radiance with this rich, hydrating vitamin mist to heal and nourish your skin. Optimized for quick absorption to prevent water from escaping lower layers of the skin. ',
        price: 49,
        point: 2.45
      },
      {
        id: 3383,
        subtitle: 'ALT. STEP 4',
        title: 'RADIANSOME™ 100 AMPOULE',
        image: RITUAL_HYDRATE_STEP2,
        description:
          'Soothe redness and irritation from cleansing calming gel with a specialized hyaluronic acid complex and rose water. Proven to retain moisture for up to 72 hours.',
        price: 153,
        point: 7.65
      },
      {
        id: 3319,
        subtitle: 'STEP 5, 6, 7',
        title: 'DERMATOLOGY FIRST PACKAGE EX',
        image: RITUAL_HYDRATE_STEP3,
        description:
          'The cult favorite Boo-Se-Boo. Boost your skin barrier with peptides in the Dermatology Booster EX, combat impurities with actives in the Dermatology Serum EX, and lock in moisture and hydration by layering Dermatology Booster EX again on top.',
        price: 125,
        point: 6.25
      },
      {
        id: 3386,
        subtitle: 'STEP 8',
        title: 'CALMING BALANCE GEL',
        image: RITUAL_HYDRATE_STEP4,
        description:
          'Moisturize the deepest layers of your skin for proven, visible results. Composed of over 50% Korean-grown pure Byungpool leaf water, EZ-COM-6 botanical complex to brighten and sooth, and antioxidant NBP-Complex™.',
        price: 49,
        point: 2.45
      }
    ]
  },
  {
    subTabs: ['CLEANSE', 'HYDRATE'],
    title: 'PROTECT',
    image: RITUAL_PROTECT,
    icon: RITUAL_PROTECT_ICON,
    description:
      'The heart of Korean skincare is hydration. While the aesthetic benefits of well-hydrated skin are undeniable (skin looks plump, dewy, and reflective), hydration is essential for your overall skin health and well-being. By working with your skin to enhance its innate hydration and strength, you create the perfect base for other skincare products to work their magic. We embrace the importance of hydration in every formula we create - with layering of our products in each RIMAN ritual, you are getting a high dose of hydrating ingredients  with exceptional bioavailability for skin that feels and looks refreshed.',
    tabs: [],
    steps: [
      {
        id: 3403,
        subtitle: 'STEP 9',
        title: 'AQUA PROTECTION SUNSCREEN',
        image: RITUAL_PROTECT_STEP1,
        description:
          'A plant derived, powder-based cleanser that gently whisks away dead skin cells and impurities, leaving clear, moist skin.',
        price: 30,
        point: 1.5
      }
    ]
  }
]

export const RITUAL_BLOG = [
  {
    id: 1,
    title: 'Experience the Difference',
    image: RITUAL_BLOG_1
  },
  {
    id: 2,
    title: 'Elevated by Responsibility',
    image: RITUAL_BLOG_2
  },
  {
    id: 3,
    title: 'Ingredients with Purpose',
    image: RITUAL_BLOG_3
  }
]

export const RITUAL_PRODUCT_US = [
  {
    id: 3357,
    image: RITUAL_PRODUCT_1,
    category: '',
    title: 'ADVANCED RIMAN RITUAL',
    description:
      'Our most advanced skincare yet. A sophisticated ritu al formulated entirely with microfluidized nano-lipos omes, ensuring proper absorption of our exclusive a nd patented natural ingredients and vitamin complex es into deeper layers of the',
    price: 355,
    point: 17.75,
    country: 'US'
  },
  {
    id: 3320,
    image: RITUAL_PRODUCT_2,
    category: 'MOISTURIZER',
    title: 'ACTIVE CREAM EX',
    description: '',
    price: 60,
    point: 3
  },
  {
    id: 48,
    image: RITUAL_PRODUCT_3,
    category: 'HAIR CARE',
    title: 'DESERTICOLA SHAMPOO',
    description: '',
    price: 13,
    point: 6
  },
  {
    id: 4,
    image: RITUAL_PRODUCT_4,
    category: 'SUPPLEMENT',
    title: 'LIFENING BEAUTY COLLAGEN AMPOU',
    description: '',
    price: 33,
    point: 1.65
  }
]

export const RITUAL_PRODUCT_CA = [
  {
    id: 3401,
    image: RITUAL_PRODUCT_1,
    category: '',
    title: 'ADVANCED RIMAN RITUAL',
    description:
      'Our most advanced skincare yet. A sophisticated ritu al formulated entirely with microfluidized nano-lipos omes, ensuring proper absorption of our exclusive a nd patented natural ingredients and vitamin complex es into deeper layers of the',
    price: 405,
    point: 20.25,
    country: 'CA'
  },
  {
    id: 3361,
    image: RITUAL_PRODUCT_2,
    category: 'MOISTURIZER',
    title: 'ACTIVE CREAM EX',
    description: '',
    price: 83,
    point: 4.15
  },
  {
    id: 3381,
    image: RITUAL_PRODUCT_3,
    category: 'HAIR CARE',
    title: 'DESERTICOLA SHAMPOO',
    description: '',
    price: 46,
    point: 2.3
  },
  {
    id: 4,
    image: RITUAL_PRODUCT_4,
    category: 'SUPPLEMENT',
    title: 'LIFENING BEAUTY COLLAGEN AMPOU',
    description: '',
    price: 20,
    point: 10
  }
]
