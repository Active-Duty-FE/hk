<script setup>
import SubTitle from '@/components/return-exchange/SubTitle.vue'
import { reactive, ref, computed, watch } from 'vue'
import { DEFAULT_REASONS, RETURN_EXCHANGE_TABS, RETURN_ORDER_REASON_TYPE } from '@/helpers/constant'
import { useNotification } from '@/composables/notification'
import apiService from '@/http/api'
import { useAlertConfirm } from '@/composables/alert'
import { VALIDATE_MESSAGE } from '@/helpers/validate-message'
import { useRouter } from 'vue-router'

const ACCESS_EXTENSION = 'video/*,image/*'

const RETURN_EXCHANGE_TYPE = ['RETURN', 'EXCHANGE']

defineProps({
  title: {
    default: undefined,
    type: String,
    required: false
  },
  orderInfo: {
    type: Object,
    default: undefined
  }
})

const emit = defineEmits(['updateStep', 'changeFormData'])
const { showNotification } = useNotification()
const router = useRouter()
const currentTab = ref(0)
const activeKey = ref()

const tabs = reactive(RETURN_EXCHANGE_TABS)
const reasons = reactive(DEFAULT_REASONS)

const pageState = reactive({
  loading: false
})

const formState = reactive({
  files: [],
  returnOrderReasonType: '',
  returnReasonDetail: '',
  returnReasonOtherDetail: '',
  imageReturnRequestList: [],
  returnExchangeType: RETURN_EXCHANGE_TYPE[0]
})
const rules = reactive({
  returnReasonOtherDetail: [{ validator: validateContent, trigger: 'change' }]
})

const isReasonOther = computed(() => {
  return formState.returnReasonDetail === 'Other'
})

function validateContent(_, value) {
  if (isReasonOther.value) {
    if (!value) {
      return Promise.reject(`${VALIDATE_MESSAGE.required} content .`)
    }
    if (value.length > 500) {
      return Promise.reject('Do not enter content exceeding 500 characters.')
    } else {
      return Promise.resolve()
    }
  }
}

const filterReasonIds = computed(() =>
  currentTab.value
    ? reasons?.ids.filter((id) => !reasons.entities[id]?.showOnExchange)
    : reasons?.ids
)

const onUpdate = (data) => {
  formState.returnExchangeType = RETURN_EXCHANGE_TYPE[data]
  currentTab.value = data
}

const clearData = () => {
  formState.returnOrderReasonType = ''
  formState.returnReasonDetail = ''
}

const onChange = (e) => {
  clearData()
  activeKey.value = e.pop()
  formState.returnReasonDetail = getReason(activeKey.value)?.option?.at(0)?.value
  formState.returnOrderReasonType = activeKey.value
}

const onRemoveFile = (index) => {
  formState.files.splice(index, 1)
  formState.imageReturnRequestList.splice(index, 1)
}

const onChangeFiles = async ({ file }) => {
  const type = file.type?.split('/')?.shift()

  if (formState.files.length === 3) {
    showNotification({
      type: 'error',
      message: 'You can upload up to 3 files.'
    })
    return
  }

  if (!['image', 'video'].includes(type)) {
    return
  }

  formState.files.push(file)

  if (file) {
    pageState.loading = true
    const {
      success: uploadSuccess,
      data: uploadData,
      message: uploadMessage
    } = await apiService.uploadService.orderUploadFileMultiple([file])

    pageState.loading = false

    if (!uploadSuccess) {
      showNotification({
        type: 'error',
        message: uploadMessage
      })
      return
    }

    const fileUploaded = uploadData.at(0)
    formState.imageReturnRequestList.push({
      previewUrl: URL.createObjectURL(file),
      originalFileName: file?.name,
      uploadedFileName: fileUploaded.replace('return/', ''),
      imageFileUrl: fileUploaded,
      contentType: file?.type,
      type: type === 'image' ? 'image' : 'video'
    })
  }
}

const onSubmit = () => {
  let msg = ''
  if (!formState.returnOrderReasonType) {
    msg = 'Please select a reason'
  }

  if (
    formState.returnOrderReasonType &&
    isReasonOther.value &&
    (!formState.returnReasonOtherDetail || formState.returnReasonOtherDetail.length > 500)
  ) {
    msg = 'Please check reason again .'
  }

  if (
    !formState.imageReturnRequestList.length &&
    formState.returnOrderReasonType !== RETURN_ORDER_REASON_TYPE.MISTAKE
  ) {
    msg = 'Please register an image'
  }

  if (msg) {
    showNotification({
      type: 'error',
      message: msg
    })
    return
  }
  emit('changeFormData', formState)
}

const onCancel = async () => {
  const confirm = await useAlertConfirm({
    content: 'Do you want to cancel the return or exchange application?',
    okText: 'Ok',
    cancelText: 'Cancel'
  })
  if (!confirm) return
  router.back()
}

function getReason(id) {
  return reasons.entities[id]
}

watch(
  () => formState.returnReasonDetail,
  () => (formState.returnReasonOtherDetail = '')
)
</script>

