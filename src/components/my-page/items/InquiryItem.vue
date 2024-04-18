<template>
  <div>
    <div class="px-5">
      <div>
        <div v-if="itemInfo?.salesOrderNumber && itemInfo?.salesOrderNumber !== 'null'">
          Order No.{{ itemInfo?.salesOrderNumber }} {{ itemInfo?.productName }}
        </div>
        <div class="text-gray-10 leading-base font-475 style-normal text-14px pb-[15px]">
          {{ itemInfo.inquiryContents }}
        </div>
        <div class="flex justify-between">
          <div class="text-gray-14 style-normal leading-base text-[12px] font-normal">
            {{ formatDateTime(itemInfo.createdDateTime, FORMAT_DATETIME) }}
          </div>
          <div>
            <div
              v-if="itemInfo.inquiryStatusType.code !== InquiryStatusEnum.COMPLETED"
              class="flex gap-[18px]"
            >
              <EditIcon class="cursor-pointer" @click="editItem" />
              <DeleteIcon class="cursor-pointer" @click="deleteItem" />
            </div>
          </div>
        </div>
        <div
          class="hide-scrollbar -mx-5 ml-0 mt-3 flex gap-[10px] overflow-x-auto overflow-y-hidden overscroll-x-none pb-5 md:mx-0"
        >
          <div
            v-for="slide in itemInfo.inquiryAttachments"
            :key="slide"
            class="h-[100px] w-[100px] cursor-pointer"
          >
            <img
              alt="image slide"
              class="h-[100px] w-[100px]"
              :src="addPrefixForImageInquiry(slide.url)"
            />
          </div>
        </div>
        <div v-if="itemInfo.inquiryAnswerDtoList?.length" class="px-5 py-5">
          <div
            v-for="item in itemInfo?.inquiryAnswerDtoList"
            :key="item.inquiryAnswerId"
            class="bg-gray-11 mb-3 bg-opacity-20 px-5 py-[25px]"
          >
            <RimanIcon />
            <div
              class="text-gray-10 font-475 style-normal line-clamp-3 py-[15px] text-[14px] leading-normal"
            >
              {{ item.inquiryAnswerContents }}
            </div>
            <div class="font-400 style-normal text-gray-14 text-[12px]">
              {{ formatDateTime(item.createdDateTime, FORMAT_DATETIME) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import DeleteIcon from '@/assets/svgs/delete-small.svg'
import EditIcon from '@/assets/svgs/my-page/edit.svg'
import RimanIcon from '@/assets/svgs/my-page/riman.svg'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { addPrefixForImageInquiry } from '@/utils/common'
import { InquiryStatusEnum } from '@/helpers/enum'
import { formatDateTime } from '@/utils/datetime'
import { FORMAT_DATETIME } from '@/helpers/constant'

const router = useRouter()
const emits = defineEmits(['delete'])

const props = defineProps({
  itemInfo: {
    type: Object,
    default: () => ({})
  },
  open: {
    type: Boolean,
    default: false
  }
})

const deleteItem = () => emits('delete')

const editItem = () =>
  router.push({ name: AppRoutes.myPage.editInquiry.name, params: { id: props.itemInfo.inquiryId } })
</script>

<style scoped lang="scss">
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
