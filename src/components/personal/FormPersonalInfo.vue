<template>
  <div>
    <a-form ref="formRef" :model="formState" :rules="rules" @finish="onSubmit">
      <div class="text-[16px font-normal]">My Picture</div>
      <div v-if="formState.isNoAvatar" class="text-center">
        <RButtonUpload accept=".jpg,.jpeg,.png" @change="onFileChange">
          <NoAvatar class="cursor-pointer" />
        </RButtonUpload>
        <p class="font-300 style-normal text-gray-14 mb-0 text-[12px]">
          ※ Upload image below 20MB.
        </p>
      </div>
      <div v-else class="text-center">
        <img
          v-if="formState.avatarUrl"
          :src="formState.avatarUrl"
          alt="avatar"
          class="mb-2.5 aspect-square h-[120px] w-[120px] rounded-full"
        />
        <div
          v-else
          class="border-1 border-navy-deep mx-auto aspect-square h-[120px] w-[120px] rounded-full border-solid pt-[51px] text-center"
        >
          <Logo class="w-[70px]" />
        </div>
        <div class="flex items-center justify-center gap-4">
          <RButtonUpload accept=".jpg,.jpeg,.png" @change="onFileChange">
            <EditIcon class="cursor-pointer" />
          </RButtonUpload>
          <DeleteIcon class="cursor-pointer" @click="formState.avatarUrl && onDeleteAvatar()" />
        </div>
      </div>
      <div v-if="formState.isExceedFile" class="text-center text-[12px] text-red-500">
        {{ formState.fileMessage }}
      </div>
      <div>
        <r-label title="Shop Name" />
        <a-form-item name="mallName" class="!mt-[10px] mb-[30px]">
          <r-input
            v-model:value="formState.mallName"
            placeholder="Please enter your personal shop name."
            :maxlength="20"
          />
        </a-form-item>
      </div>
      <div>
        <r-label title="Welcome Message" />
        <a-form-item name="wellComeMessage" class="!mt-[10px] mb-[30px]">
          <r-input
            v-model:value="formState.wellComeMessage"
            placeholder="Thank you for visiting my mall!"
            :maxlength="50"
          />
        </a-form-item>
      </div>
      <div>
        <r-label title="Additional Information" />
        <a-form-item name="additionalInfo" class="!mt-[10px] mb-[30px]">
          <r-textarea
            v-model:value="formState.additionalInfo"
            :maxlength="300"
            placeholder="Share more about yourself and your shop to give it a personal touch, such as contact information and social media links!"
          />
        </a-form-item>
      </div>
      <a-divider class="!bg-gray-11 !my-7.5" />
      <div class="text-gray-14 font-300 leading-base text-[12px]">
        *The information you enter will be displayed in the main My Personal Shop popup information.
      </div>
      <div class="mx-auto max-w-[500px] py-6">
        <div class="flex gap-2">
          <RButton title="Cancel" class="!text-navy-6 w-1/2" @click="onCancel" />
          <RButton
            title="Save"
            html-type="submit"
            class="!bg-navy-6 w-1/2 !text-white disabled:!bg-opacity-70"
          />
        </div>
      </div>
    </a-form>
  </div>
  <RModalAlert
    v-model:visible="isShowModalAlert"
    title="Alarm"
    text-btn="Ok"
    :description="descriptionModal"
    :width="350"
    @confirm="isShowModalAlert = false"
  />
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import NoAvatar from '@/assets/svgs/personal/no-avatar.svg'
import EditIcon from '@/assets/svgs/personal/edit.svg'
import DeleteIcon from '@/assets/svgs/personal/delete.svg'
import Logo from '@/assets/icons/Logo.vue'
import { useAlertConfirm } from '@/composables/alert'
import apiService from '@/http/api'
import { useMutation } from 'vue-query'
import { useAuthUserStore } from '@/stores/modules/auth-user'
import { storeToRefs } from 'pinia'
import RButtonUpload from '../common/RButtonUpload.vue'
import router from '@/router'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { addPrefixForImage } from '@/utils/common'
import { ImageActionEnum } from '@/helpers/enum'

const { currentAuthUser } = storeToRefs(useAuthUserStore())
const { showGlobalLoading } = useGlobalLoadingStore()

const isShowModalAlert = ref(false)
const descriptionModal = ref('')

const formRef = ref()
const formState = reactive({
  mallName: '',
  wellComeMessage: '',
  additionalInfo: '',
  avatar: '',
  isNoAvatar: true,
  hasData: false,
  isExceedFile: false,
  fileMessage: '',
  avatarUrl: '',
  imageActionType: ImageActionEnum.NONE
})

