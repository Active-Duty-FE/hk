<template>
  <div class="relative">
    <div class="md:(h-[468px]) flex h-[330px] justify-center">
      <img :src="data?.attachmentList[0].url" class="mr-0 w-full object-cover" alt="rituals" />
    </div>

    <div class="md:(bottom-10 left-10) absolute bottom-[30px] left-[25px] max-w-[calc(100%-80px)]">
      <p
        class="md:(leading-[14px] text-[14px]) mb-[10px] w-max text-[10px] font-normal leading-[10px]"
      >
        {{ data.title1 }}
      </p>
      <p
        class="md:(text-[34px] leading-[26px]) mb-[10px] w-max text-[24px] font-semibold leading-none"
      >
        {{ data.title2 }}
      </p>
      <div class="flex w-max cursor-pointer items-center gap-[10px]" @click="onClick">
        <p class="md:(text-[34px] leading-[26px]) mb-0 text-[24px] font-normal leading-none">
          {{ data.title3 }}
        </p>
        <ArrowRight />
      </div>
    </div>
  </div>
</template>
<script setup>
import ArrowRight from '@/assets/svgs/arrow-right.svg'

const props = defineProps({
  data: {
    type: Object,
    default: () => {}
  }
})

const onClick = () => {
  if (!props.data.link) return
  const isNewWindow = props.data.newWindow
  window.open(props.data.link, isNewWindow ? '' : '_self')
}
</script>
