<template>
  <div class="xl:mx-[32px]" :class="!isShowBannerWelcome ? 'mt-[55px]' : 'mt-[85px] md:mt-[95px]'">
    <!-- <TheBanner
      :image="addPrefixForImage(dataBanner?.background)"
      :content="dataBanner"
      :is-white="dataBanner?.fontColor"
    /> -->
    <TheBanner
      :image="addPrefixForImage(dataBanner?.background)"
      :content="dataBanner"
      :is-white="dataBanner?.fontColor"
    />
  </div>

  <EventIntroList
    v-if="eventListSection && eventListSection.length"
    :data="eventListSection"
    class="second-section md:py-5"
  />

  <div
    v-if="eventSecondBanner"
    class="my-25 md:my-45 flex flex-col items-center md:mt-[180px] md:justify-center"
  >
    <div class="relative mx-5 md:mx-0 md:h-[350px] md:w-full">
      <img
        :src="addPrefixForImage(eventSecondBanner?.imageUrl)"
        alt="retreat_2"
        class="hidden w-full md:block md:h-[350px]"
      />
      <img
        :src="addPrefixForImage(eventSecondBanner?.imageUrlMobile)"
        alt="retreat_2_mo"
        class="img_retreat_mo md:hidden"
      />
      <div
        class="md:(top-1/2 -translate-1/2 left-1/2) absolute bottom-5 left-5 text-white md:w-full md:max-w-[1200px]"
      >
        <p class="mb-4 text-base uppercase leading-[22px]">{{ eventSecondBanner?.subCopy }}</p>
        <p class="font-550 md:(text-[50px] leading-[50px]) mb-10 text-[40px] leading-[40px]">
          {{ eventSecondBanner?.displayTitle }}
        </p>
        <div
          class="flex cursor-pointer items-center gap-5"
          @click="handleLearnMore(eventSecondBanner?.link)"
        >
          <span class="font-550 text-base uppercase">{{ eventSecondBanner?.buttonText }}</span>
          <ArrowRight class="arrow_icon" />
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-col-reverse pt-6 md:flex-col">
    <div class="md:(flex items-center) flex-col justify-center">
      <RCalendarTitle
        :mode="pageState.currentCalendarMode"
        class="md:(px-0 pt-[0]) container mx-auto max-w-[1200px] px-5 pb-10"
        @view-mode="switchViewMode"
      />
      <RCalendar
        class="container mx-auto max-w-[1200px] px-5 md:px-0"
        :current-month="pageState.currentMonth"
        :current-year="pageState.currentYear"
        :mode="pageState.currentCalendarMode"
        :events="pageState.eventLists"
        @detail="viewScheduleDetail"
        @change="onFetchEvents"
      />
    </div>
  </div>
  <div class="md:(py-unset h-full) my-[70px] flex w-full flex-col items-center justify-center">
    <DiveIn />
  </div>

  <RModalConfirm
    v-model:visible="pageState.showModalSchedule"
    :footer="false"
    mask-closable
    closable
  >
    <template #extraDescription>
      <div class="px-[40px] pb-[10px]">
        <p class="text-gray-10 font-550 style-normal leading-base mb-0 text-[32px]">
          {{ pageState.scheduleDetail?.title }}
        </p>
        <div class="aspect-[1] max-w-[472px] pb-10 pt-[60px]">
          <img
            alt="schedule-image"
            class="w-full"
            src="@/assets/images/explores/events/schedule-1.webp"
          />
        </div>
        <div>
          <div class="font-550 style-normal leading-base pb-[30px] text-left text-[20px]">
            Opportunity Presentation
          </div>
          <div
            class="font-550 style-normal leading-base flex justify-between pb-[20px] text-[20px]"
          >
            <span class="leading-base leading-base font-475 text-[18px]">Date</span>
            <span class="leading-base leading-base font-400 text-[16px]">
              {{ pageState.scheduleDetail?.customTitle }}
            </span>
          </div>
          <div
            class="font-550 style-normal leading-base flex justify-between pb-[20px] text-[20px]"
          >
            <span class="leading-base leading-base font-475 text-[18px]">Time</span>
            <span class="leading-base leading-base font-400 text-[16px]"
            >{{ pageState.scheduleDetail?.startTime }} ~
              {{ pageState.scheduleDetail?.endTime }}</span
            >
          </div>
          <div
            class="font-550 style-normal leading-base flex justify-between pb-[20px] text-[20px]"
          >
            <span class="leading-base leading-base font-475 text-[18px]">Description</span>
            <span class="leading-base leading-base font-400 max-w-[240px] text-[16px]">
              {{ pageState.scheduleDetail.description }}
            </span>
          </div>
        </div>
      </div>
    </template>
  </RModalConfirm>
</template>
<script setup>
import { computed, onMounted, reactive } from 'vue'
import { ScheduleLists } from '@/mocks/event-page'
import { CalendarViewModeEnum } from '@helpers/enum'
import {
  FORMAT_DATE_USE_DOT,
  FORMAT_ONLY_WEEK_DAY,
  FORMAT_SHORT_DAY,
  FORMAT_HOUR_MINUTE,
  FORMAT_MONTH_YEAR,
  FORMAT_SHORT_YEAR_MONTH_DAY,
  EVENT_COLORS_LIST
} from '@/helpers/constant'
import { formatDateTime, checkIfDiffWeek, getDatesWithinRange } from '@/utils/datetime'
import { addPrefixForImage, randomNumber } from '@/utils/common'
import ArrowRight from '@/assets/svgs/arrow-right.svg'

