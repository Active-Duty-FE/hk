<script setup>
import MenuItem from '@/components/return-exchange/agreement/MenuItemCustom.vue'
import CautionNotice from '@/components/return-exchange/agreement/CautionNotice.vue'
import ListIcon from '@/assets/svgs/list.svg'
import {
  RETURN_AGREEMENT_TERMS,
  RETURN_AGREEMENT_STATE,
  RETURN_AGREEMENT_CAUTIONS,
  REFUND_AMOUNT_SAMPLE,
  POINT_INFO_SAMPLE
} from '@/helpers/constant'
import { computed, reactive, ref, watch } from 'vue'

defineProps({
  estimateData: {
    type: Object,
    required: true
  }
})

const totalRefund = ref(0)

const isAcceptAgreement = ref(false)

const pageState = reactive({
  currentState: RETURN_AGREEMENT_STATE.ESTIMATED_REFUND
})

const pointInfo = reactive(POINT_INFO_SAMPLE)
const terms = reactive(RETURN_AGREEMENT_TERMS)

const cautionNotices = computed(() =>
  totalRefund.value >= 0
    ? RETURN_AGREEMENT_CAUTIONS.RETURN_AVAILABLE
    : RETURN_AGREEMENT_CAUTIONS.RETURN_UNAVAILABLE
)

const toggleAcceptAgreement = (isChecked) => {
  isAcceptAgreement.value = !isChecked
}

const formatCardNumber = (value) => {
  if (!value) return ''
  return value.match(/.{1,4}/g).join(' ')
}
const renderPrice = (value, index) => {
  return !index ? `$ ${Math.abs(value ?? 0)}` : `- $ ${Math.abs(value ?? 0)}`
}

watch(
  () => pageState.currentState,
  () => {
    isAcceptAgreement.value = false
  }
)

defineExpose({
  isAcceptAgreement
})
</script>

<template>
  <div class="flex flex-col gap-[30px] px-5">
    <a-divider class="!bg-gray-10 !my-0" />
    <p class="font-475 mb-0 text-[16px]">
      {{
        pageState.currentState === RETURN_AGREEMENT_STATE.ESTIMATED_REFUND
          ? 'Estimated Refund Amount'
          : 'Refund Amount'
      }}
    </p>
    <div class="flex flex-col gap-5">
      <MenuItem v-for="(item, index) in REFUND_AMOUNT_SAMPLE" :key="item.label">
        <template #label>{{ item.label }} </template>
        <template #value>
          {{
            renderPrice(
              estimateData?.data?.[
                item.value === 'returnShipping' &&
                pageState.currentState === RETURN_AGREEMENT_STATE.ESTIMATED_REFUND
                  ? 'returnShippingCost'
                  : item.value
              ],
              index
            )
          }}
        </template>
      </MenuItem>
      <MenuItem>
        <template #label> Refund Method </template>
        <template #value>
          <div class="text-right">
            <div>{{ estimateData?.data?.cardName }}</div>
            <div class="font-400 text-[12px]">
              {{ formatCardNumber(estimateData?.data?.cardNumber) }}
            </div>
          </div>
        </template>
      </MenuItem>
      <div>
        <a-divider class="!bg-gray-10 !my-0" />
        <MenuItem class="pt-5">
          <template #label>
            <span class="font-475 text-gray-10 text-[16px]"> Total </span>
          </template>
          <template #value>
            <span class="font-625 text-gray-10 text-[18px]">
              $ {{ Math.abs(estimateData?.data?.total ?? 0) }}
            </span>
          </template>
        </MenuItem>
      </div>
    </div>
    <a-divider class="!bg-gray-10 !my-0" />
    <div>
      <p class="font-475 mb-[30px] text-[16px]">Points Information</p>
      <div class="mb-5 flex flex-col gap-5">
        <MenuItem v-for="item in pointInfo" :key="item">
          <template #label> {{ item.label }} </template>
          <template #value> {{ estimateData?.data?.[item.value] }} P </template>
        </MenuItem>
      </div>
      <CautionNotice v-if="estimateData?.data?.isDowngrade">
        <div class="flex flex-col gap-3">
          <div>
            <div
              v-for="caution in cautionNotices"
              :key="caution"
              class="font-400 relative flex items-center text-[12px]"
            >
              <ListIcon class="absolute top-2 mr-2" /> <span class="pl-2">{{ caution.label }}</span>
            </div>
          </div>
        </div>
      </CautionNotice>
    </div>
    <CartCheckBox
      v-if="totalRefund >= 0"
      size="small"
      class="mb-[90px] items-stretch"
      :checked="isAcceptAgreement"
      @checked-change="toggleAcceptAgreement"
    >
      <template #content>
        <div class="flex flex-col pl-[10px]">
          <div class="font-475 text-gray-10 text-[14px] leading-normal">Agree to Terms</div>
          <div
            v-if="pageState.currentState === RETURN_AGREEMENT_STATE.RETURN_REFUND"
            class="font-400 text-[14px] -tracking-[0.28px]"
          >
            Some changes have been made to the product to be returned, refund amount, and
            accumulated points. <br />Please check again and do you agree with the above?
          </div>
          <div v-else class="font-400 text-[14px] -tracking-[0.28px]">
            Have you checked the expected refund amount and agree to the above?
          </div>
          <div
            v-for="term in terms"
            :key="term"
            class="font-400 relative flex items-center text-[12px]"
          >
            <ListIcon class="absolute top-2 mr-2" /> <span class="pl-2">{{ term.label }}</span>
          </div>
        </div>
      </template>
    </CartCheckBox>
  </div>
</template>
