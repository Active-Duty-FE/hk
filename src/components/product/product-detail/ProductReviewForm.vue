<template>
  <div class="reviewForm">
    <div v-show="showFormRef" class="reviewForm__rating">
      <RRate
        v-model:value="formState.rate"
        class="reviewForm__rating-rate"
        :allow-half="false"
        @change="onChangeRate"
      />
      <div class="reviewForm__rating-description" :class="{ 'text-red': formState.invalidRate }">
        Please select a star rating for the product *
      </div>
    </div>

    <a-form
      v-show="showFormRef"
      ref="formRef"
      :model="formState"
      :rules="rules"
      class="form-custom"
    >
      <a-form-item name="title" class="form-item-group">
        <RInput
          v-model:value="formState.title"
          placeholder="Please write the review title *"
          :maxlength="100"
        />
      </a-form-item>

      <div class="reviewForm__upload">
        <RButtonUpload
          v-if="availableAddFile"
          :accept="acceptExtension"
          multiple
          @change="onChangeFiles"
        >
          <div class="reviewForm__upload-btn">+</div>
        </RButtonUpload>
        <div class="reviewForm__upload-files">
          <div
            v-for="(item, index) in formState.filesPreview"
            :key="item.url"
            class="reviewForm__upload-file"
          >
            <img
              src="@/assets/svgs/icon-close.svg?url"
              alt=""
              class="reviewForm__upload-remove"
              @click="onRemoveFile(index)"
            />
            <img
              v-if="item.type === 'image'"
              :src="item.url"
              alt=""
              class="h-full w-full object-cover"
            />
            <video v-else class="bg-gray-11 h-full w-full object-cover" playsinline loop>
              <source :src="item.url" :type="item.originalType" />
              <track src="" label="" kind="captions" default />
            </video>
          </div>
        </div>
      </div>

      <a-form-item name="content" class="form-item-group reviewForm__review">
        <RTextarea
          v-model:value="formState.content"
          placeholder="Please write the review detail *"
          class="reviewForm__review-input"
          :maxlength="500"
        />
      </a-form-item>
    </a-form>
    <div v-if="isReviewed">
      <RButton
        v-if="!showFormRef"
        title="Write a review"
        class="!bg-navy-1 btn-submit !md:h-15 !md:w-[440px] !h-10 !w-full"
        class-title="text-sm md:text-base font-bold text-white"
        @click="onShowHideReview"
      />
      <RButton
        v-if="showFormRef"
        title="Register a review"
        class="!bg-navy-1 btn-submit !md:h-15 !md:w-[440px] !h-10 !w-full"
        class-title="text-sm md:text-base font-bold text-white"
        @click="handleRegisterView"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
import { emailRule, maxRule, requiredRule } from '@/helpers/validation'
import apiService from '@/http/api'
import { useRoute } from 'vue-router'
import { useNotification } from '@/composables/notification'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { storeToRefs } from 'pinia'
import { getFullName } from '@/utils/auth'

const acceptExtension = 'video/mp4,image/png,image/jpeg'

const route = useRoute()
const formRef = ref()
const showFormRef = ref(false)
const { showNotification } = useNotification()
const authUserStore = useAuthUserStore()
const { currentAuthUser } = storeToRefs(authUserStore)
const storeLoading = useGlobalLoadingStore()
const { showGlobalLoading } = storeLoading

const emits = defineEmits(['create-success'])
defineProps({
  isReviewed: {
    type: Boolean,
    default: false
  }
})

const formState = reactive({
  invalidRate: false,
  rate: 0,
  email: '',
  title: '',
  content: '',
  files: [],
  filesPreview: []
})

const rules = reactive({
  email: currentAuthUser ? [requiredRule('Email'), emailRule('Email')] : [],
  title: [requiredRule('Title'), maxRule('Title', 100)],
  content: [requiredRule('Content'), maxRule('Content', 500)],
  files: []
})

const availableAddFile = computed(() => formState.files.length < 5)

watch(
  () => currentAuthUser,
  (data) => {
    if (!data) return
    formState.email = data.value?.email
  },
  {
    deep: true
  }
)

const onChangeRate = (value) => {
  formState.invalidRate = !value
}
const onShowHideReview = () => {
  showFormRef.value = !showFormRef.value
}

