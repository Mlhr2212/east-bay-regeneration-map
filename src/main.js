import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import { router } from './helpers';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import 'leaflet/dist/leaflet.css';

import './style.css'
import './assets/motion.css'

// Gate scroll-reveal on JS being alive: only when this runs do `.rm-reveal`
// elements start hidden. If JS fails, the gate is absent and all content shows.
document.documentElement.classList.add('has-reveal');

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.component('VueDatePicker', VueDatePicker);

app.mount('#app');

