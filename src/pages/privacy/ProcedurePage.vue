<script setup>
import { PRIVACY_PROCEDURE } from '@/helpers/footer'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'

const vCleanHtml = buildVueDompurifyHTMLDirective()
</script>
<template>
  <div
    class="text-black-50 my-12.5 max-w-1240px mx-auto flex w-full flex-col items-center justify-center md:my-20"
  >
    <div v-clean-html="PRIVACY_PROCEDURE" class="w-full break-words px-5"></div>
  </div>
</template>
