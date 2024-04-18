<template>
  <div class="flex h-full flex-col items-center px-5 md:px-[90px]">
    <div class="w-full pt-[140px] md:pt-[200px]">
      <RimanIcon />
      <div class="pt-[30px]">
        <div class="style-normal font-440 pb-[7px] text-[20px] leading-[26px] text-white">
          Your ritual is ready!
        </div>
        <div class="font-475 style-normal leading-base text-[14px] leading-4 text-white">
          Enter your email for your curated Ritual Set.
        </div>
      </div>
      <div class="pt-[41px]">
        <a-form ref="formRef" :rules="rules" :model="pageState" class="text-left">
          <a-form-item name="email" class="!mb-2">
            <RInput
              v-model:value="pageState.email"
              placeholder="Enter your email"
              class="input-email !mb-0 h-[40px] !rounded-none md:h-[50px]"
            />
          </a-form-item>
        </a-form>
        <RButton
          title="GET YOUR RITUAL"
          class="!text-gray-10 w-full border-0 !bg-white py-[15px]"
          class-title="font-550 text-[14px] leading-base"
          @click="handleFinish"
        />
      </div>
    </div>
    <div class="p-t-20 w-full">
      <div class="flex justify-center gap-[5px]">
        <RButton
          title="SKIP"
          class="!bg-navy-6 font-550 w-full !border-none py-[15px] text-[14px] !text-white"
          @click="gotoResult('')"
        />
      </div>
    </div>
  </div>
  <RModalAlert
    v-model:visible="pageState.isShowModalAlarm"
    title="Hi!"
    text-btn="OK"
    description="Please enter your e-mail address"
    :width="270"
    @confirm="pageState.isShowModalAlarm = false"
  />
</template>
<script setup>
import { reactive, ref } from 'vue'
import RimanIcon from '@/assets/svgs/skin-quiz/riman.svg'
import { emailRule } from '@/helpers/validation'

const emits = defineEmits(['onResult'])
const pageState = reactive({
  isShowModalAlarm: false,
  email: undefined
})
const formRef = ref()

const rules = reactive({
  email: [emailRule('Email')]
})

const handleFinish = async () => {
  if (!pageState.email) {
    pageState.isShowModalAlarm = true
  } else {
    try {
      await formRef.value.validate()
      gotoResult(pageState.email)
    } catch (error) {
      //
    }
  }
}

const gotoResult = (data = '') => emits('onResult', data)
</script>
<style lang="scss" scoped>
.input-email,
:deep(.ant-input:placeholder-shown) {
  text-align: center;
}
.buttonCustom[data-v-1099723d] {
  min-height: 50px;
  @media only screen and (max-width: 768px) {
    min-height: 40px;
  }
}
</style>
