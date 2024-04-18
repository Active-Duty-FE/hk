<template>
  <div class="-mt-6">
    <div class="relative -mx-5 mb-[65px] md:mx-0">
      <img class="bag__banner" :src="state.bannerImagePreview" alt="" loading="lazy" />
      <BagButton
        class="bag__editBtn"
        text="Edit"
        icon="edit"
        @click="onShowChooseImage(BAG_IMAGE_TYPE.BANNER)"
      />

      <img
        class="bag__profile"
        loading="lazy"
        alt=""
        :src="state.profileImagePreview"
        @click="onShowChooseImage(BAG_IMAGE_TYPE.PROFILE)"
      />
    </div>

    <a-form ref="formRef" :rules="rules" :model="state">
      <a-form-item name="bagTitle" class="!mb-3">
        <RTextarea
          v-model:value="state.bagTitle"
          placeholder="Please enter bag title"
          class="bag__title"
          :maxlength="50"
          :auto-size="{ minRows: 2, maxRows: 2 }"
        />
      </a-form-item>

      <a-form-item name="bagSubTitle" class="!mb-10">
        <RTextarea
          v-model:value="state.bagSubTitle"
          placeholder="Please enter bag sub title"
          class="bag__subtitle"
          :maxlength="150"
          :auto-size="{ minRows: 4, maxRows: 4 }"
        />
      </a-form-item>
    </a-form>

    <div class="flex flex items-center justify-between pb-2.5">
      <span class="leading-base text-lg font-semibold">
        Bag ({{ productSelectedLength }} {{ productSelectedLength === 1 ? 'Item' : 'Items' }})
      </span>
      <span
        class="font-550 leading-base cursor-pointer text-xs underline"
        @click="state.isShowAddProductDrawer = !state.isShowAddProductDrawer"
      >
        Add Product
      </span>
    </div>

    <div class="border-1 border-gray-10 border-l-0 border-r-0 border-solid">
      <template v-if="productSelectedLength">
        <BagProductItem
          v-for="(item, index) in state.productSelectedArray"
          :key="`${item.productId}-${item.productOptionId}`"
          v-model="item.quantity"
          class="bag__product-item"
          :item="item"
          @delete="onDeleteProductSelected(index)"
        />
      </template>

      <span v-else class="block py-10 text-center">Your bag is currently empty.</span>
    </div>

    <div class="mt-5">
      <div class="mb-3 flex justify-between">
        <span class="font-550 text-black-100 text-base leading-5">Subtotal</span>
        <span class="text-black-100 text-xl font-medium leading-[26px]">
          {{ currencyForBag }}
          {{ convertNumber(totalPricePoint.price) }}
        </span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm font-light -tracking-[0.28px]">BP</span>
        <span class="leading-base text-sm">{{ convertNumber(totalPricePoint.point) }} BP</span>
      </div>
    </div>

    <div class="my-10 flex justify-center">
      <RButton
        title="Create"
        class="!border-navy-6 !bg-navy-6 disabled:(!bg-navy-4 !border-navy-4) w-full max-w-sm"
        class-title="text-white"
        :disabled="!productSelectedLength"
        @click="onCreateBag"
      />
    </div>

    <AddProductDrawer
      v-model:visible="state.isShowAddProductDrawer"
      is-bag
      @confirm="onAddProduct"
    />

    <BagChooseImageDrawer
      v-model:visible="state.isShowBagChooseImage"
      :images="imageList"
      :title="titleChooseImage"
      :image-selected="imageSelected"
      :is-profile="state.chooseImageType === BAG_IMAGE_TYPE.PROFILE"
      @save="onSaveImage"
    />

    <RModalAlert
      v-model:visible="state.isShowSuccessPopup"
      title="Your Bag is Ready!"
      description="Click and share this bag link to your customers!"
      text-btn="Share Bag Link"
      width="300px"
      :closable="false"
      @confirm="onCloseSuccessPopup"
    />
  </div>
</template>

