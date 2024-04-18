<template>
  <RDrawerBottom title="Shipping Address Management" :height="'90%'">
    <div class="list-address">
      <ShippingAddress v-model:shipping-address="pageState.shippingAddress" :is-modal="true" />
    </div>

    <RButton
      title="Add New Shipping Address"
      class="border-navy-6 mx-auto mb-2.5 w-full"
      class-title="text-navy-6 text-base font-550"
      @click="onAddNewAddress"
    >
      <template #content>
        <IconAdd class="icon__add" />
      </template>
    </RButton>
    <RButton
      title="Confirm"
      type="primary"
      class="!bg-navy-6 mb-5 w-full"
      class-title="text-white text-base font-550"
      @click="editDeliveryAutoShip"
    />
  </RDrawerBottom>
</template>
<script setup>
import { reactive, watch } from 'vue'
import { useOrderStore } from '@/stores/modules/order'
import IconAdd from '@/assets/svgs/add.svg'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'

const orderStore = useOrderStore()
const { showGlobalLoading } = useGlobalLoadingStore()

const props = defineProps({
  openModal: {
    type: Boolean,
    default: false
  },
  defaultShipping: {
    type: Number,
    default: 0
  },
  subscriptionId: {
    type: Number,
    default: 0
  }
})

const emits = defineEmits(['open-modal-add', 'load-detail-again', 'close-modal'])

const pageState = reactive({
  shippingAddress: {}
})

const getListAddress = async () => {
  await orderStore.getAddressSavedList()
  const defaultAddress = orderStore.addressList.find(
    (address) => address.userAddressId === props.defaultShipping
  )
  pageState.shippingAddress = defaultAddress || {}
}

watch(
  () => props.openModal,
  (value) => {
    value && getListAddress()
  },
  {
    immediate: true
  }
)

const onAddNewAddress = () => {
  emits('open-modal-add')
}

const editDeliveryAutoShip = async () => {
  try {
    showGlobalLoading(true)
    const response = await apiService.myPageService.editDeliveryAutoShip({
      useDeliveryId: pageState.shippingAddress?.userAddressId,
      subscriptionId: props.subscriptionId
    })

    if (response.success) {
      emits('close-modal')
      emits('load-detail-again')
    }
  } finally {
    showGlobalLoading(false)
  }
}
</script>
<style scoped lang="scss">
.list-address {
  height: calc(100vh - 350px);
  @apply overflow-auto;
}
</style>
