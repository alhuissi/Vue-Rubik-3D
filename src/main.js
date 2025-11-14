import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { createHead } from '@vueuse/head';
import App from './App.vue';
import 'element-plus/dist/index.css';
import '../static/common.css';

const app = createApp(App);
const head = createHead();

app.use(ElementPlus);
app.use(head);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');
