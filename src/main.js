import { createApp, h } from "vue";
import { createPinia } from "pinia";
import ToastPlugin from "vue-toast-notification";
import VueTelInput from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";
import "vue-toast-notification/dist/theme-sugar.css";

import App from "./App.vue";
import router from "./router";
import "./assets/index.css";

const app = createApp({
  render: () => h(App),
});

app.use(createPinia());
app.use(router);
app.use(ToastPlugin);
app.use(VueTelInput);

app.mount("#app");
