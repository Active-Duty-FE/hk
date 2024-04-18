<template>
  <div class="flex items-center justify-center pt-[115px] md:py-10">
    <div class="sm:(w-[600px]) md:(w-[500px] rounded-[10px]) w-full bg-white">
      <r-sub-navigation
        class="z-10 w-full bg-white"
        :title="$t('common.sign_up')"
        :is-hide-back-icon="false"
        @click="router.back()"
      />
      <div class="my-5 px-5">
        <r-heading :title="$t('auth.sign_up.shipping.title')" class-title="text-xl" />
        <div class="mt-5 flex justify-end">
          <r-step :total-step="4" :model-value="3" />
        </div>
      </div>
      <a-form class="w-full" :model="formState" :rules="rules" @finish="onSubmit">
        <div class="p-5">
          <div>
            <div class="mb-3">
              <r-label :title="$t('auth.sign_up.shipping.shipping_address')" :required="true" />
            </div>
            <a-form-item name="firstName" class="form-item-group">
              <r-input
                v-model:value="formState.firstName"
                :placeholder="$t('auth.sign_up.shipping.first_name_placeholder')"
              />
            </a-form-item>
            <a-form-item name="lastName" class="form-item-group">
              <r-input
                v-model:value="formState.lastName"
                :placeholder="$t('auth.sign_up.shipping.lass_name_placeholder')"
              />
            </a-form-item>
            <a-form-item name="city" class="!mb-2">
              <r-select
                v-model:value="formState.city"
                :placeholder="$t('auth.sign_up.shipping.city_placeholder')"
                :options="stateOptions"
              />
            </a-form-item>
            <a-form-item name="area" class="!mb-2">
              <r-select
                v-model:value="formState.area"
                :placeholder="$t('auth.sign_up.shipping.area_placeholder')"
                :options="stateOptions"
              />
            </a-form-item>
            <a-form-item name="address1" class="form-item-group">
              <r-input
                v-model:value="formState.address1"
                :placeholder="$t('auth.sign_up.shipping.address1_placeholder')"
              >
              </r-input>
            </a-form-item>
            <a-form-item name="address2" class="form-item-group">
              <r-input
                v-model:value="formState.address2"
                :placeholder="$t('auth.sign_up.shipping.address2_placeholder')"
              >
              </r-input>
            </a-form-item>
          </div>
          <div class="pb-[100px] md:pb-0">
            <a-form-item name="phoneNumber" class="!mb-2">
              <r-input
                v-model:value="formState.phoneNumber"
                :maxlength="9"
                :placeholder="$t('auth.sign_up.shipping.cell_phone_placeholder')"
              />
            </a-form-item>
          </div>
          <div class="hidden w-full pb-8 pt-10 md:block">
            <r-button
              title="Next"
              class="!bg-navy-1 disabled:(!bg-navy-4 border-1 !border-navy-4) w-full"
              html-type="submit"
              :disabled="!isValid"
              class-title="text-white"
            />
          </div>
        </div>
        <div class="fixed bottom-0 left-0 w-full md:hidden">
          <div class="justify-content flex bg-white px-5 pb-3">
            <r-button
              title="Next"
              class="disabled:(!bg-navy-4 !border-navy-4) !border-navy-6 !bg-navy-6 w-full"
              :disabled="!isValid"
              html-type="submit"
              class-title="text-white"
            />
          </div>
        </div>
      </a-form>
    </div>
  </div>
  <RModalAlert
    v-model:visible="modalAlertState.isShowModal"
    text-btn="Confirm"
    :description="modalAlertState.contentModal"
    :width="300"
    @confirm="modalAlertState.isShowModal = false"
  />
  <RModalConfirm
    v-model:visible="modalAlertState.visibleAlert"
    :width="370"
    :text-ok="$t('auth.sign_up.agree_term_condition.use_address')"
    text-cancel="Edit Address"
    :mask-closable="false"
    @ok="handlePassAddress"
    @cancel="modalAlertState.visibleAlert = false"
  >
    <template #extraDescription>
      <span> {{ modalAlertState.descriptionAlert }}</span>
    </template>
  </RModalConfirm>
