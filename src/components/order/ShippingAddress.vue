<template>
  <div>
    <p v-if="orderStore.addressList.length && !isModal">Choose from saved addresses:</p>
    <div class="custom-radio">
      <a-radio-group v-model:value="formState.addressSelected" name="radioGroup">
        <a-radio
          v-for="(item, index) in orderStore.addressList"
          :key="item.userAddressId"
          :value="item.userAddressId"
        >
          <ShippingAddressItem
            :item="item"
            :index="index"
            class="addressItem"
            :country="country"
            @edit="onEditAddress"
            @delete="handleDeleteAddress"
            @as-default="onChangeShippingAddressDefault"
          />
        </a-radio>
      </a-radio-group>
    </div>

    <p v-if="orderStore.addressList.length && !isModal" class="description">
      The default delivery address can be modified in the Member Information section of your
      profile. You can save up to five shipping addresses to your profile.
    </p>

    <RButton
      v-if="!isModal"
      title="Add New Shipping Address"
      class="border-navy-6 mx-auto mb-[50px] !h-10 w-full"
      class-title="text-navy-6 text-base font-550"
      @click="onAddNewAddress"
    >
      <template #content>
        <IconAdd class="icon__add" />
      </template>
    </RButton>

    <ShippingAddressForm
      v-if="formState.isShowAddressForm"
      ref="shippingAddressFormRef"
      :country="country"
      :allow-valid="allowValid"
      @update-success="updateShippingAddress"
      @update-address-selected="updateAddressSelected"
    />

    <RModalConfirm
      v-model:visible="formState.isShowConfirmDeletePopup"
      style-button="style2"
      :description="`Are you sure you want to\nremove this address?`"
      :width="270"
      text-ok="Remove"
      @ok="onDeleteShippingAddress"
      @cancel="formState.isShowConfirmDeletePopup = false"
    />
  </div>
</template>

<script setup>
import { useVModels } from '@vueuse/core'
import { nextTick, reactive, ref, watch } from 'vue'
import IconAdd from '@/assets/svgs/add.svg'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useNotification } from '@/composables/notification'
import { useOrderStore } from '@/stores/modules/order'
import { VALUE_COUNTRY } from '@/helpers/constant'

const globalLoading = useGlobalLoadingStore()
const orderStore = useOrderStore()

const { showGlobalLoading } = globalLoading
const { showNotification } = useNotification()

const props = defineProps({
  shippingAddress: {
    type: Object,
    default: () => ({})
  },
  isModal: {
    type: Boolean,
    default: false
  },
  country: {
    type: String,
    default: VALUE_COUNTRY.US
  },
  allowValid: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['update:shippingAddress'])

const { shippingAddress } = useVModels(props, emits)

const shippingAddressFormRef = ref()
const formState = reactive({
  addressSelected: undefined,
  isShowAddressForm: false,
  isShowConfirmDeletePopup: false,
  userAddressIdDelete: undefined
})

watch(
  () => shippingAddress.value,
  async (value) => {
    formState.addressSelected = value.userAddressId
  },
  {
    immediate: true
  }
)

const fillDataAddressForm = (item) => {
  formState.isShowAddressForm = true
  nextTick(() => {
    shippingAddressFormRef.value.setShippingAddress(item)
  })
}

watch(
  () => props.allowValid,
  (value) => {
    if (value) formState.isShowAddressForm = true
  },
  {
    immediate: true
  }
)

watch(
  () => formState.addressSelected,
  () => {
    updateShippingAddress()
  }
)

const updateAddressSelected = (value) => {
  formState.addressSelected = value
}

const handleDeleteAddress = (id) => {
  formState.userAddressIdDelete = id
  formState.isShowConfirmDeletePopup = true
}

const onDeleteShippingAddress = async () => {
  formState.isShowConfirmDeletePopup = false
  showGlobalLoading(true)
  const response = await apiService.addressService.deleteAddressSaved(formState.userAddressIdDelete)
  showGlobalLoading(false)

  if (!response.success) {
    showNotification({ type: 'error', message: 'Delete address failed!' })
    return
  }

  if (formState.userAddressIdDelete === formState.addressSelected) {
    formState.addressSelected = undefined
  }
  await orderStore.getAddressSavedList()
  showNotification({
    type: 'success',
    message: 'Delete address successfully!'
  })
}

const onChangeShippingAddressDefault = async (id) => {
  showGlobalLoading(true)
  const response = await apiService.addressService.updateDefaultAddressSaved(id)
  showGlobalLoading(false)

  if (response.success) {
    await orderStore.getAddressSavedList()
    showNotification({
      type: 'success',
      message: 'Update default address successfully!'
    })

    return
  }

  showNotification({ type: 'error', message: 'Update default address failed!' })
}

const onEditAddress = (item) => {
  fillDataAddressForm({ ...item })
}

const onAddNewAddress = () => {
  fillDataAddressForm({})
}

const updateShippingAddress = () => {
  const item = orderStore.addressList.find(
    (item) => item.userAddressId === formState.addressSelected
  )

  shippingAddress.value = item || {}

  formState.isShowAddressForm = false
}
</script>

<style lang="scss" scoped>
.ant-radio-group {
  @apply flex flex-col;
}

.ant-radio-wrapper {
  @apply border-b-solid border-b-1 border-gray-11 m-0 mb-5 w-full gap-2 py-5;

  &:after {
    @apply hidden;
  }

  &:first-child {
    @apply pt-0;
  }

  &:not(:last-child) {
    @apply pt-0;
  }
}

:deep(.ant-radio + span) {
  @apply w-[calc(100%-24px)] flex-1 p-0;
}

.description {
  letter-spacing: -0.28px;
  @apply text-gray-10 my-5 text-sm font-normal;
}

.icon__add :deep(g) {
  fill: #063451;
}

.custom-radio {
  :deep(.ant-radio-checked) {
    .ant-radio-inner {
      @apply border-navy-deep;
    }
    .ant-radio-inner:after {
      @apply bg-navy-deep;
    }
  }
}
</style>
