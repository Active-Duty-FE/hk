<template>
  <p
    class="font-550 text-black-50 md:(text-[40px] leading-[40px]) md:(mb-[70px] text-center) md:(ml-0 w-full) mb-10 ml-5 text-[28px] md:w-[287px]"
  >
    Start your journey to a more youthful, radiant life today!
  </p>

  <div class="items-center justify-center md:flex">
    <div class="w-full max-w-[1200px]">
      <r-carousel
        v-slot="item"
        :options="dataLists"
        :wrap-around="dataLists?.length > 3"
        :mouse-drag="dataLists?.length > 3"
        :breakpoints="breakpoints"
      >
        <div class="relative">
          <img :src="item.src" alt="journey" class="w-[275px] md:w-[390px]" />
          <div
            class="absolute bottom-[30px] left-5 cursor-pointer text-start text-2xl leading-[24px] text-white"
            @click="alertNoti"
          >
            <p class="mb-0">{{ item.title }}</p>
            <p class="font-625 mb-0">{{ item.subTitle }}</p>
          </div>
          <div
            class="absolute bottom-[30px] right-[25px] cursor-pointer"
            @click="handleTransit(item.url, item?.openInNewWindow)"
          >
            <ArrowRight class="arrow_icon" />
          </div>
        </div>
      </r-carousel>
    </div>
    <RModalAlert
      v-model:visible="isShowModalAlert"
      description="Coming Soon"
      @confirm="isShowModalAlert = false"
    />
  </div>
</template>
<script setup>
import ArrowRight from '@/assets/svgs/arrow-right.svg'
import { ref } from 'vue'
import { computed } from 'vue'
import { addPrefixForImage } from '@/utils/common'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const dataLists = computed(() => {
  return props.data.map((item, index) => {
    return {
      id: index,
      src: addPrefixForImage(item.imageUrl),
      title: item.displayTitle,
      subTitle: item.subCopy,
      url: item?.link,
      openInNewWindow: item?.openInNewWindow
    }
  })
})

const isShowModalAlert = ref(false)
const breakpoints = {
  992: {
    itemsToShow: 3,
    snapAlign: 'start'
  },
  600: {
    itemsToShow: 2,
    snapAlign: 'start'
  },
  200: {
    itemsToShow: 1.3,
    snapAlign: 'start'
  }
}

const handleTransit = (url, openInNewWindow) => {
  window.open(url, openInNewWindow ? '_blank' : '_self')
}
const alertNoti = () => {
  isShowModalAlert.value = true
}
</script>
<style scoped lang="scss">
.arrow_icon {
  :deep(path) {
    fill: #fff;
  }
}
</style>
