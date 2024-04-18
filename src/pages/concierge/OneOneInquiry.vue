<template>
  <div class="inquiryForm">
    <div class="text-gray-10 hidden pb-4 text-center text-[30px] font-medium md:block">
      Customer Support Ticket
    </div>
    <div class="mb-4 flex items-center justify-center gap-[10px]">
      <span
        class="bg-gray-11 cursor-pointer rounded-full px-6 py-2 text-[16px]"
        :class="{ tabActive: checkCurrentFormType(InquiryFormType.ORDER_INQUIRY) }"
        @click="formState.formType = InquiryFormType.ORDER_INQUIRY"
      >Inquiry after ordering</span
      >
      <span
        class="bg-gray-11 cursor-pointer rounded-full px-6 py-2 text-[16px]"
        :class="{ tabActive: checkCurrentFormType(InquiryFormType.GENERAL_INQUIRY) }"
        @click="chooseGeneralInquiry()"
      >General Inquiry</span
      >
    </div>
    <div>
      <span
        v-if="checkCurrentFormType(InquiryFormType.ORDER_INQUIRY)"
        class="bg-navy-deep mb-3 inline-block cursor-pointer px-3 py-1 text-[14px] text-white"
        @click="getOrderNum()"
      >
        Find Order
      </span>
      <span class="mx-4 font-medium"> {{ orderState.orderNumber }}</span>
    </div>
    <a-form ref="formRef" :model="formState" :rules="rules" class="w-full" @finish="onSubmit">
      <RLabel title="Type of Inquiry" required />
      <a-form-item name="type" class="form-item-group">
        <RSelect v-model:value="formState.type" placeholder="Select" :options="INQUIRY_OPTIONS" />
      </a-form-item>
      <RLabel title="Title" required />
      <a-form-item name="title" class="form-item-group">
        <RInput v-model:value="formState.title" :maxlength="50" placeholder="Title" />
      </a-form-item>
      <RLabel title="Content" required />
      <a-form-item name="content" class="form-item-group inquiryForm__review">
        <RTextarea
          v-model:value="formState.content"
          placeholder="Please write your message"
          class="inquiryForm__review-input"
          :maxlength="1000"
        />
      </a-form-item>
      <RLabel title="Image" />
      <div class="inquiryForm__upload">
        <RButtonUpload :accept="acceptExtension" multiple @change="onChangeFiles">
          <div class="inquiryForm__upload-btn">+</div>
        </RButtonUpload>
        <div class="inquiryForm__upload-files">
          <div
            v-for="(item, index) in formState.filesPreview"
            :key="item.url"
            class="inquiryForm__upload-file"
          >
            <img
              src="@/assets/svgs/icon-close.svg?url"
              alt=""
              class="inquiryForm__upload-remove"
              @click="onRemoveFile(index)"
            />
            <img :src="item.url" alt="" class="h-full w-full object-cover" />
          </div>
        </div>
      </div>
      <div class="style-normal text-gray-14 leading-base pt-1 text-[12px] font-normal">
        ※ Upload up to 3 photos within 20MB.
      </div>
      <div class="!pt-[30px]">
        <RLabel title="Cell Phone Number" />
        <a-form-item name="cellPhone" class="form-item-group !mb-1">
          <RInput
            v-model:value="formState.cellPhone"
            :maxlength="14"
            :readonly="formState.isHavePhone"
          />
        </a-form-item>
      </div>
      <div class="style-normal text-gray-14 leading-base text-[12px] font-normal">
        To receive notifications, please provide us with your cell phone number.
      </div>

      <div class="flex justify-center gap-4">
        <RButton
          title="Cancel"
          class="!bg-navy-6 my-10 w-1/2 !border-none !opacity-20 md:w-1/4"
          class-title="text-white text-[14px] leading-base font-550 style-normal"
          @click="onCancel"
        />
        <RButton
          html-type="submit"
          title="Submit"
          class="!bg-navy-6 my-10 w-1/2 !border-none md:w-1/4"
          class-title="text-white text-[14px] leading-base font-550 style-normal"
        />
      </div>
    </a-form>
  </div>
  <RModalAlert
    v-model:visible="formState.isShowModalConfirm"
    title="Alarm"
    text-btn="Confirm"
    :description="formState.descriptionModal"
    :width="400"
    @confirm="onConfirmData"
  />

  <RModalAlert v-model:visible="formState.isShowModalOrder" :width="500" :footer="false">
    <template #extraDescription>
      <div class="text-left">
        <div class="-mt-4 text-[18px]">
          Order Lists
          <span class="float-right cursor-pointer" @click="closeOrderModal()">
            <CloseOutlined />
          </span>
        </div>
        <div><a-divider class="!my-2" /></div>
        <div>
          <span
            v-for="item in OrderButton"
            :key="item.value"
            class="border-1 -mr-[0.5px] cursor-pointer border-solid px-2 py-1"
            :class="{
              'bg-navy-deep border-1 border-navy-deep border-solid text-white': getCurrentOrderTab(
                item.value
              )
            }"
            @click="chooseOrderTab(item.value)"
          >
            {{ item.label }}
          </span>
        </div>
        <div class="mt-4 max-h-[500px] overflow-y-auto">
          <template v-if="orderState.lists?.length">
            <div v-for="item in orderState.lists" :key="item.orderNumber" class="mb-5">
              <div class="bg-grey-1 relative px-2 py-1">
                <span class="inline-block w-[96px]">Order Number</span>
                <span class="px-3">{{ item.orderNumber }}</span>
                <span
                  class="bg-navy-deep absolute right-2 cursor-pointer rounded-sm px-1 text-white"
                  @click="selectOrder(item.orderNumber)"
                >
                  Select
                </span>
              </div>
              <div>
                <div class="flex p-3">
                  <div class="w-[100px]">Product List</div>
                  <div class="w-[60px]">
                    <img
                      :src="addPrefixForImage(item.thumbnailUrl)"
                      width="50"
                      height="50"
                      alt=""
                    />
                  </div>
                  <div class="text-name">{{ item.productName }}</div>
                </div>
              </div>
            </div>
          </template>
          <div v-else class="h-[500px] max-h-[500px] text-[16px]">No order found</div>
        </div>
      </div>
    </template>
  </RModalAlert>
