<template>
  <div class="home-container">
    <section
      v-if="mainBannerListParse?.length"
      ref="banner"
      class="section-key-visual md:pb-180px pb-90px xl:mx-[32px]"
    >
      <KeyVisual />
    </section>
    <section ref="secondarySection" class="section-slide">
      <div v-if="shopBestSellerListParse?.registerTypeYn">
        <ShopBestSeller
          :type="TypeCategoryEnum.UPPER"
          :title-upper="titleUpper"
          :desc-upper="descUpper"
          :upper-slug="upperSlug"
        />
      </div>
      <div v-else>
        <WhatNews
          :type="TypeCategoryEnum.UPPER"
          :title-upper="titleUpper"
          :desc-upper="descUpper"
        />
      </div>
    </section>
    <section ref="secondarySection" class="section-slide">
      <div v-if="whatNewListParse?.registerTypeYn">
        <ShopBestSeller
          :type="TypeCategoryEnum.LOWER"
          :title-lower="titleLower"
          :desc-lower="descLower"
          :lower-slug="lowerSlug"
        />
      </div>
      <div v-else>
        <WhatNews
          :type="TypeCategoryEnum.LOWER"
          :title-lower="titleLower"
          :desc-lower="descLower"
        />
      </div>
    </section>
    <section v-if="diveInListParse?.length" class="section-slide">
      <DiveInSlider></DiveInSlider>
    </section>
    <section v-if="marketingBannerListParse?.length" class="section-slide">
      <QuizItem class="w-full px-5 md:px-0" />
    </section>
    <section class="section-slide">
      <OurBrands />
    </section>
    <section>
      <VideoAdvertising />
    </section>
    <!-- <AdvertisingPopup /> -->
    <!-- <ConnectingCountryPopup /> -->
  </div>
</template>

<script setup>
import apiService from '@/http/api'
import { addPrefixForImage, textToSlug } from '@/utils/common'
import { useElementVisibility, useWindowSize } from '@vueuse/core'
import { ref, watch, onMounted, computed } from 'vue'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import VueScrollTo from 'vue-scrollto'
import storage from '@/utils/storage'
import { STORAGE_IP_ADDRESS } from '@/helpers/constant'
import { CountryEnum } from '@/helpers/enum'
import { useCmsStore } from '@/stores/modules/cms'
import { storeToRefs } from 'pinia'
import { useQuery } from 'vue-query'
import DiveInSlider from '@/components/home/DiveInSlider.vue'
import DiveIn from '@/components/home/DiveIn.vue'
import WhatNews from '@/components/home/WhatNews.vue'
import { TypeCategoryEnum } from '@/helpers/enum'

const targetDivVideo = ref()
const banner = ref()
const secondarySection = ref()
const pageTimeout = ref()
const upperSlug = ref()
const lowerSlug = ref()
const { width } = useWindowSize()

const isMobile = computed(() => width.value < 992)

const { showGlobalLoading } = useGlobalLoadingStore()
const targetIsVisible = useElementVisibility(targetDivVideo)
const bannerVisible = useElementVisibility(banner)

const { getSnsList } = useCmsStore()
const { getMainBannerList } = useCmsStore()
const { getDiveInList } = useCmsStore()
const { getMarketingBannerList } = useCmsStore()
const { getWhatNewList } = useCmsStore()
const { getShopBestSellerList } = useCmsStore()
const { getOurBrandList } = useCmsStore()
const {
  marketingBannerListParse,
  snsList,
  diveInListParse,
  mainBannerListParse,
  shopBestSellerListParse,
  whatNewListParse
} = storeToRefs(useCmsStore())

const titleUpper = computed(() => shopBestSellerListParse.value?.adminTitle)
const titleLower = computed(() => whatNewListParse.value?.adminTitle)
const descUpper = computed(() => shopBestSellerListParse.value?.title1)
const descLower = computed(() => whatNewListParse.value?.title1)
const togglePlayVideo = (val) => {
  const videoElement = document.querySelector('video')

  if (videoElement) {
    videoElement.muted = true
    if (val) {
      videoElement.play()
    } else {
      videoElement.pause()
    }
  }
}

