import { createApp } from "vue";
import wsvaio from "@wsvaio/components";
import App from "./app.vue";

const app = createApp(App);
app.use(wsvaio);
app.mount("#app");
