import { defineStore } from 'pinia'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import apiService from '@/http/api'
import cloneDeep from 'lodash/cloneDeep'
import { FONT_COLOR } from '@/helpers/enum'
import { addPrefixForImage } from '@/utils/common'
import { banners, skinQuiz, diveIn } from '@/mocks/cms'

const CATEGORY_ENUM = {
  BANNER: 'BANNER',
  SNS: 'SNS',
  MAIN: 'MAIN',
  DIVEIN: 'DIVEIN',
  GNB: 'GNB',
  MARKETING: 'MARKETING',
  WHATNEW: 'WHATNEW',
  BESTSELLERS: 'BESTSELLERS',
  OURBRAND: 'OURBRAND',
  RITUAL: 'RITUAL'
}

const BANNER_CATEGORY = {
  MAIN: 'MAIN',
  RITUAL: 'RITUAL',
  MARKETING: 'MARKETING',
  GNB: 'GNB'
}

const DEVICE_ENUM = {
  PC: 'PC',
  MO: 'MO'
}

const EXPLORE_ENUM = {
  ABOUT_US: 'ABOUT_US',
  SUSTAINABILITY: 'SUSTAINABILITY',
  INGREDIENTS: 'INGREDIENTS',
  RITUAL: 'RITUAL',
  BLOG: 'BLOG',
  BUSINESS_OPPORTUNITY: 'BUSINESS_OPPORTUNITY',
  EVENT: 'EVENT',
  RETREATS: 'RETREATS'
}

const EXPLORE_DISPLAY_TYPE_ENUM = {
  NONE: 'NONE',
  CONTENT: 'CONTENT',
  BANNER: 'BANNER',
  EVENT: 'EVENT',
  UPCOMING_TRIPS: 'UPCOMING_TRIPS',
  PAST_TRIPS: 'PAST_TRIPS',
  TITLE: 'TITLE',
  RELATED_PAGE: 'RELATED_PAGE',
  VIDEO: 'VIDEO',
  BANNER_SMALL: 'BANNER_SMALL',
  SNS: 'SNS'
}

const SNS_TYPE = {
  EVENT: 'EVENT',
  RETREATS: 'RETREATS'
}

const SNS_DISPLAY_TYPE = {
  SAME_AS_MAIN: 'SAME_AS_MAIN',
  CUSTOM: 'CUSTOM'
}

const PAGE_SIZE_MAX = 100

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

