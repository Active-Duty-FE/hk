<template>
  <div class="text-left">
    <div>
      <span class="inline-block">
        <img
          alt="blog image"
          class="aspect-square w-full cursor-pointer object-cover"
          :src="blogInfo.image || blogInfo.pcImageUrl"
        />
      </span>
    </div>
    <div>
      <p
        class="font-550 text-gray-12 mb-0 line-clamp-2 h-auto max-h-[86px] cursor-pointer pb-[20px] pt-[20px] text-base leading-[30px] md:max-h-[96px] md:text-xl"
      >
        {{ blogInfo?.title || blogInfo?.blogTitle }}
      </p>
    </div>
    <div>
      <p
        v-clean-html="blogInfo?.subTitle || blogInfo?.blogContent"
        class="leading-base mb-[20px] line-clamp-3 h-auto max-h-[74px] text-[14px] font-light md:mb-[30px] md:max-h-[63px] md:text-[16px] md:leading-[22px]"
      ></p>
    </div>
    <div>
      <span
        class="font-550 text-gray-10 read-more-effect inline-block cursor-pointer text-[14px] md:text-[16px]"
        @click="gotoDetail(blogInfo?.id)"
      >
        Read More
      </span>
    </div>
  </div>
</template>
<script setup>
import { AppRoutes } from '@/router/path'
import { useRouter } from 'vue-router'

import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'

const ignoreTags = ['img', 'video', 'iframe', 'figure']

const vCleanHtml = buildVueDompurifyHTMLDirective({
  default: {
    FORBID_TAGS: ignoreTags
  }
})

const router = useRouter()
defineProps({
  blogInfo: {
    type: Object,
    required: true
  }
})

const gotoDetail = (id) => {
  router.push({ name: AppRoutes.blog.detail.name, params: { id } })
}
</script>
<style lang="scss" scoped>
.read-more-effect {
  transition: all 0.2s ease;
  position: relative;
  svg {
    margin-left: 4px;
    opacity: 0;
    transform: translateX(-5px);
    transition: all 0.3s ease;
  }
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 1px;
    bottom: 4px;
    left: 0;
    background-color: #212121;
    transform-origin: bottom left;
    transition: transform 0.25s ease-out;
  }

  &:hover {
    svg {
      opacity: 1;
      transform: translateX(0);
    }
    &::after {
      transform: scaleX(1);
      transform-origin: bottom left;
    }
  }
}
</style>
