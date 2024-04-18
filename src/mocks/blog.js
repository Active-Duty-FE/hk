import BLOG_BANNER_IMAGE from '@/assets/images/blog-list/blog-banner.webp'
import BLOG_RECENT_IMAGE from '@/assets/images/blog-list/blog-recent.webp'
import BLOG_POST_1 from '@/assets/images/blog-list/blog-post-1.webp'
import BLOG_POST_2 from '@/assets/images/blog-list/blog-post-2.webp'
import BLOG_POST_3 from '@/assets/images/blog-list/blog-post-3.webp'
import BLOG_POST_4 from '@/assets/images/blog-list/blog-post-4.webp'
import BLOG_POST_5 from '@/assets/images/blog-list/blog-post-5.webp'
import BLOG_POST_6 from '@/assets/images/blog-list/blog-post-6.webp'
import BLOG_POST_7 from '@/assets/images/blog-list/blog-post-7.webp'
import BLOG_DETAIL_1 from '@/assets/images/blog-detail/blog-detail-1.webp'
import BLOG_DETAIL_2 from '@/assets/images/blog-detail/blog-detail-2.webp'
import BLOG_DETAIL_3 from '@/assets/images/blog-detail/blog-detail-3.webp'
import BLOG_DETAIL_4 from '@/assets/images/blog-detail/blog-detail-4.webp'

export const BLOG_BANNER = {
  image: BLOG_BANNER_IMAGE,
  subtitle: 'BLOG',
  title: 'Please write\nBlog title here',
  description:
    'Please write text here. Please write text here. Please write text here. Please write text here. Please write text here.'
}

export const BLOG_RECENT = {
  image: BLOG_RECENT_IMAGE,
  title: 'Your guide to achieving glowing skin',
  description:
    'Dive into your personal RIMAN, build a self-care routine as natural and sacred as your skin.'
}

export const BLOG_POSTS = [
  {
    id: 1,
    image: BLOG_POST_1,
    category: 'Ingredients',
    title: 'Korean Skincare',
    description: "Unlock the flawless beauty of Korean skincare and unveil your skin's true",
    createdAt: 'July 10, 2023'
  },
  {
    id: 2,
    image: BLOG_POST_2,
    category: 'Science',
    title: 'How Korean Skincare is Revolutionizing Western Beauty Routines',
    description: 'Experience the future of skincare with RIMAN Innovation. Our cutting',
    createdAt: 'July 11, 2023'
  },
  {
    id: 3,
    image: BLOG_POST_3,
    category: 'Rituals',
    title: 'Korean Skincare',
    description: "Unlock the flawless beauty of Korean skincare and unveil your skin's true",
    createdAt: 'July 12, 2023'
  },
  {
    id: 4,
    image: BLOG_POST_4,
    category: 'Formulations',
    title: 'How Korean Skincare is Revolutionizing Western Beauty Routines',
    description: 'Experience the future of skincare with RIMAN Innovation. Our cutting...',
    createdAt: 'July 13, 2023'
  },
  {
    id: 5,
    image: BLOG_POST_5,
    category: 'Rituals',
    title: 'The Timeless Benefits\n BYoungPool in Skincare:\nThe Science Behind Its Success',
    description: 'Discover the power of innovation and embrace a new era of radiant',
    createdAt: 'July 14, 2023'
  },
  {
    id: 6,
    image: BLOG_POST_6,
    category: 'Lifestyle',
    title: 'Giant BYoungPool',
    description: 'Unleash the power of Giant Byungpool. Our revolution skincare ease',
    createdAt: 'July 15, 2023'
  },
  {
    id: 7,
    image: BLOG_POST_7,
    category: 'Lifestyle',
    title: 'Your Own Skincare',
    description:
      'Vegan skincare goes beyond the exclusion of animal-derived ingredients; it represents a commitment to using only plant-based, cruelty-free formulations',
    createdAt: 'July 16, 2023'
  }
]

export const BLOG_FILTER = [
  {
    label: 'Categories',
    value: 'categories',
    options: [
      {
        label: 'Science',
        value: 'science'
      },
      {
        label: 'Ingredients',
        value: 'ingredients'
      },
      {
        label: 'Rituals',
        value: 'rituals'
      },
      {
        label: 'Lifestyle',
        value: 'lifestyle'
      },
      {
        label: 'Formulations',
        value: 'formulations'
      }
    ]
  }
]

