<template>
  <a-modal
    v-if="isShowModal"
    v-model:visible="isShowModal"
    centered
    wrap-class-name="connectingPopup"
    :footer="false"
    :closable="false"
    :width="592"
  >
    <div class="relative flex h-full flex-col items-center md:h-[460px]">
      <CloseIcon class="absolute right-0 top-0 cursor-pointer" @click="handleClose" />
      <p class="mt-9 text-[18px] font-medium leading-none md:mt-[46px] md:text-[24px]">
        Accessed {{ defaultCountry }} Website
      </p>
      <p
        class="mt-5 w-[240px] text-center text-[12px] leading-5 md:mt-[30px] md:w-[320px] md:text-[16px]"
      >
        Looks like you are trying to access Riman.com({{ defaultCountry }}) from another country.
        <br />
        If this is incorrect, please select your market or continue in {{ defaultCountry }} website.
      </p>
      <div class="flags mt-1 flex grid grid-cols-2 items-center gap-x-[20px] md:mt-[30px]">
        <div v-for="item in options" :key="item.text" @click="setCountry(item)">
          <div class="hover:cursor-pointer">
            <div>
              <img
                :src="item.url"
                :alt="item.value"
                class="w-[102px] p-3 md:w-[132px]"
                :class="item.value === selectedCountry ? 'rounded-full bg-gray-200 p-3' : ''"
              />
            </div>

            <p class="mt-1 text-center text-[14px] leading-none md:text-[16px]">{{ item.text }}</p>
          </div>
        </div>
      </div>
      <div class="w-full !bg-black px-0 md:px-9">
        <button
          class="mx-15 button-connect mx-auto mt-10 w-full cursor-pointer border-none py-[15px] text-[14px] leading-none text-white"
          @click="handleUpdateCountry"
        >
          Continue
        </button>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import CloseIcon from '@assets/svgs/close.svg'
import storage from '@/utils/storage'
import { STORAGE_IP_ADDRESS, OPTIONS_GLOBE, TW_PAGE_URL } from '@/helpers/constant'
import { CountryEnum } from '@/helpers/enum'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
const loadingStore = useGlobalLoadingStore()

const { showGlobalLoading } = loadingStore
const hasStorage = storage.get(STORAGE_IP_ADDRESS, 'localStorage')
const flagDefault = hasStorage || CountryEnum.US.value
const options = ref([...OPTIONS_GLOBE].filter((item) => item.value !== flagDefault))
const selectedCountry = ref(storage.get(STORAGE_IP_ADDRESS, 'localStorage') ?? CountryEnum.US.value)
const isShowModal = ref(false)
const defaultCountry = ref()

const setCountry = (item) => {
  selectedCountry.value = item.value
}

const handleUpdateCountry = () => {
  if (selectedCountry.value === OPTIONS_GLOBE[2].value) {
    window.open(`${TW_PAGE_URL}`, '_blank')
  } else {
    storage.set(STORAGE_IP_ADDRESS, selectedCountry.value, 'localStorage')
    showGlobalLoading(true)
    setTimeout(() => {
      showGlobalLoading(false)
      isShowModal.value = false
    }, 1000)
  }
}

const handleClose = () => {
  isShowModal.value = false
}

onMounted(() => {
  if (hasStorage) return
  isShowModal.value = true
  defaultCountry.value = storage.get(STORAGE_IP_ADDRESS, 'localStorage') ?? CountryEnum.US.value
})
</script>
<style lang="scss" scoped>
p {
  margin-bottom: 0;
}
:deep(.button-connect) {
  background: #063451;
}
</style>