</template>
<script setup>
import { computed, onMounted, reactive, watch } from 'vue'
import { validateInputName, validateRequired } from '@/helpers/handle-validate'
import {
  CA_STATE_OPTIONS,
  CELLPHONE_LENGTH,
  STORAGE_CURRENT_STEP,
  STORAGE_ENTER_INFORMATION,
  STORAGE_ENTER_SHIPPING_DATA,
  US_STATE_OPTIONS,
  VALUE_COUNTRY
} from '@/helpers/constant'
import { storage } from '@/utils/storage'
import useValidate from '@/composables/validate'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { REGEX_CELLPHONE_HK, REGEX_START_BINARY } from '@/helpers/regex'
import { formatCellphoneToSend, formatNumberPhoneHk, removeCharacterString } from '@/utils/common'
import { VALIDATE_MESSAGE } from '@/helpers/validate-message'
import RInput from '@/components/common/RInput.vue'
import RSelect from '@/components/common/RSelect.vue'
import RLabel from '@/components/common/RLabel.vue'
import RHeading from '@/components/common/RHeading.vue'
import RStep from '@/components/common/RStep.vue'
import RModalAlert from '@/components/common/RModalAlert.vue'
import RModalConfirm from '@/components/common/RModalConfirm.vue'
import RButton from '@/components/common/RButton.vue'
import RSubNavigation from '@/components/navigation/RSubNavigation.vue'

const dataEnterInfoStorage = storage.get(STORAGE_ENTER_INFORMATION)
const dataEnterShipping = storage.get(STORAGE_ENTER_SHIPPING_DATA)
const router = useRouter()
const formState = reactive({
  firstName: '',
  lastName: '',
  phoneNumber: '',
  address1: '',
  address2: '',
  city: null,
  area: null
})

const modalAlertState = reactive({
  isShowModal: false,
  contentModal: '',
  visibleAlert: false,
  descriptionAlert: ''
})

onMounted(() => {
  if (dataEnterInfoStorage) {
    formState.phoneNumber = dataEnterInfoStorage.cellphone
    formState.firstName = dataEnterInfoStorage.firstName
    formState.lastName = dataEnterInfoStorage.lastName
  }
  if (dataEnterShipping) Object.assign(formState, dataEnterShipping.shipping)
})

const validatePhoneNumber = async (_rule, value) => {
  const valueFormat = removeCharacterString(value)
  if (!valueFormat) {
    return Promise.reject(VALIDATE_MESSAGE.cellPhoneRequired)
  }
  if (!REGEX_START_BINARY.test(valueFormat)) {
    return Promise.reject(VALIDATE_MESSAGE.startBinary)
  }
  if (
    valueFormat.replace(/\s/g, '').length !== CELLPHONE_LENGTH &&
    !REGEX_CELLPHONE_HK.test(valueFormat)
  ) {
    return Promise.reject(VALIDATE_MESSAGE.invalidCellPhoneHk)
  }
  return Promise.resolve()
}

const rules = reactive({
  firstName: [{ validator: validateInputName, trigger: 'change' }],
  lastName: [{ validator: validateInputName, trigger: 'change' }],
  phoneNumber: [{ validator: validatePhoneNumber, trigger: 'change' }],
  address1: [{ validator: validateRequired, trigger: 'change' }],
  address2: [{ validator: validateRequired, trigger: 'change' }],
  city: [{ validator: validateRequired, trigger: 'change' }],
  area: [{ validator: validateRequired, trigger: 'change' }]
})

const isValid = useValidate(formState, rules)

watch(
  () => formState.phoneNumber,
  () => {
    formState.phoneNumber = removeCharacterString(formState.phoneNumber)
    if (
      !REGEX_CELLPHONE_HK.test(formState.cellphone) &&
      formState.phoneNumber.length === CELLPHONE_LENGTH
    ) {
      formState.phoneNumber = formatNumberPhoneHk(formState.phoneNumber)
    }
  }
)

const stateOptions = computed(() =>
  formState.country === VALUE_COUNTRY.US ? US_STATE_OPTIONS : CA_STATE_OPTIONS
)

const handlePassAddress = () => {
  const routePush = `${AppRoutes.register.path}/${AppRoutes.register.agreeTerm.path}`
  storage.set(STORAGE_ENTER_SHIPPING_DATA, { shipping: formState })
  router.push(routePush)
  storage.set(STORAGE_CURRENT_STEP, [...storage.get(STORAGE_CURRENT_STEP), routePush])
}

const onSubmit = async (values) => {
  handlePassAddress()
}
</script>
<style scoped lang="scss">
.form-item-group {
  @apply mb-2;

  &.ant-form-item-has-error {
    @apply mb-0;
  }
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

.form-item-custom {
  @apply mb-2 mt-[10px];
}
</style>
