<template>
  <div class="h-calendar-monthly h-calendar-weekly h-calendar h-calendar-events">
    <div
      v-for="week in allWeeks"
      :key="`week-${week}`"
      class="h-calendar-weekly__week border-b-1 border-gray-10 border-l-0 border-r-0 border-t-0 border-solid border-opacity-10"
    >
      <div
        v-for="day in getDateByWeek(week)"
        :key="`day-${day.date}`"
        style="height: 100px"
        class="h-calendar-weekly__day !border-l-0 !border-r-0"
        :class="day.class"
      >
        <div class="h-calendar-weekly__day-label !text-right">
          <span>{{ day.date }}</span>
        </div>
        <!-- need remove hidden after make api call -->
        <div
          v-for="schedule in getScheduleByDate(day)"
          :key="schedule.id"
          data-date="2023-09-01"
          class="h-event h-event-start h-event-end !ml-[10px] mb-[1px] h-5 text-white"
          :style="schedule.style"
          :class="{ hidden: !day.isPresent }"
          @click="viewScheduleDetail(schedule)"
        >
          <div class="pl-1">
            <span class="h-event-summary line-clamp-1">{{ schedule.title }}</span>
          </div>
        </div>
        <div
          class="h-event h-event-start h-event-end bg-navy-1 !ml-[10px] mb-[1px] h-5 text-white"
          :class="{ hidden: getScheduleByDate(day)?.length < 4 }"
          @click="showMore(getScheduleByDate(day))"
        >
          <div class="pl-1">
            <span class="h-event-summary line-clamp-1">{{
              `${getScheduleByDate(day).length - 2} more events`
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from 'vue'

const emits = defineEmits(['detail'])

const props = defineProps({
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

const allDates = ref([])
const allWeeks = computed(() => allDates.value.length / 7)

const getDateByWeek = (week) => {
  const items = [...allDates.value]
  return items.splice((week - 1) * 7, 7)
}

const initCalendarView = () => {
  const dayOne = new Date(props.currentYear, props.currentMonth, 1).getDay()

  const lastDate = new Date(props.currentYear, props.currentMonth + 1, 0).getDate()

  const dayEnd = new Date(props.currentYear, props.currentMonth, lastDate).getDay()

  const monthLastDate = new Date(props.currentYear, props.currentMonth, 0).getDate()

  const previousDates = []
  const presentDates = []
  const futureDates = []

  for (let i = dayOne; i > 0; i--) {
    previousDates.push({
      date: monthLastDate - i + 1,
      isPast: true,
      format: `${monthLastDate - i + 1}-${props.currentMonth}-${props.currentYear}`,
      class: 'h-past'
    })
  }

  for (let i = 1; i <= lastDate; i++) {
    presentDates.push({
      date: i,
      isPresent: true,
      format: `${i}-${props.currentMonth + 1}-${props.currentYear}`,
      class: 'h-present'
    })
  }

  for (let i = dayEnd; i < 6; i++) {
    futureDates.push({
      date: i,
      isFuture: true,
      format: `${i}-${props.currentMonth + 2}-${props.currentYear}`,
      class: 'h-future'
    })
  }

  allDates.value = [...previousDates, ...presentDates, ...futureDates]
}

const viewScheduleDetail = (schedule) => emits('detail', schedule)

const calculateStyleIfOverlap = (item, events, index) => {
  if (events?.length > 3) {
    return {
      display: index < 2 ? 'block' : 'none'
    }
  }

  return {}
}

const getScheduleByDate = (day) => {
  const itemFiltered = props.events.filter((schedule) => schedule.dateFormat === day.format)
  // hide if this day has more than three events
  // show +number more events if has more than three
  const events = itemFiltered.map((item, index) => ({
    ...item,
    style: { ...item.style, ...calculateStyleIfOverlap(item, itemFiltered, index) }
  }))
  return events
}

const showMore = (schedules) => {
  // show more when click
}

watch(
  () => [props.currentMonth, props.currentYear],
  () => {
    initCalendarView()
  },
  {
    immediate: true
  }
)
</script>
<style src="@/assets/css/calendar.css" scoped></style>
