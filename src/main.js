import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import axiosPlugin from './plugins/axios'
import apiPlugin from './plugins/api'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(axiosPlugin)
app.use(apiPlugin)
app.use(router)
app.use(ElementPlus)
app.use(pinia)

app.mount('#app')
