<template>
  <r-heading :title="'Please enter the necessary information when converting to a planner'" />
  <div class="mb-10 mt-5 flex justify-end">
    <r-step v-model="pageState.step" :total-step="4" />
  </div>

  <ShippingAddressForm
    ref="shippingAddressFormRef"
    :is-member="false"
    :convert-to-planner="true"
    :country="currentAuthUser?.nationalCode"
    :allow-both-country="true"
    @get-data-address="getDataAddress"
  />
</template>
<script setup>
import { reactive, ref, nextTick, watch } from 'vue'
import { storage } from '@/utils/storage'
import { CONVERSION_SHIPPING } from '@/helpers/constant'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { storeToRefs } from 'pinia'
import { convertDataAddress } from '@/utils/address'

const authUserStore = useAuthUserStore()

const { currentAuthUser, infoUserToConvert } = storeToRefs(authUserStore)

const pageState = reactive({
  step: 3
})
const shippingAddressFormRef = ref(null)

const dataShipping = storage.get(CONVERSION_SHIPPING)

watch(
  () => [dataShipping, infoUserToConvert.value],
  ([value, valueInfo]) => {
    if (value && Object.keys(value).length) {
      nextTick(() => {
        shippingAddressFormRef.value.setShippingAddress(value)
      })
    } else if (valueInfo?.address && Object.keys(valueInfo.address).length) {
      nextTick(() => {
        shippingAddressFormRef.value.setShippingAddress(convertDataAddress(valueInfo.address))
      })
    }
  },
  {
    immediate: true,
    deep: true
  }
)

const router = useRouter()

const getDataAddress = (value) => {
  storage.set(CONVERSION_SHIPPING, value)
  router.push(AppRoutes.myPage.conversionToPlanner.path)
}
</script>
