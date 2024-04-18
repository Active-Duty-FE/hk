<template>
  <div class="bag">
    <div class="flex w-[calc(100%-70px)] items-center gap-3">
      <RCheckbox v-model:checked="checked" />
      <div class="flex w-full flex-col">
        <span v-if="statusBag" class="bag__status">{{ statusBag }}</span>
        <span class="bag__title" :class="{ UNAVAILABLE: isUnavailable }" @click="goToDetail">{{
          item.title
        }}</span>
        <span class="bag__datetime" :class="{ UNAVAILABLE: isUnavailable }">{{
          formatDateTime(item.updatedAt, FORMAT_DATETIME)
        }}</span>
      </div>
    </div>

    <div class="actionBtn" @click="onAction">
      <BagButton v-if="statusBag" text="Delete" icon="delete" />
      <BagButton v-else text="Share" icon="share" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useVModels } from '@vueuse/core'
import { computed } from 'vue'
import { formatDateTime } from '@/utils/datetime'
import { FORMAT_DATETIME } from '@/helpers/constant'
import { BAG_STATUS } from '@/helpers/enum'
import { useNotification } from '@/composables/notification'
import { useAlertConfirm } from '@/composables/alert'
import { AppRoutes } from '@/router/path'
import apiService from '@/http/api'

const { showNotification } = useNotification()

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  checked: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['update:checked', 'deleted'])
const router = useRouter()
const { checked } = useVModels(props, emits)

const statusBag = computed(() => BAG_STATUS[props.item.bagStatus])

const isUnavailable = computed(() => statusBag.value === BAG_STATUS.CAN_NOT_BE_USED)

const goToDetail = () => {
  router.push({
    name: AppRoutes.myPage.bagManagement.detail.name,
    params: {
      id: props.item.bagId
    }
  })
}

const onAction = async () => {
  // Delete Bag
  if (statusBag.value) {
    const confirm = await useAlertConfirm({
      content: 'Are you sure you want to remove this bag?',
      okText: 'Remove',
      cancelText: 'Cancel'
    })

    if (!confirm) return
    const { success } = await apiService.bagService.deleteBag(props.item.bagId)
    showNotification({
      type: success ? 'success' : 'error',
      message: success ? 'Delete bag successfully' : 'Delete bag failed'
    })

    emits('deleted')
    return
  }

  // Share Bag
  await navigator.clipboard.writeText(props.item.shortUrl)
  showNotification({
    type: 'success',
    message: 'Bag’s link has been copied.'
  })
}
</script>

<style lang="scss" scoped>
.bag {
  @apply flex items-center justify-between py-5 md:py-7;
  @apply border-b-1 border-b-gray-11 border-b-solid;

  &__status {
    @apply bg-navy-6 leading-base mb-1.5 inline-flex h-4 w-fit items-center justify-center rounded-[3px] p-1 text-xs font-light text-white;
  }

  &__title {
    @apply text-truncate font-475 leading-base mb-1 w-[calc(100%-30px)] cursor-pointer text-sm;
    @apply md:text-lg;

    &.UNAVAILABLE {
      @apply text-gray-13;
    }
  }

  &__datetime {
    @apply leading-base text-xs text-[#666] md:text-sm;

    &.UNAVAILABLE {
      @apply text-gray-13;
    }
  }
}
</style>
