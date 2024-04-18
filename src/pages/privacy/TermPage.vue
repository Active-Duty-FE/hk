<script setup>
import { PRIVACY_TERMS } from '@/helpers/footer'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'

const vCleanHtml = buildVueDompurifyHTMLDirective()
</script>
<template>
  <div
    class="text-black-50 mx-auto flex flex-col items-center justify-center px-5 py-[50px] md:max-w-[50%] md:px-20"
  >
    <div v-clean-html="PRIVACY_TERMS"></div>
  </div>
</template>
