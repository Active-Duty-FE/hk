<template>
  <a-form ref="formRef" :model="formState" :rules="rules" class="w-full">
    <div class="p-5 md:mb-0">
      <a-form-item name="brNumber">
        <RInputNumber
          v-model:value="formState.brNumber"
          :placeholder="$t('auth.sign_up.business_information.br_number', { star: '*' })"
          :controls="false"
        />
      </a-form-item>
      <a-form-item name="companyName">
        <r-input
          v-model:value="formState.companyName"
          :placeholder="$t('auth.sign_up.business_information.company_name', { star: '*' })"
        />
      </a-form-item>
      <a-form-item name="companyType">
        <r-select
          v-model:value="formState.companyType"
          :options="LIST_TYPE_COMPANY"
          :placeholder="$t('auth.sign_up.business_information.company_type', { star: '*' })"
        />
      </a-form-item>
    </div>
  </a-form>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { requiredRule } from '@/helpers/validation'
import RInputNumber from '@/components/common/RInputNumber.vue'
import RInput from '@/components/common/RInput.vue'
import { useI18n } from 'vue-i18n'
import { useForm } from 'ant-design-vue/es/form'
import RSelect from '@/components/common/RSelect.vue'
import { LIST_TYPE_COMPANY } from '@/helpers/constant'

const { t } = useI18n()
const emits = defineEmits(['get-data-business'])
const props = defineProps({
  defaultInfo: {
    type: Object,
    default: () => {}
  },
  isRegister: {
    type: Boolean,
    default: true
  }
})
const formRef = ref()
const formState = reactive({
  brNumber: undefined,
  companyName: '',
  companyType: LIST_TYPE_COMPANY[0].value
})
const rules = reactive({
  brNumber: [requiredRule(t('auth.sign_up.business_information.br_number'))],
  companyName: [requiredRule(t('auth.sign_up.business_information.company_name'))],
  companyType: [requiredRule(t('auth.sign_up.business_information.company_type'))]
})
const checkDisableForm = computed(() => {
  return formState.companyName && formState.companyType && formState.brNumber
})
watch(
  () => formState,
  () => {
    emits('get-data-business', {
      data: formState,
      disabled: !checkDisableForm.value
    })
  },
  {
    deep: true
  }
)
</script>

<style lang="scss" scoped>
.form-item-group {
  @apply mb-2;

  &.ant-form-item-has-error {
    @apply mb-0;
  }
}

.label--form {
  @apply text-sm;
}

:deep(.ant-select-selector) {
  @apply min-h-[50px];
}

:deep(.ant-select-selection-search-input) {
  height: 100% !important;

  &::placeholder {
    @apply text-gray-1 h-full;
  }
}

:deep(.ant-form-item) {
  @apply w-full;
}

.checkbox-custom {
  @apply mb-7 mt-[2px] leading-3;

  :deep(.ant-checkbox-inner) {
    @apply h-3.5 w-3.5;

    &::after {
      left: 18.5%;
    }
  }

  :deep(.ant-checkbox + span) {
    @apply text-xs leading-3;
  }
}
</style>
