<template>
  <div class="flex flex-col">
    <h3 class="font-550 mb-0 text-lg leading-[18px]">Shipping Address</h3>

    <a-divider class="!bg-gray-14 !my-[25px]" />

    <div class="savedAddress__content">
      <template v-if="pageState.addressList.length">
        <template v-for="item in pageState.addressList" :key="item.userAddressId">
          <div class="flex justify-between gap-4">
            <div class="addressItem__content">
              <div class="flex items-center" :class="item.defaultValue ? 'mb-4' : 'mb-2.5'">
                <span class="addressItem__description">{{ item.addressDescription }}</span>
                <span v-if="item.defaultValue" class="addressItem__default">[Default]</span>
              </div>

              <p
                v-if="!item.defaultValue"
                class="addressItem__setDefault"
                @click="onSetAsDefault(item.userAddressId)"
              >
                Set as default
              </p>

              <p class="addressItem-textBase addressItem__fullName">{{ getFullName(item) }}</p>
              <p class="addressItem-textBase addressItem__fullAddress">
                {{ getFullAddress(item) }}
              </p>
              <p class="addressItem-textBase addressItem__phone">
                Cell: {{ formatPhoneNumber(item.phoneNumber) }}
              </p>
              <p class="addressItem-textBase addressItem__homePhone">
                Home: {{ formatPhoneNumber(item.homePhone) }}
              </p>
            </div>

            <div class="addressItem__action">
              <img
                src="@/assets/svgs/icon-edit.svg?url"
                alt=""
                class="cursor-pointer"
                @click.prevent="onEdit(item.userAddressId)"
              />
              <img
                src="@/assets/svgs/icon-remove.svg?url"
                alt=""
                class="cursor-pointer"
                @click.prevent="handleDeleteAddress(item.userAddressId)"
              />
            </div>
          </div>
          <a-divider class="!bg-gray-11 !my-5 !bg-opacity-40" />
        </template>

        <p class="savedAddress__note">You can save up to 5 addresses.</p>
      </template>

      <p v-else class="no-data">There is no registered shipping address</p>
    </div>

    <div class="mx-auto mb-10 w-full max-w-[350px]">
      <RButton
        title="Add New Shipping Address"
        class="!border-navy-6 w-full"
        class-title="text-navy-6 text-base font-550"
        @click="onAdd"
      >
        <template #content>
          <IconAdd class="icon__add" />
        </template>
      </RButton>
    </div>
  </div>

  <RModalConfirm
    v-model:visible="pageState.isShowConfirmDeletePopup"
    style-button="style2"
    :description="`Are you sure you want to\nremove this address?`"
    :width="270"
    text-ok="Remove"
    @ok="onDeleteAddress"
    @cancel="pageState.isShowConfirmDeletePopup = false"
  />
</template>

<script setup>
import IconAdd from '@/assets/svgs/add.svg'
import { onBeforeMount, reactive } from 'vue'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { formatPhoneNumber } from '@/utils/common'
import { useNotification } from '@/composables/notification'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { getAddressList } from '@/utils/address'

const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading
const { showNotification } = useNotification()

const router = useRouter()

const pageState = reactive({
  addressList: [],
  addressIdSelected: null,
  isShowConfirmDeletePopup: false
})

onBeforeMount(() => {
  getAddressSavedList()
})

const getFullName = (item) => `${item.firstName} ${item.lastName}`
const getFullAddress = (item) => {
  const { address, aptFloorSuite, city, state, zipcode } = item

  const result = []
  if (aptFloorSuite) result.push(aptFloorSuite)
  if (address) result.push(address)
  if (city) result.push(city)
  if (state) result.push(state)
  if (zipcode) result.push(zipcode)

  return result.join(', ')
}

const getAddressSavedList = async () => {
  pageState.addressList = await getAddressList()
}

const onAdd = () => {
  router.push({ name: AppRoutes.myPage.addShippingAddress.name })
}

const onSetAsDefault = async (id) => {
  showGlobalLoading(true)
  const response = await apiService.addressService.updateDefaultAddressSaved(id)
  showGlobalLoading(false)

  if (response.success) {
    await getAddressSavedList()
    showNotification({
      type: 'success',
      message: 'Update default address successfully!'
    })

    return
  }

  showNotification({ type: 'error', message: 'Update default address failed!' })
}

const onEdit = (id) => {
  router.push({
    name: AppRoutes.myPage.editShippingAddress.name,
    params: { id }
  })
}

const handleDeleteAddress = (id) => {
  pageState.addressIdSelected = id
  pageState.isShowConfirmDeletePopup = true
}

const onDeleteAddress = async () => {
  pageState.isShowConfirmDeletePopup = false
  showGlobalLoading(true)
  const response = await apiService.addressService.deleteAddressSaved(pageState.addressIdSelected)
  showGlobalLoading(false)

  if (!response.success) {
    showNotification({ type: 'error', message: 'Delete address failed!' })
    return
  }

  await getAddressSavedList()
  showNotification({
    type: 'success',
    message: 'Delete address successfully!'
  })
}
</script>

<style lang="scss" scoped>
.shippingAddressManagement {
  &__content {
    @apply mb-10 max-h-[calc(100dvh-65px-60px-50px-20px-50px-120px)] flex-1 flex-col overflow-y-auto;
  }

  &__note {
    @apply mb-0 text-sm font-normal -tracking-[0.28px];
  }
}

.addressItem {
  &__content {
    @apply flex w-[calc(100%-70px)] flex-col;
  }

  &__description {
    @apply text-gray-10 font-475 text-truncate leading-base mr-2 text-sm;
  }

  &__default {
    @apply text-navy-deep leading-base text-xs;
  }

  &-textBase {
    @apply text-gray-10 mb-0 text-sm leading-[18px];
  }

  &__setDefault {
    @apply text-gray-10 leading-base mb-4 w-fit cursor-pointer text-xs font-normal underline;
  }

  &__fullAddress {
    @apply mb-4;
  }

  &__action {
    @apply flex min-w-[44px] max-w-[44px] items-start justify-between gap-4;

    img {
      @apply max-h-[13px] min-h-[13px] min-w-[13px] max-w-[13px];
    }
  }
}

.no-data {
  @apply leading-base py-7.5 mb-10 mt-[15px] text-center text-sm font-normal -tracking-[0.28px];
}

.icon__add {
  @apply mb-1;
  :deep(g) {
    @apply fill-navy-6;
  }
}
</style>
