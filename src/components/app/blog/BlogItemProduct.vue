<template>
  <div class="text-left">
    <div>
      <span class="inline-block">
        <img
          alt="blog image"
          class="w-full cursor-pointer"
          :src="addPrefixForImage(blogInfo.image || blogInfo.pcImageUrl)"
        />
      </span>
    </div>
    <div>
      <p
        class="font-550 text-gray-12 mb-0 line-clamp-2 cursor-pointer pb-[20px] pt-[20px] text-[16px] leading-[30px] md:line-clamp-2"
      >
        {{ blogInfo?.title || blogInfo?.blogTitle }}
      </p>
    </div>
    <div>
      <p class="mb-[30px] line-clamp-3 text-[16px] font-light leading-[22px]">
        {{ blogInfo?.subTitle || blogInfo?.blogContent }}
      </p>
    </div>
    <div>
      <span
        class="font-550 text-gray-10 read-more-effect inline-block cursor-pointer text-[16px]"
        @click="gotoDetail(blogInfo?.id)"
      >
        Read More
        <NextDoubleIcon />
      </span>
    </div>
  </div>
</template>
<script setup>
import { AppRoutes } from '@/router/path'
import { useRouter } from 'vue-router'
import NextDoubleIcon from '@/assets/svgs/calendar/next-double.svg'
import { addPrefixForImage } from '@/utils/common'

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