const onChangeFiles = ({ file }) => {
  if (formState.files.length === 5) return

  if (!acceptExtension.includes(file.type)) return

  const type = file.type?.split('/')?.shift()

  formState.filesPreview.unshift({
    type: type,
    originalType: file.type,
    url: URL.createObjectURL(file)
  })
  formState.files.unshift(file)
}

const onRemoveFile = (index) => {
  formState.filesPreview.splice(index, 1)
  formState.files.splice(index, 1)
}

const parseImagePayload = (urls) => {
  const productReviewId = route.params.productId

  return formState.files.map((file, index) => ({
    productReviewId,
    imageFileName: file.name,
    imageFileUrl: urls[index],
    imageType: 'REVIEW',
    contentType: file.type,
    fileSize: file.size,
    displayOrder: 1
  }))
}

const resetFormData = () => {
  Object.assign(formState, {
    invalidRate: false,
    rate: 0,
    title: '',
    content: '',
    files: [],
    filesPreview: []
  })

  if (!currentAuthUser) formState.email = ''

  formRef.value.clearValidate()
}

const handleRegisterView = async () => {
  formState.invalidRate = !formState.rate

  showGlobalLoading(true)
  try {
    await formRef.value.validate()
    if (formState.invalidRate) return

    const productId = route.params.productId
    const payload = {
      productId,
      email: formState.email,
      title: formState.title,
      content: formState.content,
      rate: +formState.rate,
      imageReviewRequestList: [],
      mediaReviewRequestList: []
    }

    if (currentAuthUser) {
      payload.fullName = getFullName.value
    }

    if (formState.files.length) {
      const {
        success: uploadSuccess,
        data: uploadData,
        message: uploadMessage
      } = await apiService.uploadService.uploadFileMultiple(formState.files)

      if (!uploadSuccess) {
        showNotification({
          type: 'error',
          message: uploadMessage
        })
        return
      }
      payload.imageReviewRequestList = parseImagePayload(uploadData)
    }

    const { success, message } = await apiService.productService.createReview(payload)

    if (!success) {
      showNotification({
        type: 'error',
        message
      })
      return
    }

    showNotification({
      type: 'success',
      message: 'Review successfully!'
    })
    emits('create-success')
    resetFormData()
  } catch {
    //
  } finally {
    showGlobalLoading(false)
  }
}

onBeforeUnmount(() => {
  formState.filesPreview.forEach(({ url }) => {
    URL.revokeObjectURL(url)
  })
})
</script>

<style lang="scss" scoped>
.form-custom {
  @apply grid grid-cols-1 gap-x-2.5;
  @apply md:grid-cols-2;
}

.form-item-group {
  @apply mb-2;

  &.ant-form-item-has-error {
    @apply mb-2;
  }
}

.reviewForm {
  @apply py-7.5;
  @apply md:py-12.5 md:px-[125px];

  &__rating {
    @apply mb-[30px] flex flex-col items-center justify-center;
    @apply md:mb-[50px];

    &-rate {
      @apply text-navy-1 mb-4 text-[33px] leading-none md:text-[45px];
      @apply md:mb-5 md:text-[45px];
    }
  }

  &__upload {
    @apply order-4 flex gap-2.5;

    &-btn {
      @apply bg-gray-11 text-gray-10 flex min-h-[58px] w-[58px] min-w-[58px] max-w-[58px]
      cursor-pointer items-center justify-center rounded bg-opacity-30 text-2xl;

      @apply md:max-h-[68px] md:min-h-[68px] md:min-w-[68px] md:max-w-[68px];
    }

    &-files {
      &::-webkit-scrollbar {
        display: none !important;
      }

      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
      @apply flex gap-2.5 overflow-auto;
    }

    &-file {
      @apply relative max-h-[58px] min-h-[58px] min-w-[58px] max-w-[58px] overflow-hidden rounded;
      @apply md:max-h-[68px] md:min-h-[68px] md:min-w-[68px] md:max-w-[68px];
    }

    &-remove {
      @apply z-1 absolute right-1.5 top-1.5 cursor-pointer;
    }
  }

  &__review {
    @apply md:col-[2] md:row-[1_/_span_3];

    &-input {
      @apply h-[180px];
    }
  }
}

.btn-submit {
  @apply mt-7 w-full;
  @apply md:ml-auto md:mr-auto md:mt-10;
}
</style>
