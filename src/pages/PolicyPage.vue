<template>
  <div
    class="text-black-50 mx-auto flex flex-col items-center justify-center px-5 py-[50px] md:max-w-[50%] md:px-20"
  >
    <h1 class="font-550 mb-10 text-center text-[28px] leading-7">Return Policy</h1>
    <div v-clean-html="dataPolicy?.contents" class="text-base leading-[22px]" />
    <p class="mb-0 w-full text-start text-xs">
      Update : {{ formatDateTime(dataPolicy.exposureStartDate, FORMAT_FULL_YEAR_USE_DOT) }}
    </p>
  </div>
</template>
<script setup>
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { formatDateTime } from '@/utils/datetime'
import { FORMAT_FULL_YEAR_USE_DOT, TERMS_TYPE, TERMS_USE_TYPE } from '@/helpers/constant'
import { useMutation } from 'vue-query'
import apiService from '@/http/api'
import { onMounted, reactive } from 'vue'
import { useGlobalLoadingStore } from '@/stores/modules/loading'

const store = useGlobalLoadingStore()

const { showGlobalLoading } = store
const vCleanHtml = buildVueDompurifyHTMLDirective()
const dataPolicy = reactive({})

const { mutate: mutationGetShipping } = useMutation(
  async (params) => {
    showGlobalLoading(true)
    return await apiService.authService.getTermsFooterPolicy(params)
  },
  {
    onSuccess: (response) => {
      showGlobalLoading(false)
      if (response.success) Object.assign(dataPolicy, response.data)
    }
  }
)

onMounted(() => {
  const params = {
    termsType: TERMS_TYPE,
    termsUseType: TERMS_USE_TYPE.RETURN_POLICY
  }
  mutationGetShipping(params)
})
</script>
