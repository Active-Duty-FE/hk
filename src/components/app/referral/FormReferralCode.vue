<template>
  <div>
    <a-form
      ref="formRef"
      :model="formGeneralState"
      :rules="formRules"
      autocomplete="off"
      @finish="onFinish"
    >
      <div>
        <a-form-item name="referralNumber" class="!mb-2">
          <r-input
            v-model:value="formGeneralState.referralNumber"
            placeholder="Please enter your membership number"
          />
        </a-form-item>
      </div>
      <div class="pt-1">
        <r-button
          class-title="text-white"
          title="Search"
          height="50px"
          :loading="isLoadingSearchReferralCode"
          class="!bg-navy-6 !border-navy-6 disabled:(!bg-navy-4 border-1 !border-navy-4) mb-5 w-full"
          html-type="submit"
        >
        </r-button>
        <div v-if="formGeneralState.match" class="text-sm">
          <p class="font-475 mb-[15px]">Sponsor information</p>
          <span>
            {{ formGeneralState.codeReferral }} {{ formGeneralState.nameReferral }}
            {{ formGeneralState.firstName }} {{ formGeneralState.lastName }}
          </span>
        </div>
      </div>
    </a-form>
  </div>
</template>
<script setup>
import { reactive, watch } from 'vue'
import { blankRule } from '@/helpers/validation'
import { useMutation } from 'vue-query'
import apiService from '@/http/api'
import { VALIDATE_MESSAGE } from '@/helpers/validate-message'

const props = defineProps({
  updateDisabled: {
    type: Function,
    default: () => {}
  },
  clear: {
    type: String,
    default: '1'
  },
  changeStatusError: {
    type: Function,
    default: () => {}
  }
})

const formGeneralState = reactive({
  referralNumber: undefined,
  match: false,
  nameReferral: '',
  codeReferral: '',
  firstName: '',
  lastName: ''
})

watch(
  () => props,
  () => {
    Object.assign(formGeneralState, {
      referralNumber: undefined,
      match: false,
      nameReferral: '',
      codeReferral: '',
      firstName: '',
      lastName: ''
    })
  },
  {
    immediate: true,
    deep: true
  }
)

const formRules = {
  referralNumber: [blankRule('Membership Number')]
}

const { mutate: mutationSearchReferralCode, isLoading: isLoadingSearchReferralCode } = useMutation(
  async (params) => {
    const response = await apiService.authService.searchRecommenderCode(params)
    return response
  },
  {
    onSuccess: (data) => {
      if (data.success) {
        const { globalRefererUserNumber, globalRefererRegionCode, firstName, lastName } = data.data

        Object.assign(formGeneralState, {
          match: true,
          nameReferral: globalRefererUserNumber,
          codeReferral: globalRefererRegionCode.code,
          firstName,
          lastName
        })
        props.updateDisabled({
          status: false,
          globalRefererUserNumber,
          globalRefererRegionCode: globalRefererRegionCode.code
        })
      } else {
        props.changeStatusError({ status: true, message: VALIDATE_MESSAGE.matchReferralCode })

        Object.assign(formGeneralState, {
          match: false,
          nameReferral: '',
          codeReferral: '',
          firstName: '',
          lastName: ''
        })
        props.updateDisabled({
          status: true,
          globalRefererUserNumber: '',
          globalRefererRegionCode: ''
        })
      }
    }
  }
)

const onFinish = (values) => {
  mutationSearchReferralCode({ userCode: values.referralNumber })
}
</script>
