<script setup>
import RSwitch from '@/components/common/RSwitch.vue'
import { reactive, markRaw, onMounted } from 'vue'
import GoogleIcon from '@/assets/svgs/google-icon.svg'
import FacebookIcon from '@/assets/svgs/facebook-icon.svg'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import apiService from '@/http/api'
import { SNSEnum } from '@/helpers/enum'
import { initFacebookSdk } from '@/utils/authenticate'
import { googleSdkLoaded } from 'vue3-google-login'
import { GOOGLE_CLIENT_ID } from '@helpers/constant'
import { useAlert } from '@/composables/alert'

initFacebookSdk()

const globalLoading = useGlobalLoadingStore()
const { showGlobalLoading } = globalLoading

const SNS_LIST_DEFAULT = [
  {
    icon: markRaw(FacebookIcon),
    title: 'Connect to Facebook',
    checked: false,
    code: SNSEnum.FACEBOOK
  },
  {
    icon: markRaw(GoogleIcon),
    title: 'Connect to Google',
    checked: false,
    code: SNSEnum.GOOGLE
  }
]
const snsList = reactive([...SNS_LIST_DEFAULT])

const getSocialAccount = async () => {
  try {
    showGlobalLoading(true)
    const { data, success } = await apiService.myPageService.getSocialAccount()
    if (success && data?.socialConnectingInfoList?.length) {
      snsList?.forEach((snsItem) => {
        data.socialConnectingInfoList?.forEach((resItem) => {
          if (snsItem.code === resItem?.socialType?.code) {
            snsItem.checked = !!resItem?.connected
            return
          }
        })
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    showGlobalLoading(false)
  }
}

const connectSocialAccount = async (socialType, tokenSocial) => {
  try {
    showGlobalLoading(true)

    if (!tokenSocial) {
      return
    }

    const payload = {
      tokenSocial,
      socialType
    }
    const { success, data, message } = await apiService.myPageService.connectSocialAccount(payload)
    if (success && data?.socialConnectingInfoList?.length) {
      snsList?.forEach((snsItem) => {
        data.socialConnectingInfoList?.forEach((resItem) => {
          if (snsItem.code === resItem?.socialType?.code) {
            snsItem.checked = !!resItem?.connected
            return
          }
        })
      })
    }

    if (!success) {
      useAlert({
        content: message
      })
      snsList?.forEach((snsItem) => {
        if (snsItem.code === socialType) {
          snsItem.checked = false
          return
        }
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    showGlobalLoading(false)
  }
}

const disconnectSocialAccount = async (socialType) => {
  try {
    showGlobalLoading(true)

    const payload = {
      socialType
    }
    const { success, data, message } = await apiService.myPageService.disconnectSocialAccount(
      payload
    )
    if (success && data?.socialConnectingInfoList?.length) {
      snsList?.forEach((snsItem) => {
        data.socialConnectingInfoList?.forEach((resItem) => {
          if (snsItem.code === resItem?.socialType?.code) {
            snsItem.checked = !!resItem?.connected
            return
          }
        })
      })
      return
    }
    if (!success) {
      useAlert({
        content: message
      })
      snsList?.forEach((snsItem) => {
        if (snsItem.code === socialType) {
          snsItem.checked = true
          return
        }
      })
    }
  } catch (error) {
    console.error(error)
  } finally {
    showGlobalLoading(false)
  }
}

const loginFacebook = async () => {
  const { authResponse } = await new Promise(window.FB.login)
  if (authResponse?.accessToken) {
    connectSocialAccount(SNSEnum.FACEBOOK, authResponse.accessToken)
  }
}

const loginGoogle = () => {
  googleSdkLoaded((google) => {
    google.accounts.oauth2
      .initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/userinfo.profile',
        callback: async (response) => {
          if (response?.access_token) {
            connectSocialAccount(SNSEnum.GOOGLE, response?.access_token)
          }
        }
      })
      .requestAccessToken()
  })
}

const onToggleChange = (code, checked) => {
  switch (code) {
    case SNSEnum.FACEBOOK:
      if (checked) {
        loginFacebook()
        break
      } else {
        disconnectSocialAccount(SNSEnum.FACEBOOK)
        break
      }
    case SNSEnum.GOOGLE:
      if (checked) {
        loginGoogle()
        break
      } else {
        disconnectSocialAccount(SNSEnum.GOOGLE)
        break
      }
    default:
      break
  }
}

onMounted(() => {
  getSocialAccount()
})
</script>
<template>
  <div class="sns-account-wrapper flex justify-center">
    <div class="content max-w-112">
      <div class="font-475 mt-[50px] text-center text-base leading-[22px]">
        Sign in conveniently by connecting to your social media account.
      </div>
      <div class="sns-list mt-[40px]">
        <div v-for="(item, index) in snsList" :key="index" class="item">
          <div class="flex items-center">
            <div class="m-r-[10px]">
              <component :is="item.icon" class="mb-[-6px]" />
            </div>
            <div>{{ item.title }}</div>
          </div>
          <RSwitch
            v-model:model-value="item.checked"
            @update:model-value="onToggleChange(item.code, item.checked)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.sns-account-wrapper {
  .sns-list {
    .item {
      @apply flex items-center justify-between border-[1px] border-solid border-[#212121] px-[20px] py-[30px];
    }
    .item + .item {
      border-top: none;
    }
  }
}
</style>
