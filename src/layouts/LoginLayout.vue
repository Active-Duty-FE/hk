<template>
  <div>
    <app-mobile-header class="md:hidden" />
    <app-desktop-header class="hidden md:block" />
    <div class="pt-[55px]">
      <router-view />
    </div>
  </div>
</template>