export const useCmsStore = defineStore('cms', {
  state: () => ({
    bannerList: [],
    snsList: [],
    aboutUsList: [],
    sustainabilityList: [],
    businessOpportunityList: [],
    retreatList: [],
    eventList: [],
    diveInList: [],
    gnbBannerList: [],
    mainBannerList: [],
    marketingBannerList: [],
    shopBestSellerList: {},
    whatNewList: {},
    ourBrandList: []
  }),

  getters: {
    mainBannerListParse: (state) => {
      return state.mainBannerList.map((item) => {
        const imagePC = item.attachmentList.find((item) => item.device === DEVICE_ENUM.PC)?.url
        const fileTypePC = item.attachmentList.find(
          (item) => item.device === DEVICE_ENUM.PC
        )?.fileType
        const imageMobile = item.attachmentList.find((item) => item.device === DEVICE_ENUM.MO)?.url
        const fileTypeMobile = item.attachmentList.find(
          (item) => item.device === DEVICE_ENUM.MO
        )?.fileType

        return { ...item, imagePC, fileTypePC, imageMobile, fileTypeMobile }
      })
    },
    marketingBannerListParse: (state) => {
      return state.marketingBannerList.map((item) => {
        const imagePC = item.attachmentList.find((item) => item.device === DEVICE_ENUM.PC)?.url
        const imageMobile = item.attachmentList.find((item) => item.device === DEVICE_ENUM.MO)?.url
        return { ...item, imagePC, imageMobile }
      })
    },
    gnbBannerListParse: (state) => {
      return state.gnbBannerList.map((item) => ({
        ...item,
        imageUrl: item.attachmentList?.[0]?.url,
        fontColor: item.fontColor?.code === FONT_COLOR.WHITE
      }))
    },
    diveInListParse: (state) => {
      return state.diveInList.map((item) => ({
        ...item,
        imageUrl: item.attachmentList?.[0]?.url
      }))
    },
    shopBestSellerListParse: (state) => {
      return {
        ...state.shopBestSellerList,
        imageUrl: state.shopBestSellerList.attachmentList?.[0]?.url
      }
    },
    whatNewListParse: (state) => {
      return {
        ...state.whatNewList,
        productList: state.whatNewList.attachmentList?.[0]?.productAttachmentsResponseList,
        imageUrl: state.whatNewList.attachmentList?.[0]?.url
      }
    },
    ourBrandListParse: (state) => {
      return state.ourBrandList.map((item) => ({
        ...item,
        imageUrl: item.attachmentList?.[0]?.url
      }))
    },
    aboutUsBanner: (state) => {
      const title = state.aboutUsList.find(
        (item) => item.displayType === EXPLORE_DISPLAY_TYPE_ENUM.TITLE
      )
      return getContentTypeAttachment(title)
    },
    businessOpportunityBanner: (state) => {
      const title = state.businessOpportunityList.find(
        (item) => item.displayType === EXPLORE_DISPLAY_TYPE_ENUM.TITLE
      )
      return getContentTypeAttachment(title)
    },
    businessOpportunityVideo: (state) => {
      const video = state.businessOpportunityList.find(
        (item) => item.displayType === EXPLORE_DISPLAY_TYPE_ENUM.VIDEO
      )
      return video
    },
    businessOpportunityBigBanner: (state) => {
      const video = state.businessOpportunityList.find(
        (item) => item.displayType === EXPLORE_DISPLAY_TYPE_ENUM.BANNER
      )
      return video
    },
    businessOpportunitySmallBanner: (state) => {
      const video = state.businessOpportunityList.filter(
        (item) => item.displayType === EXPLORE_DISPLAY_TYPE_ENUM.BANNER_SMALL && item?.displayStatus
      )
      return video.slice(0, 3)
    },
    retreatBanner: (state) => {
      const title = state.retreatList.find(
        (item) => item.displayType === EXPLORE_DISPLAY_TYPE_ENUM.TITLE
      )
      return getContentTypeAttachment(title)
    },
    retreatUpComingTrips: (state) => {
      const title = state.retreatList.find(
        (item) => item.displayType === EXPLORE_DISPLAY_TYPE_ENUM.UPCOMING_TRIPS
      )
      return getContentTypeAttachment(title)
    },
    retreatPastTrips: (state) => {
      const title = state.retreatList.find(
        (item) => item.displayType === EXPLORE_DISPLAY_TYPE_ENUM.PAST_TRIPS
      )
      return getContentTypeAttachment(title)
    },
    eventBanner: (state) => {
      const title = state.eventList?.find(
        (item) => item.displayType === EXPLORE_DISPLAY_TYPE_ENUM.TITLE
      )
      return getContentTypeAttachment(title)
    },
    eventListSection: (state) => {
      const data = state.eventList?.filter(
        (item) =>
          item?.displayType === EXPLORE_DISPLAY_TYPE_ENUM.EVENT &&
          item?.type === EXPLORE_ENUM.EVENT &&
          item?.displayStatus
      )
      return data?.slice(0, 8)
    },
    eventSecondBanner: (state) => {
      const banner = state.eventList?.find(
        (item) => item.displayType === EXPLORE_DISPLAY_TYPE_ENUM.BANNER
      )
      return banner ? getContentTypeAttachment(banner) : undefined
    },
    aboutUsContent: (state) => {
      return state.aboutUsList.filter(
        (item) => item.displayType === EXPLORE_DISPLAY_TYPE_ENUM.CONTENT
      )
    },
    aboutUsRelatedPage: (state) => {
      return state.aboutUsList.filter(
        (item) => item.displayType === EXPLORE_DISPLAY_TYPE_ENUM.RELATED_PAGE
      )
    },
    sustainabilityTitle: (state) => {
      const title = state.sustainabilityList.find(
        (item) => item.displayType === EXPLORE_DISPLAY_TYPE_ENUM.TITLE
      )
      return getContentTypeAttachment(title)
    },
    sustainabilityContent: (state) => {
      return state.sustainabilityList.filter(
        (item) => item.displayType === EXPLORE_DISPLAY_TYPE_ENUM.CONTENT
      )
    },
    sustainabilityBanner: (state) => {
      const banner = state.sustainabilityList.find(
        (item) => item.displayType === EXPLORE_DISPLAY_TYPE_ENUM.BANNER
      )
      return banner || {}
    },
    sustainabilityRelatedPage: (state) => {
      return state.sustainabilityList.filter(
        (item) => item.displayType === EXPLORE_DISPLAY_TYPE_ENUM.RELATED_PAGE
      )
    }
  },

  actions: {
    async getDiveInList() {
      const { showGlobalLoading } = useGlobalLoadingStore()
      showGlobalLoading(true)
      const { data, success } = await apiService.productService.getCmSMain({
        category: CATEGORY_ENUM.DIVEIN
      })
      this.diveInList = success ? data : []
      showGlobalLoading(false)
    },
    async getBannerList() {
      const { showGlobalLoading } = useGlobalLoadingStore()
      showGlobalLoading(true)
      const { data, success } = await apiService.productService.getCmSMain({
        category: CATEGORY_ENUM.BANNER
      })
      this.bannerList = success ? data : []
      showGlobalLoading(false)
    },
    async getMainBannerList() {
      const { showGlobalLoading } = useGlobalLoadingStore()
      showGlobalLoading(true)
      const { data, success } = await apiService.productService.getCmSMain({
        category: CATEGORY_ENUM.MAIN
      })
      this.mainBannerList = success ? data : []
    },
    async getGnbBannerList() {
      const { showGlobalLoading } = useGlobalLoadingStore()
      showGlobalLoading(true)
      const { data, success } = await apiService.productService.getCmSMain({
        category: CATEGORY_ENUM.GNB
      })
      this.gnbBannerList = success ? data : []
      showGlobalLoading(false)
    },
    async getMarketingBannerList() {
      const { showGlobalLoading } = useGlobalLoadingStore()
      showGlobalLoading(true)
      const { data, success } = await apiService.productService.getCmSMain({
        category: CATEGORY_ENUM.MARKETING
      })
      this.marketingBannerList = success ? data : []
      showGlobalLoading(false)
    },
    async getShopBestSellerList() {
      const { showGlobalLoading } = useGlobalLoadingStore()
      showGlobalLoading(true)
      const { data, success } = await apiService.productService.getLinkToCategory({
        category: CATEGORY_ENUM.BESTSELLERS
      })
      this.shopBestSellerList = success ? data : {}
    },
    async getWhatNewList() {
      const { showGlobalLoading } = useGlobalLoadingStore()
      showGlobalLoading(true)
      const { data, success } = await apiService.productService.getLinkToCategory({
        category: CATEGORY_ENUM.WHATNEW
      })
      this.whatNewList = success ? data : {}
    },
    async getOurBrandList() {
      const { showGlobalLoading } = useGlobalLoadingStore()
      showGlobalLoading(true)
      const { data, success } = await apiService.productService.getCmSMain({
        category: CATEGORY_ENUM.RITUAL
      })
      this.ourBrandList = success ? data : showGlobalLoading(false)
    },
    async getSnsList() {
      const { showGlobalLoading } = useGlobalLoadingStore()
      showGlobalLoading(true)
      const { data, success } = await apiService.productService.getCmSMain({
        category: CATEGORY_ENUM.DIVEIN
      })
      this.snsList = success ? data : []
      showGlobalLoading(false)
    },
    async getEventSNS() {
      const { showGlobalLoading } = useGlobalLoadingStore()
      showGlobalLoading(true)
      const { data, success } = await apiService.exploreService.getContentEC(
        {
          type: EXPLORE_ENUM.EVENT,
          displayType: EXPLORE_DISPLAY_TYPE_ENUM.SNS
        },
        {
          currentPage: 1,
          pageSize: PAGE_SIZE_MAX
        }
      )

      showGlobalLoading(false)
      this.snsList = success
        ? data?.content?.map((item) => getContentTypeAttachment(item)) || []
        : []

      this.snsList = this.snsList.map((item) => ({
        ...item,
        attachmentList: [
          {
            ...item.attachmentList?.[0],
            url: addPrefixForImage(item.exploreFileAttachEntities?.[0].fileKey)
          }
        ]
      }))
    },
    async getEventSnsType() {
      const { showGlobalLoading } = useGlobalLoadingStore()
      showGlobalLoading(true)
      const { data, success } = await apiService.exploreService.getSnsDisplayType({
        type: SNS_TYPE.EVENT
      })
      showGlobalLoading(false)
      if (success && data?.displayType === SNS_DISPLAY_TYPE.CUSTOM) {
        this.getEventSNS()
      } else {
        this.getSnsList()
      }
    },
    async getRetreatSNS() {
      const { showGlobalLoading } = useGlobalLoadingStore()
      showGlobalLoading(true)
      const { data, success } = await apiService.exploreService.getContentEC(
        {
          type: EXPLORE_ENUM.RETREATS,
          displayType: EXPLORE_DISPLAY_TYPE_ENUM.SNS
        },
        {
          currentPage: 1,
          pageSize: PAGE_SIZE_MAX
        }
      )

      showGlobalLoading(false)
      this.snsList = success
        ? data?.content?.map((item) => getContentTypeAttachment(item)) || []
        : []

      this.snsList = this.snsList.map((item) => ({
        ...item,
        attachmentList: [
          {
            ...item.attachmentList?.[0],
            url: addPrefixForImage(item.exploreFileAttachEntities?.[0].fileKey)
          }
        ]
      }))
    },
    async getRetreatType() {
      const { showGlobalLoading } = useGlobalLoadingStore()
      showGlobalLoading(true)
      const { data, success } = await apiService.exploreService.getSnsDisplayType({
        type: SNS_TYPE.RETREATS
      })
      showGlobalLoading(false)
      if (success && data?.displayType === SNS_DISPLAY_TYPE.CUSTOM) {
        this.getRetreatSNS()
      } else {
        this.getSnsList()
      }
    },
    async getAboutUs() {
      const { showGlobalLoading } = useGlobalLoadingStore()
      showGlobalLoading(true)
      const { data, success } = await apiService.exploreService.getContentEC(
        {
          type: EXPLORE_ENUM.ABOUT_US,
          displayType: EXPLORE_DISPLAY_TYPE_ENUM.NONE
        },
        {
          currentPage: 1,
          pageSize: PAGE_SIZE_MAX
        }
      )

      this.aboutUsList = success ? data?.content || [] : []
      showGlobalLoading(false)
    },
    async getSustainability() {
      const { showGlobalLoading } = useGlobalLoadingStore()
      showGlobalLoading(true)
      const { data, success } = await apiService.exploreService.getContentEC(
        {
          type: EXPLORE_ENUM.SUSTAINABILITY,
          displayType: EXPLORE_DISPLAY_TYPE_ENUM.NONE
        },
        {
          currentPage: 1,
          pageSize: PAGE_SIZE_MAX
        }
      )

      this.sustainabilityList = success ? data?.content || [] : []
      showGlobalLoading(false)
    },
    async getBusinessOpportunity() {
      const { showGlobalLoading } = useGlobalLoadingStore()
      showGlobalLoading(true)
      const { data, success } = await apiService.exploreService.getContentEC(
        {
          type: EXPLORE_ENUM.BUSINESS_OPPORTUNITY,
          displayType: EXPLORE_DISPLAY_TYPE_ENUM.NONE
        },
        {
          currentPage: 1,
          pageSize: PAGE_SIZE_MAX
        }
      )

      showGlobalLoading(false)
      this.businessOpportunityList = success ? data?.content || [] : []
    },
    async getRetreat() {
      const { showGlobalLoading } = useGlobalLoadingStore()
      showGlobalLoading(true)
      const { data, success } = await apiService.exploreService.getContentEC(
        {
          type: EXPLORE_ENUM.RETREATS,
          displayType: EXPLORE_DISPLAY_TYPE_ENUM.NONE
        },
        {
          currentPage: 1,
          pageSize: PAGE_SIZE_MAX
        }
      )

      showGlobalLoading(false)
      this.retreatList = success ? data?.content || [] : []
    },
    async getEvent() {
      const { showGlobalLoading } = useGlobalLoadingStore()
      showGlobalLoading(true)
      const { data, success } = await apiService.exploreService.getContentEC(
        {
          type: EXPLORE_ENUM.EVENT,
          displayType: EXPLORE_DISPLAY_TYPE_ENUM.NONE
        },
        {
          currentPage: 1,
          pageSize: PAGE_SIZE_MAX
        }
      )

      showGlobalLoading(false)
      this.eventList = success ? data?.content || [] : []
    }
  }
})
