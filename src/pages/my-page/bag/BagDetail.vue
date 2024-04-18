<template>
  <div class="-mt-4">
    <p class="bag__title" :class="{ isUnavailable }">{{ state.title }}</p>
    <p class="bag__subtitle" :class="{ isUnavailable }">{{ state.subTitle }}</p>
    <p class="bag__date">{{ formatDateTime(state.updatedAt, FORMAT_DATETIME) }}</p>

    <RButton
      v-if="!isUnavailable"
      title="Share This Bag"
      class="!border-navy-6 !bg-navy-6 md:max-w-97.5 !md:h-15 mb-10 w-full"
      class-title="text-white"
      @click="onShareBag"
    />

    <div class="flex gap-2">
      <BagButton v-if="!isUnavailable" text="Preview" icon="preview" @click="onPreview" />
      <BagButton text="Delete" icon="delete" @click="onDelete" />
    </div>

    <a-divider class="!bg-gray-10 !md:mb-10" />

    <div v-if="hasProduct" class="mb-10 flex flex-col gap-10">
      <BagDetailItem v-for="item in state.productBag" :key="item.productId" :item="item" />
    </div>

    <div v-else class="py-10 text-center">No Data</div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { formatDateTime } from '@/utils/datetime'
import { FORMAT_DATETIME } from '@/helpers/constant'
import { useAlertConfirm } from '@/composables/alert'
import { useNotification } from '@/composables/notification'
import { AppRoutes } from '@/router/path'
import { PRODUCT_STATUS_ENUM } from '@/helpers/enum'

const route = useRoute()
const router = useRouter()
const { showNotification } = useNotification()
const { showGlobalLoading } = useGlobalLoadingStore()
const state = reactive({})

onBeforeMount(() => {
  getBag()
})

const hasProduct = computed(() => state.productBag && state.productBag?.length)
const bagStatus = computed(() => {
  const result = {
    hasUnavailable: false,
    hasOutOfStock: false
  }

  if (!hasProduct.value) return result

  state.productBag.forEach((p) => {
    const productStatus = p.optionSalesStatus?.code ?? p.salesStatus?.code
    if (!productStatus) return
    if (productStatus === PRODUCT_STATUS_ENUM.PAUSE) result.hasUnavailable = true
    if (productStatus === PRODUCT_STATUS_ENUM.SOLD_OUT) result.hasOutOfStock = true
  })

  return result
})

const isUnavailable = computed(() => bagStatus.value.hasUnavailable)

const getBag = async () => {
  const bagId = route.params.id
  showGlobalLoading(true)
  const { data, success } = await apiService.bagService.getBagDetail(bagId)
  showGlobalLoading(false)
  Object.assign(state, success ? data : {})
}

const onShareBag = () => {
  navigator.clipboard.writeText(state.shortUrl)
  showNotification({
    type: 'success',
    message: 'Bag’s link has been copied.'
  })
}

const onPreview = () => {
  const routeData = router.resolve({
    name: AppRoutes.bag.preview.name,
    params: {
      id: state.bagId
    }
  })
  window.open(routeData.href, '_blank')
}

const onDelete = async () => {
  const confirm = await useAlertConfirm({
    content: 'Are you sure you want to remove this bag?',
    okText: 'Remove',
    cancelText: 'Cancel'
  })

  if (!confirm) return
  const { success } = await apiService.bagService.deleteBag(state.bagId)
  showNotification({
    type: success ? 'success' : 'error',
    message: success ? 'Bag have been deleted' : 'Delete bag failed'
  })

  router.push({ name: AppRoutes.myPage.bagManagement.list.name })
}
</script>

<style lang="scss" scoped>
.bag {
  &__banner {
    @apply h-[375px] w-full object-cover;
  }

  &__profile {
    @apply w-22.5 h-22.5 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-pointer rounded-full object-cover;
  }

  &__title {
    @apply font-475 mb-5 break-words text-base leading-[22px];
    @apply md:text-10 md:leading-base md:font-medium;
  }

  &__subtitle {
    @apply leading-base mb-5 whitespace-pre-line break-words text-xs;
    @apply md:text-lg;
  }

  &__date {
    @apply leading-base text-gray-14 mb-10 text-xs;
    @apply md:text-sm;
  }

  &__product-item:not(:last-child) {
    @apply border-b-solid border-b-gray-11 border-b-1;
  }
}

.isUnavailable {
  @apply text-gray-14;
}
</style>
