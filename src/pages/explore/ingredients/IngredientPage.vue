<template>
  <div class="exploreWrap">
    <div
      v-show="pageState.dataTitle && pageState.dataTitle?.imageUrl"
      class="banner-section !xl:mx-[32px]"
    >
      <div class="ex_fullbg md:!h-screen">
        <div class="hidden overflow-hidden md:block md:h-screen">
          <video
            v-if="pageState.dataTitle.imageUrlType?.includes('video')"
            class="banner__background h-full w-full object-fill"
            playsinline
            autoplay
            loop
            muted
          >
            <source :src="addPrefixForImage(pageState.dataTitle.imageUrl)" type="video/mp4" />
            <track src="" label="" kind="captions" default />
          </video>
          <img
            v-else
            :src="addPrefixForImage(pageState.dataTitle.imageUrl)"
            alt=""
            class="h-full w-full object-cover"
          />
        </div>
        <div class="block overflow-hidden md:hidden">
          <video
            v-if="pageState.dataTitle.imageUrlMobileType?.includes('video')"
            class="banner__background max-h-[400px] w-full object-fill"
            playsinline
            autoplay
            loop
            muted
          >
            <source :src="addPrefixForImage(pageState.dataTitle.imageUrlMobile)" type="video/mp4" />
            <track src="" label="" kind="captions" default />
          </video>
          <img
            v-else
            :src="addPrefixForImage(pageState.dataTitle.imageUrlMobile)"
            alt=""
            class="h-full w-full object-cover"
          />
        </div>
        <div class="txtbox">
          <div class="t01 white">INGREDIENTS</div>
          <div :class="handleStyleFontColor(pageState.dataTitle?.fontColor)">
            <div class="t02 hidden md:block">{{ pageState.dataTitle?.titlePc }}</div>
            <div class="t02 !text-black-50 md:hidden">{{ pageState.dataTitle?.titleMobile }}</div>
            <div class="t03 hidden md:block">{{ pageState.dataTitle?.subTitlePc }}</div>
            <div class="t03 !text-black-50 md:hidden">
              {{ pageState.dataTitle?.subTitleMobile }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="second-section !pt-25 flex items-center justify-center md:!pt-[170px]">
      <div class="md:(flex-row gap-20) flex flex-col gap-[25px]">
        <SearchIngredients
          :data="pageState.dataContent"
          @get-content-ingredients="getContentIngredients"
        />
      </div>
    </div>
    <div class="ex_content">
      <div v-if="pageState.dataBanner?.id" class="md:!py-[180px]">
        <QuizItemIngredients :data-quiz-item="pageState.dataBanner" />
      </div>

      <div v-if="pageState.dataRelatePage?.length" class="explist2">
        <div class="inner">
          <ul class="md:(flex gap-5)">
            <li v-for="item in pageState.dataRelatePage.slice(0, 3)" :key="item.id">
              <img
                alt="image"
                :src="addPrefixForImage(item.imageUrl)"
                class="md:(h-[385px] w-[385px]) h-25 w-25 object-cover"
              />
              <div class="tbox">
                <div class="tbox1 !mb-[25px]">{{ item.displayTitle }}</div>
                <div class="font-500 text-base underline" @click="openNewLink(item)">Read More</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="section">
        <DiveIn />
      </div>
    </div>
  </div>
</template>
<script setup>
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { CmsTypeEnum, CmsDisplayTypeEnum } from '@/helpers/enum'
import { onMounted, reactive } from 'vue'
import { addPrefixForImage, handleStyleFontColor } from '@/utils/common'
import { useCmsStore } from '@/stores/modules/cms'
import cloneDeep from 'lodash/cloneDeep'

const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading
const { getSnsList } = useCmsStore()

const pageState = reactive({
  paramsContent: {
    currentPage: 1,
    pageSize: 15
  },
  payloadContent: {
    type: CmsTypeEnum.INGREDIENTS,
    displayType: CmsDisplayTypeEnum.NONE
  },
  dataTitle: {},
  dataBanner: {},
  dataContent: [],
  dataRelatePage: []
})

const getContentIngredients = async (payload) => {
  try {
    showGlobalLoading(true)
    const response = await apiService.cmsService.getContentExplore(pageState.paramsContent, payload)
    const { content } = response.data
    if (!payload.displayTitle && payload.displayType === CmsDisplayTypeEnum.NONE) {
      pageState.dataBanner = content?.find((e) => e.displayType === CmsDisplayTypeEnum.BANNER)
      pageState.dataRelatePage = content.filter(
        (e) => e.displayType === CmsDisplayTypeEnum.RELATED_PAGE
      )
    } else {
      pageState.dataContent = content.splice(0, 8)
    }
  } finally {
    showGlobalLoading(false)
  }
}

const getContentTitleIngredients = async () => {
  try {
    showGlobalLoading(true)
    const response = await apiService.cmsService.getContentExplore(pageState.paramsContent, {
      type: CmsTypeEnum.INGREDIENTS,
      displayType: CmsDisplayTypeEnum.TITLE
    })
    const { content } = response.data
    if (content.length) {
      const dataTitle = content?.find((e) => e.displayType === CmsDisplayTypeEnum.TITLE)
      pageState.dataTitle = dataTitle ? getContentTypeAttachment(dataTitle) : undefined
    }
  } finally {
    showGlobalLoading(false)
  }
}

const getContentTypeAttachment = (item) => {
  if (!item) return {}

  const itemClone = cloneDeep(item)
  const imageUrlType = itemClone.exploreFileAttachEntities?.find(
    (file) => file.fileKey === itemClone.imageUrl
  )
  if (imageUrlType) itemClone.imageUrlType = imageUrlType.contentType

  const imageUrlMobileType = itemClone.exploreFileAttachEntities?.find(
    (file) => file.fileKey === itemClone.imageUrlMobile
  )
  if (imageUrlMobileType) itemClone.imageUrlMobileType = imageUrlMobileType.contentType

  return itemClone
}

onMounted(async () => {
  await getContentTitleIngredients()
  await getContentIngredients(pageState.payloadContent)
  await getSnsList()
})

const openNewLink = (item) => {
  if (item.openInNewWindow) {
    window.open(item?.link, 'link', 'height=600,width=600')
  } else {
    window.open(item?.link, '_blank')
  }
}
</script>
<style src="@/assets/css/common.css" scoped></style>
<style src="@/assets/css/explore.css" scoped></style>
