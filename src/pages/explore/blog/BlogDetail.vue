<template>
  <div class="blogDetail text-black-50">
    <div class="md:pb-25 border-b-solid border-1 border-gray-10 pb-10 text-center">
      <p class="blogDetail__category">
        {{ detailData?.categoryName || detailData?.category?.displayTitle }}
      </p>
      <div class="flex items-center justify-center">
        <h3 class="blogDetail__title max-w-[936px] whitespace-pre-wrap text-center">
          {{ detailData?.displayTitle }}
        </h3>
      </div>
      <p class="blogDetail__createdAt">{{ detailData?.createdAt }}</p>
      <div class="blogDetail__social">
        <img
          class="cursor-pointer"
          src="@/assets/svgs/icon-facebook-circle.svg?url"
          alt=""
          @click="shareFacebook"
        />
        <img
          class="cursor-pointer"
          src="@/assets/svgs/icon-twitter-circle.svg?url"
          alt=""
          @click="shareTwitter"
        />
        <img
          class="cursor-pointer"
          src="@/assets/svgs/icon-email-circle.svg?url"
          alt=""
          @click="copyLink"
        />
      </div>
    </div>

    <div class="mt-10 flex flex-col gap-[30px] md:mt-20">
      <div v-clean-html="detailData?.description"></div>
    </div>

    <div class="list__btn">
      <RButton
        title="LIST"
        class="!border-navy-6 !bg-navy-6 w-full"
        class-title="text-white"
        @click="goToBlogList"
      />
    </div>

    <h4 v-if="relatedBlog?.length" class="relatedBlog">RELATED BLOG</h4>
    <div
      v-if="relatedBlog?.length"
      class="mb-22.5 md:mb-62.5 grid grid-cols-1 gap-5 md:grid-cols-4"
    >
      <BlogRelatedDetail
        v-for="(post, index) in relatedBlog"
        :key="post.id"
        :blog="post"
        :is-reverse="!!(index % 2)"
      />
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { FULL_BLOGS } from '@/mocks/blog'
import { AppRoutes } from '@/router/path'
import { computed, onBeforeMount, ref, watch } from 'vue'
import apiService from '@/http/api'
import { addPrefixForImage } from '@/utils/common'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useNotification } from '@/composables/notification'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 992)
const { showNotification } = useNotification()
const vCleanHtml = buildVueDompurifyHTMLDirective({
  default: {
    ADD_TAGS: ['iframe']
  }
})

const route = useRoute()
const router = useRouter()
const blog = ref({})

const storeLoading = useGlobalLoadingStore()
const { showGlobalLoading } = storeLoading
const detailData = ref()

const getDataDetail = async () => {
  showGlobalLoading(true)
  const { data } = await apiService.exploreService.getContentBlogDetail(route.params.id)
  detailData.value = data
  showGlobalLoading(false)
}

const relatedBlog = computed(() => {
  return detailData.value?.relatedBlogList?.map((item) => {
    return {
      id: item?.id,
      title: item?.displayTitle,
      subTitle: item?.description,
      description: item?.subTitlePc ?? item?.subTitleMobile ?? item?.description,
      image: addPrefixForImage(isMobile.value ? item?.imageUrlMobile : item?.imageUrl)
    }
  })
})

const getData = () => {
  const id = route.params.id
  const post = FULL_BLOGS.find((blog) => blog.id === +id) || {}
  blog.value = post
}

onBeforeMount(() => getData())

const goToBlogList = () => {
  router.push({ name: AppRoutes.blog.name })
}

const linkShare = computed(() => window.location.href)

const shareFacebook = () => {
  const link = `https://www.facebook.com/sharer/sharer.php?u=${linkShare.value}`
  window.open(link, '_blank')
}

const shareTwitter = () => {
  const link = `https://twitter.com/intent/tweet?url=${linkShare.value}&text=${detailData.value?.displayTitle}`
  window.open(link, '_blank')
}

const copyLink = () => {
  navigator.clipboard.writeText(linkShare.value)
  showNotification({
    description: 'Link is copied!',
    placement: 'topRight',
    type: 'success'
  })
}

watch(
  () => route.params?.id,
  (value) => {
    value && getDataDetail()
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.blogDetail {
  @apply mx-auto mt-5 max-w-[1240px] px-5;
  @apply md:mt-30;

  &__category {
    @apply text-navy-6 font-475 mb-5 text-base leading-[22px];
    @apply md:leading-base md:text-xl;
  }

  &__title {
    @apply text-gray-10 font-550 leading-base mb-5 text-[28px];
    @apply md:leading-15 md:mb-7 md:text-[50px];
  }

  &__createdAt {
    @apply leading-base text-gray-14 mb-7 text-sm font-normal -tracking-[0.28px];
    @apply md:tracking-0 md:mb-10 md:text-lg;
  }

  &__social {
    @apply flex justify-center gap-5;
  }

  &__image {
    @apply h-full w-full;
  }
}

.content {
  &__image {
    @apply mb-10 aspect-[1.34] h-full max-h-[250px] w-full object-cover;
    @apply md:aspect-[2.4] md:max-h-[500px];
  }

  &__title {
    @apply font-475 leading-base text-lg;
    @apply md:font-550 md:text-xl md:leading-[26px];
  }

  &__description {
    @apply whitespace-pre-wrap text-base font-normal leading-[22px];
    @apply md:leading-base md:text-lg;
  }
}

.list__btn {
  @apply mb-22.5 mt-17.5 mx-auto max-w-[335px];
  @apply md:mb-50 md:mt-20;
}

.relatedBlog {
  @apply font-550 mb-10 text-xl leading-[26px];
  @apply md:mb-17.5 md:leading-base md:text-[40px];
}
</style>
