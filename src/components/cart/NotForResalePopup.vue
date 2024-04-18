<template>
  <a-modal
    v-if="isShowModal"
    :visible="isShowModal"
    centered
    wrap-class-name="notForResale"
    :footer="false"
    :closable="false"
    :width="660"
  >
    <div class="relative flex flex-col items-center">
      <div class="mb-2 mt-10 w-full !bg-black px-5">
        <p class="text-center text-lg font-semibold">Not For Resale (NFR)</p>
        <p class="mt-[30px] text-center">
          You've chosen to place an order from the USA Not <br />
          For Resale (NFR) catalog. The items featured on this page will be shipped from a warehouse
          located in the USA. <br />Not all RIMAN products are accessible in every region where
          RIMAN operates. Please be aware that there might be customs fees or duties applicable to
          your order when it's imported into your country. As the importer, it is your
          responsibility to cover all import fees and taxes.<br /><br />All NFR products are
          intended for personal use or for use by your immediate family members, and there is a
          restriction of a 90-day supply per person, based on the product's recommended usage
          guidelines.
        </p>
        <button
          class="mx-15 border-1 mx-auto mt-10 w-full cursor-pointer border-solid border-none border-[#063451] bg-white py-[15px] text-[14px] leading-none text-[#063451]"
          @click="closeModal"
        >
          No, Return To My Market Site
        </button>
        <button
          class="mx-15 button-connect mx-auto mt-4 w-full cursor-pointer border-none py-[15px] text-[14px] leading-none text-white"
          @click="handleCheckout"
        >
          Accept
        </button>
      </div>
    </div>
  </a-modal>
</template>

<script setup>
const props = defineProps({
  isShowModal: {
    type: Boolean,
    default: false
  },
  checkedCartList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['setIsShowModal', 'createSaleOrder'])

const closeModal = () => {
  emit('setIsShowModal')
}
const handleCheckout = () => {
  emit('createSaleOrder', props.checkedCartList)
}
</script>
<style lang="scss" scoped>
p {
  margin-bottom: 0;
}
:deep(.ant-modal) {
  width: 335px;
}
:deep(.ant-modal-content) {
  border-radius: 10px;
}
:deep(.button-connect) {
  background: #063451;
}
</style>
