<template>
  <div class="text-black-50 container mx-auto">
    <p class="font-550 mb-5 px-5 text-[32px]">Blog</p>
    <div
      v-for="(blog, index) in blogs"
      :key="blog.blogId"
      class="blogPost px-5 pb-5"
      :class="{ isReverse: index % 2 !== 0 }"
    >
      <img :src="addPrefixForImage(blog.pcImageUrl)" alt="Blog Image" class="blogPost__image" />

      <div class="flex w-1/2 flex-col text-left md:mx-20">
        <p class="font-550 text-gray-12 mb-[10px] text-base leading-normal">{{ blog.blogTitle }}</p>
        <p class="font-300 text-gray-12 mb-5 line-clamp-3 text-sm leading-normal">
          {{ blog.blogContent }}
        </p>
        <span class="font-550 text-gray-12 text-sm leading-normal underline">Read More</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { addPrefixForImage } from '@/utils/common'

defineProps({
  title: {
    type: String,
    default: ''
  },
  blogs: {
    type: Array,
    default: () => []
  }
})
</script>
<style lang="scss" scoped>
@media (max-width: 767px) {
  .blog-list {
    margin: 0 !important;
    @apply px-3 lg:px-0;
  }

  .container {
    @apply max-w-3xl;
  }
}
.blogPost {
  @apply flex items-center gap-3;
  @apply md:gap-0;

  &.isReverse {
    @apply flex-row-reverse;
  }

  &__image {
    @apply aspect-square h-full w-1/2 object-cover;
    @apply md:aspect-[3/2] md:max-h-[400px];
  }
}
</style>
