<template>
  <div class="scroll-smooth">
    <div class="relative xl:mx-[32px]">
      <div class="hidden w-full overflow-hidden md:block md:h-screen">
        <video
          v-if="getFileType(dataRituals.dataTitle?.imageUrl) === 'video/mp4'"
          class="banner__background w-full"
          name="media"
          playsinline
          autoplay
          loop
          muted
        >
          <source :src="addPrefixForImage(dataRituals.dataTitle?.imageUrl)" type="video/mp4" />
          <track src="" label="" kind="captions" default />
        </video>
        <img
          v-else
          alt="image"
          class="w-full object-cover"
          :src="addPrefixForImage(dataRituals.dataTitle?.imageUrl)"
        />
      </div>
      <div class="block overflow-hidden md:hidden">
        <video
          v-if="getFileType(dataRituals.dataTitle?.imageUrlMobile) === 'video/mp4'"
          class="banner__background max-h-[400px] w-full object-fill"
          name="media"
          playsinline
          autoplay
          loop
          muted
        >
          <source
            :src="addPrefixForImage(dataRituals.dataTitle?.imageUrlMobile)"
            type="video/mp4"
          />
          <track src="" label="" kind="captions" default />
        </video>
        <img v-else alt="image" :src="addPrefixForImage(dataRituals.dataTitle?.imageUrlMobile)" />
      </div>
      <div
        class="lg:(block) text-gray-10 absolute left-[calc((100vw_-_1264px)/2)] top-1/2 hidden -translate-y-1/2"
      >
        <p class="font-475 mb-[26px] text-xl leading-normal">RITUALS</p>
        <p
          class="font-550 mb-[30px] max-w-[608px] text-[50px] leading-[60px]"
          :class="handleStyleFontColor(dataRituals.dataTitle?.fontColor)"
        >
          {{ dataRituals.dataTitle?.titlePc }}
        </p>
        <p
          class="mb-0 w-[608px] text-lg font-normal leading-normal"
          :class="handleStyleFontColor(dataRituals.dataTitle?.fontColor)"
        >
          {{ dataRituals.dataTitle?.subTitlePc }}
        </p>
      </div>
    </div>
    <div class="lg:(hidden) text-black-50 mx-5 my-[70px]">
      <p class="font-550 mb-5 text-xs leading-normal">RITUALS</p>
      <p class="font-550 mb-10 text-[32px] leading-[36px]">
        {{ dataRituals.dataTitle?.titleMobile }}
      </p>
      <p class="mb-0 text-base font-normal leading-[22px]">
        {{ dataRituals.dataTitle?.subTitleMobile }}
      </p>
    </div>

    <RitualContentDesktop :list-products="dataRituals.listProducts" class="second-section" />

    <RitualContentMobile :list-products="dataRituals.listProducts" />

    <RitualProduct :list-products="dataRituals.listProducts" />

    <RitualQuizItem v-if="dataRituals.dataBanner" :data-quiz-item="dataRituals.dataBanner" />

    <RitualBlog :data-blog="dataRituals.dataRelatePage" />

    <DiveIn />
  </div>
</template>
<script setup>
import { CmsTypeEnum, CmsDisplayTypeEnum } from '@/helpers/enum'
import { onMounted, reactive } from 'vue'
import { addPrefixForImage, handleStyleFontColor } from '@/utils/common'
import { useCmsStore } from '@/stores/modules/cms'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import storage from '@/utils/storage'
import { STORAGE_ACCESS_TOKEN, STORAGE_IP_ADDRESS, VALUE_COUNTRY } from '@/helpers/constant'
import { getSaveTokenStorage } from '@/utils/auth'

const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading
const { getSnsList } = useCmsStore()

const dataRituals = reactive({
  dataTitle: {},
  dataBanner: {},
  dataRelatePage: [],
  listProducts: []
})

const getDataRituals = async () => {
  try {
    showGlobalLoading(true)
    const response = await apiService.cmsService.getContentExplore(
      {
        currentPage: 1,
        pageSize: 15
      },
      {
        type: CmsTypeEnum.RITUAL,
        displayType: CmsDisplayTypeEnum.NONE
      }
    )

    if (response.success) {
      const content = response.data?.content
      dataRituals.dataTitle = content?.find((e) => e.displayType === CmsDisplayTypeEnum.TITLE)
      dataRituals.dataBanner = content?.find((e) => e.displayType === CmsDisplayTypeEnum.BANNER)
      dataRituals.dataRelatePage = content.filter(
        (e) => e.displayType === CmsDisplayTypeEnum.RELATED_PAGE
      )
    }
  } finally {
    showGlobalLoading(false)
  }
}

const getListProducts = async () => {
  const params = { country: storage.get(STORAGE_IP_ADDRESS, 'localStorage') || VALUE_COUNTRY.US }
  try {
    showGlobalLoading(true)
    const response = storage.get(STORAGE_ACCESS_TOKEN, getSaveTokenStorage())
      ? await apiService.cmsService.getListProductRitualExplore(params)
      : await apiService.cmsService.getListProductRitualPublicExplore(params)

    if (response.success) {
      dataRituals.listProducts = response.data
    }
  } finally {
    showGlobalLoading(false)
  }
}

const getFileType = (url) => {
  const dataMatch = dataRituals.dataTitle?.exploreFileAttachEntities?.find((e) => e.fileKey === url)
  return dataMatch?.contentType
}

onMounted(async () => {
  getDataRituals()
  getSnsList()
  await getListProducts()
})
</script>

<style lang="scss" scoped>
.quiz-custom {
  @apply md:my-50 my-17.5 mx-5 md:mx-0;
}

:deep(.diveIn) {
  @apply md:my-50 my-22.5;
  & > div {
    @media (min-width: 1200px) {
      align-items: center;
    }
  }
}

:deep(.banner) {
  @apply mb-17.5 md:mb-0;
}
</style>
