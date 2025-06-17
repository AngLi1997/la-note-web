import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import apiPlugin from './plugins/apiPlugin'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import './plugins/elementConfig'

const app = createApp(App)
const pinia = createPinia()

app.use(apiPlugin)
app.use(router)
app.use(ElementPlus)
app.use(pinia)

app.mount('#app')
