<template>
  <div class="text-black-50">
    <div class="flex items-center gap-[10px]">
      <img :src="handleRenderAvatarCustomer" alt="avatar" class="aspect-square w-10 rounded-full" />
      <div>
        <div class="font-550 mb-2.5 text-lg leading-[22px]">{{ getFullName }}</div>
        <div class="text-xs">
          Since {{ formatDateTime(currentAuthUser.joinDatetime, FORMAT_FULL_YEAR_USE_DOT) }}
        </div>
      </div>
    </div>

    <div class="max-h-[400px] overflow-auto md:max-h-[500px]">
      <a-row class="border-t-solid border-gray-14 mt-4 border-[1px] text-sm">
        <a-col :span="8" class="border-r-solid border-gray-11 border-[1px] py-[15px] text-center">
          Rank
        </a-col>
        <a-col :span="16" class="col-custom py-[15px] text-center"> Achievement Criteria </a-col>
      </a-row>
      <div v-for="(item, index) in DETAIL_VIEW_LEVEL" :key="item.id">
        <a-row
          class="border-t-solid border-gray-11 border-[1px] text-xs"
          :class="[
            { 'border-b-solid !border-b-gray-14': index === DETAIL_VIEW_LEVEL.length - 1 },
            { 'bg-navy-1 rounded-[5px] !text-white': checkLevelActive(item.id) }
          ]"
        >
          <a-col
            :span="8"
            class="border-r-solid border-gray-11 border-[1px] py-[15px]"
            :class="{ '!border-gray-14': checkLevelActive(item.id) }"
          >
            <div class="flex h-full w-full items-center justify-center">
              {{ item.title }}
            </div>
          </a-col>
          <a-col :span="16" class="col-custom px-3 py-[15px]">
            <div class="font-475 mb-[10px]">{{ item.headingFirst }}</div>
            <div v-clean-html="item.firstContent" class="mb-2" />

            <span
              v-clean-html="item.subFirstContent"
              class="text-navy-6"
              :class="{ '!text-navy-3': checkLevelActive(item.id) }"
            />
            <div class="font-475 mb-[10px] mt-4">{{ item.headingSecond }}</div>
            <div v-clean-html="item.secondContent" class="mb-2" />

            <span
              v-clean-html="item.subSecondContent"
              class="text-navy-6"
              :class="{ '!text-navy-3': checkLevelActive(item.id) }"
            />
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="mb-[50px] mt-[30px] flex flex-col gap-[15px]">
      <r-line-notice
        content="All BPs are calculated after the discounts are applied and Reward Points are used."
      />
      <r-line-notice content="Please go to the RBO site for more information." />
    </div>
    <a-divider class="bg-gray-14" />
    <div class="flex cursor-pointer items-center justify-between" @click="transitToRbo">
      <div>RBO (Riman Business Office)</div>
      <ArrowRight />
    </div>
    <a-divider class="bg-gray-14" />
  </div>
</template>
<script setup>
import { formatDateTime } from '@/utils/datetime'
import { FORMAT_FULL_YEAR_USE_DOT, DETAIL_VIEW_LEVEL } from '@/helpers/constant'

import { getFullName, handleRenderAvatarCustomer } from '@/utils/auth'
import { useRouter } from 'vue-router'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { storeToRefs } from 'pinia'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import ArrowRight from '@/assets/svgs/calendar/arrow-right.svg'
import apiService from '@/http/api'

const vCleanHtml = buildVueDompurifyHTMLDirective()

const authUserStore = useAuthUserStore()

const { currentAuthUser } = storeToRefs(authUserStore)
const router = useRouter()

const checkLevelActive = (id) => {
  return currentAuthUser.value?.rank?.code === id
}

const transitToRbo = () => {
  apiService.myPageService.rboSelfLogin()
}
</script>
