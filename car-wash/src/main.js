import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

const app = createApp(App)

app.use(ToastService)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})

app.use(router)
app.use(ConfirmationService)

app.mount('#app')
