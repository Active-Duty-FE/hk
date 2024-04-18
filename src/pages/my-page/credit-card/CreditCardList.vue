<template>
  <div class="text-black-50">
    <p class="font-475 mb-0 text-base leading-[22px]">Registered Card</p>
    <a-divider class="bg-black-50 my-[25px]" />
    <div class="max-h-90 mb-5 overflow-auto">
      <div
        v-for="(item, index) in listCreditCard"
        :key="item.userFavoriteCardsId"
        class="flex items-center justify-between py-5"
        :class="{ 'border-1 border-gray-11 border-t-solid ': index !== 0 }"
      >
        <div>
          <div class="flex gap-2">
            <div
              v-if="item.defaultCard"
              class="text-navy-deep border-black-50 mb-[10px] flex w-fit items-center justify-center border-[1px] border-solid px-[5px] py-[3px] text-[9px] font-bold leading-[9px]"
            >
              Default
            </div>
            <div
              v-if="item.fixedTerm"
              class="text-navy-deep border-black-50 mb-[10px] flex w-fit items-center justify-center border-[1px] border-solid px-[5px] py-[3px] text-[9px] font-bold leading-[9px]"
            >
              Autoship
            </div>
          </div>
          <p class="font-475 mb-[10px] text-sm">{{ item.alias }}</p>
          <p class="mb-[15px] text-sm">{{ item.cardNum }}</p>
          <p
            v-if="!item.defaultCard"
            class="text-gray-13 mb-0 cursor-pointer text-xs leading-3"
            @click="updateCard(item.userFavoriteCardsId)"
          >
            [Use add default]
          </p>
        </div>
        <DeleteIcon
          class="cursor-pointer"
          @click="openModalDelete(item.userFavoriteCardsId, item)"
        />
      </div>
    </div>
    <RButton
      title="Add credit card"
      class="border-navy-6 mb-15 mx-auto !h-10 w-full"
      class-title="text-navy-6 text-base font-550"
      @click="transitToCreate"
    >
      <template #content>
        <IconAdd class="icon__add" />
      </template>
    </RButton>
  </div>
  <RModalAlert
    v-model:visible="modalAlertState.showModal"
    :text-btn="modalAlertState.textBtn"
    :description="modalAlertState.description"
    :width="280"
    @confirm="creditCardStore.changeStatusModalAlert(false)"
  />

  <ModalRemoveCard
    :visible="visibleModalDelete"
    :on-cancel="() => creditCardStore.changeVisibleModalDelete(false)"
    :on-ok="removeCard"
  />

  <!-- Pin code mobile -->
  <CartPinCode
    :visible="pinCodeState.showPinCodeMobile"
    :step-text="pinCodeState.stepText"
    :title="pinCodeState.titlePinCode"
    :error-validate="pinCodeState.errorValidate"
    :is-refresh="pinCodeState.isRefresh"
    class="md:hidden"
    @close="modalPinCode.closePinPopup"
    @final-pin-code="getFinalPinCode"
  />
  <!-- Pin code mobile -->
  <!-- Pin code desktop -->
  <CartPinCodeDesktop
    :visible="pinCodeState.showPinCodeDesktop"
    :step-text="pinCodeState.stepText"
    :title="pinCodeState.titlePinCode"
    :error-validate="pinCodeState.errorValidate"
    :is-refresh="pinCodeState.isRefresh"
    class="hidden md:block"
    @close="modalPinCode.closePinPopup"
    @final-pin-code="getFinalPinCode"
  />
  <!-- Pin code desktop -->

  <RModalConfirm
    v-model:visible="pageState.visibleAlert"
    text-ok="YES"
    text-cancel="NO"
    :width="370"
    :mask-closable="false"
    @ok="handleConfirm"
    @cancel="pageState.visibleAlert = false"
  >
    <template #extraDescription>
      <div>
        <span>{{ pageState.descriptionModalAlert }}</span>
        <p class="mt-5 italic">
          <span class="text-red-400">Note:</span> In order to remove this card without replacing it
          with a new one, you must first cancel any Autoship Orders associated with this card.
        </p>
      </div>
    </template>
  </RModalConfirm>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { useCreditCardStore } from '@/stores/modules/credit-card'
import { computed, onMounted, ref, reactive } from 'vue'
import DeleteIcon from '@/assets/svgs/delete.svg'
import IconAdd from '@/assets/svgs/add.svg'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { useModalPinCode } from '@/stores/modules/modal-pincode'

const authUserStore = useAuthUserStore()
const { currentAuthUser } = storeToRefs(authUserStore)
const creditCardStore = useCreditCardStore()
const { listCreditCard, modalAlertState, visibleModalDelete, statusConditionPinCode } =
  storeToRefs(creditCardStore)
const currentCardId = ref('')
const router = useRouter()
const modalPinCode = useModalPinCode()

const pageState = reactive({
  visibleAlert: false,
  descriptionModalAlert: ''
})

const { pinCodeState } = storeToRefs(modalPinCode)

onMounted(() => {
  const userSeqNo = currentAuthUser.value.userSeqNo
  if (userSeqNo) creditCardStore.getListCreditCard(userSeqNo)
})
const transitToCreate = () => {
  router.push(AppRoutes.myPage.createCreditCard)
}

const updateCard = (cardId) => {
  creditCardStore.updateCreditCard(currentAuthUser.value.userSeqNo, cardId)
}

const openModalDelete = (id, data) => {
  if (data.fixedTerm) {
    pageState.visibleAlert = true
    pageState.descriptionModalAlert =
      'It looks like the card you are trying to remove is associated with an Autoship Order. Would you like to assign a new card to your Autoship Order?'
    return
  }
  creditCardStore.changeVisibleModalDelete(true)
  currentCardId.value = id
}
const removeCard = () => {
  creditCardStore.deleteCreditCard(currentAuthUser.value.userSeqNo, currentCardId.value)
}

const getFinalPinCode = (pinCode) => {
  if (pinCodeState.value.currentSetPassStep < 2) {
    if (statusConditionPinCode.value.change) {
      creditCardStore.checkPassCodeMatch({ orderPassword: pinCode })
    } else {
      creditCardStore.resetPinCode({
        ...statusConditionPinCode.value.dataReset,
        orderPassword: pinCode
      })
    }
  } else {
    creditCardStore.updatePinCode({
      oldOrderPassword: pinCodeState.value.setUpPinCode,
      newOrderPassword: pinCode
    })
  }
}

const handleConfirm = () => {
  router.push(AppRoutes.myPage.createCreditCard)
}
</script>
