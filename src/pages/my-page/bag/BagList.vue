<template>
  <div class="-mt-5">
    <p
      class="max-w-165 md:text-10 md:leading-base md:mt-17.5 md:mb-15 mx-auto mb-10 text-center text-xl font-medium leading-[26px]"
    >
      Add a Personal Touch and Customize Your Bag to Amaze Your Customers!
    </p>

    <div class="md:max-w-97.5 mx-auto">
      <RButton
        title="Create New Bag"
        class-title="font-550 text-white text-sm"
        class="!border-navy-6 !bg-navy-6 disabled:(!bg-navy-4 !border-navy-4) md:mb-15 mb-10 w-full"
        @click="onCreateNewBag"
      />
    </div>
    <div v-if="hasBag" class="flex justify-between">
      <RCheckbox v-model:checked="formState.selectAll" @change="onChangeSelectAll">
        Select All
      </RCheckbox>

      <BagButton
        text="Delete Selected"
        icon="delete"
        :disabled="!listBagIds.length"
        @click="onDeleteSelected"
      />
    </div>

    <a-divider class="bg-gray-10 !mb-0 !mt-5" />
    <template v-if="hasBag">
      <BagItem
        v-for="bag in formState.bagList"
        :key="bag.bagId"
        v-model:checked="formState.bagSelected[bag.bagId]"
        :item="bag"
        @update:checked="onCheckedItem"
        @deleted="getBags"
      />
    </template>

    <div
      v-else
      class="leading-base md:mt-15 mt-10 text-center text-sm font-light -tracking-[0.28px]"
    >
      There are no bags created
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, reactive } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/http/api'
import { AppRoutes } from '@/router/path'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { useAlertConfirm } from '@/composables/alert'
import { useNotification } from '@/composables/notification'

const { showGlobalLoading } = useGlobalLoadingStore()
const { showNotification } = useNotification()

const MAX_BAG_LENGTH = 10

const router = useRouter()
const formState = reactive({
  selectAll: false,
  bagList: [],
  bagSelected: {}
})

const hasBag = computed(() => formState.bagList.length)
const listBagIds = computed(() => {
  const ids = []
  for (const id in formState.bagSelected) {
    if (!formState.bagSelected[id]) continue
    ids.push(+id)
  }

  return ids
})

onBeforeMount(() => {
  getBags()
})

const getBags = async () => {
  showGlobalLoading(true)
  const { data, success } = await apiService.bagService.getBagList()
  formState.bagList = success ? data : []
  showGlobalLoading(false)
}

const onCreateNewBag = () => {
  if (formState.bagList.length >= MAX_BAG_LENGTH) {
    showNotification({
      type: 'error',
      message: 'You can create up to 10 bags.'
    })
    return
  }

  router.push({ name: AppRoutes.myPage.bagManagement.create.name })
}

const onDeleteSelected = async () => {
  const listBagIds = []
  for (const id in formState.bagSelected) {
    if (!formState.bagSelected[id]) continue
    listBagIds.push(+id)
  }

  if (!listBagIds.length) return

  const confirm = await useAlertConfirm({
    content: 'If the bag is deleted, recovery is not possible . Do you want to delete it?',
    okText: 'Remove',
    cancelText: 'Cancel'
  })
  if (!confirm) return

  const { success } = await apiService.bagService.deleteMultipleBag({ listBagIds })
  await getBags()
  showNotification({
    type: success ? 'success' : 'error',
    message: success ? 'Bags have been deleted' : 'Delete bag failed'
  })
}

const onChangeSelectAll = (event) => {
  const checked = event.target.checked
  if (checked) {
    formState.bagList.forEach((bag) => {
      formState.bagSelected[bag.bagId] = true
    })
    return
  }

  formState.bagSelected = {}
}

const onCheckedItem = () => {
  //
  let count = 0
  for (const bagId in formState.bagSelected) {
    const checked = formState.bagSelected[bagId]
    if (checked) count++
  }

  formState.selectAll = count === formState.bagList.length
}
</script>
