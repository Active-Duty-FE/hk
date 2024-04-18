<template>
  <div
    class="border-b-1 border-b-solid border-b-navy-02 group fixed top-0 z-20 h-[55px] w-full bg-white"
    :class="[{ '!top-10': isShowBannerWelcome }]"
  >
    <div class="container mx-auto flex h-[55px] w-full items-center justify-between">
      <div>
        <Logo
          class="text-navy-deep flex cursor-pointer items-center"
          :class="{
            'text-navy-deep': !isShowHeaderWhite,
            'group-hover:text-navy-deep': isShowHeaderWhite
          }"
          @click="router.push('/')"
        />
      </div>
      <div>
        <div class="menu-zone relative">
          <span
            v-for="menu in currentMenusLowercase"
            :key="menu.id"
            class="font-475 parent-item menu-depth-one cursor-pointer py-[21px] pr-[30px] text-base capitalize leading-[normal]"
            :class="{
              'text-navy-deep': !isShowHeaderWhite,
              'group-hover:text-navy-deep': isShowHeaderWhite
            }"
            @mouseenter="showChildMenu(menu, true)"
            @mouseleave="showChildMenu(menu, false)"
            @click="gotoProductByCategory(menu)"
          >
            {{ menu.name }}
          </span>
        </div>
      </div>
      <div class="flex items-center">
        <!-- <span v-if="currentAuthUser" class="hidden cursor-pointer pr-[10px]">
          <a-dropdown :trigger="['click']">
            <ShareIcon class="outline-none" />
            <template #overlay>
              <a-menu>
                <div class="flex flex-col justify-center px-[10px] py-2">
                  <div class="flex w-full pb-[8px]">
                    <share-top-icon /> <span class="font-475 pl-1 text-sm">Share</span>
                  </div>
                  <div class="flex w-full">
                    <twitter-icon /> <span class="font-475 pl-1 text-sm">SNS</span>
                  </div>
                </div>
              </a-menu>
            </template>
          </a-dropdown>
        </span> -->

        <!-- Use for test multi language -->
        <!-- <span class="relative flex cursor-pointer items-center pr-[26px]">
          <a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click.prevent>{{ $t('lang.change_lang') }}</a>
            <template #overlay>
              <a-menu>
                <a-menu-item key="0">
                  <div @click="changeLanguage('en')">English</div>
                </a-menu-item>
                <a-menu-item key="1">
                  <div @click="changeLanguage('hk')">Hong Kong</div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </span> -->
        <span class="relative flex cursor-pointer items-center pr-[26px]">
          <SearchIcon
            :class="{
              'text-navy-deep': !isShowHeaderWhite,
              'group-hover:text-navy-deep': isShowHeaderWhite
            }"
            @mouseover="showSearchBar = true"
            @click="showSearchBar = !showSearchBar"
          />
          <Transition name="slide" mode="in-out">
            <search-bar
              v-if="showSearchBar"
              class="!absolute !left-[-150px] !top-[36px] !w-[250px]"
              @on-search="onSearch"
            />
          </Transition>
        </span>
        <span
          v-if="!isLoginPage"
          class="inline-block flex cursor-pointer items-center pr-[26px]"
          @click="gotoLogin"
        >
          <UserIcon
            :class="{
              'text-navy-deep': !isShowHeaderWhite,
              'group-hover:text-navy-deep': isShowHeaderWhite
            }"
          />
        </span>
        <span
          v-if="!isLoginPage"
          class="relative cursor-pointer"
          :class="{
            'text-navy-deep': !isShowHeaderWhite,
            'group-hover:text-navy-deep': isShowHeaderWhite
          }"
          @click="gotoCart"
        >
          <CartIcon class="flex items-center" />
          <span class="absolute -top-[7px] left-5 text-[10px] font-[475px]">
            ({{ convertCartADisplay(totalCartBadge) }})
          </span>
        </span>
      </div>
    </div>
    <div
      v-if="pageState.showSubMenu && pageState.currentParentMenu?.children?.length"
      class="relative bg-white"
    >
      <div class="overlay absolute top-0 z-10 min-h-screen w-screen"></div>
      <Transition class="absolute top-0 z-50">
        <div
          class="child-item absolute left-0 min-h-[405px] w-full bg-white"
          @mouseenter="showChildMenu(pageState.currentParentMenu, true)"
          @mouseleave="showChildMenu(pageState.currentParentMenu, false)"
        >
          <div>
            <a-divider class="!mb-[50px] mt-[5px]" />
          </div>
          <div class="container mx-auto flex w-full justify-between">
            <div
              class="flex gap-[70px]"
              :class="showClassForItem(pageState.currentParentMenu?.children)"
            >
              <div
                v-for="menuDepthTwo in pageState.currentParentMenu?.children"
                :key="menuDepthTwo.name"
              >
                <div
                  class="font-625 text-gray-10 cursor-pointer pb-[30px] text-[18px] leading-[18px]"
                >
                  {{ menuDepthTwo.name }}
                </div>
                <div>
                  <div
                    v-for="menuDepthThree in menuDepthTwo?.children"
                    :key="menuDepthThree.name"
                    class="pb-[25px]"
                    @click="gotoProductByCategory(menuDepthThree)"
                    @mousedown="gotoProductByCategory(menuDepthThree)"
                  >
                    <span
                      class="menu-depth-three relative cursor-pointer text-[16px] font-normal leading-6"
                    >
                      {{ menuDepthThree.name }}
                    </span>
                  </div>
                  <div
                    v-if="isShowShopAll(pageState.currentParentMenu.name)"
                    class="mb-[70px] pt-[15px] font-medium underline hover:cursor-pointer"
                    @click="gotoProductByCategory(pageState.currentParentMenu)"
                    @mousedown="gotoProductByCategory(pageState.currentParentMenu)"
                  >
                    Shop All
                  </div>
                </div>
              </div>
              <div>
                <div
                  v-for="otherMenu in pageState.currentParentMenu?.others"
                  :key="otherMenu.path"
                  class="text-gray-10 font-600 cursor-pointer pb-[25px] text-[18px] capitalize leading-[18px]"
                  :class="`${otherMenu.class}`"
                  @click="gotoOtherMenu(otherMenu.path, otherMenu)"
                  @mousedown="gotoOtherMenu(otherMenu.path, otherMenu)"
                >
                  {{ otherMenu.name?.toLowerCase() }}
                </div>
                <div
                  v-for="otherMenu in pageState.currentParentMenu?.specials"
                  :key="otherMenu.path"
                  class="text-gray-10 font-600 cursor-pointer pb-[25px] text-[18px] capitalize leading-[18px]"
                  :class="`${otherMenu.class}`"
                  @click="gotoOtherMenu(otherMenu.path, otherMenu)"
                  @mousedown="gotoOtherMenu(otherMenu.path, otherMenu)"
                >
                  {{ otherMenu.name?.toLowerCase() }}
                </div>
              </div>
            </div>
            <div>
              <div class="w-[500px] pb-[43px]">
                <RCarousel
                  v-if="bannerColumns"
                  v-slot="item"
                  :options="bannerColumns"
                  :autoplay="3000"
                  :items-to-show="2"
                >
                  <div class="max-w-full text-left">
                    <div
                      v-if="item.displayType?.code === GNB_DISPLAY_TYPE.VERTICAL"
                      class="menu-slide-image relative h-[320px] w-[250px]"
                      :style="{ backgroundImage: `url(${addPrefixForImage(item.imageUrl)})` }"
                      @click="gotoLinkedPage(item)"
                    >
                      <div class="absolute bottom-5 left-5 right-5">
                        <div
                          class="py-5 text-[28px] font-medium leading-[30px]"
                          :class="handleStyleFontColor(item.fontColor)"
                        >
                          {{ item?.title1 }}
                        </div>
                        <div class="flex items-center justify-between">
                          <div
                            class="line-clamp-1 max-w-full text-base font-light"
                            :class="handleStyleFontColor(item.fontColor)"
                          >
                            {{ item.title2 }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      v-else
                      class="flex w-[250px] flex-col justify-between gap-5 text-[#212121]"
                      @click="gotoLinkedPage(item)"
                    >
                      <div
                        class="menu-slide-image h-[190px] w-full"
                        :style="{ backgroundImage: `url(${addPrefixForImage(item.imageUrl)})` }"
                      />
                      <div class="">
                        <div
                          class="pb-5 text-2xl font-medium leading-7"
                          :class="handleStyleFontColor(item.fontColor)"
                        >
                          {{ item?.title1 }}
                        </div>
                        <div class="flex items-center justify-between">
                          <div
                            class="line-clamp-1 max-w-full text-base font-light tracking-[-0.32px]"
                            :class="handleStyleFontColor(item.fontColor)"
                          >
                            {{ item.title2 }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </RCarousel>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
    <RModalConfirm
      v-model:visible="pageState.showModalError"
      :description="AUTH_REQUIRED.notAuth"
      text-ok="Login"
      text-cancel="Later"
      :width="270"
      :mask-closable="false"
      @ok="router.push(AppRoutes.login)"
      @cancel="pageState.showModalError = false"
    />
  </div>
</template>
<script setup>
import { computed, reactive, ref, onMounted, watch, onBeforeMount } from 'vue'
import { MenuType, CountryEnum, ExploreRimanNameEnum, GNB_DISPLAY_TYPE } from '@/helpers/enum'
import { AUTH_REQUIRED } from '@/helpers/validate-message'
import { AppRoutes } from '@/router/path'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { useCartStore } from '@/stores/modules/cart'
import { useMenuStore } from '@/stores/modules/menu'
import CartIcon from '@assets/icons/CartIcon.vue'
import Logo from '@assets/icons/Logo.vue'
import SearchIcon from '@assets/icons/SearchIcon.vue'
import ShareTopIcon from '@assets/svgs/share-icon.svg'
import ShareIcon from '@assets/svgs/share.svg'
import TwitterIcon from '@assets/svgs/twitter.svg'
import UserIcon from '@assets/icons/UserIcon.vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { convertCartADisplay, handleStyleFontColor } from '@/utils/common'
import { HTTPS_LINK } from '@/helpers/regex'
import { useMemberBannerStore } from '@/stores/modules/member-banner'
import { useCmsStore } from '@/stores/modules/cms'
import Canada from '@assets/svgs/country/canada.svg?url'
import USA from '@assets/svgs/country/usa.svg?url'
import { checkAccessSkinQuiz } from '@/utils/guard/skin-quiz'
import { useShowAccessSkinQuiz } from '@/stores/modules/access-skinquiz'
import { loadMessage } from '@/utils/i18n'
import { addPrefixForImageNew, addPrefixForImage } from '@/utils/common'
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'

const { setShowAccessDenyPopup } = useShowAccessSkinQuiz()

const { gnbBannerListParse } = storeToRefs(useCmsStore())
const { getGnbBannerList } = useCmsStore()

const { isShowBannerWelcome } = storeToRefs(useMemberBannerStore())

const cartStore = useCartStore()
const authUserStore = useAuthUserStore()
const menuStore = useMenuStore()
const router = useRouter()
const route = useRoute()
const { currentAuthUser } = storeToRefs(authUserStore)
const { totalCartBadge } = storeToRefs(cartStore)
const { currentMenus } = storeToRefs(menuStore)
const showSearchBar = ref(false)
const current = ref(0)

const isLoginPage = computed(() => route.name === AppRoutes.login.name)

const isShowHeaderWhite = computed(() => whiteTextHeader.includes(route.name))

const isShowShopAll = (currentParentMenu) => {
  return !currentParentMenu.includes(ExploreRimanNameEnum.EXPLORE_RIMAN)
}

const currentMenusLowercase = computed(
  () =>
    currentMenus.value?.map((item) => ({
      ...item,
      name: item?.name?.toLowerCase()
    })) ?? []
)

const eventScroll = (e) => {
  showSearchBar.value = false
}

const whiteTextHeader = [
  AppRoutes.sustainability.name,
  AppRoutes.blog.name,
  AppRoutes.byoungPoolBusiness.name,
  AppRoutes.events.name
]

const pageState = reactive({
  showSubMenu: false,
  currentParentMenu: undefined,
  showModalError: false,
  banners: []
})

const bannerColumns = computed(() => pageState.banners.slice(0, 2))

const showChildMenu = (parentMenu, isShow) => {
  const child = parentMenu?.children?.length
    ? parentMenu.children.filter((el) => el?.children?.length)
    : []
  const banners = gnbBannerListParse.value.filter(
    (item) => item.subtypeId === parentMenu.categoryId
  )
  pageState.currentParentMenu = { ...parentMenu, children: child }
  pageState.banners = banners.slice(0, 2)
  pageState.showSubMenu = isShow
}

const isShowSlideImage = () => {
  const { children } = pageState.currentParentMenu
  if (children?.length && children?.length === 1) {
    return false
  } else if (children?.length && children?.length > 1) {
    return true
  }
}

const gotoLogin = () => {
  if (!currentAuthUser.value) {
    const referrerCode = route.query?.referrerCode || ''
    return router.push({ name: AppRoutes.login.name, query: { referrerCode } })
  } else {
    return router.push({ path: AppRoutes.myPage.path })
  }
}

const gotoCart = () => {
  if (!currentAuthUser.value) {
    pageState.showModalError = true
  } else {
    router.push(AppRoutes.cart.list)
  }
}

const gotoProductByCategory = (menu) => {
  if (menu.shouldStop && menu.path) return router.push(AppRoutes.skinQuiz)
  if (menu.categoryType?.code === MenuType.RITUAL) {
    return router.push({
      name: AppRoutes.product.ritual.name,
      params: { category: menu?.categoryId }
    })
  }
  if (menu.isExternal) return router.push({ path: menu.path })

  return router.push({
    name: AppRoutes.product.productCategory.name,
    params: { category: menu.path }
  })
}

const gotoOtherMenu = (path, menu) => {
  if (menu.categoryType?.code === MenuType.RITUAL) {
    return router.push({
      name: AppRoutes.product.ritual.name,
      params: { category: menu?.categoryId }
    })
  }
  return router.push({
    name: AppRoutes.product.productCategory.name,
    params: { category: path }
  })
}

const showClassForItem = (itemMenu) => {
  if (itemMenu?.length < 2) return 'w-full pr-[120px]'
  return ''
}

const onSearch = (keySearch) => {
  showSearchBar.value = false
  router.push({ path: AppRoutes.search.path, query: { keySearch } })
}

const gotoLinkedPage = (item) => {
  if (!item.link) return
  window.open(item.link, item.newWindow ? '' : '_self')
}

const changeLanguage = (lang) => {
  loadMessage(lang)
}

onMounted(() => {
  window.addEventListener('scroll', eventScroll)
})

watch(
  () => route.name,
  () => {
    showSearchBar.value = false
  }
)

onBeforeMount(() => {
  getGnbBannerList()
})
</script>
<style lang="scss" scoped>
.menu-slide-image {
  background-size: cover;
  background-position: center center;
}

.parent-item {
  &:hover {
    .child-item {
      display: block;
    }
  }
}
.capitalize {
  text-transform: capitalize;
}

.carousel__pagination {
  margin-top: 0px;
}

:deep(.carousel__pagination-button) {
  &::after {
    @apply h-2.5 w-2.5 rounded-full bg-[#A0A0A0];
  }
}

:deep(.carousel__pagination-button--active::after) {
  @apply bg-[#666666];
}

.overlay {
  background-color: #000;
  opacity: 0.2;
  min-height: 100vh;
}
.ant-divider-horizontal {
  margin: 0;
}

.menu-depth-three {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #212121;
    transform: scaleX(0);
    transition: transform 250ms ease-in-out;
  }
  &:hover:after {
    transform: scaleX(1);
  }
}

.menu-depth-one {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    width: calc(100% - 30px);
    height: 2px;
    bottom: 4px;
    left: 0;
    background-color: #04263f;
    transform: scaleX(0);
    transition: transform 250ms ease-in-out;
    z-index: 2;
  }
  &:hover:after {
    transform: scaleX(1);
  }
}

.menu-zone {
  .menu-depth-one:first-child {
    @apply pl-[30px];
    &::after {
      left: 30px;
      width: calc(100% - 60px);
    }
  }
}

:deep(.carousel__track) {
  gap: 0;
}
</style>
