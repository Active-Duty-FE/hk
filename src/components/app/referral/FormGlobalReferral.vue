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
        <p class="text-gray-14 mb-2 mt-5 text-sm font-normal">
          If you also have a Korean Sponsor,<br />
          please enter the code below.
        </p>
        <div class="w-full">
          <a-form-item name="referralCode" class="!mb-2 w-full">
            <r-input
              v-model:value="formGeneralState.referralCode"
              :maxlength="10"
              placeholder="Member number "
            />
          </a-form-item>
          <p class="text-gray-14 mb-5 text-xs">Please enter 5 digit numbers only excluding “INC”</p>
          <div v-if="formGeneralState.match" class="mb-5 text-sm">
            <p class="font-475 mb-[15px]">Sponsor information</p>
            <span> {{ formGeneralState.codeReferral }} {{ formGeneralState.nameReferral }}</span>
          </div>
          <r-button
            type="primary"
            title="Search"
            class="!bg-navy-6 !border-navy-6 w-full"
            html-type="submit"
            :loading="isLoadingSearchReferralGlobal"
          />
        </div>
      </div>
    </a-form>
  </div>
</template>
<script setup>
import { reactive, watch } from 'vue'
import { blankRule } from '@/helpers/validation'
import apiService from '@/http/api'
import { useMutation } from 'vue-query'
import { VALIDATE_MESSAGE } from '@/helpers/validate-message'
import { removeCharacterString } from '@/utils/common'
import RButton from '@/components/common/RButton.vue'
import RInput from '@/components/common/RInput.vue'

const formGeneralState = reactive({
  referralCode: undefined,
  match: false,
  nameReferral: '',
  codeReferral: ''
})

const props = defineProps({
  updateDisabled: {
    type: Function,
    default: () => {}
  },
  changeStatusError: {
    type: Function,
    default: () => {}
  }
})

const formRules = {
  referralCode: [blankRule('INC Number')]
}

const { mutate: mutationSearchReferralGlobal, isLoading: isLoadingSearchReferralGlobal } =
  useMutation(
    async (params) => {
      return await apiService.authService.searchRecommenderGlobal(params)
    },
    {
      onSuccess: (data) => {
        if (data.success) {
          const { kStoreReferrerCode, kStoreReferrerName } = data.data

          Object.assign(formGeneralState, {
            match: true,
            codeReferral: kStoreReferrerCode,
            nameReferral: kStoreReferrerName
          })
          props.updateDisabled({
            status: false,
            kStoreReferrerCode
          })
        } else props.changeStatusError({ status: true, message: VALIDATE_MESSAGE.wrongIncNumber })
      }
    }
  )

const onFinish = (values) => {
  mutationSearchReferralGlobal({ code: values.referralCode })
}

watch(
  () => formGeneralState.referralCode,
  () => {
    formGeneralState.referralCode = removeCharacterString(formGeneralState.referralCode)
  }
)
</script>
