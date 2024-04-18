<template>
  <div class="blogPost" :class="{ isReverse }">
    <img :src="blog.image" alt="Blog Image" class="blogPost__image" />

    <div class="flex w-1/2 flex-col text-left md:mx-20">
      <p class="blogPost__title">{{ blog.title }}</p>
      <p
        v-clean-html="blog.description"
        class="blogPost__description line-clamp-2 max-h-[68px]"
      ></p>
      <span class="blogPost__readMore" @click="goToDetail">Read More</span>
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
  const { id } = props.blog
  router.push({ name: AppRoutes.blog.detail.name, params: { id } })
}
</script>

<style lang="scss" scoped>
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

  &__title {
    @apply font-550 leading-base -mr-5 mb-2.5 text-base;
    @apply md:text-[40px];
  }

  &__description {
    @apply leading-base mb-5 line-clamp-3 text-sm font-normal;
    @apply leading-[22px] md:mb-6 md:text-base;
    :deep(strong) {
      font-weight: normal !important;
    }

    :deep(b) {
      font-weight: normal !important;
    }
  }

  &__readMore {
    @apply font-550 leading-base w-fit cursor-pointer text-sm underline;
  }
}
</style>
