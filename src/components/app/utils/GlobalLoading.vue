<template>
  <div v-if="isGlobalLoading">
    <div class="loading-overlay"></div>
    <div class="loading-content">
      <div class="loading" style="--duration: 2s; --num-dot: 10">
        <div style="--index: 0"></div>
        <div style="--index: 1"></div>
        <div style="--index: 2"></div>
        <div style="--index: 3"></div>
        <div style="--index: 4"></div>
        <div style="--index: 5"></div>
        <div style="--index: 6"></div>
        <div style="--index: 7"></div>
        <div style="--index: 8"></div>
        <div style="--index: 9"></div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useGlobalLoadingStore } from '@/stores/modules/loading'
import { storeToRefs } from 'pinia'
const store = useGlobalLoadingStore()

const { isGlobalLoading } = storeToRefs(store)
</script>
<style lang="scss" scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  opacity: 0.1;
  z-index: 999999;
}

@keyframes spin-loading {
  100% {
    transform: rotate(360deg);
  }
}

@-webkit-keyframes spin-loading {
  100% {
    transform: rotate(360deg);
  }
}

.loading-content {
  position: fixed;
  width: 12rem;
  height: 12rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999999;
  img {
    width: 100%;
    animation: spin-loading 1s linear infinite;
  }
}

.loading {
  font-size: 12rem;
  --duration: 1s;
  --num-dot: 10;
  --color-dot: #1b3651;
  --box-color: rgb(50, 50, 50);
  width: 12rem;
  height: 12rem;
}
.loading > * {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  transform: rotate(calc((360deg / var(--num-dot)) * var(--index)));
}
.loading > *::before {
  position: absolute;
  content: '';
  top: 0.15em;
  left: 0.45em;
  width: 0.05em;
  height: 0.05em;
  transform: scale(0);
  border-radius: 50%;
  background-color: var(--color-dot);
  animation: scaleTo1 var(--duration) ease-in-out
    calc(var(--duration) / var(--num-dot) * var(--index)) infinite reverse;
}
@keyframes scaleTo1 {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}
.loading {
  width: 1em;
  aspect-ratio: 1;
  border-radius: 0.2em;
  position: relative;
}
.loading::before {
  content: '';
  position: absolute;
  top: 0px;
  left: 0px;
  right: 1px;
  bottom: 1px;
  border-radius: 0.2em;
  background-image: url('@assets/images/new-leave.png');
  transform: scale(0.6);
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
