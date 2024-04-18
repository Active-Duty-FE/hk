<template>
  <div class="blogRecent">
    <p class="blogRecent__heading">RECENT BLOG</p>
    <img :src="blog.image" alt="" class="blogRecent__image" />
    <p class="blogRecent__title">{{ blog.title }}</p>
    <p class="blogRecent__description">{{ blog.description }}</p>

    <span class="blogRecent__readMore">Read More</span>
  </div>
</template>

<script setup>
defineProps({
  blog: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style lang="scss" scoped>
.blogRecent {
  @apply text-gray-10 mt-[70px] flex flex-col;

  &__heading {
    @apply font-550 mb-5 text-xl leading-[26px];
    @apply md:mb-17.5 leading-base md:text-[40px];
  }

  &__image {
    @apply mb-10 aspect-square max-h-[400px] w-full object-cover;
    @apply md:aspect-[2/1] md:max-h-full;
  }

  &__title {
    @apply font-550 leading-base mb-5 text-[28px];
    @apply md:text-[40px];
  }

  &__description {
    @apply mb-[25px] text-base font-normal leading-[22px];
    @apply md:mb-[35px] md:text-lg md:leading-[28px];
  }

  &__readMore {
    @apply font-550 leading-base w-fit cursor-pointer text-sm underline;
  }
}
</style>
