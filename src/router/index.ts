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
import InitialSetup from "@/pages/InitialSetup.vue"; // 👈 Tu vista nueva

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
  // 👇 Excelente decisión: Fuera del Layout para que no vea el menú
  {
    path: '/initial',
    name: 'InitialSetup',
    component: InitialSetup,
    meta: { requiresAuth: true } 
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
        meta: { allowedRoles: ["Solicitante", "Gestor", "Admin", "SuperAdmin"] },
      },
      {
        path: "/area",
        component: Departamentos,
        name: "area",
        meta: { allowedRoles: ["Admin", "SuperAdmin"] },
      },
      {
        path: "/actividad",
        component: Actividad,
        name: "Actividad",
        meta: { allowedRoles: ["Admin", "SuperAdmin"] },
      },
      {
        path: "/usuarios",
        component: Usuarios,
        name: "Usuarios",
        meta: { allowedRoles: ["SuperAdmin"] },
      },
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

// 👇 LÓGICA DE GUARDIÁN CORREGIDA
router.beforeEach(async(to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!authStore.token;
  const userRole = authStore.user?.rol;

  // 1. SI REQUIERE AUTH Y NO ESTÁ LOGUEADO -> LOGIN
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: "Login" });
  }

  // 2. SI ES GUEST (Login) Y ESTÁ LOGUEADO -> HOME
  if (to.meta.requiresGuest && isAuthenticated) {
     return next({ path: "/" });
  }

  // -----------------------------------------------------
  // 🔒 LÓGICA DE BLOQUEO (INITIAL SETUP)
  // -----------------------------------------------------
  
  // A. Si DEBE cambiar pass y trata de ir a cualquier lado que NO sea InitialSetup
  if (isAuthenticated && authStore.debeCambiarPassword) {
    if (to.name !== 'InitialSetup') {
      return next({ name: 'InitialSetup' }); // 🛑 ¡Quieto ahí! Vete a configurar
    }
  }

  // B. Si YA configuró (NO debe cambiar) y trata de volver a entrar a InitialSetup manualmente
  if (isAuthenticated && !authStore.debeCambiarPassword && to.name === 'InitialSetup') {
    return next({ path: "/" }); // 🛑 Ya terminaste, vete al Home
  }

  // -----------------------------------------------------

  // 4. ROLES
  if (to.meta.allowedRoles) {
    if (userRole && !to.meta.allowedRoles.includes(userRole as any)) {
      if (to.path !== "/") {
        return next({ path: "/" });
      } else {
        return next(false);
      }
    }
  }

  // 5. Pase usted
  next();
});

export default router;