<template>
  <SubTitle :title="title"> </SubTitle>
  <a-form ref="formRef" :model="formState" :rules="rules">
    <div class="px-5">
      <p class="text-[18px]">Choose a Method</p>
    </div>
    <RTabCustom :tabs="tabs" :model-value="currentTab" @update:model-value="onUpdate" />
    <div class="px-5 py-[30px]">
      <a-space direction="vertical" class="custom-collapse w-full">
        <a-collapse
          v-for="id in filterReasonIds"
          :key="id"
          v-model:activeKey="activeKey"
          @change="onChange"
        >
          <a-collapse-panel :key="id" :show-arrow="false" :header="getReason(id).label">
            <div v-if="getReason(id)?.option?.length">
              <p class="text-gray-10 mb-[10px] text-[14px]">Select Detailed reason</p>
              <r-select
                v-model:value="formState.returnReasonDetail"
                class="w-full"
                :placeholder="getReason(id)?.option?.at(0)?.label"
                :options="getReason(id).option"
              />
            </div>
          </a-collapse-panel>
        </a-collapse>
      </a-space>
      <a-form-item v-if="isReasonOther" name="returnReasonOtherDetail">
        <div class="flex">
          <r-label
            title="Content"
            class-title="font-475 text-gray-10 mb-[10px] h-fit text-[16px]"
          />
          <p class="text-gray-14 mb-0 ml-auto text-[12px]">
            {{ formState.returnReasonOtherDetail.length }}/500
          </p>
        </div>
        <RTextarea
          v-model:value="formState.returnReasonOtherDetail"
          placeholder="Please write detailed reason"
          :rules="rules.returnReasonOtherDetail"
        />
      </a-form-item>
      <a-form-item>
        <r-label title="Image" class-title="font-475 text-gray-10  h-fit text-[16px]" />
        <div class="reviewForm__upload mt-[10px]">
          <RButtonUpload :accept="ACCESS_EXTENSION" multiple @change="onChangeFiles">
            <div class="reviewForm__upload-btn">+</div>
          </RButtonUpload>
          <div class="reviewForm__upload-files">
            <div
              v-for="(item, index) in formState.imageReturnRequestList"
              :key="item.imageFileUrl"
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
                :src="item.previewUrl"
                alt=""
                class="h-full w-full object-cover"
              />
              <video v-else class="bg-gray-11 h-full w-full object-cover" playsinline loop>
                <source :src="item.previewUrl" :type="item.contentType" />
                <track src="" label="" kind="captions" default />
              </video>
            </div>
          </div>
        </div>
        <p class="text-gray-14 font-400 mt-[10px] text-[12px]">
          If the return or exchange is attributable to the company, please upload an image.
        </p>
      </a-form-item>

      <div class="flex gap-[5px]">
        <r-button
          class-title="text-navy-1"
          title="Cancel"
          height="54px"
          class="disabled:(!bg-navy-4 border-1 !border-navy-4) !mx-auto w-full"
          @click="onCancel"
        />
        <r-button
          class-title="text-white"
          title="Confirm"
          height="54px"
          html-type="submit"
          :disabled="pageState.loading"
          class="!bg-navy-1 disabled:(!bg-navy-4 border-1 !border-navy-4) !mx-auto w-full"
          @click="onSubmit"
        />
      </div>
    </div>
  </a-form>
</template>

<style lang="scss" scoped>
.custom-collapse {
  @apply mb-[30px];
  :deep(.ant-collapse-header) {
    @apply text-navy-3 font-550 h-[50px] justify-center border-white bg-white  text-center text-base leading-[28px] shadow-none;
  }

  :deep(.ant-collapse) {
    @apply border-1 border-navy-3 border-solid;
    .ant-collapse-item-active {
      @apply border-1 border-navy-6 border-solid;
    }
  }
  :deep(.ant-collapse-content) {
    .ant-collapse-content-box {
      @apply p-5;
    }
  }

  :deep(.ant-collapse-item-active) {
    .ant-collapse-header {
      @apply rounded-0 border-1 border-b-solid border-navy-6  text-navy-6;
    }
  }
}

.ant-collapse {
  :deep(.ant-collapse-header) {
    @apply px-1 tracking-tighter;
  }
  :deep(.ant-collapse-no-arrow > .ant-collapse-header) {
    @apply pl-1;
  }
}

.ant-form-item {
  @apply mb-[30px];
}
.wrap-checkbox {
  :deep(.ant-checkbox-checked) {
    &::after {
      border-color: #123250 !important;
    }

    .ant-checkbox-inner {
      @apply bg-navy-1;
    }
  }

  :deep(.ant-checkbox-inner) {
    border-color: #d3d3d3 !important;
  }
}

.reviewForm {
  @apply lg:border-1 lg:border-gray-10 lg:border-solid lg:px-[125px] lg:py-[50px];

  &__rating {
    @apply mb-[30px] flex flex-col items-center justify-center;
    @apply lg:mb-[50px];

    &-rate {
      @apply text-navy-1 mb-4 text-[33px] leading-none lg:text-[45px];
      @apply lg:mb-5 lg:text-[45px];
    }
  }

  &__upload {
    @apply order-4 flex gap-2.5;

    &-btn {
      @apply bg-gray-11 text-gray-10 flex min-h-[58px] w-[58px] min-w-[58px] max-w-[58px]
      cursor-pointer items-center justify-center rounded bg-opacity-30 text-2xl;

      @apply lg:max-h-[68px] lg:min-h-[68px] lg:min-w-[68px] lg:max-w-[68px];
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
      @apply lg:max-h-[68px] lg:min-h-[68px] lg:min-w-[68px] lg:max-w-[68px];
    }

    &-remove {
      @apply z-1 absolute right-1.5 top-1.5 cursor-pointer;
    }
  }

  &__review {
    @apply lg:col-[2] lg:row-[1_/_span_3];

    &-input {
      @apply h-[180px];
    }
  }
}
</style>