export const BLOG_DETAIL = [
  {
    image: BLOG_DETAIL_1,
    content: [
      {
        title: 'BYoungPool: A Key Ingredient in Cutting-Edge Formulations',
        description:
          'In the cosmetics and personal care industry, whether you’re formulating the next big shampoo as a chemist, or applying the newest trending lotion as a consumer, you are wholly participating in and influencing trends that drive the industry.\n \n of trends are ever-present and always changing. Despite the constantly evolving beauty technology, there are certain ingredients in the cosmetics industry that stand the test of time and remain a staple in high-performing formulations. One such ingredient is centella asiatica, which is also known as Indian pennywort or gotu kola, and referred to as BYoungPool in Korea.'
      },
      {
        title: 'The History and Benefits of BYoungPool in Skin Care and Beyond',
        description:
          'BYoungPool, native to Southeast countries like India and China, has shown a history of use expanding thousands of years.1 In China, it was even reported as one of the “miracle elixirs of life”, a status that has withstood the test of time.2 BYoungPool is known for its skin regenerating properties, with activities such as healing wounds, improving blood circulation, and even preventing wrinkles.\nThe benefits of BYoungPool, however, extend far beyond just skin care. The people of Sri Lanka consider it to be associated with longevity, while ayurvedic medicine credits it with the ability to rejuvenate and clear the mind, making it ideal for meditation.\nThe Role of Saponins and Triterpenoids in Skincare\nThe scientific evidence points to the saponin content, or triterpenoids, as the primary source of BYoungPool’s beneficial effects.3 The four most notable triterpenoids are madecassoside, madecassic acid, asiatic acid, and asiaticoside.\nStudies suggest that some of these triterpenoids are able to stimulate type I collagen synthesis, which plays a major role in the structuring of the skin in the dermis,4 while other studies suggest that BYoungPool saponin extracts improve the tensile strength of skin, leading to increased elasticity.5 Additional research suggests anti-inflammatory and anti-oxidant properties, all leading to an overall promise of glowing, structurally sound skin.'
      }
    ]
  },
  {
    image: BLOG_DETAIL_2,
    content: [
      {
        title:
          'How RIMAN is Revolutionizing the Cosmetics Industry with Exclusive Giant BYoungPool Strain',
        description:
          'RIMAN utilizes a unique strain of BYoungPool, known as Giant BYoungPool, in their INCELLDERM technology. This particular strain is cultivated exclusively for RIMAN on Jeju Island in Korea, and the patented technology enables RIMAN to harness the additional benefits that the larger leaves provide, which is exclusive to RIMAN.While the comparison between giant and regular BYoungPool is still being studied, early efforts have shown that the larger leaves of the giant BYoungPool plant boast higher polyphenol contents and higher antioxidant activity, along with the traditionally understood benefits of skin firming and structuring. A collaborative study with Seoul National University even found that our giant BYoungPool had a significant anti-wrinkle effect and reduced hyperpigmentation.\nWhile more is still to be discovered on the different fractions and subspecies of BYoungPool, one thing is for certain – its presence in the beauty industry will last for years to come. The multiple routes of skin treatment, extensive history of use, and application in both body and mind is why RIMAN chose to center not only INCELLDERM’s formulation, but INCELLDERM’s philosophy, around the beauty of BYoungPool.'
      },
      {
        title:
          'Combining Traditional Practices with Modern Advancements for Unparalleled Skincare Performance',
        description:
          'Our exclusive strain of Giant BYoungPool allows us to deliver both its time-honored benefits and the opportunity to strengthen them using cutting-edge research and methodologies. This approach affords us a comprehensive understanding of which molecules are most effective for your skin, enabling us to formulate optimal skincare solutions. By combining the best of traditional practices with modern advancements, we provide skincare products that deliver unparalleled performance.'
      }
    ]
  }
]

export const BLOG_DETAIL_OTHER = [
  {
    image: BLOG_DETAIL_4,
    content: [
      {
        title: 'Experience Self-Care and Expression with Korean Skincare',
        description:
          'Indulging in the beauty industry is an opportunity to explore self-care and self-expression. What makes skincare so special is that it caters to you – your skin concerns, and your way of life. Korean skincare, also known as K-Beauty, takes this personalization to the next level by offering tailor-made mulit-step routines that cater to your exact skin goals and desired aesthetic. '
      },
      {
        title: 'The Rise of K-Beauty in Western Skincare Markets',
        description:
          'K-Beauty, once a coveted beauty secret, revolutionized the Western skincare industry when it entered the mainstream market in 2011. Over time, American consumers were introduced to the science of Korean beauty and how it could enhance their skincare routine. Today, Korean skincare products are widely available in Ulta, Sephora, and drugstores, cementing their place in the Western beauty industry.'
      }
    ]
  },
  {
    image: BLOG_DETAIL_3,
    content: [
      {
        title: 'How Korean Skincare Differs from American Skincare',
        description:
          'Korean skincare sets itself apart from American skincare by placing a greater emphasis on preventive measures and protection, rather than simply treating existing skin issues. K-beauty routines are designed to deliver long-lasting results through the consistent use of gentle ingredients. Unlike American skincare, which often relies on high concentrations of harsh actives like AHAs and BHAs, K-beauty formulations feature lower percentages of these ingredients to protect the integrity of the skin barrier. As Ashley Hubbard suggests in her Healthline article “Korean Skin Care Routine: All the Steps From A to Z”, Korean skincare routines are about respecting your skin and bringing it to its healthiest status through a multitude of gentle steps. Cleansing, toning, and moisturizing all have the central focus on working with the skin to promote balance, instead of working against the issues that your skin may currently be presenting.'
      },
      {
        title: 'Hydration is Key: The Central Concept of Korean Skincare',
        description:
          'The heart of Korean skincare is hydration, which is also the foundation of the trends, “glass skin” and “honey skin”. The aesthetic benefits of well-hydrated skin are undeniable – skin looks plump, dewy, and reflective. Beyond just appearances, hydration is essential to care for your skin for its overall health and well-being. By working with your skin to enhance its innate hydration and strength, you create the perfect base for other skincare products to work their magic. Korean skincare goes beyond hydration and focuses on addressing common signs of aging, such as hyperpigmentation, wrinkles, and dehydrated skin. In fact, Koreans start their skincare routines at a young age to prevent these signs of aging from happening in the first place. Sun care plays a crucial role in this preventative treatment, helping to reduce photo-aging and maintain a youthful, radiant complexion.'
      },
      {
        title: 'The Benefits of a Multi-Step Skincare Routine',
        description:
          'Korean skincare’s multi-step approach is renowned for its emphasis on both protection and ritual, a unique combination that honors the skin’s wellbeing. A typical Korean skincare routine may consist of several steps, but the exact number of products is entirely customizable, ranging from four to ten. This flexibility allows users to curate a ritual that empowers individuals. From determining which steps to include, to selecting specific products and ingredients, individuals are empowered to curate a skincare ritual that meets their unique needs and preferences.\n Korean skincare has taken the Western beauty industry by storm through prioritizing hydration, prevention, and protection. Its multifaceted approach enables a personalized journey towards achieving healthier and luminous skin.'
      }
    ]
  }
]

