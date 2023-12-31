import AOS from "aos";
import { createApp, h } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from "@tanstack/vue-query";
import ToastPlugin from "vue-toast-notification";
import VueTelInput from "vue-tel-input";
import "aos/dist/aos.css";
import "vue-tel-input/vue-tel-input.css";
import "vue-toast-notification/dist/theme-sugar.css";

import App from "./App.vue";
import router from "./router";
import "./assets/index.css";

const app = createApp({
  render: () => h(App),
});

AOS.init();

app.use(createPinia());
app.use(router);
app.use(ToastPlugin);
app.use(VueTelInput);
app.use(VueQueryPlugin);

app.mount("#app");
