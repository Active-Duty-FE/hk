<script setup>
import MailIcon from '@/assets/svgs/mail.svg'
import PhoneIcon from '@/assets/svgs/phone.svg'
import AddressIcon from '@/assets/svgs/checkin.svg'
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import apiService from '@/http/api'
import { onMounted, reactive } from 'vue'
import ContactUsMap from '@/components/cms/ContactUsMap.vue'

const USA_PHONE_NUM_PREFIX = '+1'

const storeLoading = useGlobalLoadingStore()

const { showGlobalLoading } = storeLoading

const state = reactive({
  address: '',
  email: '',
  googleLatitude: null,
  googleLongitude: null,
  tel: ''
})

const getContactUs = async () => {
  try {
    showGlobalLoading(true)

    const { data, success } = await apiService.cmsService.getContactUsDetail()
    if (success) {
      state.address = data?.address
      state.email = data?.email
      state.googleLatitude = data?.googleLatitude
      state.googleLongitude = data?.googleLongitude
      state.tel = data?.tel
    }
  } catch (error) {
    console.log(error)
  } finally {
    showGlobalLoading(false)
  }
}

onMounted(() => {
  getContactUs()
})
</script>
<template>
  <div class="my-12.5 max-w-1240px mx-auto px-5 md:my-20">
    <div class="font-550 w-full text-left md:text-center">
      <h1 class="md:text-50px md:leading-15 mb-10 text-[28px] leading-7 md:mb-4">Contact Us</h1>
      <p class="md:text-20px mb-5 text-base">We’re here for you!</p>
      <p class="mb-[68px] hidden text-base font-normal leading-[22px] md:block md:text-lg">
        Our Customer Service team is standing by to assist <br />
        you with everything from order support to business inquiries.
      </p>
      <p class="mb-[68px] block text-base font-normal leading-[22px] md:hidden">
        Our Customer Service team is standing by to assist you with everything from order support to
        business inquiries.
      </p>
    </div>
    <h2 class="md:text-24px mb-5 w-full text-xl">RIMAN Location</h2>

    <div class="-mx-5 mb-[30px] w-[calc(100%+40px)] md:mx-0 md:w-full">
      <ContactUsMap
        :key="`${state.googleLatitude}-${state.googleLongitude}`"
        :lat="state.googleLatitude"
        :long="state.googleLongitude"
        title="map_google"
        style="border: 0"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
        class="map-style"
      />
    </div>

    <div
      class="font-550 information flex w-full flex-col justify-between md:flex-row md:gap-[100px]"
    >
      <div class="item mb-5 flex w-full flex-1 items-start gap-3">
        <MailIcon class="mt-[4px]" />
        <span class="font-475 text-sm">{{ state.email }}</span>
      </div>
      <div class="item mb-5 flex w-full flex-1 items-start gap-3">
        <PhoneIcon class="mt-[4px]" />
        <span class="font-475 text-sm">{{ USA_PHONE_NUM_PREFIX }}{{ state.tel }}</span>
      </div>
      <div class="item address flex w-full flex-1 items-start gap-3">
        <AddressIcon class="min-w-4 mt-[4px]" />
        <span class="font-475 text text-sm">
          {{ state.address }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.map-style {
  @apply md:( h-[500px]) h-[215px] w-full justify-center;
}
</style>
