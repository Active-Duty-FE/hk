<template>
  <div
    class="pointer-auto fixed inset-0 bottom-0 left-0 top-[55px] z-20 w-full overflow-auto border-r bg-white md:hidden"
  >
    <div class="pointer-events-auto fixed left-0 top-[55px] z-[-1] h-screen w-full bg-white"></div>
    <div class="h-full w-full px-5">
      <!-- Start parent menu -->
      <Transition name="slide-left" mode="in-out">
        <div v-if="!showMenuDetail" class="flex h-full w-full flex-col">
          <div class="pt-6.25">
            <div
              v-for="menu in currentMenusLowercase"
              :key="menu.categoryId"
              class="flex cursor-pointer items-center justify-between pb-[40px]"
              @click="handleShowMenuDetail(menu)"
            >
              <span class="text-gray-10 text-5 text-xl font-semibold capitalize leading-[18px]">{{
                menu.name
              }}</span>
              <span v-if="menu.children?.length"> <right-link-icon /></span>
            </div>
            <div>
              <a-divider class="bg-gray-10 !mb-10 !mt-0"></a-divider>
            </div>
          </div>
          <div>
            <div
              v-for="otherMenu in specialMenusLowerCase"
              :key="otherMenu.name"
              class="flex cursor-pointer items-center justify-between pb-[40px]"
              @click="gotoProductByCategorySpecial(otherMenu.path)"
            >
              <span class="text-gray-10 text-5 text-lg font-semibold capitalize leading-[26px]">{{
                otherMenu.name
              }}</span>
            </div>
          </div>

          <div v-if="!currentAuthUser" class="flex flex-grow items-end justify-center py-4">
            <div
              class="w-full cursor-pointer text-center"
              @click="gotoAuthPage(AppRoutes.login, false)"
            >
              <user-sign-in-icon />
              <span class="text-[14px] font-normal">Sign In</span>
            </div>
            <a-divider type="vertical" class="bg-gray-3"></a-divider>
            <div
              class="w-full cursor-pointer text-center"
              @click="gotoAuthPage(AppRoutes.register.onBoarding, false)"
            >
              <user-sign-up-icon />
              <span class="text-[14px] font-normal">Sign Up</span>
            </div>
          </div>
          <div v-else class="flex items-center justify-between gap-4 py-4">
            <span class="text-truncate text-gray-10 whitespace-nowrap text-xl font-medium">
              {{ getFullName }}
            </span>

            <span
              class="cursor-pointer whitespace-nowrap text-[14px] font-normal underline"
              @click="gotoAuthPage(AppRoutes.myPage.path, true)"
            >
              My Page
            </span>
          </div>
        </div>
      </Transition>
      <!-- End parent menu -->
      <!-- Start child menu -->
      <Transition name="slide-right" mode="in-out">
        <div v-if="showMenuDetail" class="flex h-full w-full flex-col">
          <div class="fixed left-0 top-[55px] z-20 w-full bg-white">
            <div class="flex items-center justify-between px-5 pt-[10px]">
              <span class="cursor-pointer pr-2" @click="backToMainMenu"><left-link-icon /></span>
              <span class="text-gray-10 text-[18px] font-medium capitalize leading-[18px]">{{
                currentParentMenu?.name
              }}</span>
              <span></span>
            </div>
            <div class="px-5">
              <a-divider class="bg-gray-11 !mb-0 !mt-[15px]"></a-divider>
            </div>
          </div>
          <div class="pt-[60px]">
            <a-collapse
              v-model:activeKey="activeKey"
              ghost
              accordion
              class="custom-toggle-child-menu"
            >
              <a-collapse-panel
                v-for="menuDepthOne in currentParentMenu.children"
                :key="menuDepthOne.categoryId"
                :show-arrow="false"
                :header="menuDepthOne.name"
              >
                <template v-if="menuDepthOne?.children && menuDepthOne?.children.length" #extra>
                  <div>
                    <div :class="{ hidden: activeKey?.includes(String(menuDepthOne.categoryId)) }">
                      <down-link-icon />
                    </div>
                    <div :class="{ hidden: !activeKey?.includes(String(menuDepthOne.categoryId)) }">
                      <up-link-icon />
                    </div>
                  </div>
                </template>
                <div>
                  <div
                    v-for="menuDepthTwo in menuDepthOne.children"
                    :key="menuDepthTwo.categoryId"
                    class="pb-6.25 text-4 first:mt-1.25 font-normal last:pb-2"
                    @click="gotoProductByCategory(menuDepthTwo, true)"
                  >
                    {{ menuDepthTwo.name }}
                  </div>
                  <div
                    v-if="isShowShopAll(currentParentMenu.name)"
                    class="mb-[20px] font-medium underline hover:cursor-pointer"
                    @click="gotoProductByCategory(currentParentMenu)"
                  >
                    Shop All
                  </div>
                </div>
              </a-collapse-panel>
            </a-collapse>
            <div v-if="currentParentMenu?.others?.length" class="-mb-[12px] mt-[10px]">
              <div
                v-for="extra in currentParentMenu?.others"
                :key="extra.name"
                class="font-400 style-normal mb-10 text-lg leading-[16px] first:pt-5"
                @click="gotoProductByCategorySpecial(extra.path)"
              >
                {{ extra.name }}
              </div>
            </div>
          </div>
          <div>
            <a-divider class="!mb-[30px] !mt-[20px]"></a-divider>
          </div>
          <div>
            <div
              v-for="otherMenu in specialMenusLowerCase"
              :key="otherMenu.name"
              class="flex cursor-pointer items-center justify-between pb-[40px]"
              @click="gotoProductByCategorySpecial(otherMenu.path)"
            >
              <span class="text-gray-10 text-5 text-xl font-medium capitalize leading-[18px]">{{
                otherMenu.name
              }}</span>
            </div>
          </div>
          <div>
            <div
              v-for="(item, index) in currentParentMenu?.categoryMenuBanners"
              :key="index"
              class="wrap mb-[25px] w-full text-left"
            >
              <div class="max-w-full text-left">
                <div
                  v-if="item.displayType?.code === GNB_DISPLAY_TYPE.VERTICAL"
                  class="menu-slide-image relative h-[600px] w-full bg-cover"
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
                  class="flex w-full flex-col justify-between gap-5"
                  @click="gotoLinkedPage(item)"
                >
                  <div
                    class="menu-slide-image h-[260px] w-full"
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
            </div>
          </div>

          <div v-if="!currentAuthUser" class="flex flex-grow items-end justify-center py-4">
            <div
              class="w-full cursor-pointer text-center"
              @click="gotoAuthPage(AppRoutes.login, false)"
            >
              <user-sign-in-icon />
              <span class="text-[14px] font-normal">Sign In</span>
            </div>
            <a-divider type="vertical" class="bg-gray-3"></a-divider>
            <div
              class="w-full cursor-pointer text-center"
              @click="gotoAuthPage(AppRoutes.register.onBoarding, false)"
            >
              <user-sign-up-icon />
              <span class="text-[14px] font-normal">Sign Up</span>
            </div>
          </div>
          <div v-else class="flex flex-grow items-end justify-between gap-4 py-4">
            <span
              class="text-truncate text-gray-10 whitespace-nowrap text-xl font-medium leading-[18px]"
            >
              {{ getFullName }}
            </span>

            <span
              class="cursor-pointer whitespace-nowrap text-[14px] font-normal underline"
              @click="gotoAuthPage(AppRoutes.myPage.path, true)"
            >
              My Page
            </span>
          </div>
        </div>
      </Transition>
      <!-- End child menu -->
    </div>
  </div>
