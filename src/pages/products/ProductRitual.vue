<template>
  <div>
    <div class="hidden md:block">
      <RitualPC :data="pageState.dataRituals" />
    </div>
    <div class="block md:hidden">
      <RitualMobile :data="pageState.dataRituals" />
    </div>
  </div>
</template>

<script setup>
import { CountryEnum } from '@/helpers/enum'
import { countryLocalStorage } from '@/utils/common'
import { computed, watch, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import apiService from '@/http/api'
import storage from '@/utils/storage'
import { STORAGE_ACCESS_TOKEN } from '@/helpers/constant'
import { getSaveTokenStorage } from '@/utils/auth'

const isCanada = computed(() => countryLocalStorage === CountryEnum.CA.value)
const storeLoading = useGlobalLoadingStore()
const { showGlobalLoading } = storeLoading

const route = useRoute()
const pageState = reactive({
  dataRituals: {}
})

const getDataRituals = async () => {
  const params = {
    country: isCanada.value ? CountryEnum.CA.value : CountryEnum.US.value
  }
  try {
    showGlobalLoading(true)
    const response = storage.get(STORAGE_ACCESS_TOKEN, getSaveTokenStorage())
      ? await apiService.productService.getProductCategories(route.params.category, params)
      : await apiService.productService.getProductPublicCategories(route.params.category, params)
    if (response.success) {
      pageState.dataRituals = response.data
    }
  } finally {
    showGlobalLoading(false)
  }
}

watch(
  () => route.params.category,
  (value) => {
    if (value) getDataRituals()
  },
  {
    immediate: true
  }
)
</script>
