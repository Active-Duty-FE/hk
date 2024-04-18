<template>
  <div class="calendar-header w-full">
    <div class="w-full">
      <div
        class="month-area border-b-1 border-gray-10 flex items-center justify-between border-l-0 border-r-0 border-t-0 border-solid border-opacity-[0.2] pb-[10px] pt-[25px]"
      >
        <div class="item-text relative cursor-pointer" @click="navigateYear(false)">
          <PreDoubleIcon /> <br />
          {{ getPreviousYear }}
        </div>
        <div class="item-text relative cursor-pointer" @click="navigateMonth(false)">
          <PreviousIcon /> <br />
          {{ getExtraMonth.previous }}
        </div>
        <div class="active item-text relative cursor-pointer">
          <div class="item-text !font-550">{{ currentYear }}</div>
          {{ getMonthName }}
        </div>
        <div class="item-text relative cursor-pointer" @click="navigateMonth(true)">
          <NextIcon /> <br />
          {{ getExtraMonth.next }}
        </div>
        <div class="item-text relative cursor-pointer" @click="navigateYear(true)">
          <NextDoubleIcon /> <br />
          {{ getNextYear }}
        </div>
      </div>
      <div
        v-if="!hideWeekday"
        class="weekday-area border-b-1 border-gray-10 flex justify-between border-l-0 border-r-0 border-t-0 border-solid border-opacity-[0.1] pb-[10px] pt-[25px]"
      >
        <div class="w-full text-center">Sun</div>
        <div class="w-full text-center">Mon</div>
        <div class="w-full text-center">Tue</div>
        <div class="w-full text-center">Wed</div>
        <div class="w-full text-center">Thu</div>
        <div class="w-full text-center">Fri</div>
        <div class="w-full text-center">Sat</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import NextIcon from '@/assets/svgs/calendar/next.svg'
import NextDoubleIcon from '@/assets/svgs/calendar/next-double.svg'
import PreviousIcon from '@/assets/svgs/calendar/previous.svg'
import PreDoubleIcon from '@/assets/svgs/calendar/previous-double.svg'
import { MONTH_LISTS } from '@/helpers/constant'

const emits = defineEmits(['navigateYear', 'navigateMonth'])

const props = defineProps({
  currentMonth: {
    type: Number,
    default: new Date().getMonth()
  },
  currentYear: {
    type: Number,
    default: new Date().getFullYear()
  },
  hideWeekday: {
    type: Boolean,
    default: false
  }
})

const getMonthName = computed(() => MONTH_LISTS[props.currentMonth])

const getNextYear = computed(() => props.currentYear + 1)

const getPreviousYear = computed(() => props.currentYear - 1)

const getExtraMonth = computed(() => {
  return {
    previous: MONTH_LISTS[calculateMonth(false)],
    next: MONTH_LISTS[calculateMonth(true)]
  }
})

const calculateMonth = (isNext) => {
  if (isNext) {
    if (props.currentMonth === 11) return 0
    return props.currentMonth + 1
  } else {
    if (props.currentMonth === 1) return 0
    if (props.currentMonth === 0) return 11
    return props.currentMonth - 1
  }
}

const navigateYear = (isNext) => {
  emits('navigateYear', isNext)
}

const navigateMonth = (isNext) => {
  emits('navigateMonth', isNext)
}
</script>
<style lang="scss" scoped>
.calendar-header {
  .item-text {
    @apply style-normal text-gray-10 w-full text-center text-[16px] font-normal;
  }

  .month-area {
    .active {
      @apply font-550 style-normal text-gray-15 relative text-[16px];
      &::after {
        opacity: 1;
        width: 100% !important;
      }
    }

    .item-text::after {
      position: absolute;
      content: '';
      display: table;
      clear: both;
      bottom: -11px;
      left: 50%;
      width: 0;
      height: 1px;
      background: #212121;
      -webkit-transition: width 125ms ease, opacity 200ms ease;
      transition: width 125ms ease, opacity 200ms ease;
      -webkit-transform: translateX(-50%);
      transform: translateX(-50%);
    }
  }
}
</style>
