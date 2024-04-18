<template>
  <div
    class="z-21 border-b-1 border-b-solid border-b-navy-02 fixed top-0 flex h-[55px] w-full items-center justify-between bg-white px-5"
    :class="[{ '!top-[30px] ': !showMobileNav && isShowBannerWelcomeData() }]"
  >
    <div>
      <Logo
        class="text-navy-deep text-navy-deep cursor-pointer"
        :class="{
          'text-navy-deep': !isShowHeaderWhite && showMobileNav,
          'group-hover:text-navy-deep': isShowHeaderWhite && !showMobileNav
        }"
        @click="router.push('/')"
      />
    </div>
    <div class="text-navy-deep flex items-center">
      <span
        v-if="currentAuthUser"
        class="inline-block flex !hidden cursor-pointer items-center pr-[13px]"
      >
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
      </span>
      <span class="text-navy-deep relative mx-[13px] inline-block flex cursor-pointer items-center">
        <img
          :src="countryLocalStorage === CountryEnum.CA.value ? Canada : USA"
          alt="usa"
          class="h-5 w-5 outline-none"
          :class="{
            'text-navy-deep': !isShowHeaderWhite && showMobileNav,
            'group-hover:text-navy-deep': isShowHeaderWhite && !showMobileNav
          }"
          @click="
            () => {
              showGlobe = !showGlobe
              if (showGlobe) showSearchBar = false
            }
          "
        />
        <SelectCountry :show-globe="showGlobe" @set-show-globe="setShowGlobe" />
      </span>
      <span class="mx-[13px] inline-block flex cursor-pointer items-center">
        <SearchIcon
          :class="{
            'text-navy-deep': !isShowHeaderWhite && showMobileNav,
            'group-hover:text-navy-deep': isShowHeaderWhite && !showMobileNav
          }"
          @click="
            () => {
              showSearchBar = !showSearchBar
              if (showSearchBar) showGlobe = false
            }
          "
        />
        <Transition name="slide" mode="in-out">
          <search-bar v-if="showSearchBar" class="top-[40px]" @on-search="onSearch" />
        </Transition>
      </span>
      <span
        v-if="!isLoginPage"
        class="relative ml-[13px] inline-block flex cursor-pointer items-center pr-[26px]"
        :class="{
          'text-navy-deep': !isShowHeaderWhite && showMobileNav,
          'group-hover:text-navy-deep': isShowHeaderWhite && !showMobileNav
        }"
        @click="gotoCart"
      >
        <CartIcon />
        <span class="absolute -top-[7px] right-[15px] text-[10px] font-[475px]">
          ({{ convertCartADisplay(totalCartBadge) }})
        </span>
      </span>
      <span class="inline-block flex cursor-pointer items-center" @click="toggleSideNavigation">
        <MenuIcon
          v-if="!showMobileNav"
          :class="{
            'text-navy-deep': !isShowHeaderWhite && showMobileNav,
            'group-hover:text-navy-deep': isShowHeaderWhite && !showMobileNav
          }"
        />
        <CloseIcon v-else />
      </span>
    </div>
    <RModalConfirm
      v-model:visible="pageState.showModalError"
      :description="AUTH_REQUIRED.notAuth"
      text-ok="Login"
      text-cancel="Later"
      :width="350"
      :mask-closable="false"
      @ok="router.push(AppRoutes.login)"
      @cancel="pageState.showModalError = false"
    />
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import SelectCountry from '@/components/home/SelectCountry.vue'
import { AUTH_REQUIRED } from '@/helpers/validate-message'
import { AppRoutes } from '@/router/path'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { useCartStore } from '@/stores/modules/cart'
import { useMemberBannerStore } from '@/stores/modules/member-banner'
import { convertCartADisplay, countryLocalStorage } from '@/utils/common'
import CartIcon from '@assets/icons/CartIcon.vue'
import Logo from '@assets/icons/Logo.vue'
import MenuIcon from '@assets/icons/MenuIcon.vue'
import SearchIcon from '@assets/icons/SearchIcon.vue'
import CloseIcon from '@assets/svgs/close.svg'
import ShareTopIcon from '@assets/svgs/share-icon.svg'
import ShareIcon from '@assets/svgs/share.svg'
import TwitterIcon from '@assets/svgs/twitter.svg'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import Canada from '@assets/svgs/country/canada.svg?url'
import USA from '@assets/svgs/country/usa.svg?url'
import { CountryEnum } from '@/helpers/enum'

const { isShowBannerWelcome } = storeToRefs(useMemberBannerStore())

const cartStore = useCartStore()
const authUserStore = useAuthUserStore()

const { currentAuthUser } = storeToRefs(authUserStore)
const { totalCartBadge } = storeToRefs(cartStore)
const router = useRouter()
const route = useRoute()

const isShowBannerWelcomeData = () =>
  isShowBannerWelcome.value && !route.fullPath.includes(AppRoutes.register.path)

defineProps({
  showMobileNav: {
    type: Boolean,
    default: false,
    required: false
  }
})

const pageState = reactive({
  showModalError: false
})

const isLoginPage = computed(() => route.name === AppRoutes.login.name)

const showSearchBar = ref(false)
const showGlobe = ref(false)

const setShowGlobe = () => {
  showGlobe.value = !showGlobe.value
}

const eventScroll = () => {
  showGlobe.value = false
  showSearchBar.value = false
}
const isShowHeaderWhite = computed(() => whiteTextHeader.includes(route.name))

const whiteTextHeader = [
  AppRoutes.sustainability.name,
  AppRoutes.blog.name,
  AppRoutes.byoungPoolBusiness.name,
  AppRoutes.events.name
]

const emits = defineEmits(['toggleNavigation'])

const toggleSideNavigation = () => {
  emits('toggleNavigation')
}

const gotoCart = () => {
  if (!currentAuthUser.value) {
    pageState.showModalError = true
  } else {
    router.push(AppRoutes.cart.list)
  }
}

const onSearch = (keySearch) => {
  showSearchBar.value = false
  router.push({ path: AppRoutes.search.path, query: { keySearch } })
}

onMounted(() => {
  window.addEventListener('scroll', eventScroll)
})
watch(
  () => route.name,
  () => {
    showSearchBar.value = false
    showGlobe.value = false
  }
)
</script>
