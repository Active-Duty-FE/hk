<template>
  <div>
    <p class="archive-title break-words">{{ archive.displayTitle }}</p>
    <p class="archive-date">{{ formatDateTime(archive.createDateTime, FORMAT_USER_DISPLAY) }}</p>

    <a-divider class="!border-gray-black !my-10" />

    <p v-clean-html="archive.description" class="archive-description" />

    <p class="font-550 leading-5.5 mb-5 mt-10 text-base">Attach files</p>

    <div v-if="archive.policyAttachResponseList?.length" class="archive-files">
      <div v-for="file in archive.policyAttachResponseList" :key="file?.id" class="archive-file">
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
      class="!bg-navy-6 my-17.5 mx-auto w-full !border-none md:w-[335px]"
      title="List"
      class-title="text-white"
      @click="gotoArchiveList"
    />
  </div>
</template>

<script setup>
import { onBeforeMount, reactive, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { useDownloadFileS3 } from '@/composables/download'
import { AppRoutes } from '@/router/path'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { formatDateTime } from '@/utils/datetime'
import { FORMAT_USER_DISPLAY } from '@/helpers/constant'

const { showGlobalLoading } = useGlobalLoadingStore()

const vCleanHtml = buildVueDompurifyHTMLDirective({
  default: {
    ADD_TAGS: ['iframe']
  }
})
const router = useRouter()
const route = useRoute()
const archiveId = route.params.id

const state = reactive({
  archive: {}
})

const { archive } = toRefs(state)

onBeforeMount(() => {
  getarchiveDetail()
})

const getarchiveDetail = async () => {
  showGlobalLoading(true)
  try {
    showGlobalLoading(true)
    const { data, success } = await apiService.etcService.getArchiveDetail(archiveId)
    if (!success) return
    state.archive = data
  } finally {
    showGlobalLoading(false)
  }
  showGlobalLoading(false)
}

const gotoArchiveList = () => {
  router.push({ name: AppRoutes.myPage.archive.list.name })
}
</script>

<style lang="scss" scoped>
.archive {
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