export const BLOG_RELATED_POSTS = [
  {
    id: 5,
    image: BLOG_POST_5,
    category: 'Rituals',
    title: 'RIMAN Rituals',
    description: 'Discover the power of innovation and embrace a new era of radiant',
    createdAt: 'July 14, 2023'
  },
  {
    id: 6,
    image: BLOG_POST_6,
    category: 'Lifestyle',
    title: 'Giant BYoungPool',
    description: 'Unleash the power of Giant Byungpool. Our revolution skincare ease',
    createdAt: 'July 15, 2023'
  },
  {
    id: 3,
    image: BLOG_POST_5,
    category: 'Rituals',
    title: 'RIMAN Rituals',
    description: 'Discover the power of innovation and embrace a new era of radiant',
    createdAt: 'July 14, 2023'
  },
  {
    id: 4,
    image: BLOG_POST_6,
    category: 'Lifestyle',
    title: 'Giant BYoungPool',
    description: 'Unleash the power of Giant Byungpool. Our revolution skincare ease',
    createdAt: 'July 15, 2023'
  }
]

export const MORE_BLOGS = [
  {
    id: 10,
    image: BLOG_POST_1,
    category: 'Ingredients',
    title: 'Korean Skincare',
    description: "Unlock the flawless beauty of Korean skincare and unveil your skin's true",
    createdAt: 'July 10, 2023'
  },
  {
    id: 11,
    image: BLOG_POST_2,
    category: 'Ingredients',
    title: 'Korean Skincare',
    description: "Unlock the flawless beauty of Korean skincare and unveil your skin's true",
    createdAt: 'July 10, 2023'
  },
  {
    id: 12,
    image: BLOG_POST_3,
    category: 'Ingredients',
    title: 'Korean Skincare',
    description: "Unlock the flawless beauty of Korean skincare and unveil your skin's true",
    createdAt: 'July 10, 2023'
  },
  {
    id: 13,
    image: BLOG_POST_4,
    category: 'Ingredients',
    title: 'Korean Skincare',
    description: "Unlock the flawless beauty of Korean skincare and unveil your skin's true",
    createdAt: 'July 10, 2023'
  },
  {
    id: 14,
    image: BLOG_POST_5,
    category: 'Ingredients',
    title: 'Korean Skincare',
    description: "Unlock the flawless beauty of Korean skincare and unveil your skin's true",
    createdAt: 'July 10, 2023'
  },
  {
    id: 15,
    image: BLOG_POST_6,
    category: 'Ingredients',
    title: 'Korean Skincare',
    description: "Unlock the flawless beauty of Korean skincare and unveil your skin's true",
    createdAt: 'July 10, 2023'
  },
  {
    id: 16,
    image: BLOG_POST_7,
    category: 'Ingredients',
    title: 'Korean Skincare',
    description: "Unlock the flawless beauty of Korean skincare and unveil your skin's true",
    createdAt: 'July 10, 2023'
  },
  {
    id: 17,
    image: BLOG_POST_1,
    category: 'Ingredients',
    title: 'Korean Skincare',
    description: "Unlock the flawless beauty of Korean skincare and unveil your skin's true",
    createdAt: 'July 10, 2023'
  }
]

export const FULL_BLOGS = [...BLOG_POSTS, ...MORE_BLOGS]
