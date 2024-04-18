<template>
  <div class="search-duration">
    <div class="flex items-center justify-center gap-[10px] text-center">
      <div class="w-full">
        <a-date-picker
          v-model:value="pageState.startDate"
          placeholder="YYYY-MM-DD"
          size="large"
          class="w-full !px-[18px] !py-[10px]"
          :allow-clear="false"
          :disabled-date="disableStartDate"
        />
      </div>
      <div class="!w-[20px]">
        <a-divider class="bg-gray-13 !my-0 !h-[1px]" />
      </div>
      <div class="w-full">
        <a-date-picker
          v-model:value="pageState.endDate"
          placeholder="YYYY-MM-DD"
          size="large"
          class="w-full !px-[18px] !py-[10px]"
          :allow-clear="false"
          :disabled-date="disableEndDate"
        />
      </div>
    </div>
    <div class="pb-5 pt-[8px]">
      <RButton
        class="!bg-navy-6 mx-auto w-full !border-none md:w-[335px]"
        title="Search"
        class-title="text-white text-[14px] style-normal leading-base font-550"
        @click="handleSearch"
      />
    </div>
    <div
      v-if="showMonth"
      class="border-1 border-l-gray-11 list-month flex justify-around border-y-0 border-r-0 border-solid"
    >
      <div
        v-for="month in months"
        :key="month.label"
        class="border-1 border-y-gray-11 border-r-gray-11 w-full cursor-pointer border-l-0 border-solid py-[6px] text-center"
        :class="{ selected: checkSelectedMonth(month.label) }"
        @click="choseMonth(month)"
      >
        <div class="style-normal text-gray-13 pb-[5px] text-[16px] font-normal leading-[16px]">
          {{ month.label }}
        </div>
        <div class="style-normal text-gray-13 leading-base text-[10px] font-normal">Months</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, reactive } from 'vue'
import dayjs from 'dayjs'
import { FORMAT_FULL_YEAR, FORMAT_FIRST_DAY } from '@/helpers/constant'

defineProps({
  showMonth: {
    type: Boolean,
    default: true
  }
})

const emits = defineEmits(['onSearch'])

const getStartDateByMonth = (month) => {
  let format = FORMAT_FIRST_DAY
  if (month) format = `YYYY-${month}-01`
  return dayjs().format(format)
}

const getCurrentDate = () => {
  return dayjs().format(FORMAT_FULL_YEAR)
}

const pageState = reactive({
  startDate: dayjs(getStartDateByMonth(), FORMAT_FULL_YEAR),
  endDate: dayjs(getCurrentDate(), FORMAT_FULL_YEAR),
  selectedMonth: undefined
})

const months = [
  { value: '06', label: 6 },
  { value: '05', label: 5 },
  { value: '04', label: 4 },
  { value: '03', label: 3 },
  { value: '02', label: 2 },
  { value: '01', label: 1 }
]

const checkSelectedMonth = (month) => pageState.selectedMonth === month

const choseMonth = (month) => {
  pageState.selectedMonth = month.label
  const startDate = dayjs(pageState.endDate).subtract(month.value, 'months')
  pageState.startDate = dayjs(startDate, FORMAT_FULL_YEAR)
}

const convertDatePayload = () => {
  return {
    startDate: dayjs(pageState.startDate).format(FORMAT_FULL_YEAR),
    endDate: dayjs(pageState.endDate).format(FORMAT_FULL_YEAR)
  }
}

const disableEndDate = (current) => {
  return current && current < dayjs(pageState.startDate).endOf('day')
}

const disableStartDate = (current) => {
  return current && current > dayjs(pageState.endDate).endOf('day')
}

const handleSearch = () => emits('onSearch', convertDatePayload())

onMounted(() => {
  emits('onSearch', convertDatePayload())
})
</script>
<style lang="scss" scoped>
:deep(.ant-picker .ant-picker-input span.ant-picker-suffix) {
  margin-left: 0;
  margin-right: 5px;
  order: -1;
}

:deep(.ant-picker .ant-picker-input input) {
  padding-top: 5px;
}

.list-month {
  .selected {
    border: 1px solid #333;
  }
}

:deep(.ant-picker input) {
  @apply text-sm;
  &::placeholder {
    @apply text-sm -tracking-[0.28px];
  }
}
</style>