import { useMemberBannerStore } from '@/stores/modules/member-banner'
import { useCmsStore } from '@/stores/modules/cms'
import { storeToRefs } from 'pinia'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
const { getEvent, getEventSnsType } = useCmsStore()

const { eventBanner, eventListSection, eventSecondBanner } = storeToRefs(useCmsStore())

const { isShowBannerWelcome } = useMemberBannerStore()
const { getSnsList } = useCmsStore()

const pageState = reactive({
  showModalSchedule: false,
  currentCalendarMode: CalendarViewModeEnum.GRID,
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  eventLists: [],
  scheduleDetail: undefined
})

const isMobile = computed(() => width.value < 992)
const dataBanner = computed(() => {
  const data = eventBanner.value
  return {
    background: addPrefixForImage(isMobile.value ? data?.imageUrlMobile : data?.imageUrl),
    title: isMobile.value ? data?.titleMobile : data?.titlePc,
    subtitle: isMobile.value ? data?.subTitleMobile : data?.subTitlePc,
    description: data?.description,
    fontColor: data?.fontColor && !isMobile.value
  }
})

const viewScheduleDetail = (schedule) => {
  pageState.scheduleDetail = schedule
  pageState.showModalSchedule = true
}

const switchViewMode = (mode) => {
  pageState.currentCalendarMode = mode
  if (mode === CalendarViewModeEnum.LIST) pageState.eventLists = getEventLists(true)
}

const getEventLists = (isListView) => {
  const items = ScheduleLists.map((schedule) => {
    const days =
      Number(formatDateTime(schedule.endDate, FORMAT_SHORT_DAY)) -
      Number(formatDateTime(schedule.startDate, FORMAT_SHORT_DAY))
    const arrDates = getDatesWithinRange(schedule.startDate, schedule.endDate).dates
    const weekWithDates = getDatesWithinRange(schedule.startDate, schedule.endDate).weekWithDates
    const isDiffWeek = checkIfDiffWeek(schedule.startDate, schedule.endDate)
    return {
      ...schedule,
      customTitle: transformScheduleDate(schedule.startDate, schedule.endDate),
      days,
      style: !isDiffWeek ? getStyleByEvent(days, false) : { display: 'none' },
      dateFormat: formatDateTime(schedule.startDate, FORMAT_SHORT_YEAR_MONTH_DAY),
      startTime: formatDateTime(schedule.startDate, FORMAT_HOUR_MINUTE),
      endTime: formatDateTime(schedule.endDate, FORMAT_HOUR_MINUTE),
      monthYear: formatDateTime(schedule.startDate, FORMAT_MONTH_YEAR),
      isDiffWeek,
      arrDates,
      weekWithDates
    }
  })

  items.forEach((schedule) => {
    if (schedule.isDiffWeek) {
      const color = EVENT_COLORS_LIST[randomNumber(4, 1)]
      for (const key in schedule.weekWithDates) {
        const datesSameWeek = schedule.weekWithDates[key]
        const days =
          Number(formatDateTime(datesSameWeek[datesSameWeek.length - 1], FORMAT_SHORT_DAY)) -
          Number(formatDateTime(datesSameWeek[0], FORMAT_SHORT_DAY))
        const item = {
          ...schedule,
          style: getStyleByEvent(days, color),
          dateFormat: formatDateTime(datesSameWeek[0], FORMAT_SHORT_YEAR_MONTH_DAY),
          monthYear: formatDateTime(datesSameWeek[0], FORMAT_MONTH_YEAR)
        }
        items.push(item)
      }
    }
  })

  if (isListView) {
    return items.filter(
      (item) => item.monthYear === `${pageState.currentMonth + 1}-${pageState.currentYear}`
    )
  }
  return []
}

const getStyleByEvent = (days, color) => {
  return {
    width: `${calculateEventWidth(days)}%`,
    backgroundColor: !color ? EVENT_COLORS_LIST[randomNumber(4, 1)] : color
  }
}

const calculateEventWidth = (days) => (days + 1) * 100 - 5

const transformScheduleDate = (startDate, endDate) => {
  const dayStart = `${formatDateTime(startDate, FORMAT_DATE_USE_DOT)}(${formatDateTime(
    startDate,
    FORMAT_ONLY_WEEK_DAY
  )})`
  const dayEnd = `${formatDateTime(endDate, FORMAT_DATE_USE_DOT)}(${formatDateTime(
    endDate,
    FORMAT_ONLY_WEEK_DAY
  )})`
  return `${dayStart} ~ ${dayEnd}`
}

const onFetchEvents = (data) => {
  pageState.currentYear = data.currentYear
  pageState.currentMonth = data.currentMonth
  pageState.eventLists = getEventLists(pageState.currentCalendarMode === CalendarViewModeEnum.LIST)
}

const handleLearnMore = (value) => {
  window.open(value, eventSecondBanner.value?.openInNewWindow ? '_blank' : '_self')
}

onMounted(() => {
  getEvent()
  getEventSnsType()
})
</script>
<style lang="scss" scoped>
.event-page {
  :deep(.diveIn > div:first-child) {
    align-items: center !important;
  }
}
.arrow_icon {
  @apply h-5 w-5 cursor-pointer;
  :deep(path) {
    fill: #fff;
  }
}
</style>
