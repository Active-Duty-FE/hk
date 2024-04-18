<template>
  <div>
    <r-header :show-mobile-nav="showMobileNav" @toggle-navigation="toggleNavigation" />
    <Transition name="slide-right" mode="in-out">
      <app-side-menu v-if="showMobileNav" @toggle-navigation="toggleNavigation" />
    </Transition>
  </div>
</template>
<script setup>
import { ref } from 'vue'
const showMobileNav = ref(false)

const toggleNavigation = () => {
  showMobileNav.value = !showMobileNav.value
}
</script>
