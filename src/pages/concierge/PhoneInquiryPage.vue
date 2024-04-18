<template>
  <div class="phoneInquiryForm mx-auto max-w-[800px] px-5">
    <div class="text-gray-10 hidden pb-4 text-center text-[30px] font-medium md:block">
      Phone Reservation
    </div>
    <div class="text-gray-10 py-8 text-[24px] font-medium">What would you like to discuss?</div>
    <a-form ref="formRef" :model="formState" :rules="rules" class="w-full" @finish="onSubmit">
      <div class="mb-8">
        <div class="border-1 border-gray-11 grid grid-cols-3 border-b-0 border-l-0 border-solid">
          <span
            v-for="item in INQUIRY_OPTIONS"
            :key="item.value"
            class="text-gray-14 border-1 border-gray-11 cursor-pointer border-r-0 border-t-0 border-solid py-3 text-center"
            :class="{ typeActive: item.enum === formState.type }"
            @click="formState.type = item.enum"
          >
            {{ item.label }}
          </span>
        </div>
      </div>
      <a-form-item name="content" class="form-item-group phoneInquiryForm__review">
        <RTextarea
          v-model:value="formState.content"
          placeholder="If you write down what you want to discuss, we can make the consultation more accurate."
          class="phoneInquiryForm__review-input"
          :maxlength="1000"
        />
      </a-form-item>
      <RLabel title="Name" required />
      <a-form-item name="title" class="form-item-group">
        <RInput v-model:value="formState.title" placeholder="Name" :maxlength="50" />
      </a-form-item>
      <div class="!pt-[30px]">
        <RLabel title="Contact" required />
        <a-form-item name="cellPhone" class="form-item-group !mb-1">
          <RInput v-model:value="formState.cellPhone" :maxlength="14" />
        </a-form-item>
      </div>
      <div class="!pt-[30px]">
        <RLabel title="Contact information verification" required />
        <a-form-item name="reCellPhone" class="form-item-group !mb-1">
          <RInput v-model:value="formState.reCellPhone" :maxlength="14" />
        </a-form-item>
      </div>
      <div class="style-normal text-gray-14 leading-base hidden text-[12px] font-normal">
        To receive notifications, please provide us with your cell phone number.
      </div>
      <span
        v-if="!isMatchPhone && formState.cellPhone && formState.reCellPhone"
        class="text-red-1000 text-[10px] font-normal leading-[10px]"
      >{{ CONCIERGE_MESSAGE.phoneNotMatch }}</span
      >

      <div class="flex justify-center gap-[10px]">
        <RButton
          title="Cancel"
          class="!bg-navy-6 my-10 w-1/2 !border-none !opacity-20 md:w-1/4"
          class-title="text-white text-[14px] leading-base font-550 style-normal"
          @click="onCancel"
        />
        <RButton
          html-type="submit"
          title="Submit"
          class="!bg-navy-6 my-10 w-1/2 !border-none md:w-1/4"
          class-title="text-white text-[14px] leading-base font-550 style-normal"
        />
      </div>
    </a-form>
  </div>
  <RModalAlert
    v-model:visible="formState.isShowModalConfirm"
    title="Alarm"
    text-btn="Confirm"
    :description="formState.descriptionModal"
    :width="350"
    @confirm="formState.isShowModalConfirm = false"
  />
</template>
<script setup>
import { reactive, ref, watch, computed } from 'vue'
import { phoneRule, requiredRule } from '@/helpers/validation'
import { INQUIRY_OPTIONS } from '@/helpers/constant'
import { useMutation } from 'vue-query'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { CONCIERGE_MESSAGE } from '@/helpers/validate-message'
import { ALPHABETS, ESCAPE } from '@/helpers/regex'
import { formatCellphoneToSend, formatPhoneNumber } from '@/utils/common'

const loadingStore = useGlobalLoadingStore()
const { showGlobalLoading } = loadingStore
const formState = reactive({
  type: INQUIRY_OPTIONS[0].enum,
  title: undefined,
  content: undefined,
  cellPhone: undefined,
  reCellPhone: undefined,
  isShowModalConfirm: false,
  descriptionModal: ''
})

const formRef = ref()

const rules = reactive({
  type: [requiredRule('type')],
  title: [requiredRule('Name')],
  cellPhone: [requiredRule('Cell Phone'), phoneRule('Cell Phone')],
  reCellPhone: [requiredRule('Cell Phone'), phoneRule('Cell Phone')]
})

const isMatchPhone = computed(() => checkMathPhone())

const checkMathPhone = () => {
  if (formState.cellPhone && formState.reCellPhone) {
    return formState.cellPhone === formState.reCellPhone
  }

  return false
}

const { mutate: phoneReservation } = useMutation(
  async (payload) => {
    return await apiService.conciergeService.phoneReservation(payload)
  },
  {
    onSuccess: (data) => {
      if (data?.success && data?.data) {
        formState.descriptionModal = CONCIERGE_MESSAGE.phoneReservationSuccess
        // Object.assign(formS, {})
        formRef.value.resetFields()
      } else {
        formState.descriptionModal = CONCIERGE_MESSAGE.error
      }
      formState.isShowModalConfirm = true
      showGlobalLoading(false)
    },
    onError: () => {
      showGlobalLoading(false)
    }
  }
)

const onSubmit = async () => {
  try {
    formState.title = formState.title?.trim()
    // get data with this value
    await formRef.value.validate()
    if (formState.cellPhone !== formState.reCellPhone) return
    showGlobalLoading(true)
    phoneReservation({
      callReservationType: formState.type,
      callReservationContents: formState.content,
      name: formState.title,
      telNo: formatCellphoneToSend(formState.cellPhone)
    })
  } catch (error) {
    showGlobalLoading(false)
  }
}

const onCancel = () => {
  Object.assign(formState, {
    type: INQUIRY_OPTIONS[0].enum,
    title: undefined,
    content: undefined,
    cellPhone: undefined,
    reCellPhone: undefined,
    isShowModalConfirm: false,
    descriptionModal: ''
  })
}

watch(
  () => formState.cellPhone,
  (newVal) => {
    formState.cellPhone = formatPhoneNumber(
      String(newVal).replace(ALPHABETS, '').replace(ESCAPE, '')
    )
  }
)

watch(
  () => formState.reCellPhone,
  (newVal) => {
    formState.reCellPhone = formatPhoneNumber(
      String(newVal).replace(ALPHABETS, '').replace(ESCAPE, '')
    )
  }
)
</script>
<style lang="scss" scoped>
.phoneInquiryForm {
  &__review {
    @apply lg:col-[2] lg:row-[1_/_span_3];

    &-input {
      @apply h-[180px];
    }
  }

  .typeActive {
    @apply border-1 border-navy-6 text-navy-6 border-solid;
  }
}
</style>