</template>
<script setup>
import DownLinkIcon from '@assets/svgs/menu-down-link.svg'
import LeftLinkIcon from '@assets/svgs/menu-left-link.svg'
import RightLinkIcon from '@assets/svgs/menu-right-link.svg'
import UpLinkIcon from '@assets/svgs/menu-up-link.svg'
import UserSignInIcon from '@assets/svgs/user-signin.svg'
import UserSignUpIcon from '@assets/svgs/user-signup.svg'
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { storeToRefs } from 'pinia'
import { useMenuStore } from '@/stores/modules/menu'
import { HTTPS_LINK } from '@/helpers/regex'
import { getFullName } from '@/utils/auth'
import { useCmsStore } from '@/stores/modules/cms'
import { MenuType, ExploreRimanNameEnum, GNB_DISPLAY_TYPE } from '@/helpers/enum'
import { handleStyleFontColor } from '@/utils/common'
import { addPrefixForImageNew, addPrefixForImage } from '@/utils/common'

const route = useRoute()
const authUserStore = useAuthUserStore()
const menuStore = useMenuStore()
const { currentAuthUser } = storeToRefs(authUserStore)
const { currentMenus, specialMenus } = storeToRefs(menuStore)
const { gnbBannerList } = storeToRefs(useCmsStore())

