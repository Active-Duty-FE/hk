<template>
  <div>
    <div class="text-gray-10 leading-base pb-[15px] text-[12px] font-normal">
      {{ transformTime() }}
    </div>
    <div class="flex justify-between pb-[6px]">
      <span class="font-550 leading-base text-[14px]">{{
        pointHistory?.minusPoint ? 'Spent' : 'Earned'
      }}</span>
      <span class="font-550 leading-base text-[14px]">
        {{ pointHistory?.minusPoint ? '-' : '+' }}
        {{ convertNumber(pointHistory?.minusPoint || pointHistory?.plusPoint) }} P
      </span>
    </div>
    <div class="flex justify-between">
      <span class="text-gray-14 text-[14px] font-normal -tracking-[0.28px]">{{
        pointHistory?.salesOrderNumber || pointHistory?.returnOrderNumber
      }}</span>
      <span class="text-gray-14 text-[14px] font-normal -tracking-[0.28px]"
      >Balance {{ convertNumber(pointHistory?.totalPoint) }} P</span
      >
    </div>
  </div>
</template>
<script setup>
import { convertNumber } from '@/utils/currency'
import { formatDateTime } from '@/utils/datetime'
import {
  FORMAT_FULL_YEAR,
  FORMAT_ONLY_WEEK_DAY,
  FORMAT_HOUR_MINUTE_SECOND
} from '@/helpers/constant'

const props = defineProps({
  pointHistory: {
    type: Object,
    default: () => ({})
  }
})

const transformTime = () => {
  const parseDate = formatDateTime(props.pointHistory?.pointChangeDateTime, FORMAT_FULL_YEAR)
  const parseWeek = formatDateTime(props.pointHistory?.pointChangeDateTime, FORMAT_ONLY_WEEK_DAY)
  const parseTime = formatDateTime(
    props.pointHistory?.pointChangeDateTime,
    FORMAT_HOUR_MINUTE_SECOND
  )

  return `${parseDate}(${parseWeek}) ${parseTime}`
}
</script>
