<template>
  <div class="bg-navy-deep md:(overflow-y-auto max-h-[calc(100vh-150px)]) px-5 md:px-[90px]">
    <div class="w-full pt-[50px]">
      <RimanIcon />
      <div class="px-5 pt-[30px]">
        <div class="style-normal font-440 pb-[7px] text-[20px] leading-[14px] text-white">
          Your ritual is ready!
        </div>
        <div
          class="style-normal leading-base mt-[10px] text-[12px] font-normal text-white md:text-[14px]"
        >
          Introducing the perfect Ritual Set curated for your skin. It’s time to elevate your
          self-care routine <br />
          and pamper your skin like never before.
        </div>
      </div>
      <div class="pt-[41px]">
        <div class="bg-white">
          <QCarousel ref="carouselRef" :options="qCarouselOption" @current-item="onCurrentItem" />
          <div class="px-5">
            <a-divider class="!bg-navy-deep !my-[30px] opacity-[0.2]" />
          </div>
          <div
            v-if="includeProducts?.[pageState.productId]?.length"
            class="style-normal font-550 px-5 pb-5 text-left text-[16px]"
          >
            What’s Included
          </div>
          <div class="px-5">
            <div
              v-for="ip in includeProducts?.[pageState.productId]"
              :key="ip?.productId"
              class="flex gap-[10px] pb-[15px]"
            >
              <div @click="gotoProductDetail(ip?.productId)">
                <img
                  alt="image quiz"
                  class="h-[70px] w-[70px] cursor-pointer"
                  :src="
                    addPrefixForImage(ip?.thumbnailUrl) ??
                      addPrefixForImage(ip?.hoverURl) ??
                      ImageOne
                  "
                />
              </div>
              <div>
                <div class="text-left">
                  <p class="font-550 text-[14px] leading-[16px]">
                    {{ ip?.productEnglishName }}
                  </p>
                  <p
                    class="font-550 leading-base mb-0 cursor-pointer text-[12px]"
                    @click="gotoProductDetail(ip?.productId)"
                  >
                    View Detail
                  </p>
                  <div class="w-[66px]"><a-divider class="bg-gray-10 !my-0" /></div>
                </div>
              </div>
            </div>
          </div>
          <div class="ml-auto w-fit px-5 pb-[22px] pt-8">
            <div
              v-if="(qCarouselOption?.length ?? 0) > 1"
              class="flex cursor-pointer items-center justify-end gap-[10px]"
              @click="gotoNextRitual"
            >
              <span class="font-550 leading-base text-[14px]">Additional Recommendation</span>
              <NextIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full pb-[40px] pt-5">
      <div class="flex justify-center gap-[5px]">
        <RButton
          class="border-1 btn-restart w-full !border-white bg-transparent !pl-[16px] !pt-[8px] !text-white hover:!bg-transparent md:w-[165px]"
          @click="restartQuiz"
        >
          <template #content>
            <span class="pr-[10px]">RESTART QUIZ</span>
            <ReloadIcon class="-mt-[5px]" />
          </template>
        </RButton>
        <RButton
          class="!text-gray-10 w-full border-0 !bg-white !pt-[8px] md:w-[165px]"
          title="OTHER RITUALS"
          @click="gotoMainRitual"
        >
        </RButton>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import NextIcon from '@/assets/svgs/skin-quiz/next.svg'
import ReloadIcon from '@/assets/svgs/skin-quiz/reload.svg'
import RimanIcon from '@/assets/svgs/skin-quiz/riman.svg'
import { AppRoutes } from '@/router/path'
import { useRouter } from 'vue-router'
import QCarousel from './QCarousel.vue'
import ImageOne from '@assets/images/product-new/image-4.jpg'
import { addPrefixForImage } from '@/utils/common'
import storage from '@/utils/storage'
import { STORAGE_STEP_SKIN_QUIZ } from '@/helpers/constant'

const router = useRouter()

const props = defineProps({
  resultProduct: {
    type: Array,
    default: () => []
  }
})
const emits = defineEmits(['restart'])

const qCarouselOption = computed(() => {
  return props.resultProduct.map((el) => el?.productSkinQuiz)
})

const includeProducts = computed(() => {
  return props.resultProduct.reduce((acc, el) => {
    acc[`${el?.productSkinQuiz?.productId}`] = el?.includeProduct
    return acc
  }, {})
})

const pageState = reactive({
  productId: qCarouselOption.value[0]?.productId
})

const carouselRef = ref(null)

const gotoMainRitual = () => {
  router.push({
    name: AppRoutes.product.ritual.name,
    params: {
      category: 'rituals'
    }
  })
}

const restartQuiz = () => {
  emits('restart')
}

const gotoProductDetail = (id) => {
  router.push({
    name: AppRoutes.product.detail.name,
    params: { productId: id },
    query: { from: 'skin-quiz' }
  })
}

const gotoNextRitual = () => {
  carouselRef.value?.next()
  carouselRef.value?.current()
}

const onCurrentItem = (id) => {
  pageState.productId = id
}
</script>
<style lang="scss" scoped>
.btn-restart {
  :deep(span.title) {
    display: none;
  }
}
</style>
