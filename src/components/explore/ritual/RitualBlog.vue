<template>
  <div class="blog">
    <div class="blog__container">
      <ul ref="relatedPageRef" class="keen-slider hidden md:block">
        <li v-for="blog in dataBlog" :key="blog?.id" class="blog__wrap keen-slider__slide">
          <div class="blog__image">
            <img
              :src="addPrefixForImage(blog?.imageUrl)"
              alt=""
              class="h-[375px] w-[375px] object-cover"
            />
          </div>
          <div class="flex flex-col justify-center gap-6">
            <span class="blog__title">{{ blog?.displayTitle }}</span>
            <span class="blog__btn underline" @click="handleClick(blog)">Read More</span>
          </div>
        </li>
      </ul>

      <div class="md:hidden">
        <div v-for="blog in dataBlog?.slice(0, 3)" :key="blog?.id" class="blog__wrap mb-10">
          <div class="blog__image">
            <img
              :src="addPrefixForImage(blog?.imageUrl)"
              alt=""
              class="h-25 w-25 min-w-25 object-cover"
            />
          </div>
          <div class="flex flex-col justify-center gap-6">
            <span class="blog__title">{{ blog?.displayTitle }}</span>
            <span class="blog__btn underline" @click="handleClick(blog)">Read More</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { addPrefixForImage } from '@/utils/common'
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'

const [relatedPageRef] = useKeenSlider(
  {
    breakpoints: {
      '(min-width: 200px)': {
        disabled: true
      },
      '(min-width: 1023px)': {
        slides: { perView: 3, spacing: 20 }
      }
    }
  },
  [
    (slider) => {
      slider.on('created', () => {
        observer.observe(slider.container)
      })

      const observer = new ResizeObserver(function () {
        slider.update()
      })

      slider.on('destroyed', () => {
        observer.unobserve(slider.container)
      })
    }
  ]
)

defineProps({
  dataBlog: {
    type: Array,
    default: () => []
  }
})

const handleClick = (data) => {
  if (!data.link) return
  window.open(data.link, data?.openInNewWindow ? '' : '_self')
}
</script>

<style lang="scss" scoped>
.blog {
  @apply bg-[#F5F5F5] px-5 pb-[110px] pt-[90px];
  @apply md:py-[200px];

  &__container {
    @apply flex flex-col gap-5;
    @apply md:mx-auto md:max-w-[1240px] md:flex-row;
  }

  &__wrap {
    @apply flex w-full gap-4;
    @apply md:flex-col;
  }

  &__image {
    @apply h-[100px] w-[100px];
    @apply md:h-full md:w-full;
  }

  &__title {
    @apply font-550 text-gray-10 text-xl leading-[26px];
  }

  &__btn {
    @apply font-550 text-gray-12 cursor-pointer text-sm leading-[normal] hover:underline;
  }
}
</style>
