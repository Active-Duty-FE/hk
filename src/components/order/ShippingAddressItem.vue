<template>
  <div
    class="flex justify-between gap-4"
    :class="isDisable ? 'cursor-not-allowed bg-gray-100' : ''"
  >
    <div class="flex w-[calc(100%-70px)] flex-col">
      <div class="mb-5 flex items-center">
        <span class="addressItem__description">{{ item.addressDescription }}</span>
        <span v-if="item.defaultValue" class="addressItem__default">[Default]</span>
      </div>
      <p class="addressItem-textBase addressItem__fullName">{{ fullName }}</p>
      <p class="addressItem-textBase addressItem__fullAddress">{{ fullAddress }}</p>
      <p class="addressItem-textBase addressItem__phone">
        Cell: {{ formatPhoneNumber(item.phoneNumber) }}
      </p>
      <p class="addressItem-textBase addressItem__homePhone">
        Home: {{ formatPhoneNumber(item.homePhone) }}
      </p>
      <p v-if="!item.defaultValue" class="addressItem__asDefault" @click.prevent="onAsDefault">
        [Use as default Shipping Address]
      </p>
    </div>

    <div class="addressItem__action" @click.prevent>
      <img src="@/assets/svgs/icon-edit.svg?url" alt="" @click.prevent="onEdit" />
      <img src="@/assets/svgs/icon-remove.svg?url" alt="" @click.prevent="onDelete" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { formatPhoneNumber } from '@/utils/common'
import { CountryEnum, NfrImportProductEnum } from '@/helpers/enum'

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  index: {
    type: Number,
    default: 0
  },
  country: {
    type: String
  }
})

const isDisable = computed(() => {
  if (props.item.country === CountryEnum.CA.value && props.country === NfrImportProductEnum.NFR) {
    return false
  } else {
    return props.country !== props.item.country
  }
})

const emits = defineEmits(['edit', 'delete', 'as-default'])

const fullName = computed(() => `${props.item.firstName} ${props.item.lastName}`)
const fullAddress = computed(() => {
  const { address, aptFloorSuite, city, state, zipcode } = props.item

  const result = []
  if (aptFloorSuite) result.push(aptFloorSuite)
  if (address) result.push(address)
  if (city) result.push(city)
  if (state) result.push(state)
  if (zipcode) result.push(zipcode)

  return result.join(', ')
})

const onEdit = () => {
  emits('edit', props.item)
}

const onDelete = () => {
  emits('delete', props.item.userAddressId)
}

const onAsDefault = () => {
  emits('as-default', props.item.userAddressId)
}
</script>

<style lang="scss" scoped>
.addressItem {
  &__description {
    @apply text-gray-10 font-475 text-truncate mr-2 text-sm;
  }

  &__default {
    @apply text-navy-deep text-xs;
  }

  &-textBase {
    @apply text-gray-10 mb-0 text-sm leading-[18px];
  }

  &__fullAddress {
    @apply mb-4;
  }

  &__asDefault {
    @apply mb-0 mt-4 text-xs -tracking-[0.24px] text-[#A0A0A0];
  }

  &__action {
    @apply flex min-w-[52px] max-w-[52px] items-start justify-between gap-4;

    img {
      @apply max-h-[18px] min-h-[18px] min-w-[18px] max-w-[18px];
    }
  }
}
</style>
