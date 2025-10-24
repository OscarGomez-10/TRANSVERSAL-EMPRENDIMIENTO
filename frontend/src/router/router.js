import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "../layouts/layout.vue";
import BlankLayout from "../layouts/blank.vue";
import HomeView from "../views/home.vue";
import LoginCliente from "../views/loginCliente.vue";
import LoginAdministrador from "../views/loginAdministrador.vue";
import Cliente from "../views/cliente.vue";
import RegistroCliente from "../views/registroCliente.vue";
import Citas from "../views/citas.vue";
import Mascotas from "../views/mascotas.vue";
import Servicios from "../views/servicios.vue";
const routes = [
  {
    path: "/",
    component: BlankLayout,
    children: [
      { path: "", name: "home", component: HomeView },
      { path: "login-cliente", name: "login-cliente", component: LoginCliente },
      { path: "registro-cliente", name: "registro-cliente", component: RegistroCliente },
      { path: "login-administrador", name: "login-administrador", component: LoginAdministrador },
      { path: "cliente", name: "cliente", component: Cliente },
    ],
  },
  {
    path: "/admin",
    component: Layout,
    children: [
      { path: "", redirect: { name: "citas" } },
      { path: "citas", name: "citas", component: Citas },
      { path: "mascotas", name: "mascotas", component: Mascotas },
      { path: "servicios", name: "servicios", component: Servicios },
      { path: "veterinaria", redirect: { name: "citas" } },
    ],
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
