<template>
  <div class="xl:mx-[32px]">
    <div class="banner-section md:mb-50 relative mb-[90px]">
      <div
        class="main-bg hidden w-full overflow-hidden object-center md:block md:h-[957px] md:h-screen"
        :style="{
          backgroundImage: `url(${addPrefixForImage(businessOpportunityBanner?.imageUrl)})`
        }"
      ></div>
      <img
        :src="addPrefixForImage(businessOpportunityBanner?.imageUrlMobile)"
        alt="business_mo"
        class="block h-auto w-full overflow-hidden md:hidden"
      />
      <div
        class="xl:left-90 lg:(block left-10) absolute top-1/2 hidden -translate-y-1/2"
        :class="{
          'text-white': businessOpportunityBanner?.fontColor,
          'text-black-50 ': !businessOpportunityBanner?.fontColor
        }"
      >
        <p class="font-475 mb-[26px] text-xl leading-normal">BUSINESS OPPORTUNITY</p>
        <p class="font-550 mb-[30px] text-[50px] leading-[60px]">
          {{ businessOpportunityBanner?.titlePc }}
        </p>
        <p class="mb-0 w-[700px] text-lg font-normal leading-normal">
          {{ businessOpportunityBanner?.subTitlePc }}
        </p>
      </div>
    </div>
  </div>
  <div class="text-black-50 mx-5 mb-[90px] lg:hidden">
    <p class="font-550 mb-5 text-sm leading-normal">BUSINESS OPPORTUNITY</p>
    <p class="font-550 mb-10 text-[32px] leading-[36px]">
      {{ businessOpportunityBanner?.titleMobile }}
    </p>
    <p class="mb-0 text-base font-normal leading-[22px]">
      {{ businessOpportunityBanner?.subTitleMobile }}
    </p>
  </div>
  <div
    v-if="businessOpportunityVideo?.displayStatus"
    class="second-section md:mb-50 mb-[90px] flex justify-center md:pt-[90px]"
  >
    <!-- when have api, this is video  -->
    <video controls class="ingredient__video w-full md:w-[1200px]" playsinline loop muted autoplay>
      <source :src="addPrefixForImage(businessOpportunityVideo?.videoUrl)" type="video/mp4" />
      <track src="" label="" kind="captions" default />
    </video>
    <!--    <img :src="Ingredient" alt="ingredient" class="w-full md:w-[1200px]" />-->
  </div>
  <div
    class="md:(flex-row gap-20) text-black-50 md:(mb-40 mx-0) mx-5 mb-[30px] flex flex-col items-center justify-center gap-10"
  >
    <img :src="BusinessSecond" alt="business_2" class="w-full md:w-auto" />
    <div>
      <p
        class="md:(text-[40px] leading-[40px]) font-550 md:(mb-10 mb-[30px]) mb-[25px] text-[28px] leading-[28px]"
      >
        Partner with RIMAN
      </p>
      <p class="md:(w-[520px] text-lg) mb-0 w-full text-base font-normal leading-normal">
        For thousands of years, people have engaged in the practice of buying and selling goods from
        their friends, family and peers as a source of income. Here at RIMAN, just as we respect
        ancient practices of holistic self-care, we want to embrace this age-old practice to help
        those around the world who are looking unlock their full earning potential.<br /><br />
        We are proud to continue this tradition in today’s marketplace by providing the strength of
        a simple and effective e-commerce and logistics infrastructure to help you share your
        favorite RIMAN products with those around you. Backed by a robust compensation plan that
        pays 10-45% commissions, we are confident that starting your journey as a RIMAN Planner
        today has the potential to be your first step in experiencing
        <span class="font-475">#TheRIMANDifference</span>, a lifestyle difference you will love.
      </p>
    </div>
  </div>
  <div
    v-if="businessOpportunityBigBanner?.displayStatus"
    class="container_start relative mb-[90px] flex justify-center md:mb-40"
  >
    <div class="container_start relative">
      <img
        class="container_image absolute inset-0 !h-full !w-full object-cover"
        :src="addPrefixForImage(banner)"
        alt="big"
      />
      <div class="container_start absolute inset-0">
        <p
          class="font-550 md:(w-full mb-[30px]) mb-5 w-[194px] text-center text-[28px] leading-[28px]"
        >
          {{ businessOpportunityBigBanner?.displayTitle }}
        </p>
        <r-button
          :title="businessOpportunityBigBanner?.buttonText"
          type="primary"
          class="!text-black-50 mb-5 w-[335px] !border-white !bg-white !text-sm md:mb-[30px]"
          @click="handleLearnMore(businessOpportunityBigBanner?.link)"
        />
        <p class="mb-0 hidden !w-[580px] whitespace-pre-wrap text-center text-base md:block">
          {{ businessOpportunityBigBanner?.subCopy }}
        </p>
        <p
          class="mb-0 w-[335px] whitespace-pre-wrap text-center text-base leading-[20px] md:hidden"
        >
          {{ businessOpportunityBigBanner?.subCopy }}
        </p>
      </div>
    </div>
  </div>
  <div
    class="md:(gap-[50px] mb-40) md:(flex-row mx-0) mx-5 mb-20 flex flex-col items-center justify-center gap-10"
  >
    <div class="flex items-center gap-[15px]">
      <img :src="BusinessFour" alt="business_4" class="w-20 md:w-auto" />
      <p class="md:(text-base leading-[22px]) mb-0 w-full text-xs md:w-[358px]">
        Earn a percentage of sales you personally generate, including your own purchases! As you
        build a team, earn a percentage of sales made by Beauty Planners who you personally enroll
        to join your team. It’s that simple – sell, grow, earn!
      </p>
    </div>
    <div class="flex items-center gap-[15px]">
      <img :src="BusinessFive" alt="business_5" class="w-20 md:w-auto" />
      <p class="md:(text-base leading-[22px]) mb-0 w-full text-xs md:w-[358px]">
        Earn bonuses based on your personal group volume, based on certain qualifications. These
        bonuses are unlocked at certain ranks, and increase as you move within the RIMAN
        Compensation Plan
      </p>
    </div>
  </div>

  <div
    class="md:(flex-row gap-20) text-black-50 md:(mb-40 mx-0) mx-5 mb-[90px] flex flex-col-reverse items-center justify-center gap-[30px]"
  >
    <div>
      <p
        class="md:(text-[40px] leading-normal) font-550 mb-[25px] hidden text-[28px] md:mb-10 md:block"
      >
        Benefits of <br />starting your<br />RIMAN business:
      </p>
      <p
        class="md:(text-[40px] leading-normal) font-550 mb-[25px] block text-[28px] md:mb-10 md:hidden"
      >
        Benefits of starting your RIMAN business:
      </p>
      <div class="mb-[30px] md:mb-10">
        <p class="font-550 md:(text-lg leading-[18px]) mb-[15px] text-base">Begin Saving Today</p>
        <p class="md:(w-[520px] text-base) mb-0 w-full text-sm leading-[22px]">
          From the moment you enroll as a Planner, you automatically earn 10% back on all of your
          own purchases, and 5% back on any customer sales. Why spend more when you can save?
        </p>
      </div>
      <div class="mb-[30px] md:mb-10">
        <p class="font-550 md:(text-lg leading-[18px]) mb-[15px] text-base">
          Low Start-Up & Maintenance Costs
        </p>
        <p class="md:(w-[520px] text-base) mb-0 w-full text-sm leading-[22px]">
          Starting a traditional business can be a large expense, with fees such as licensing fees,
          buying and storing inventory, and shipping costs. However, at RIMAN, you only pay an
          annual fee of $20 USD, which only covers the maintenance of your personal RIMAN “MyShop”
          so you can easily share and sell RIMAN products online, as well as a Reporting Dashboard
          you can track your personal and team progress.
        </p>
      </div>
      <div>
        <p class="font-550 md:(text-lg leading-[18px]) mb-[15px] text-base">
          Access to Latest Marketing Tools & Training
        </p>
        <p class="md:(w-[520px] text-base) mb-0 w-full text-sm leading-[22px]">
          RIMAN is committed to providing ongoing, updated marketing materials such as sales
          training manuals, product brochures, how-to guides, videos, social media posts, event
          signage, and more to help you easily grow your business. We also provide weekly and
          monthly training and corporate update calls to help you stay in-the-know about the latest
          new products and promotions.
        </p>
      </div>
    </div>
    <img :src="BusinessSix" alt="business_6" class="w-full md:w-auto" />
  </div>

  <div class="md:mb-50 mb-[90px]">
    <SlideJourney :data="businessOpportunitySmallBanner" />
  </div>
  <div class="mb:mb-[250px] mb-[166px]">
    <DiveIn />
  </div>
