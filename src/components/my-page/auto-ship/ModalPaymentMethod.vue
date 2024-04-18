<template>
  <RDrawerBottom title="My Credit Card" height="auto">
    <div class="flex items-center justify-center">
      <div class="max-w-[400px]">
        <ListCreditCard
          v-if="pageState.listCards.length > 0"
          :data-card="pageState.listCards"
          :is-modal="true"
          :card-active="defaultCard"
          @get-list-cards="getListCards"
          @get-active-element="getActiveElement"
        />
      </div>
    </div>

    <RButton
      title="Add New Credit Card"
      class="border-navy-6 mb-[10px] w-full"
      class-title="text-navy-6 text-base font-550"
      @click="transitToCreate"
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
      @click="chooseCardByScroll"
    >
    </RButton>
    <RModalConfirm
      v-model:visible="pageState.showModalConfirm"
      description="Do you want to go to the Manage Frequently used cards page ?"
      text-ok="Confirm"
      text-cancel="Cancel"
      :width="270"
      :mask-closable="false"
      @ok="handleOkConfirm"
      @cancel="pageState.showModalConfirm = false"
    />
    <RModalAlert
      v-model:visible="pageState.showModalAlert"
      title="Alarm"
      text-btn="Confirm"
      :description="pageState.descriptionAlert"
      :width="280"
      @confirm="handleCloseAlert"
    />
  </RDrawerBottom>
</template>
<script setup>
import apiService from '@/http/api'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { storeToRefs } from 'pinia'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { reactive, watch } from 'vue'
import IconAdd from '@/assets/svgs/add.svg'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'

const userStore = useAuthUserStore()
const { currentAuthUser } = storeToRefs(userStore)
const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading
const router = useRouter()

const props = defineProps({
  openModal: {
    type: Boolean,
    default: false
  },
  subscriptionId: {
    type: Number,
    default: 0
  },
  defaultCard: {
    type: [Number, String],
    default: ''
  }
})
const pageState = reactive({
  listCards: [],
  showModalConfirm: false,
  activeElement: '',
  showModalAlert: false,
  descriptionAlert: ''
})

const emits = defineEmits(['load-detail-again', 'close-modal'])

const getListCards = async () => {
  showGlobalLoading(true)
  try {
    const response = await apiService.creditCardService.getListCard(currentAuthUser.value.userSeqNo)
    if (response.success) {
      pageState.listCards = response.data?.reverse()
    }
  } finally {
    showGlobalLoading(false)
  }
}

const handleOkConfirm = () => {
  router.push({
    name: AppRoutes.myPage.creditCard.name
  })
}

const transitToCreate = () => {
  pageState.showModalConfirm = true
}

const getActiveElement = (value) => {
  pageState.activeElement = value
}

const chooseCardByScroll = async () => {
  try {
    showGlobalLoading(true)
    const response = await apiService.myPageService.editCardPaymentAutoShip({
      userPaymentId: pageState.activeElement,
      subscriptionId: props.subscriptionId
    })
    if (response.success) {
      emits('load-detail-again')
      pageState.showModalAlert = true
      pageState.descriptionAlert = 'Card has been selected.'
      emits('close-modal')
    }
  } finally {
    showGlobalLoading(false)
  }
}

const handleCloseAlert = () => {
  pageState.showModalAlert = false
}

watch(
  () => props.openModal,
  (value) => {
    value && getListCards()
  }
)
</script>
