<template>
  <div ref="container" class="keen-slider relative" :class="{ 'h-screen': !isMobile }">
    <slot />
    <div
      v-if="slider && current !== 0 && !isMobile"
      class="dots absolute right-0 top-1/2 -translate-y-1/2"
    >
      <button
        v-for="(_slide, idx) in dotHelper"
        :key="idx"
        class="h-fit w-fit border-none bg-transparent"
        :class="{ dot: true, active: current === idx }"
        @click="slider.moveToIdx(idx)"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { useKeenSlider } from 'keen-slider/vue.es'
import 'keen-slider/keen-slider.min.css'
import { computed, onMounted, ref, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
const isMobile = computed(() => width.value < 992)

const dotHelper = ref([])

const current = ref(0)

const [container, slider] = useKeenSlider(
  {
    initial: current.value,
    loop: false,
    vertical: true,
    defaultAnimation: {
      duration: 1000
    },
    disabled: isMobile.value,
    slideChanged: (s) => {
      current.value = s.track.details.rel
    }
  },
  [WheelControls, MutationPlugin, ResizePlugin]
)

function ResizePlugin(slider) {
  const observer = new ResizeObserver(function () {
    slider.update()
  })

  slider.on('created', () => {
    observer.observe(slider.container)
  })
  slider.on('destroyed', () => {
    observer.unobserve(slider.container)
  })
}

function MutationPlugin(slider) {
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function () {
      dotHelper.value = slider.slides ? [...Array(slider.slides.length).keys()] : []
      slider.update()
    })
  })
  const config = { childList: true }

  slider.on('created', () => {
    observer.observe(slider.container, config)
  })
  slider.on('destroyed', () => {
    observer.disconnect()
  })
}

watch(
  () => slider.value?.slides,
  () => {
    dotHelper.value = slider.value.slides ? [...Array(slider.value.slides.length).keys()] : []
  },
  { deep: true }
)

function WheelControls(slider) {
  let touchTimeout
  let position
  let wheelActive

  function dispatch(e, name) {
    position.x -= e.deltaX
    position.y -= e.deltaY
    slider.container.dispatchEvent(
      new CustomEvent(name, {
        detail: {
          x: position.x,
          y: position.y
        }
      })
    )
  }

  function wheelStart(e) {
    position = {
      x: e.pageX,
      y: e.pageY
    }
    dispatch(e, 'ksDragStart')
  }

  function wheel(e) {
    dispatch(e, 'ksDrag')
  }

  function wheelEnd(e) {
    dispatch(e, 'ksDragEnd')
  }

  function touchWheel(e) {
    e.preventDefault()
    if (!wheelActive) {
      wheelStart(e)
      wheelActive = true
    }
    wheel(e)
    clearTimeout(touchTimeout)
    touchTimeout = setTimeout(() => {
      wheelActive = false
      wheelEnd(e)
    }, 50)
  }

  function mouseWheel(e) {
    wheelEvent(e)
  }

  function eventWheel(e) {
    const isLastSlide = slider?.track?.details?.rel === slider?.track?.details?.length
    const isScrollDown = e.deltaY > 0
    const isScrollHoz = Math.abs(e.deltaX) > Math.abs(e.deltaY)
    if (isScrollHoz) return
    if (isLastSlide && isScrollDown) return
    if (!isLastSlide) e.preventDefault()
    const isTouchPad = e.wheelDeltaY ? e.wheelDeltaY === -3 * e.deltaY : e.deltaMode === 0
    if (isTouchPad) touchWheel(e)
    else mouseWheel(e)
  }

  slider.on('created', () => {
    slider.container.addEventListener('wheel', eventWheel, {
      passive: false
    })
  })
}

const wheelEvent = (event) => {
  if (event.deltaY > 0) slider.value.next()
  else slider.value.prev()
}

const listenKeyboard = (event) => {
  // TODO remove it when Nadal recheck
  // const isLastSlide = slider?.track?.details?.rel === slider?.track?.details?.length
  // if (isLastSlide) event.preventDefault()
  switch (event.keyCode) {
    case 38:
      slider.value.prev()
      break
    case 40:
      slider.value.next()
      break
  }
}

onMounted(() => {
  window.addEventListener('keydown', listenKeyboard)
})
</script>

<style scoped>
.dots {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}

.dot {
  border: none;
  width: 4px;
  height: 4px;
  background: #a0a0a0;
  opacity: 0.6;
  border-radius: 50%;
  margin: 0 5px;
  padding: 4px;
  cursor: pointer;
}

.dot:focus {
  outline: none;
}

.dot.active {
  background: #666666;
  opacity: 1;
}
</style>
