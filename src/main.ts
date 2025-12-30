import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { plugin, defaultConfig } from '@formkit/vue'
import '@fontsource/zen-kaku-gothic-antique';

const app = createApp(App)

app.use(router)
app.use(plugin, defaultConfig)
app.mount('#app')