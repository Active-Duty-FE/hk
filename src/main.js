import { createPinia } from 'pinia'
import 'virtual:uno.css'
import { createApp } from 'vue'
import { VueQueryPlugin } from 'vue-query'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import App from './App.vue'
import './assets/css/app.scss'
import router from './router'
import 'animate.css'
import 'keen-slider/keen-slider.min.css'
import { i18n } from '@/utils/i18n'

const app = createApp(App)

app.use(router)
app.use(VueQueryPlugin)
app.use(createPinia())
app.use(PerfectScrollbar)
app.use(i18n)

app.mount('#app')

// global 사용 정의부
app.config.globalProperties.$i18n = i18n