</template>
<script setup>
import { reactive, ref, watch, onMounted } from 'vue'
import { phoneRule, requiredRule } from '@/helpers/validation'
import { InquiryFormType, TimeZoneEnum } from '@/helpers/enum'
import { INQUIRY_OPTIONS } from '@/helpers/constant'
import { ALPHABETS, ESCAPE } from '@/helpers/regex'
import { useMutation } from 'vue-query'
import apiService from '@/http/api'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { CONCIERGE_MESSAGE } from '@/helpers/validate-message'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { storeToRefs } from 'pinia'
import router from '@/router'
import { AppRoutes } from '@/router/path'
import { convertTimezone, getDateMonthRange } from '@/utils/datetime'
import { addPrefixForImage } from '@/utils/common'
import { CloseOutlined } from '@ant-design/icons-vue'
import { formatCellphoneToSend, formatPhoneNumber } from '@/utils/common'

const authUserStore = useAuthUserStore()
const loadingStore = useGlobalLoadingStore()
const { showGlobalLoading } = loadingStore
const { currentAuthUser } = storeToRefs(authUserStore)
const formState = reactive({
  type: undefined,
  title: undefined,
  content: undefined,
  cellPhone: undefined,
  files: [],
  isShowModalConfirm: false,
  descriptionModal: '',
  formType: InquiryFormType.ORDER_INQUIRY,
  filesPreview: [],
  isSuccess: false,
  isShowModalOrder: false,
  isHavePhone: false
})

const onCancel = () => {
  Object.assign(formState, {
    type: undefined,
    title: undefined,
    content: undefined,
    files: [],
    isShowModalConfirm: false,
    descriptionModal: '',
    formType: InquiryFormType.ORDER_INQUIRY,
    filesPreview: [],
    isSuccess: false,
    isShowModalOrder: false
  })
}

const acceptExtension = '.jpg, .jpeg, .png, .gif'

const formRef = ref()

const rules = reactive({
  type: [requiredRule('Type')],
  title: [requiredRule('Title')],
  content: [requiredRule('Content')],
  cellPhone: [phoneRule('Cell Phone')],
  files: []
})

const chooseGeneralInquiry = () => {
  formState.formType = InquiryFormType.GENERAL_INQUIRY
  orderState.orderNumber = undefined
}

const OrderButton = [
  {
    label: 'Standard Order',
    value: 'GENERAL_ORDER'
  },
  {
    label: 'Autoship Order',
    value: 'REGULAR_DELIVERY_ORDER'
  }
]

const orderState = reactive({
  tab: OrderButton[0].value,
  lists: [],
  orderNumber: undefined
})

const chooseOrderTab = (tab) => {
  orderState.tab = tab
  getOrderLists()
}

const getOrderNum = (tab = OrderButton[0].value) => {
  formState.isShowModalOrder = true
  orderState.tab = tab
  getOrderLists()
}

const getCurrentOrderTab = (tab) => tab === orderState.tab

