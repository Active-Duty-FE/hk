<template>
  <div class="shop-best-seller-wrap w-full max-w-[1240px] px-5">
    <div ref="cardRef" class="keen-slider">
      <CardBestSeller
        v-for="item in dataLists"
        :key="item.productId"
        :show-point="showPoint"
        :data-card="item"
        class="keen-slider__slide"
      />
    </div>
  </div>
</template>
<script setup>
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'
import CardBestSeller from '@/components/home/CardBestSeller.vue'

defineProps({
  showPoint: {
    type: Boolean,
    default: true
  },
  categoryId: {
    type: Number,
    default: null
  },
  bestSlug: {
    type: String,
    default: undefined
  },
  dataLists: {
    type: Array,
    default: () => []
  }
})

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

const [cardRef] = useKeenSlider(
  {
    breakpoints: {
      '(min-width: 200px)': {
        slides: { perView: 1 }
      },
      '(min-width: 600px)': {
        slides: { perView: 2 }
      },
      '(min-width: 992px)': {
        slides: { perView: 3 }
      },
      '(min-width: 1300px)': {
        slides: { perView: 4 }
      }
    },
    slides: { perView: 1 }
  },
  [ResizePlugin]
)
</script>

<style lang="scss" scoped>
.shop-best-seller-wrap {
  :deep(.carousel__slide--visible:not(:last-child)) {
    @apply mr-0;
  }

  :deep(.carousel__track) {
    align-items: flex-start;
  }
}
</style>
