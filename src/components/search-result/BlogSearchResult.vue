<template>
  <div class="px-5 py-[30px] lg:px-0">
    <div class="list-result flex flex-col gap-5">
      <BlogListPost
        v-for="(blog, index) in blogs"
        :key="blog.id"
        :blog="blog"
        :is-reverse="!!(index % 2)"
      />
    </div>
  </div>
</template>
<script setup>
defineProps({
  blogs: {
    type: Array,
    default: () => []
  }
})
</script>
