<template>
  <div class="flex cursor-pointer items-center justify-between" @click="goToPath">
    <span :class="isSubMenu ? 'submenu-text' : 'menu-text'">{{ title }}</span>

    <template v-if="iconComponent">
      <iconComponent />
    </template>
  </div>
</template>

<script setup>
import IconMenu from '@/assets/images/my-page/arrow-menu.svg'
import IconSubMenu from '@/assets/images/my-page/arrow-submenu.svg'
import IconEdit from '@/assets/svgs/my-page/edit.svg'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: '',
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
  isSubMenu: {
    type: Boolean,
    default: false
  }
})

const iconComponent = computed(() => {
  const ICON_ENUM = {
    menu: IconMenu,
    subMenu: IconSubMenu,
    edit: IconEdit
  }

  return ICON_ENUM[props.icon]
})

const isSubMenu = computed(() => props.icon === 'subMenu')

const emits = defineEmits(['click'])

const router = useRouter()

const goToPath = () => {
  emits('click')
  if (!props.name) return
  try {
    router.push({ name: props.name })
  } catch {
    //
  }
}
</script>

<style lang="scss" scoped>
.menu-text {
  @apply leading-4.5 font-550 text-lg;
}

.submenu-text {
  @apply text-sm font-normal leading-6 -tracking-[0.28px];
}
</style>