watch(
  () => targetIsVisible.value,
  (val) => {
    togglePlayVideo(val)
  }
)

watch(
  () => bannerVisible.value,
  (val) => {
    togglePlayVideo(val)
  }
)

const bestSellerId = ref()
const bestSlug = ref()

const getMyIpAddress = async () => {
  const { data } = await apiService.productService.getMyIpAddress()
  const address = storage.get(STORAGE_IP_ADDRESS, 'localStorage')
  if (data.country === CountryEnum.CA.label && !address) {
    storage.set(STORAGE_IP_ADDRESS, CountryEnum.CA.value, 'localStorage')
  } else if (data.country === CountryEnum.US.label && !address) {
    storage.set(STORAGE_IP_ADDRESS, CountryEnum.US.value, 'localStorage')
  }
}

const getProductCategory = async () => {
  const params = {
    country: storage.get(STORAGE_IP_ADDRESS, 'localStorage') ?? CountryEnum.US.value
  }
  const res = await apiService.menuService.getListMenus(params)
  if (res?.data && res.data?.length) {
    const fullItems = res.data.map((el) => ({ ...el, path: textToSlug(el.categoryName) }))
    const categoryIdUpper = shopBestSellerListParse.value?.subtypeId
    const categoryIdLower = whatNewListParse.value?.subtypeId
    const categoryUpper = fullItems.find((item) => item.categoryId === categoryIdUpper)
    const categotyLower = fullItems.find((item) => item.categoryId === categoryIdLower)
    upperSlug.value = categoryUpper?.path
    lowerSlug.value = categotyLower?.path
  }
}

const { data: dataBlog } = useQuery({
  queryKey: [
    'get-content-ec-content',
    {
      type: 'BLOG',
      displayType: 'CONTENT',
      mainDisplay: true
    },
    {
      currentPage: 1,
      pageSize: 4
    }
  ],
  queryFn: () =>
    apiService.exploreService.getContentEC(
      {
        type: 'BLOG',
        displayType: 'CONTENT',
        mainDisplay: true
      },
      {
        currentPage: 1,
        pageSize: 4
      }
    ),
  refetchOnWindowFocus: false
})

const dataBlogAfterFetched = computed(() => {
  return dataBlog?.value?.data?.content?.map((item) => ({
    id: item?.id,
    title: item?.displayTitle,
    subTitle: item?.description,
    description: item?.subTitlePc ?? item?.subTitleMobile ?? item?.description,
    image: addPrefixForImage(isMobile.value ? item?.imageUrlMobile : item?.imageUrl)
  }))
})

const eventWheel = (e) => {
  const isMobile = window.innerWidth < 768
  if (isMobile) return
  if (pageTimeout.value) {
    clearTimeout(pageTimeout.value)
  }
  pageTimeout.value = setTimeout(() => {
    const isScrollDown = e.deltaY > 0
    if (isScrollDown && bannerVisible.value) {
      VueScrollTo.scrollTo(secondarySection.value, 300, {
        container: 'body'
      })
    }
  }, 50)
}

onMounted(() => {
  getMyIpAddress()
  getSnsList()
  getMainBannerList()
  getDiveInList()
  getMarketingBannerList()
  getShopBestSellerList()
  getWhatNewList()
  getOurBrandList()
  getProductCategory()
  // getBannerList()
  showGlobalLoading(false)
  window.addEventListener('wheel', eventWheel)
})
</script>
<style lang="scss">
.home-container {
  width: auto;
  overflow-x: hidden;
  @media (max-width: 500px) {
    overflow: hidden;
    height: auto;
  }
}

.section-slide {
  @apply flex w-full snap-center flex-col items-center justify-center;
  @apply pb-[90px] md:pb-[180px];
}
.section-bottom {
  @media (max-width: 500px) {
    display: none !important;
  }
}
</style>