<script setup>
import { computed, onBeforeMount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import isEmpty from 'lodash/isEmpty'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { maxRule, requiredRule } from '@/helpers/validation'
import { convertNumber, renderCurrency } from '@/utils/currency'
import { useNotification } from '@/composables/notification'
import { useAlertConfirm } from '@/composables/alert'
import { AppRoutes } from '@/router/path'
import storage from '@/utils/storage'
import { CountryEnum } from '@/helpers/enum'
import { STORAGE_IP_ADDRESS, CURRENCY } from '@/helpers/constant'

const { showNotification } = useNotification()
const { showGlobalLoading } = useGlobalLoadingStore()

const BAG_IMAGE_TYPE = {
  BANNER: 'BANNER',
  PROFILE: 'PROFILE'
}

const router = useRouter()
const state = reactive({
  bagTitle: null,
  bagSubTitle: null,
  bannerImage: {},
  bannerImagePreview: null,
  profileImage: {},
  profileImagePreview: null,
  bannerImageList: [],
  profileImageList: [],
  chooseImageType: null,
  isShowBagChooseImage: false,
  isShowAddProductDrawer: false,
  productSelectedArray: [],
  isShowSuccessPopup: false,
  errorMessage: '',
  bagDataSuccess: {}
})

const rules = reactive({
  bagTitle: [requiredRule('Title'), maxRule('Title', 50)],
  bagSubTitle: [requiredRule('Sub Title'), maxRule('Sub Title', 150)]
})
const formRef = ref()

const isImageTypeBanner = computed(() => state.chooseImageType === BAG_IMAGE_TYPE.BANNER)

const currencyForBag = computed(() => {
  return renderCurrency(
    storage.get(STORAGE_IP_ADDRESS, 'localStorage') === CountryEnum.CA.value
      ? CURRENCY.CAD
      : CURRENCY.USD
  )
})

const imageList = computed(() => {
  if (isImageTypeBanner.value) {
    return state.bannerImageList
  }
  return state.profileImageList
})

const titleChooseImage = computed(() => {
  if (isImageTypeBanner.value) {
    return 'Banner'
  }
  return 'Profile'
})

const imageSelected = computed(() => {
  if (isImageTypeBanner.value) {
    return state.bannerImage
  }
  return state.profileImage
})

const totalPricePoint = computed(() => {
  const result = {
    price: 0,
    point: 0
  }

  state.productSelectedArray.forEach((item) => {
    const quantity = item.quantity
    const priceOneItem = item.salesAmount ?? item.priceOriginal
    result.price += priceOneItem * quantity
    result.point += item.point * quantity
  })

  return result
})

const productSelectedLength = computed(() => state.productSelectedArray.length)

onBeforeMount(() => {
  initData()
})

const initData = async () => {
  showGlobalLoading(true)
  await Promise.all([getBagContent(), getBannerImageList(), getProfileImageList()])
  showGlobalLoading(false)
}

const getBagContent = async () => {
  const { data } = await apiService.bagService.getBagContent()
  state.bagTitle = data?.bagTitle
  state.bagSubTitle = data?.bagSubTitle
}

const getBannerImageList = async () => {
  const { data, success } = await apiService.bagService.getBagImage(BAG_IMAGE_TYPE.BANNER)
  state.bannerImageList = success ? data : []
  const bannerImage = state.bannerImageList[0] || {}
  state.bannerImage = bannerImage
  state.bannerImagePreview = bannerImage.bagUrl
}

const getProfileImageList = async () => {
  const { data, success } = await apiService.bagService.getBagImage(BAG_IMAGE_TYPE.PROFILE)
  state.profileImageList = success ? data : []
  const profileImage = state.profileImageList[0] || {}
  state.profileImage = profileImage
  state.profileImagePreview = profileImage.bagUrl
}

const onShowChooseImage = (type) => {
  state.chooseImageType = type
  state.isShowBagChooseImage = true
}

const onAddProduct = (productMap) => {
  for (const productAddId in productMap) {
    const productAdd = productMap[productAddId]
    const productAddOptionId = +productAdd.productOptionId

    const productExist = state.productSelectedArray.find((p) => {
      if (productAddOptionId) {
        return p.productOptionId === productAddOptionId && p.productId === +productAddId
      }
      return p.productId === +productAddId
    })

    // Product Exist
    if (productExist) {
      productExist.quantity += 1
      continue
    }

    // Add new
    state.productSelectedArray.push({ ...productAdd, quantity: ~~productAdd.minQuantityLimit || 1 })
  }
}

const onDeleteProductSelected = async (index) => {
  const confirm = await useAlertConfirm({
    content: 'Do you want to remove the item from the bag?',
    okText: 'Remove',
    cancelText: 'Cancel'
  })
  if (!confirm) return

  state.productSelectedArray.splice(index, 1)
}

const onSaveImage = (image) => {
  // Banner Image
  if (isImageTypeBanner.value) {
    state.bannerImage = image

    // Choose image exist
    if (image.bagId) {
      state.bannerImagePreview = image.bagUrl
      return
    }

    // Choose custom image
    state.bannerImagePreview && URL.revokeObjectURL(state.bannerImagePreview)
    state.bannerImagePreview = URL.createObjectURL(image)
    return
  }

  // Profile Image
  state.profileImage = image

  // Choose image exist
  if (image.bagId) {
    state.profileImagePreview = image.bagUrl
    return
  }

  // Choose custom image
  state.profileImagePreview && URL.revokeObjectURL(state.profileImagePreview)
  state.profileImagePreview = URL.createObjectURL(image)
}

const onCreateBag = async () => {
  state.errorMessage = ''
  let isValid = false
  try {
    await formRef.value.validate()
    isValid = true
  } catch {
    //
  }

  if (isEmpty(state.bannerImage) && !(state.bannerImage instanceof File)) {
    state.errorMessage = 'Please choose banner image'
    isValid = false
  }

  if (isEmpty(state.profileImage) && !(state.profileImage instanceof File)) {
    state.errorMessage = 'Please choose profile image'
    isValid = false
  }

  if (!isValid) {
    state.errorMessage &&
      showNotification({
        type: 'error',
        message: state.errorMessage
      })
    return
  }

  const payload = new FormData()
  payload.set('bagTitle', state.bagTitle)
  payload.set('bagSubTitle', state.bagSubTitle)
  payload.set(
    state.bannerImage?.bagId
      ? 'imageBagExitsRequest.bannerImageId'
      : 'imageBagUserRequest.bannerImage',
    state.bannerImage?.bagId || state.bannerImage
  )
  payload.set(
    state.profileImage?.bagId
      ? 'imageBagExitsRequest.profileImageId'
      : 'imageBagUserRequest.profileImage',
    state.profileImage?.bagId || state.profileImage
  )

  state.productSelectedArray.forEach((item, index) => {
    payload.append(`productBagRequestList[${index}].quantity`, item.quantity)
    payload.append(`productBagRequestList[${index}].productBagId`, item.productId)
    if (item.productOptionId) {
      payload.append(`productBagRequestList[${index}].productOptionId`, item.productOptionId)
      payload.append(`productBagRequestList[${index}].optionCode`, item.optionCode)
    }
    index++
  })

  showGlobalLoading(true)
  const { success, message, data } = await apiService.bagService.createBag(payload)
  showGlobalLoading(false)

  if (success) {
    state.bagDataSuccess = data
    state.isShowSuccessPopup = true
    return
  }

  showNotification({
    type: 'error',
    message: message
  })
}

const onCloseSuccessPopup = () => {
  navigator.clipboard.writeText(state.bagDataSuccess?.shortUrl)
  showNotification({
    type: 'success',
    message: 'Bag’s link has been copied.'
  })

  state.isShowSuccessPopup = false
  router.push({ name: AppRoutes.myPage.bagManagement.list.name })
}
</script>

<style lang="scss" scoped>
.bag {
  &__banner {
    @apply h-[375px] w-full object-cover;
  }

  &__editBtn {
    @apply absolute bottom-5 left-5;
  }

  &__profile {
    @apply w-22.5 h-22.5 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 cursor-pointer rounded-full bg-white object-cover;
    @apply border-1 border-gray-11 border-solid;
  }

  &__title {
    @apply py-5 text-[28px] font-medium leading-[30px];
  }

  &__subtitle {
    @apply py-5 text-base font-light leading-[22px];
  }

  &__product-item:not(:last-child) {
    @apply border-b-solid border-b-gray-11 border-b-1;
  }
}
</style>
