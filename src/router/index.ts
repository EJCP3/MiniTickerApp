import { createRouter, createWebHistory  } from "vue-router";

import Login from "../pages/login.vue";


import Home from "../pages/Home.vue";
import Layout from "../layouts/Layout.vue";
import Solicitudes from "../pages/Solicitudes.vue";
import Departamentos from "../pages/Departamentos.vue";
import Actividad from "../pages/Actividad.vue";
import Usuarios from "../pages/Usuarios.vue";

const routes = [
     {
    path: "/login",
    component: Login,
    name: "Login",
    meta: { requiresGuest: true },
  },
    
  {
    path: "/",
    component: Layout,
    name: "Layout",
    children: [
        { path: "/", component: Home, name: "Home" },
         { path: "/solicitudes", component: Solicitudes, name: "Solicitudes" },
                  { path: "/departamentos", component: Departamentos, name: "Departamentos" },
         { path: "/actividad", component: Actividad, name: "Actividad" },
                  { path: "/usuarios", component: Usuarios, name: "Usuarios" },

                        


    ]
  }

]

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// router.beforeEach((to, from, next) => {
//     next();
// });

export default router;