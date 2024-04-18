<template>
  <div
    class="bg-navy-deep md:(flex gap-30) w-full justify-center p-5 pb-[52px] pt-[50px] text-white lg:py-20 xl:gap-60"
  >
    <div class="md:(flex gap-[60px]) container max-w-full">
      <menu-footer-desktop />
      <div class="w-full max-w-[390px]">
        <Logo class="mb-5 cursor-pointer" @click="router.push('/')" />
        <p class="font-400 hidden text-[16px] text-base leading-[22px] lg:block">
          Join the BYoungPool and get personalized ritual secrets, the heads-up on new launches, and
          be the first to know about limited-run specials.
        </p>
        <p class="lg:hidden">
          Join the BYoungPool and get personalized ritual secrets, the heads-up on new launches, and
          be the first to know about limited-run specials.
        </p>
        <!-- TODO: cr remove -->
        <!-- <a-form :model="formState" class="!pt-4">
        <a-form-item name="email" class="!mb-[25px]">
          <r-input
            v-model:value="formState.email"
            placeholder="Enter your email"
            class="!bg-navy-deep !border-b-1 placeholder:(!text-white !font-normal) !border-0 !px-0 !pb-[18px] !text-white lg:!text-lg"
            autocomplete="off"
          />
        </a-form-item>
        <r-button
          html-type="submit"
          title="SUBMIT"
          class-title="text-white"
          class="!rounded-0 !border-1 w-full !border-white !bg-transparent !shadow-none"
          height="50px"
        />
      </a-form> -->
      </div>
      <menu-footer-mobile />
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import Logo from '@assets/svgs/logo-white.svg'

const router = useRouter()
</script>
<style scoped lang="scss">
.ant-input:focus {
  border-right: none;
  @apply border-color-white border-x-0 border-t-0 outline-0;
  -webkit-box-shadow: none;
  box-shadow: none;
}

.ant-input:hover {
  border-right: none;
  @apply border-color-white border-x-0 border-t-0 outline-0;
}
</style>
