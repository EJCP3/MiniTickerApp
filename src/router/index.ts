import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

import Login from "@/pages/login.vue";
import Home from "@/pages/home/Home.vue";
import CrearSolicitud from "@/pages/crearSolicitud/CrearSolicitud.vue";
import Solicitudes from "@/pages/solicitudes/Solicitudes.vue";
import Departamentos from "@/pages/departamentos/Departamentos.vue";
import Actividad from "@/pages/actividad/Actividad.vue";
import Usuarios from "@/pages/usuarios/Usuarios.vue";
import Layout from "@/layouts/Layout.vue";
import { useAuthStore } from "@/stores/authStore";

type Role = "Solicitante" | "Admin" | "Gestor" | "SuperAdmin";

declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    allowedRoles?: Role[];
    requiresGuest?: boolean;
  }
}

const routes: RouteRecordRaw[] = [
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
    meta: { requiresAuth: true },
    children: [
      { path: "/", component: Home, name: "Home" },
      {
        path: "/crear-solicitud",
        component: CrearSolicitud,
        name: "CrearSolicitud",
        meta: { allowedRoles: ["Solicitante", "Admin", "SuperAdmin"] },
      },
      {
        path: "/solicitudes",
        component: Solicitudes,
        name: "Solicitudes",
        // meta: {
        //   allowedRoles: ["Solicitante", "Gestor", "Admin", "SuperAdmin"],
        // },
      },
      // {
      //   path: "/departamentos",
      //   component: Departamentos,
      //   name: "Departamentos",
      //   meta: { allowedRoles: ["Admin", "SuperAdmin"] },
      // },
      // {
      //   path: "/actividad",
      //   component: Actividad,
      //   name: "Actividad",
      //   meta: { allowedRoles: ["Admin", "SuperAdmin"] },
      // },
      // {
      //   path: "/usuarios",
      //   component: Usuarios,
      //   name: "Usuarios",
      //   meta: { allowedRoles: ["SuperAdmin"] },
      // },
    ],

    
  },
  { 
    path: '/:pathMatch(.*)*', 
    redirect: '/' 
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  const isAuthenticated = !!authStore.token;
  const userRole = authStore.user?.rol;

  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: "Login" });
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    return next({ path: "/" });
  }

  if (to.meta.allowedRoles) {
    if (userRole && !to.meta.allowedRoles.includes(userRole as any)) {
      if (to.path !== "/") {
        return next({ path: "/" });
      } else {
        return next(false);
      }
    }
  }

  // 4. Todo correcto
  next();
});

export default router;
