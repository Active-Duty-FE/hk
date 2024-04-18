<template>
  <div v-if="showGlobe" class="absolute right-1/2 top-10 w-[120px] translate-x-1/2 md:top-[15px]">
    <div v-for="item in options" :key="item.text" class="bg-white">
      <div
        class="flex cursor-pointer gap-1 px-[10px] py-1 hover:bg-gray-100"
        :class="isActive(item) ? 'bg-gray-200' : ''"
        @click="setCountry(item)"
      >
        <img :src="item.url" :alt="item.text" class="h-5 w-5" />
        <p class="mb-0">{{ item.text }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import storage from '@/utils/storage'
import { STORAGE_IP_ADDRESS, OPTIONS_GLOBE } from '@/helpers/constant'
import { TW_PAGE_URL } from '@/helpers/constant'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { CountryEnum } from '@/helpers/enum'

const loadingStore = useGlobalLoadingStore()
const { showGlobalLoading } = loadingStore

const options = [...OPTIONS_GLOBE]

defineProps({
  showGlobe: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['setShowGlobe'])

const isActive = (item) => {
  const hasStorage = storage.get(STORAGE_IP_ADDRESS, 'localStorage')
  if (hasStorage) {
    return item.value === hasStorage
  } else {
    return item.value === CountryEnum.US.value
  }
}

const setCountry = (item) => {
  if (item.value === OPTIONS_GLOBE[2].value) {
    window.open(`${TW_PAGE_URL}`, '_blank')
  } else {
    storage.set(STORAGE_IP_ADDRESS, item.value, 'localStorage')
    showGlobalLoading(true)
    setTimeout(() => {
      showGlobalLoading(false)
    }, 1000)
    window.location.reload()
  }
  emit('setShowGlobe')
}
</script>
