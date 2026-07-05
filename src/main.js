import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index.js'

import PrimeVue from 'primevue/config';
import '@primevue/themes/aura'; // Use the minified version
import 'primeicons/primeicons.css';
import Aura from '@primevue/themes/aura'


const app = createApp(App)

app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.mount('#app')