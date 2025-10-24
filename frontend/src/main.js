import { createApp } from "vue";
import { Quasar, Notify, Dialog } from "quasar";
import { createPinia } from "pinia";
import "@quasar/extras/material-icons/material-icons.css";
import "quasar/src/css/index.sass";
import App from "./App.vue";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import { router } from "./router/router";

const myApp = createApp(App);
const pinia = createPinia()
myApp.use(pinia)
pinia.use(piniaPluginPersistedstate)
myApp.use(router)
myApp.use(Quasar, {
  plugins: {
    Notify,
    Dialog
  },
});

myApp.mount("#app");
