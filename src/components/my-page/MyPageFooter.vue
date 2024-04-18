<template>
  <div class="mb-10">
    <img
      src="@/assets/images/my-page/my-page-RBO-footer-pc.jpg"
      alt=""
      class="footer__image hidden cursor-pointer md:block"
      @click="redirectToExternalUr"
    />
    <img
      src="@/assets/images/my-page/my-page-RBO-footer-mobile.jpg"
      alt=""
      class="footer__image cursor-pointer md:hidden"
      @click="redirectToExternalUr"
    />
    <p
      class="footer__title -mt-10 hidden cursor-pointer underline md:block"
      @click="redirectToExternalUr"
    >
      Go to RIMAN Business Office
    </p>
    <p class="footer__title cursor-pointer md:hidden">RIMAN Business Office</p>
    <p class="footer__learnMore md:hidden">Click to Access</p>
  </div>
</template>

<script setup>
import apiService from '@/http/api'

const redirectToExternalUr = () => {
  apiService.myPageService.rboSelfLogin()
}
</script>

<style lang="scss" scoped>
.footer {
  &__image {
    @apply as mb-6 aspect-[2.4/1] w-full object-contain;
  }

  &__title {
    @apply font-550 mb-4 text-xl leading-[26px];
  }

  &__learnMore {
    @apply font-475 leading-base mb-0 w-fit cursor-pointer text-base underline;
  }
}
</style>