const currentMenusLowercase = computed(
  () =>
    currentMenus.value?.map((item) => ({
      ...item,
      name: item?.name?.toLowerCase()
    })) ?? []
)

const specialMenusLowerCase = computed(
  () =>
    specialMenus.value?.map((item) => ({
      ...item,
      name: item?.name?.toLowerCase()
    })) ?? []
)

const eventEmits = defineEmits(['toggleNavigation'])
const router = useRouter()
const activeKey = ref([])
const currentParentMenu = ref()
const showMenuDetail = ref(false)

const isShowShopAll = (currentParent) => {
  return !currentParent.toLowerCase().includes(ExploreRimanNameEnum.EXPLORE_RIMAN)
}

const handleShowMenuDetail = (menu) => {
  if (menu.children?.length) {
    const child = menu?.children?.length ? menu.children.filter((el) => el?.children?.length) : []
    currentParentMenu.value = { ...menu, children: child }
    showMenuDetail.value = true
    const banners = gnbBannerList.value.filter((item) => item.subtypeId === menu.categoryId)
    currentParentMenu.value.categoryMenuBanners = banners.slice(0, 2)
  } else {
    eventEmits('toggleNavigation')
    if (menu.isExternal && menu.path) return router.push({ path: menu.path })
    return router.push({
      name: AppRoutes.product.productCategory.name,
      params: { category: menu.path }
    })
  }
}

const backToMainMenu = () => {
  showMenuDetail.value = false
}

const gotoAuthPage = (path, isLoggedIn = false) => {
  eventEmits('toggleNavigation')
  if (!isLoggedIn) {
    const referrerCode = route.query?.referrerCode || ''
    if (referrerCode) path.query = { referrerCode }
    router.push(path)
  } else {
    router.push(path)
  }
}

const gotoProductByCategory = (menu, hasLevel) => {
  eventEmits('toggleNavigation')
  if (menu.isExternal && menu.path) return router.push({ path: menu.path })
  if (menu.categoryType.code === MenuType.RITUAL) {
    return router.push({ name: AppRoutes.product.ritual.name, params: { category: menu.path } })
  }
  if (hasLevel) {
    return router.push({
      name: AppRoutes.product.productCategory.name,
      params: { category: menu.path }
    })
  }
  return router.push({
    name: AppRoutes.product.productCategory.name,
    params: { category: menu.path }
  })
}

const gotoProductByCategorySpecial = (path) => {
  eventEmits('toggleNavigation')
  return router.push({
    name: AppRoutes.product.productCategory.name,
    params: { category: path }
  })
}

const gotoLinkedPage = (item) => {
  if (!item.link) return
  if (HTTPS_LINK.test(item.link)) window.open(item.link)
}
</script>
<style lang="scss" scoped>
.menu-slide-image {
  background-image: url('@assets/images/slide-menu-mobile.webp');
  background-size: cover;
  background-position: center;
}

.custom-toggle-child-menu {
  :deep(.ant-collapse-header) {
    @apply text-gray-10 font-400 px-0 py-5 text-lg leading-[16px];
    padding-left: 0 !important;
  }

  .ant-collapse-item-active {
    :deep(.ant-collapse-header) {
      @apply text-gray-10 font-600 px-0 text-lg leading-[16px];
      padding-left: 0 !important;
    }
  }

  :deep(.ant-collapse-content-box) {
    padding: 0 !important;
  }
}

:deep(.carousel__pagination) {
  @apply mt-5 p-0;
}

:deep(.carousel__pagination-button) {
  &::after {
    @apply h-2.5 w-2.5 rounded-full bg-[#A0A0A0];
  }
}

:deep(.carousel__pagination-button--active::after) {
  @apply bg-[#666666];
}
</style>