</template>

<script setup>
import BusinessSecond from '@/assets/images/explores/byoung/business_2.png'
import BusinessFour from '@/assets/images/explores/byoung/business_4.webp'
import BusinessFive from '@/assets/images/explores/byoung/business_5.webp'
import BusinessSix from '@/assets/images/explores/byoung/business_6.webp'
import { useCmsStore } from '@/stores/modules/cms'
import { addPrefixForImage } from '@/utils/common'
import { useBreakpoints } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'

const { getSnsList, getBusinessOpportunity } = useCmsStore()
const {
  businessOpportunityBanner,
  businessOpportunityVideo,
  businessOpportunityBigBanner,
  businessOpportunitySmallBanner
} = storeToRefs(useCmsStore())

const device = useBreakpoints({
  mobile: 640,
  tablet: 1024
})
const tablet = device.smaller('tablet')
const banner = computed(() => {
  if (tablet.value) {
    return businessOpportunityBigBanner.value?.imageUrlMobile
  }
  return businessOpportunityBigBanner.value?.imageUrl
})

const handleLearnMore = (value) => {
  window.open(value, businessOpportunityBigBanner.value?.openInNewWindow ? '_blank' : '_self')
}
onMounted(() => {
  getSnsList()
  getBusinessOpportunity()
})
</script>
<style scoped lang="scss">
.container_start {
  @apply flex h-[280px] w-full  flex-col items-center justify-center text-white  md:h-[450px];
}
.container_image {
  background-size: cover;
  background-position: center;
}
</style>
