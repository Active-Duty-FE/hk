<template>
  <span id="pointScroll" />
  <div
    class="mb-[30px] ml-5 flex items-center gap-5 gap-[15px] overflow-x-auto overflow-y-hidden"
    @scroll="handleScroll"
  >
    <div
      v-for="item in dataCard"
      :id="`card${item?.userFavoriteCardsId}`"
      :key="item?.userFavoriteCardsId"
    >
      <div
        :class="[
          '  relative w-[270px] cursor-pointer',
          {
            'border-1 border-black-50 rounded-2 !w-[290px] border-solid p-2': checkCurrentCard(
              item?.userFavoriteCardsId
            )
          }
        ]"
        @click="changeChooseCard(item)"
      >
        <img :src="creditCardImg" alt="credit-card" />
        <div class="absolute left-5 top-5 flex gap-2">
          <span
            v-if="item.defaultCard"
            class="text-navy-deep flex h-[18px] w-[45px] items-center justify-center bg-white text-[9px] font-bold"
          >
            Default
          </span>
          <span
            v-if="item.fixedTerm"
            class="text-navy-deep flex h-[18px] w-[45px] items-center justify-center bg-white text-[9px] font-bold"
          >
            Autoship
          </span>
        </div>

        <span
          v-if="!item.block && !item.defaultCard"
          class="absolute bottom-[25px] right-3 cursor-pointer text-xs text-white underline"
          :class="{ '!right-5': checkCurrentCard(item?.userFavoriteCardsId) }"
          @click="changeDefaultCard(item.userFavoriteCardsId)"
        >
          Use as default
        </span>
        <div v-if="!item.block" class="absolute bottom-[25px] left-5 text-start text-sm text-white">
          <p class="mb-3">{{ item.alias }}</p>
          <span class="text-[10px]">{{ item.cardNum }}</span>
        </div>
        <div
          class="absolute right-3 top-5"
          :class="{ '!right-5': checkCurrentCard(item?.userFavoriteCardsId) }"
        >
          <div v-if="!item.block" class="flex gap-[5px]">
            <StarIcon class="cursor-pointer" />
            <TrashIcon
              class="cursor-pointer"
              @click="openModalRemove(item.userFavoriteCardsId, item)"
            />
          </div>
        </div>

        <div v-if="item.block" class="absolute bottom-[15px] left-5">
          <p class="text-center text-xs text-white">
            The card is inactive.<br />
            Please try again after verifying<br />
            your account.
          </p>
          <r-button
            title="Authenticate Account"
            type="primary"
            class="!rounded-0 !h-10 w-[230px] !border-white !bg-white"
            class-title="text-sm text-navy-deep"
            @click="orderStore.handleChangeVisibleAuthCard(true)"
          />
        </div>
      </div>
    </div>
  </div>

  <ModalRemoveCard :visible="visible" :on-cancel="closeModalRemove" :on-ok="removeCard" />
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
import creditCardImg from '@/assets/images/credit-card.png'
import StarIcon from '@/assets/svgs/star.svg'
import TrashIcon from '@/assets/svgs/trash.svg'
import { STATUS_PAYMENT } from '@/helpers/constant'
import apiService from '@/http/api'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useOrderStore } from '@/stores/modules/order'
import { storeToRefs } from 'pinia'
import { ref, reactive, watch, onMounted } from 'vue'
import { useMutation } from 'vue-query'
import ModalRemoveCard from './ModalRemoveCard.vue'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'

const props = defineProps({
  dataCard: {
    type: Array,
    default: () => []
  },
  isModal: {
    type: Boolean,
    default: false
  },
  cardActive: {
    type: [Number, String],
    default: ''
  }
})

const pageState = reactive({
  activeElement: props.dataCard[0]?.userFavoriteCardsId,
  visibleAlert: false,
  descriptionModalAlert: ''
})
const router = useRouter()
const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading

const userStore = useAuthUserStore()

const { currentAuthUser } = storeToRefs(userStore)
const currentIdCard = ref(null)
const orderStore = useOrderStore()

const emits = defineEmits(['get-list-cards', 'get-active-element'])

const visible = ref(false)

const openModalRemove = (id, data) => {
  if (data.fixedTerm) {
    pageState.visibleAlert = true
    pageState.descriptionModalAlert =
      'It looks like the card you are trying to remove is associated with an Autoship Order. Would you like to assign a new card to your Autoship Order?'
    return
  }
  visible.value = true
  currentIdCard.value = id
}

const checkCurrentCard = (id) => {
  return !props.isModal && orderStore.cardForPayment.userFavoriteCardsId === id
}

const { mutate: mutationDeleteCard } = useMutation(
  async (id) => {
    showGlobalLoading(true)
    const response = await apiService.creditCardService.deleteCard(
      currentAuthUser.value.userSeqNo,
      id
    )
    return response
  },
  {
    onSuccess: (response) => {
      showGlobalLoading(false)
      if (response.success) {
        props.isModal
          ? emits('get-list-cards')
          : orderStore.getListCard(currentAuthUser.value.userSeqNo, true)
        closeModalRemove()
      }
    }
  }
)

const { mutate: mutationUpdateCard } = useMutation(
  async (id) => {
    showGlobalLoading(true)
    const response = await apiService.creditCardService.updateCard(
      currentAuthUser.value.userSeqNo,
      id
    )
    return response
  },
  {
    onSuccess: (response) => {
      showGlobalLoading(false)
      if (response.success) {
        props.isModal
          ? emits('get-list-cards')
          : orderStore.getListCard(currentAuthUser.value.userSeqNo, true)
      }
    }
  }
)

const removeCard = () => {
  mutationDeleteCard(currentIdCard.value)
}

const changeDefaultCard = (id) => {
  mutationUpdateCard(id)
}

const closeModalRemove = () => {
  visible.value = false
}

const changeChooseCard = (data) => {
  if (!data.block && !props.isModal) {
    orderStore.changeCardForPayment(data)
    orderStore.updateDataPayment(
      {
        ...orderStore.dataPayment,
        statusPayment: STATUS_PAYMENT.CREATE_CARD
      },
      true
    )
  }
}

const handleScroll = () => {
  const pointScroll = document.getElementById('pointScroll')

  // Get the bounding boxes of the two elements
  const rectPointScroll = pointScroll.getBoundingClientRect()

  // Calculate the distance between the centers of the two elements
  const centerX1 = rectPointScroll.left + rectPointScroll.width / 2
  const centerY1 = rectPointScroll.top + rectPointScroll.height / 2

  props.dataCard?.map((item) => {
    const currentElement = document.getElementById(`card${item?.userFavoriteCardsId}`)

    const rectCurrentElement = currentElement.getBoundingClientRect()
    const centerX2 = rectCurrentElement.left + rectCurrentElement.width / 2
    const centerY2 = rectCurrentElement.top + rectCurrentElement.height / 2

    const distance = Math.sqrt(Math.pow(centerX2 - centerX1, 2) + Math.pow(centerY2 - centerY1, 2))

    if (distance > 0 && distance < 350) {
      pageState.activeElement = item.userFavoriteCardsId
    }
  })
}

onMounted(() => {
  const targetElement = document.getElementById(`card${props.cardActive}`)

  // Scroll to the target element
  targetElement && targetElement.scrollIntoView({ behavior: 'smooth' })
})

watch(
  () => pageState.activeElement,
  (value) => {
    emits('get-active-element', value)
  },
  {
    immediate: true
  }
)

const handleConfirm = () => {
  router.push(AppRoutes.myPage.createCreditCard)
}
</script>
