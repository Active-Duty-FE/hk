<template>
  <div>
    <p class="notice-type">{{ notice.displayCategory?.text }}</p>

    <p class="notice-title">{{ notice.displayTitle }}</p>
    <p class="notice-date">{{ formatDateTime(notice.createDateTime, FORMAT_USER_DISPLAY) }}</p>

    <div class="flex items-center justify-center gap-2.5 pt-4">
      <img
        src="@/assets/svgs/share/icon-facebook.svg?url"
        alt=""
        class="cursor-pointer"
        @click="shareFacebook"
      />
      <img
        src="@/assets/svgs/share/icon-twitter.svg?url"
        alt=""
        class="cursor-pointer"
        @click="shareTwitter"
      />
      <img
        src="@/assets/svgs/share/icon-mail.svg?url"
        alt=""
        class="cursor-pointer"
        @click="copyLink"
      />
    </div>

    <a-divider class="!border-gray-black !my-10" />

    <p v-clean-html="notice.description" class="notice-description" />

    <p class="font-550 leading-5.5 mb-5 mt-10 text-base">Attach files</p>

    <div v-if="notice.policyAttachResponseList?.length" class="notice-files">
      <div v-for="file in notice.policyAttachResponseList" :key="file.id" class="notice-file">
        <span class="text-truncate leading-base font-475 text-sm">{{ file.attachName }}</span>
        <img
          src="@/assets/svgs/icon-download.svg?url"
          alt=""
          class="cursor-pointer"
          @click="useDownloadFileS3(file.attachUrl, file.attachName)"
        />
      </div>
    </div>

    <RButton
      class="!bg-navy-6 mt-17.5 mx-auto w-full !border-none md:w-[335px]"
      title="List"
      class-title="text-white"
      @click="gotoNoticeList"
    />
  </div>
</template>

<script setup>
import { computed, onBeforeMount, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { useDownloadFileS3 } from '@/composables/download'
import { AppRoutes } from '@/router/path'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { formatDateTime } from '@/utils/datetime'
import { FORMAT_USER_DISPLAY } from '@/helpers/constant'
import { useNotification } from '@/composables/notification'

const { showNotification } = useNotification()
const { showGlobalLoading } = useGlobalLoadingStore()
const vCleanHtml = buildVueDompurifyHTMLDirective({
  default: {
    ADD_TAGS: ['iframe']
  }
})
const router = useRouter()
const route = useRoute()
const noticeId = route.params.id

const state = reactive({
  notice: {}
})

const { notice } = toRefs(state)

onBeforeMount(() => {
  getNoticeDetail()
})

const getNoticeDetail = async () => {
  showGlobalLoading(true)
  const { data, success } = await apiService.etcService.getNoticeDetail(noticeId)

  state.notice = success ? data : {}
  showGlobalLoading(false)
}

const gotoNoticeList = () => {
  router.push({ name: AppRoutes.myPage.notice.list.name })
}

const linkShare = computed(() => window.location.href)

const shareFacebook = () => {
  const link = `https://www.facebook.com/sharer/sharer.php?u=${linkShare.value}`
  window.open(link, '_blank')
}

const shareTwitter = () => {
  const link = `https://twitter.com/intent/tweet?url=${linkShare.value}&text=${state.notice.displayTitle}`
  window.open(link, '_blank')
}

const copyLink = () => {
  navigator.clipboard.writeText(linkShare.value)
  showNotification({
    description: 'Link is copied!',
    placement: 'topRight',
    type: 'success'
  })
}
</script>

<style lang="scss" scoped>
.notice {
  &-type {
    @apply text-navy-6 font-475 leading-5.5 mb-5 text-center text-base;
  }

  &-title {
    @apply leading-base font-550 mb-6 text-center text-[28px];
  }

  &-date {
    @apply leading-base text-gray-14 text-center text-sm -tracking-[0.28px];
  }

  &-description {
    @apply whitespace-pre-wrap break-words;

    :deep(figure) {
      &.table,
      &.image {
        display: table;
        margin: 0.9em auto;
      }
    }
  }

  &-files {
    @apply border-1 border-gray-black border-l-0 border-r-0 border-solid;
  }

  &-file {
    @apply flex items-center justify-between gap-5 py-5;

    &:not(:first-child) {
      @apply border-t-1 border-t-solid border-gray-black;
    }
  }
}
</style>
