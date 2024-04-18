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
    <a-divider class="bg-gray-14 !mb-[0px]" />
    <div class="flex justify-around">
      <div v-for="item in newDetailLevelCustomer" :key="item.id" class="w-full">
        <div class="flex items-center justify-center">
          <img :src="item.logo" alt="avatar" class="intro__avatar aspect-square w-10" />
        </div>
        <a-divider class="!mb-[15px] !mt-[0px]" />
        <div class="flex items-center justify-center text-xs">
          {{ item.content }}
        </div>
        <a-divider class="!my-[15px]" />
        <div class="flex items-center justify-center">
          <CheckedCircle v-if="checkLevelActive(item.id)" />
          <UnCheckedCircle v-else />
        </div>
        <a-divider class="!my-[15px]" />
        <div class="flex items-center justify-center text-xs">
          {{ item.activeDate }}
        </div>
      </div>
    </div>
    <a-divider class="bg-gray-14 !mb-[0px] !mt-[15px]" />

    <div class="mb-[50px] mt-[30px] flex flex-col gap-[15px]">
      <r-line-notice
        content="If you meet the product purchase amount up to one year ago as of today, you will be upgraded the next day."
      />
      <r-line-notice
        content="The product purchase amount refers to the total purchase amount of the product, excluding Points, discount Coupons, etc."
      />
      <r-line-notice
        content="If the product purchase amount is less than the standard due to return, it will be demoted the next day."
      />
    </div>
  </div>
</template>
<script setup>
import { formatDateTime } from '@/utils/datetime'
import {
  FORMAT_FULL_YEAR_USE_DOT,
  DETAIL_LEVEL_CUSTOMER,
  VALUE_COUNTRY,
  CURRENCY,
  FORMAT_DATETIME
} from '@/helpers/constant'

import { getFullName, handleRenderAvatarCustomer } from '@/utils/auth'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { storeToRefs } from 'pinia'
import CheckedCircle from '@/assets/svgs/checked-circle.svg'
import UnCheckedCircle from '@/assets/svgs/unchecked-circle.svg'
import { computed } from 'vue'
const authUserStore = useAuthUserStore()

const { currentAuthUser } = storeToRefs(authUserStore)

const checkLevelActive = (id) => {
  return currentAuthUser.value?.rank?.code === id
}

const newDetailLevelCustomer = computed(() => {
  return DETAIL_LEVEL_CUSTOMER.map((item) => {
    const dataMatch = Object.values(currentAuthUser.value?.rankAchieved)?.find(
      (e) => e.rank?.code === item?.id
    )

    const currency =
      currentAuthUser.value?.nationalCode === VALUE_COUNTRY.US ? CURRENCY.DOLLAR : CURRENCY.CAD
    if (dataMatch) {
      return {
        ...item,
        content: dataMatch?.overScore ? `Over to ${currency}${dataMatch?.overScore}` : '-',
        activeDate: dataMatch?.activeDate
          ? formatDateTime(dataMatch?.activeDate, FORMAT_DATETIME)
          : '-'
      }
    }
    return item
  })
})
</script>