const getOrderLists = async () => {
  try {
    const params = {
      pageNumber: 1,
      pageSize: 20,
      endDate: convertTimezone(`${getDateMonthRange(3, 'months').end} ${TimeZoneEnum.END_TIME}`),
      startDate: convertTimezone(
        `${getDateMonthRange(3, 'months').start} ${TimeZoneEnum.START_TIME}`
      ),
      orderType: orderState.tab
    }
    const response = await apiService.myPageService.getOrderHistory(params)
    orderState.lists = response?.success ? response?.data?.list : []
    showGlobalLoading(false)
  } catch (error) {
    //
    showGlobalLoading(false)
  }
}

const closeOrderModal = () => {
  orderState.orderNumber = undefined
  formState.isShowModalOrder = false
}

const onConfirmData = () => {
  formState.isShowModalConfirm = false
  if (formState.isSuccess) router.push(AppRoutes.customerFaq)
}

const selectOrder = (item) => {
  orderState.orderNumber = item
  formState.isShowModalOrder = false
}

const onChangeFiles = ({ file }) => {
  const type = file.type?.split('/')?.shift()
  const fileName = file?.name
  const extension = fileName?.split('.')?.pop()
  if (!acceptExtension?.includes(extension)) {
    return
  }

  if (formState.files.length === 3) return

  if (!['image'].includes(type)) {
    return
  }

  formState.filesPreview.push({
    type: 'image',
    originalType: file.type,
    url: URL.createObjectURL(file)
  })
  formState.files.push(file)
}

const onRemoveFile = (index) => {
  formState.filesPreview.splice(index, 1)
  formState.files.splice(index, 1)
}

const checkCurrentFormType = (type) => type === formState.formType

const { mutate: registerInquiry } = useMutation(
  async (payload) => {
    return await apiService.conciergeService.registerInquiryOneToOne(payload)
  },
  {
    onSuccess: (data) => {
      if (data?.success && data?.data) {
        formState.descriptionModal = CONCIERGE_MESSAGE.createInquirySuccess
        formRef.value.resetFields()
        formState.filesPreview = []
        formState.files = []
        formState.isSuccess = true
        orderState.orderNumber = undefined
      } else {
        formState.isSuccess = false
        formState.descriptionModal = data?.message || CONCIERGE_MESSAGE.error
      }
      formState.isShowModalConfirm = true
      showGlobalLoading(false)
    },
    onError: () => {
      formState.isSuccess = false
      showGlobalLoading(false)
    }
  }
)

const onSubmit = async () => {
  try {
    formState.title = formState.title?.trim()
    formState.content = formState.content?.trim()
    await formRef.value.validate()
    if (formState.formType === InquiryFormType.ORDER_INQUIRY && !orderState.orderNumber) {
      formState.descriptionModal = 'Please select order number!'
      formState.isShowModalConfirm = true
      return
    }
    showGlobalLoading(true)
    const type = INQUIRY_OPTIONS.find((el) => el.value === formState.type)
    const payload = new FormData()
    const submitData = {
      inquiryTitle: formState.title,
      inquiryFormType: formState.formType,
      inquiryType: type.enum,
      inquiryContents: formState.content,
      salesOrderNumber:
        formState.formType === InquiryFormType.ORDER_INQUIRY ? orderState.orderNumber : null,
      userId: Number(currentAuthUser?.value?.userSeqNo) || null,
      isAnswerAlarm: false
    }

    for (const keyItem in submitData) {
      payload.append(keyItem, submitData[keyItem])
    }

    if (formState.cellPhone) {
      payload.append('telNo', formatCellphoneToSend(formState.cellPhone))
    }

    if (formState.filesPreview.length) {
      for (let i = 0; i < formState.files.length; i++) {
        const file = formState.files[i]
        payload.set(`inquiryAttachmentList[${i}]`, file)
      }
    }

    registerInquiry(payload)
  } catch (error) {
    showGlobalLoading(false)
  }
}

watch(
  () => formState.cellPhone,
  (newVal) => {
    formState.cellPhone = formatPhoneNumber(
      String(newVal).replace(ALPHABETS, '').replace(ESCAPE, '')
    )
  }
)

const getUserPhoneNumber = () => {
  if (currentAuthUser && currentAuthUser?.value) {
    if (currentAuthUser.value?.mobileNumber) {
      formState.cellPhone = formatPhoneNumber(
        String(currentAuthUser.value?.mobileNumber).replace(ALPHABETS, '').replace(ESCAPE, '')
      )
      formState.isHavePhone = true
    }
  }
}

onMounted(() => {
  getUserPhoneNumber()
})
</script>
<style lang="scss" scoped>
.inquiryForm {
  @apply lg:px-[125px] lg:py-[50px];

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

  .tabActive {
    @apply bg-navy-6 text-white;
  }
}

.text-name {
  width: calc(100% - 160px);
}
</style>
