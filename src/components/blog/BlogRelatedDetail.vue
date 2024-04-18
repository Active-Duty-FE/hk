<template>
  <div class="blogRelated" :class="{ isReverse }">
    <img
      :src="blog.image"
      alt="Blog Image"
      class="blogRelated__image cursor-pointer"
      @click="goToDetail"
    />

    <div class="flex w-1/2 flex-col md:w-full">
      <p class="blogRelated__title line">{{ blog.title }}</p>
      <p v-clean-html="blog.subTitle" class="blogRelated__description"></p>
      <span class="blogRelated__readMore" @click="goToDetail">Read More</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'

const ignoreTags = ['img', 'video', 'iframe', 'figure']

const vCleanHtml = buildVueDompurifyHTMLDirective({
  default: {
    FORBID_TAGS: ignoreTags
  }
})
const props = defineProps({
  blog: {
    type: Object,
    default: () => ({})
  },
  isReverse: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const goToDetail = () => {
  router.push({ name: AppRoutes.blog.detail.name, params: { id: props.blog.id } })
}
</script>

<style lang="scss" scoped>
.blogRelated {
  @apply text-gray-12 flex flex-row items-center gap-4;
  @apply md:flex-col md:items-start;

  &.isReverse {
    @apply flex-row-reverse;
    @apply md:flex-col;
  }

  &__image {
    @apply aspect-square w-1/2 object-cover;
    @apply md:w-full;
  }

  &__title {
    @apply font-550 leading-base mb-2.5 text-base;
    @apply md:mb-4 md:text-xl md:leading-[26px];
  }

  &__description {
    @apply leading-base line-clamp-0 mb-6 text-sm font-light;
    @apply md:line-clamp-2 md:text-base md:font-normal md:leading-[22px];
  }

  &__readMore {
    @apply font-550 leading-base w-fit cursor-pointer text-sm underline;
    @apply md:;
  }
}
</style>
