<template>
  <div class="relative flex items-center gap-[10px]" :class="{ 'pb-4': isHome }">
    <img width="42" :src="getImageForNotify()" alt="image content" />
    <div class="cursor-pointer" @click="viewNotification">
      <span v-clean-html="info.body[0]" class="content-notify whitespace-pre-wrap"></span>
    </div>
    <span v-if="!isHome" class="absolute right-0 top-0 z-[2] cursor-pointer" @click="deleteItem">
      <CloseIcon />
    </span>
  </div>
  <div v-if="!isHome" class="text-gray-10 text-right text-[12px] font-normal">
    {{ formatDateTime(info.createdDatetime, FORMAT_DATETIME) }}
  </div>
</template>
<script setup>
import CloseIcon from '@/assets/svgs/pin-close.svg'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { useMutation } from 'vue-query'
import apiService from '@/http/api'
import ImageCoupon from '@/assets/images/concierge-coupon.webp'
import ImageNote from '@/assets/images/note-note.png'
import ImageInquiry from '@/assets/images/one-one.png'
import { NotifyEnum } from '@/helpers/enum'
import { formatDateTime } from '@/utils/datetime'
import { FORMAT_DATETIME } from '@/helpers/constant'

const vCleanHtml = buildVueDompurifyHTMLDirective()
const emits = defineEmits(['delete'])
const props = defineProps({
  isHome: {
    type: Boolean,
    default: true
  },
  info: {
    type: Object,
    default: () => ({})
  }
})

const getImageForNotify = () => {
  switch (props.info.type) {
    case NotifyEnum.COUPON:
      return ImageCoupon
    case NotifyEnum.INQUIRY:
      return ImageInquiry
    case NotifyEnum.NOTICE:
      return ImageNote
    default:
      return ImageCoupon
  }
}

const { mutate: readNotification } = useMutation('read-notify', () =>
  apiService.conciergeService.readNotification(props.info.notificationId)
)

const deleteItem = () => emits('delete', props.info?.notificationId)

const viewNotification = () => {
  readNotification()
}
</script>
<styler lang="scss" scoped>
.content-notify {
  p,
  span,
  a {
    @apply mb-0;
  }
  a {
    @apply text-navy-6 font-475 underline;
    &:hover {
      @apply text-navy-6 underline;
    }
  }
}
</styler>
