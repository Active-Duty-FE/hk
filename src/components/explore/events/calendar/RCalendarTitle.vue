<template>
  <div class="flex justify-between">
    <div class="style-normal font-550 leading-base text-[20px] md:text-[32px]">EVENT SCHEDULES</div>
    <div>
      <GridModeIcon
        class="calendar-view-mode mr-[5px] cursor-pointer"
        :class="{ active: isActive(CalendarViewModeEnum.GRID) }"
        @click="switchViewMode(CalendarViewModeEnum.GRID)"
      />
      <ListModeIcon
        class="calendar-view-mode cursor-pointer"
        :class="{ active: isActive(CalendarViewModeEnum.LIST) }"
        @click="switchViewMode(CalendarViewModeEnum.LIST)"
      />
    </div>
  </div>
</template>
<script setup>
import GridModeIcon from '@/assets/svgs/calendar/mode-grid.svg'
import ListModeIcon from '@/assets/svgs/calendar/mode-list.svg'
import { CalendarViewModeEnum } from '@helpers/enum'

const props = defineProps({
  mode: {
    type: String,
    default: CalendarViewModeEnum.GRID,
    validator: (value) => [CalendarViewModeEnum.GRID, CalendarViewModeEnum.LIST].includes(value)
  }
})

const emits = defineEmits(['viewMode'])

const isActive = (mode) => props.mode === mode

const switchViewMode = (mode) => {
  emits('viewMode', mode)
}
</script>
<style lang="scss" scoped>
.calendar-view-mode.active {
  :deep(path.item) {
    fill: #063451 !important;
  }
  :deep(path.stroke) {
    stroke: #063451 !important;
  }
}
</style>
