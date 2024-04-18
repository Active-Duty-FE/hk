<template>
  <a-modal
    v-if="isShowModal"
    v-model:visible="isShowModal"
    centered
    wrap-class-name="advertisingPopup"
    :footer="false"
    :closable="false"
    :width="460"
  >
    <RCarousel
      v-slot="{ url }"
      ref="carouselRef"
      :options="itemsToShow.options"
      wrap-around
      :autoplay="5000"
    >
      <div class="relative">
        <img :src="addPrefixForImage(url)" alt="" class="advertisingPopup__image" />
      </div>
    </RCarousel>

    <span class="advertisingPopup__counting"
    >{{ currentSlide }} / {{ itemsToShow.totalImages }}</span
    >
    <div class="advertisingPopup__navigate">
      <PrevIcon class="advertisingPopup__navigate-prev" @click="onPrev" />
      <NextIcon class="advertisingPopup__navigate-next" @click="onNext" />
    </div>

    <div class="advertisingPopup__btn px-0">
      <div>
        <a-checkbox v-model:checked="isCheck"> </a-checkbox>
        <span class="cursor-pointer pl-2" @click="handleOneDay">Don't see today</span>
      </div>
      <span class="advertisingPopup__btn-close" @click="handleClose">Close</span>
    </div>
  </a-modal>
</template>

<script setup>
import { computed, onMounted, ref, reactive } from 'vue'
import dayjs from 'dayjs'
import PrevIcon from '@/assets/svgs/navigate-prev.svg'
import NextIcon from '@/assets/svgs/navigate-next.svg'
import { storage } from '@/utils/storage'
import { STORAGE_ADS_POPUP } from '@/helpers/constant'
import apiService from '@/http/api'
import { useBreakpoints } from '@vueuse/core'
import { addPrefixForImage } from '@/utils/common'

const listImagePc = reactive([])
const listImageMo = reactive([])
const totalImages = reactive({
  PC: 0,
  MO: 0
})

const isShowModal = ref(false)
const carouselRef = ref(null)
const timeShowPopup = ref(0)
const isCheck = ref(false)

const currentSlide = computed(() => carouselRef.value?.currentSlide + 1 || 1)

onMounted(() => {
  getPopupList()
  isShowModal.value = itemsToShow.value.totalImages > 0
})

const onPrev = () => {
  carouselRef.value?.next()
}
const onNext = () => {
  carouselRef.value?.prev()
}

const handleClose = () => {
  isShowModal.value = false
}
const handleOneDay = () => {
  if (isCheck.value) {
    storage.set(STORAGE_ADS_POPUP, dayjs().endOf('day').format('X'), 'localStorage')
  }
  isShowModal.value = false
}
const device = useBreakpoints({
  mobile: 640,
  tablet: 1024
})

const tablet = device.smaller('tablet')

const itemsToShow = computed(() => {
  if (tablet.value) {
    return {
      options: listImageMo,
      totalImages: totalImages.MO
    }
  }
  return {
    options: listImagePc,
    totalImages: totalImages.PC
  }
})
const getPopupList = async () => {
  const { data } = await apiService.mainService.getCmsList({
    category: 'POPUP'
  })

  if (!data?.length) {
    isShowModal.value = false
    return
  }
  data.map((item) => {
    return item?.attachmentList.map((i) => {
      if (i.device === 'PC') {
        listImagePc.push({ url: i.url })
      }
      if (i.device === 'MO') {
        listImageMo.push({ url: i.url })
      }
    })
  })
  totalImages.PC = listImagePc.length
  totalImages.MO = listImageMo.length
  timeShowPopup.value = storage.get(STORAGE_ADS_POPUP, 'localStorage')
  const isAfterDay = dayjs().isAfter(dayjs(timeShowPopup.value, 'X'))
  if (isAfterDay || !timeShowPopup.value) isShowModal.value = true
}
</script>

<style lang="scss" scoped>
:deep(.ant-checkbox .ant-checkbox-inner) {
  background-color: transparent !important;
  border-color: #ffffff;
}
:deep(.ant-checkbox.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: transparent !important;
  border-color: #ffffff;
}
.advertisingPopup {
  .carousel {
    @apply z-1;
  }

  .ant-modal-content {
    @apply bg-transparent shadow-none;
  }

  .ant-modal-body {
    @apply p-0;
  }

  &__image {
    @apply w-full;
  }

  &__counting {
    @apply w-15 z-1 pointer-events-none absolute right-2.5 top-2.5 flex h-[25px] items-center justify-center rounded-2xl bg-white text-sm;
  }

  &__navigate {
    transform: translateY(-50%);
    @apply absolute -left-10 top-1/2 flex w-[calc(100%+80px)] justify-between;

    &-prev {
      @apply cursor-pointer;
    }

    &-next {
      @apply cursor-pointer;
    }
  }

  &__btn {
    @apply absolute left-0 top-full mt-2.5 flex w-full justify-between px-6 text-white;

    &-oneDay {
      background-image: url('@/assets/svgs/checked.svg');
      @apply inline-flex cursor-pointer items-center bg-no-repeat pl-8;
    }

    &-close {
      @apply cursor-pointer;
    }
  }
}

@media (max-width: 768px) {
  .advertisingPopup .advertisingPopup__navigate {
    @apply hidden;
  }
}
</style>
