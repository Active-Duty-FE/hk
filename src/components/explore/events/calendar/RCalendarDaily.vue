<template>
  <div class="w-full">
    <div v-for="(schedule, index) in events" :key="schedule.id" class="my-8">
      <div class="flex justify-between">
        <div>
          <div class="text-gray-10 font-550 style-normal leading-base pb-[25px] text-[18px]">
            {{ schedule.customTitle }}
          </div>
          <div>
            <div class="text-gray-10 text-[16px] font-normal">{{ schedule.title }}</div>
            <div>{{ schedule.subTitle }}</div>
          </div>
        </div>
        <div class="md:pt-5">
          <span
            class="text-gray-12 font-550 leading-base border-b-1 border-gray-12 hidden cursor-pointer border-x-0 border-t-0 border-solid text-[14px] md:block"
            @click="viewScheduleDetail(schedule)"
          >
            View detail
          </span>
          <ArrowRightIcon
            class="block cursor-pointer md:hidden"
            @click="viewScheduleDetail(schedule)"
          />
        </div>
      </div>
      <div v-if="index < events.length - 1"><a-divider class="bg-gray-14 my-8" /></div>
    </div>
  </div>
</template>
<script setup>
import ArrowRightIcon from '@/assets/svgs/calendar/arrow-right.svg'

defineProps({
  events: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['detail'])

const viewScheduleDetail = (schedule) => emits('detail', schedule)
</script>