const rules = reactive({})

const { mutate: mutationCreateMallInfo } = useMutation(
  async (payload) => {
    const response = await apiService.myPageService.createMyPersonalMall(
      currentAuthUser.value?.userSeqNo,
      payload
    )
    return response
  },
  {
    onSuccess: (response) => {
      showGlobalLoading(false)
      resetFileValidate()
      getMyPersonalMall()
      if (response.success) {
        descriptionModal.value = 'Shop information has been saved'
      } else {
        descriptionModal.value = response?.message || 'Something went wrong!'
      }
      isShowModalAlert.value = true
    }
  }
)

const { mutate: mutationEditMallInfo } = useMutation(
  async (payload) => {
    const response = await apiService.myPageService.updateMyPersonalMall(
      currentAuthUser.value?.userSeqNo,
      payload
    )
    return response
  },
  {
    onSuccess: (response) => {
      showGlobalLoading(false)
      resetFileValidate()
      getMyPersonalMall()
      if (response.success) {
        descriptionModal.value = 'Shop information has been saved'
      } else {
        descriptionModal.value = response?.message || 'Something went wrong!'
      }
      isShowModalAlert.value = true
    }
  }
)

const resetFileValidate = () => {
  formState.isExceedFile = false
  formState.fileMessage = ''
  formState.isNoAvatar = false
}

const onSubmit = async () => {
  try {
    await formRef.value.validate()
    const payload = new FormData()
    payload.append('mallName', formState.mallName || '')
    payload.append('message1', formState.wellComeMessage || '')
    payload.append('message2', formState.additionalInfo || '')
    if (formState.avatar && formState.imageActionType !== ImageActionEnum.REMOVE) {
      payload.append('profileImage', formState.avatar)
    }
    showGlobalLoading(true)
    if (!formState.hasData) {
      mutationCreateMallInfo(payload)
    } else {
      payload.append('imageActionType', formState.imageActionType)
      mutationEditMallInfo(payload)
    }
  } catch (error) {
    console.log(error)
    showGlobalLoading(false)
  }
}

const onCancel = async () => {
  const isOk = await useAlertConfirm({
    content: 'Do you want to cancel editing your shop information?'
  })

  if (isOk) {
    router.back()
  }
}

const getMyPersonalMall = async () => {
  formState.imageActionType = ImageActionEnum.NONE
  const { data, success } = await apiService.myPageService.getMyPersonalMall(
    currentAuthUser.value?.userSeqNo
  )
  if (success && data?.isExistPersonalMall) {
    formState.additionalInfo = data?.userPersonalMallInfoResponse?.message2
    formState.mallName = data?.userPersonalMallInfoResponse?.mallName
    formState.wellComeMessage = data?.userPersonalMallInfoResponse?.message1
    formState.hasData = true
    if (!data?.userPersonalMallInfoResponse?.profileUrl) {
      formState.avatarUrl = ''
      formState.isNoAvatar = false
    } else {
      formState.avatarUrl = addPrefixForImage(data?.userPersonalMallInfoResponse?.profileUrl)
      formState.isNoAvatar = false
    }
  } else {
    formState.hasData = false
  }
}

const onFileChange = (e) => {
  if (e?.file) {
    const fileName = e?.file?.name
    const extension = fileName?.split('.')?.pop()
    if (!['jpg', 'jpeg', 'png'].includes(extension)) {
      isShowModalAlert.value = true
      descriptionModal.value = 'Please select correct image file!'
      return
    }
    const isMatchSize = e?.file?.size / 1024 / 1024 <= 20
    if (isMatchSize) {
      formState.avatar = e?.file
      formState.isExceedFile = false
      formState.fileMessage = ''
      formState.isNoAvatar = false
      formState.avatarUrl = URL.createObjectURL(e?.file)
      formState.imageActionType = ImageActionEnum.EDIT
    } else {
      formState.isExceedFile = true
      formState.fileMessage = 'Your file size must <= 20mb'
    }
  }
}

const onDeleteAvatar = async () => {
  const isOk = await useAlertConfirm({
    content: 'Do you want to delete your profile image?'
  })

  if (isOk) {
    formState.avatarUrl = ''
    formState.isNoAvatar = true
    formState.isExceedFile = false
    formState.fileMessage = ''
    formState.imageActionType = ImageActionEnum.REMOVE
  }
}

onMounted(() => {
  getMyPersonalMall()
})
</script>
