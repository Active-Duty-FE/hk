<template>
  <div class="w-screen max-w-[1200px]">
    <div class="md:(container mx-auto) lg:mb-12.5 mb-10 max-w-[1200px] px-5 md:px-0">
      <r-heading-slide
        text-normal="OUR"
        text-bold="BRAND"
        parent-class="lg:!items-start"
        description="Indulge in skincare rituals that nourish your skin and nurture your well-being."
        class-normal="mr-3 font-extralight"
      />
    </div>
    <div ref="container" class="keen-slider mb-[80px]">
      <card-ritual
        v-for="item in dataOurBrand"
        :key="item.id"
        :data="item"
        class="keen-slider__slide"
      />
    </div>
  </div>
</template>
<script setup>
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'
import { useCmsStore } from '@/stores/modules/cms'
import { storeToRefs } from 'pinia'
import { watch, computed } from 'vue'

const { ourBrandListParse } = storeToRefs(useCmsStore())
const dataOurBrand = computed(() => ourBrandListParse?.value?.slice(0, 3) || {})

const [container] = useKeenSlider(
  {
    breakpoints: {
      '(min-width: 200px)': {
        slides: { perView: 1.4, spacing: 0 }
      },
      '(min-width: 600px)': {
        slides: { perView: 2, spacing: 5 }
      },
      '(min-width: 992px)': {
        slides: { perView: 2.5, spacing: 10 }
      },
      '(min-width: 1300px)': {
        slides: { perView: 3, spacing: 15 }
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
</script>
<style scoped lang="scss">
:deep(.carousel__slide) {
  width: auto !important;
}
</style>
