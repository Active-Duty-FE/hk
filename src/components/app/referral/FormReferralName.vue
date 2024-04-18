<template>
  <div>
    <a-form
      ref="formRef"
      :model="formGeneralState"
      :rules="formRules"
      autocomplete="off"
      @finish="onFinish"
    >
      <a-form-item v-if="!hasReferrer" name="referralNumber" class="form-item-group">
        <r-input
          v-model:value="formGeneralState.referralNumber"
          :maxlength="10"
          placeholder="Please enter your referral number"
        />
      </a-form-item>

      <div>
        <r-button
          v-if="!hasReferrer"
          class-title="text-white text-sm font-550"
          title="Search"
          height="50px"
          :loading="isLoadingSearchReferralName"
          class="!bg-navy-6 disabled:(!bg-navy-4 border-1 !border-navy-4) !border-navy-6 mb-5 w-full"
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
import { onMounted, reactive, watch } from 'vue'
import { blankRule } from '@/helpers/validation'
import { useMutation } from 'vue-query'
import apiService from '@/http/api'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { removeCharacterString } from '@/utils/common'
import RInput from '@/components/common/RInput.vue'
import RButton from '@/components/common/RButton.vue'

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
  },
  hasReferrer: {
    type: Boolean,
    default: false
  }
})

const authStore = useAuthUserStore()

const formGeneralState = reactive({
  referralNumber: undefined,
  firstName: '',
  lastName: '',
  match: false,
  nameReferral: '',
  codeReferral: ''
})

watch(
  () => props,
  () => {
    Object.assign(formGeneralState, {
      referralNumber: undefined,
      referralName: undefined,
      match: false,
      nameReferral: '',
      codeReferral: ''
    })
  },
  {
    immediate: true,
    deep: true
  }
)

const formRules = {
  referralNumber: [blankRule('Referral Number')]
}

const { mutate: mutationSearchReferralName, isLoading: isLoadingSearchReferralName } = useMutation(
  async (params) => {
    const response = await apiService.authService.searchRecommenderName(params)
    return response
  },
  {
    onSuccess: (response) => {
      if (response.success) {
        const { globalRefererUserNumber, globalRefererRegionCode, firstName, lastName } =
          response.data
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
        props.changeStatusError({ status: true, message: response.message })
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
  mutationSearchReferralName({
    userNumber: values.referralNumber
  })
}

watch(
  () => formGeneralState.referralNumber,
  () => {
    formGeneralState.referralNumber = removeCharacterString(formGeneralState.referralNumber)
  }
)

onMounted(() => {
  if (authStore.referrerCode) {
    formGeneralState.referralNumber = authStore.referrerCode
    onFinish({ referralNumber: authStore.referrerCode })
  }
})
</script>
<style lang="scss" scoped>
.form-item-group {
  @apply mb-2;
}
</style>
