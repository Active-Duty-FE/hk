<template>
  <r-form-modal :visible="visibleModal" title="Sign In" :mask-closable="false" @cancel="closeModal">
    <template #form>
      <a-form :model="formState" :rules="rules" @submit="handleSubmit">
        <a-form-item name="id" class="!mb-2">
          <r-input v-model:value="formState.id" placeholder="Enter your ID" />
        </a-form-item>
        <a-form-item name="password">
          <r-input-password v-model:value="formState.password" placeholder="Enter your password" />
        </a-form-item>
        <r-button
          title="Sign In"
          type="primary"
          class="!bg-navy-6 mb-2.5 w-full"
          html-type="submit"
        />
        <r-button
          title="Non-Member Purchase"
          class="!border-navy-6 !text-navy-6 w-full"
          @click="handleCheckoutNonMember"
        />
      </a-form>
    </template>
  </r-form-modal>

  <RModalAlert
    v-model:visible="formState.isShowModalAlert"
    title="Alarm"
    :description="formState.errorMessage"
    @confirm="formState.isShowModalAlert = false"
  />
</template>
<script setup>
import { reactive } from 'vue'
import { requiredRule } from '@/helpers/validation'
import appApiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import storage from '@/utils/storage'

import {
  STORAGE_ACCESS_TOKEN,
  STORAGE_IS_LOGGED_IN,
  STORAGE_REFRESH_TOKEN,
  PAYLOAD_LOGIN_DEFAULT
} from '@helpers/constant'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { checkBuyPeriod } from '@/utils/common'

const props = defineProps({
  visibleModal: {
    type: Boolean,
    default: false
  },
  createSheetOrder: {
    type: Function,
    default: () => {}
  },
  closeModal: {
    type: Function,
    default: () => {}
  },
  listProducts: {
    type: Array,
    default: () => []
  }
})

const storeLoading = useGlobalLoadingStore()
const { showGlobalLoading } = storeLoading

const authUserStore = useAuthUserStore()
const { setCurrentAuthUser } = authUserStore

const formState = reactive({
  id: '',
  password: '',
  isShowModalAlert: false,
  errorMessage: '',
  arrProdValidBuySignUp: []
})

const rules = {
  id: [requiredRule('The ID')],
  password: [requiredRule('The Password')]
}

const checkBuyPeriodArr = (data, joinDate) => {
  const arr = []
  const arrError = []
  data.map((item) => {
    const resValidBuy = checkBuyPeriod(item, joinDate)
    if (!resValidBuy && joinDate) arr.push(item)
    else if ((!joinDate && !item.validBuySignUp) || resValidBuy) arrError.push(item)
  })

  formState.arrProdValidBuySignUp = arrError

  return arr.length === data.length
}

const handleSubmit = async () => {
  try {
    const payload = new FormData()
    for (const key in PAYLOAD_LOGIN_DEFAULT) {
      payload.append(key, PAYLOAD_LOGIN_DEFAULT[key])
    }
    payload.set('username', formState.id)
    payload.set('password', formState.password)

    showGlobalLoading(true)
    const response = await appApiService.authService.usernameLogin(payload)

    handleLogin(response)
  } finally {
    showGlobalLoading(false)
  }
}

const handleCheckAvailableProducts = async (joinDatetime) => {
  const products = props.listProducts.filter((p) => p.productQuantity)

  if (products.filter((e) => e.validBuySignUp)?.length === products.length) return true
  const resValidBuy = await checkBuyPeriodArr(products, joinDatetime)
  if (!resValidBuy) {
    formState.isShowModalAlert = true
    formState.errorMessage = !joinDatetime
      ? 'To purchase this item(s), please log in.'
      : `[${formState.arrProdValidBuySignUp[0]?.englishName}] You have passed your eligible purchase period. People within ${formState.arrProdValidBuySignUp[0]?.setBuyPeriodLimitDay} days from enrollment are allowed for purchase.`
    return false
  } else return true
}

const handleLogin = async (data) => {
  const {
    success,
    access_token,
    refresh_token,
    scope,
    user_type,
    user_id,
    user_name,
    mobileNumber,
    roles,
    groups,
    user_display_name,
    email,
    jti,
    joinDatetime
  } = data

  if (success) {
    const resProd = await handleCheckAvailableProducts(joinDatetime)
    if (!resProd) return

    storage.set(STORAGE_ACCESS_TOKEN, access_token)
    storage.set(STORAGE_REFRESH_TOKEN, refresh_token)
    storage.set(STORAGE_IS_LOGGED_IN, true)

    setCurrentAuthUser({
      scope,
      user_type,
      user_id,
      user_name,
      mobileNumber,
      roles,
      groups,
      user_display_name,
      email,
      jti
    })
    props.createSheetOrder()
  } else {
    formState.errorMessage = 'The ID or password is not suitable. Please double-check.'
    formState.isShowModalAlert = true
  }
}

const handleCheckoutNonMember = async () => {
  const resProd = await handleCheckAvailableProducts()
  if (!resProd) return

  props.createSheetOrder()
}
</script>
