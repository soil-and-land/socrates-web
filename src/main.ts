import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
// import ElementPlus from 'element-plus';
// import 'element-plus/theme-chalk/index.css';
// import 'element-plus/theme-chalk/dark/css-vars.css';
import { createPinia } from 'pinia';

import "~/styles/index.scss";
import "uno.css";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
// app.use(ElementPlus);
app.use(pinia); // Register Pinia

app.mount('#app');
