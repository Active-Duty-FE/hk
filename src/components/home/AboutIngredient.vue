<template>
  <div class="relative w-screen bg-[#F5F5F5] md:container md:max-w-screen-xl md:bg-[#fff]">
    <div class="ingredient">
      <div ref="videosContainer" class="keen-slider w-full">
        <div v-for="item in videoState" :key="item?.id" class="keen-slider__slide">
          <div class="ingredient__wrap">
            <div class="ingredient__gallery flex items-center">
              <img
                v-if="type === 'image'"
                :src="addPrefixForImage(item?.attachmentList[0]?.url)"
                alt=""
                class="ingredient__gallery-image"
              />

              <video controls class="ingredient__video" playsinline loop muted autoplay>
                <source :src="addPrefixForImage(item?.attachmentList[0]?.url)" type="video/mp4" />
                <track src="" label="" kind="captions" default />
              </video>
            </div>

            <div class="ingredient__content">
              <p class="ingredient__content-title w-[301px]">{{ item?.title1 }}</p>

              <div class="content__wrap">
                <div v-clean-html="item?.title2" class="max-w-[300px]"></div>
              </div>

              <div class="ingredient__content-btn learn-more-effect" @click="redirectPage(item)">
                Learn More
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="navigation">
        <NavigatePrev class="navigation__btn" @click="slider.prev()" />
        <NavigateNext class="navigation__btn" @click="slider.next()" />
      </div>
      <div v-if="slider" class="dots bg-[#F5F5F5] !py-[34px] md:!hidden">
        <button
          v-for="(_slide, idx) in dotHelper"
          :key="idx"
          class="cursor-pointer border-0 bg-transparent py-2"
          @click="slider.moveToIdx(idx)"
        >
          <DashIcon :additional-class="current === idx ? 'bg-[#9e9d9d]' : 'bg-gray-4'" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import NavigatePrev from '@/assets/svgs/navigate-prev.svg'
import NavigateNext from '@/assets/svgs/navigate-next.svg'
import { useKeenSlider } from 'keen-slider/vue.es'
import apiService from '@/http/api'
import { addPrefixForImage } from '@/utils/common'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import DashIcon from '@/assets/icons/DashIcon.vue'

const vCleanHtml = buildVueDompurifyHTMLDirective()
const ResizePlugin = (slider) => {
  const observer = new ResizeObserver(function () {
    slider.update()
  })

  slider.on('created', () => {
    observer.observe(slider.container)
  })
  slider.on('destroyed', () => {
    observer.unobserve(slider.container)
  })
}

const current = ref(1)
const videoState = ref()

const dotHelper = computed(() => (slider.value ? [...Array(videoState?.value?.length).keys()] : []))

const [videosContainer, slider] = useKeenSlider(
  {
    initial: current.value ?? 1,
    slideChanged: (s) => {
      current.value = s?.track?.details?.rel
    }
  },
  [ResizePlugin]
)

const getVideoList = async () => {
  const { data } = await apiService.mainService.getCmsList({
    category: 'VIDEO'
  })

  videoState.value = data
}

const redirectPage = (item) => {
  const target = item.newWindow ? '_blank' : ''
  if (!item.link) return
  window.open(item.link, target)
}

onMounted(() => {
  getVideoList()
})
</script>

<style lang="scss" scoped>
.ingredient {
  a {
    color: #212121;
  }
  @apply lg:mb-unset relative mb-[90px];

  :deep(.carousel) {
    @apply z-1;
  }

  &__wrap {
    @apply flex h-full w-full grid-cols-1 flex-col gap-0 bg-[#F5F5F5];
    @apply md:flex-row md:gap-[83px] md:bg-transparent;
  }

  &__gallery {
    &-image {
      @apply h-full w-full object-cover;
    }

    &-iframe {
      @apply h-full w-full border-none;
    }
  }
  &__video {
    @apply w-full md:w-[593px];
  }

  &__content {
    @apply pt-7.5 flex flex-col justify-center px-5;
    @apply md:p-0;

    &-title {
      @apply font-500 leading-7.5 mb-[30px] text-left text-[28px];
    }

    &-btn {
      @apply font-400 md:font-475 text-4 mt-6 w-fit cursor-pointer text-left  leading-none;
      @apply md:font-550 md:mt-10 md:text-lg;

      &.learn-more-effect {
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
    }
  }
}

.content {
  &__wrap {
    @apply flex flex-col gap-2.5 text-left;
  }

  &__item {
    @apply flex items-center gap-1;

    &-icon {
      @apply h-6 w-6;
    }

    &-text {
      @apply text-gray-12;
    }
  }
}

.navigation {
  transform: translateY(-50%);
  @apply -left-15 absolute top-1/2 flex w-[calc(100%+120px)] justify-between;

  &__btn {
    @apply cursor-pointer;
  }
}

:deep(.carousel__pagination) {
  @apply mt-0 hidden bg-[#F5F5F5] px-0 py-10;
  @apply md:bg-transparent md:pb-0;
}

:deep(.carousel__pagination-button) {
  &::after {
    @apply h-2.5 w-2.5 rounded-full bg-[#A0A0A0];
  }
}

:deep(.carousel__pagination-button--active::after) {
  @apply bg-[#666666];
}

@media (max-width: 1330px) {
  .navigation {
    @apply hidden;
  }

  :deep(.carousel__pagination) {
    @apply flex;
  }
}

.dots {
  display: flex;
  padding: 10px 0;
  justify-content: center;
}
.dot {
  border: none;
  width: 8px;
  height: 8px;
  background: #a0a0a0;
  border-radius: 50%;
  margin: 0 5px;
  padding: 5px;
  cursor: pointer;
}
.dot:focus {
  outline: none;
}
.dot.active {
  background: #666666;
}
.arrow {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  fill: #fff;
  cursor: pointer;
}
</style>
