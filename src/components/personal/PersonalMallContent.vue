<template>
  <div class="pt-25px max-h-[500px] px-5">
    <div class="flex gap-4">
      <img
        v-if="dataDetail?.avatar"
        :src="dataDetail?.avatar"
        alt="avatar"
        class="aspect-square h-[90px] w-[90px] rounded-full"
      />
      <div
        v-else
        class="border-1 border-navy-deep aspect-square h-[90px] w-[90px] rounded-full border-solid pt-[36px] text-center"
      >
        <Logo class="w-[70px]" />
      </div>
      <div>
        <div class="flex h-[90px] flex-col items-start justify-center">
          <template
            v-if="
              !dataDetail?.mallInfo?.userPersonalMallInfoResponse ||
                !dataDetail?.mallInfo?.userPersonalMallInfoResponse?.mallName
            "
          >
            <p class="style-normal text-[18px] font-normal">Welcome!</p>
            <p>RIMAN Mall</p>
          </template>
          <template v-else>
            <p class="style-normal text-[18px] font-normal">Welcome!</p>
            <p>
              <b>{{ dataDetail?.mallInfo?.userPersonalMallInfoResponse?.mallName }}</b
              >'s Mall
            </p>
          </template>
          <p class="font-300 leading-base mb-0 text-[14px] -tracking-[0.28]">
            {{ dataDetail?.mallInfo?.userPersonalMallInfoResponse?.message1 }}
          </p>
        </div>
      </div>
    </div>
    <a-divider
      v-if="dataDetail?.mallInfo?.userPersonalMallInfoResponse?.message2"
      class="bg-gray-11 !my-7.5"
    />
    <div>
      <p
        v-if="dataDetail?.mallInfo?.userPersonalMallInfoResponse?.message2"
        v-clean-html="dataDetail?.mallInfo?.userPersonalMallInfoResponse?.message2"
        class="text-gray-10 style-normal font-300 leading-base --tracking-[0.28px] mb-0 whitespace-pre-wrap text-[14px]"
      ></p>
    </div>

    <a-divider class="bg-gray-10 !mb-0 !mt-[30px]" />
    <a-collapse v-model:activeKey="activeKey" :bordered="false" accordion>
      <a-collapse-panel
        v-for="(item, index) in appState.items"
        :key="index"
        class="collapse-panel-custom"
        :show-arrow="false"
        :class="[activeKey && activeKey.includes(String(index)) ? '!border-black-50' : '']"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <div>
              {{ item.title }}
            </div>
          </div>
        </template>
        <template #extra>
          <div class="mr-[8px]">
            <div v-if="activeKey && activeKey.includes(String(index))">
              <ArrowUp class="cursor-pointer" />
            </div>
            <div v-else>
              <ArrowDown class="cursor-pointer" />
            </div>
          </div>
        </template>
        <div>
          <template v-if="activeKey && activeKey?.includes('0')">
            <ReferralInfo :data-detail="dataDetail" @close="onClose" />
          </template>
          <template v-if="activeKey && activeKey?.includes('1')">
            <BagInfo :data-detail="dataDetail" @close="onClose" />
          </template>
        </div>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import ArrowDown from '@/assets/svgs/personal/arrow_down.svg'
import ArrowUp from '@/assets/svgs/personal/arrow_up.svg'
import ReferralInfo from './ReferralInfo.vue'
import BagInfo from './BagInfo.vue'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import Logo from '@/assets/icons/Logo.vue'

const vCleanHtml = buildVueDompurifyHTMLDirective()

const emits = defineEmits(['close'])

defineProps({
  dataDetail: {
    type: Object,
    default: () => ({})
  }
})

const activeKey = ref([])
const appState = reactive({
  items: [
    {
      title: 'Referral Info',
      component: ReferralInfo
    },
    {
      title: 'Bag',
      component: BagInfo
    }
  ]
})

const onClose = () => {
  emits('close')
}
</script>
<style lang="scss" scoped>
.collapse-panel-custom {
  @apply bg-white;
  :deep(.ant-collapse-header) {
    @apply border-b-solid border-1 border-color-black-50  style-normal text-gray-10 flex items-center p-5 text-[14px] font-normal;
    padding: 25px 0 !important;
  }

  :deep(.ant-collapse-content-box) {
    padding: 0 !important;
  }

  :deep(.ant-collapse-item) {
    border-color: 1px solid #212121;
  }
}

:deep(.ant-collapse-item-active) {
  .ant-collapse-header {
    border-bottom: none !important;
  }
}
</style>
