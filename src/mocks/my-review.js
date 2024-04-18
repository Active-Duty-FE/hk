import ProductImage1 from '@/assets/images/product-1.webp'
import ProductImage2 from '@/assets/images/product-2.webp'
import ProductImage3 from '@/assets/images/product-3.webp'
import ProductVideo1 from '@/assets/videos/product-1.mp4'

export const DATA_FAKE = [
  {
    id: 1,
    status: 'Waiting for approval',
    title: 'Amazing product !',
    rate: 5,
    content:
      'The hair oil serum product left my hair smooth and glossy, and I was very satisfied with it.',
    createdDatetime: '2023-09-19',
    imageUrl: [ProductImage1, ProductImage2, ProductImage3],
    mediaUrl: [ProductVideo1]
  },
  {
    id: 2,
    status: 'Approved',
    title: 'BEST OF MY SERUM',
    rate: 4,
    content:
      'It is the best product among serums I bought recently It is the best product among serums I bought recentlyIt is the best product among serums I bought recentlyIt is the best product among serums I bought recentlyIt is the best product among serums I bought recently',
    createdDatetime: '2023-09-01',
    imageUrl: [
      'https://dqmx7jipz0ukv.cloudfront.net/INCELLDERM/image/hover/Active_Cream_Ex_Hover_1.jpg',
      'https://dqmx7jipz0ukv.cloudfront.net/INCELLDERM/image/thumbnail/Active_Cream_Ex_Thumbnail.jpg'
    ],
    mediaUrl: [
      'https://us-dev-product-service.s3.us-west-2.amazonaws.com/review/d45fece0-42c2-403d-9773-32d74898a6e3'
    ],
    reply: ''
  },
  {
    id: 3,
    status: 'Approved',
    title: 'BEST OF MY SERUM',
    rate: 4,
    content:
      'It is the best product among serums I bought recently It is the best product among serums I bought recentlyIt is the best product among serums I bought recentlyIt is the best product among serums I bought recentlyIt is the best product among serums I bought recently',
    createdDatetime: '2023-08-28',
    imageUrl: [],
    mediaUrl: [],
    reply: ''
  },
  {
    id: 4,
    status: 'Waiting for approval',
    title: 'BEST OF MY SERUM',
    rate: 4,
    content:
      'It is the best product among serums I bought recently It is the best product among serums I bought recentlyIt is the best product among serums I bought recentlyIt is the best product among serums I bought recentlyIt is the best product among serums I bought recently',
    createdDatetime: '2023-09-15',
    imageUrl: [],
    mediaUrl: [],
    reply: ''
  }
]
