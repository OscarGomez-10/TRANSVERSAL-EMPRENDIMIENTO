import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "../layouts/layout.vue";
import BlankLayout from "../layouts/blank.vue";
import HomeView from "../views/home.vue";
import VetTimeView from "../views/vetTime.vue";
import LoginCliente from "../views/loginCliente.vue";
import LoginAdministrador from "../views/loginAdministrador.vue";
import Cliente from "../views/cliente.vue";

const routes = [
  {
    path: "/",
    component: BlankLayout,
    children: [
      { path: "", name: "home", component: HomeView },
      { path: "login-cliente", name: "login-cliente", component: LoginCliente },
      { path: "login-administrador", name: "login-administrador", component: LoginAdministrador },
      { path: "cliente", name: "cliente", component: Cliente },
    ],
  },
  {
    path: "/admin", component: Layout,
    children: [
      { path: "veterinaria", name: "vettime", component: VetTimeView },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
