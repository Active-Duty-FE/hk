<template>
  <div class="container-custom flex min-h-screen lg:h-screen lg:items-center">
    <div class="mx-auto w-[367px] bg-white md:w-[500px]">
      <div class="flex h-[530px] min-h-full flex-col px-5 py-[30px]">
        <div class="">
          <p class="font-550 text-gray-10 text-center text-[18px] leading-normal">
            {{ $t('common.find_account') }}
          </p>
          <p
            class="text__description mx-auto mb-[36px] w-[292px] text-center text-[12px] font-normal leading-normal"
          >
            {{ displayTextByStatus() }}
          </p>
        </div>
        <div v-if="!dataVerify.status" class="h-full">
          <form-find-account :change-status="changeStatusVerify" />
        </div>
        <div v-else class="flex h-full flex-col">
          <div>
            <span>{{ $t('common.id') }}</span>
          </div>
          <div class="border-1 border-solid border-black bg-white p-[12px]">
            <span>{{ dataVerify?.userId }}</span>
          </div>

          <div class="mt-auto flex items-center justify-center gap-2">
            <r-button
              :title="$t('auth.find_account.go_sign_in')"
              class="w-full"
              @click="handleTransit(`${AppRoutes.login.path}`)"
            />l
            <r-button
              :title="$t('common.reset_password')"
              type="primary"
              class="!bg-navy-1 !border-navy-1 w-full"
              @click="handleTransit(`${AppRoutes.resetPassword.path}`)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { AppRoutes } from '@/router/path'
import { useI18n } from 'vue-i18n'
import FormFindAccount from '@/components/app/authentication/FormFindAccount.vue'
import RButton from '@/components/common/RButton.vue'
import storage from '@/utils/storage'
import { STORAGE_USER_NUMBER_FIND_ACCOUNT } from '@/helpers/constant'

const { t } = useI18n()
const router = useRouter()
const dataVerify = reactive({
  status: false,
  userId: ''
})

const changeStatusVerify = (data) => {
  Object.assign(dataVerify, data)
}
const changeDataAutoFillFindAccount = () => {
  const newData = {
    userNumber: dataVerify.userId,
    auto: true
  }
  storage.set(STORAGE_USER_NUMBER_FIND_ACCOUNT, newData)
}

const handleTransit = (url) => {
  changeDataAutoFillFindAccount()
  router.push(url)
}

const displayTextByStatus = () => {
  return dataVerify.status ? t('auth.find_account.content_1') : t('auth.find_account.content_2')
}
</script>
<style lang="scss" scoped>
.container-custom {
  background-image: url('@/assets/images/login-bg.webp');
  @apply flex min-h-full items-center justify-center p-5;
  @apply lg:min-h-screen;
}
.authenticate-tabs {
  width: 100%;

  :deep(.ant-tabs-nav-wrap) {
    height: 50px;
    flex-direction: column-reverse;

    .ant-tabs-nav-list {
      height: 50px;
      @apply bg-gray-6;
    }
  }

  :deep(.ant-tabs-tab) {
    width: 50vw;
    @apply bg-gray-6 justify-center;

    .ant-tabs-tab-btn {
      @apply text-gray-2 text-[14px] font-medium;
    }
  }

  :deep(.ant-tabs-nav-operations) {
    .ant-tabs-nav-more {
      @apply display-none;
    }
  }

  :deep(.ant-tabs-tab-active) {
    @apply bg-white;

    .ant-tabs-tab-btn {
      @apply text-navy-1;
    }
  }

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
@screen sm {
  .authenticate-tabs {
    :deep(.ant-tabs-nav) {
      @apply px-5;
    }
  }
}

@screen lg {
  .authenticate-tabs {
    :deep(.ant-tabs-nav) {
      @apply px-0;
    }

    :deep(.ant-tabs-tab:nth-child(even)) {
      border-right: none;
    }

    :deep(.ant-tabs-tab:nth-child(odd)) {
      border-left: none;
    }
  }
}
</style>
