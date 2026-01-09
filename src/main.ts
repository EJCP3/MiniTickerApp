import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

// 1. Importar el idioma español y el plugin de FormKit
import { plugin, defaultConfig } from '@formkit/vue'
import { es } from '@formkit/i18n'

import '@fontsource/zen-kaku-gothic-antique';

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 2. Configurar el plugin con el idioma importado
app.use(plugin, defaultConfig({
  locales: { es },
  locale: 'es',
  config: {
    classes: {
      // Aplica color rojo a todos los mensajes de error de la app
      message: 'text-red-500 text-xs mt-1 font-bold italic uppercase tracking-wide',
      inner: 'data-[invalid]:border-red-500',
    }
  }
}))

app.mount('#app')