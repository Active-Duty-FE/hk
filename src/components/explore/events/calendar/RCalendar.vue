<template>
  <div class="w-full">
    <div>
      <RCalendarHeader
        :hide-weekday="isShowView(CalendarViewModeEnum.LIST)"
        :current-month="currentMonth"
        :current-year="currentYear"
        @navigate-year="navigateYear"
        @navigate-month="navigateMonth"
      />
      <RCalendarMonthly
        v-if="isShowView(CalendarViewModeEnum.GRID)"
        :events="events"
        :current-month="currentMonth"
        :current-year="currentYear"
        @detail="viewScheduleDetail"
      />
      <RCalendarDaily
        v-if="isShowView(CalendarViewModeEnum.LIST)"
        :events="events"
        :current-month="currentMonth"
        :current-year="currentYear"
        class="container mx-auto max-w-[1200px] px-5 md:px-0"
        @detail="viewScheduleDetail"
      />
    </div>
  </div>
</template>
<script setup>
import { CalendarViewModeEnum } from '@helpers/enum'

const emits = defineEmits(['detail', 'change'])

const props = defineProps({
  mode: {
    type: String,
    default: CalendarViewModeEnum.GRID,
    validator: (value) => [CalendarViewModeEnum.GRID, CalendarViewModeEnum.LIST].includes(value)
  },
  currentMonth: {
    type: Number,
    default: new Date().getMonth()
  },
  currentYear: {
    type: Number,
    default: new Date().getFullYear()
  },
  events: {
    type: Array,
    default: () => []
  }
})

const isShowView = (mode) => props.mode === mode

const viewScheduleDetail = (schedule) => emits('detail', schedule)

const navigateYear = (isNext) => {
  emits('change', {
    currentYear: isNext ? props.currentYear + 1 : props.currentYear - 1,
    currentMonth: props.currentMonth
  })
}

const navigateMonth = (isNext) => {
  emits('change', {
    currentYear: calculateYear(isNext, calculateMonth(isNext)),
    currentMonth: calculateMonth(isNext).month
  })
}

const calculateYear = (isNext, monthResult) => {
  if (isNext && !monthResult.keepYear) return props.currentYear + 1
  if (!isNext && !monthResult.keepYear) return props.currentYear - 1
  return props.currentYear
}

const calculateMonth = (isNext) => {
  if (isNext) {
    if (props.currentMonth === 11) return { month: 0, keepYear: false }
    return { month: props.currentMonth + 1, keepYear: true }
  } else {
    if (props.currentMonth === 0) return { month: 11, keepYear: false }
    return { month: props.currentMonth - 1, keepYear: true }
  }
}
</script>
