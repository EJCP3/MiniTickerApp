<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "vue-sonner"; // Opcional: para feedback visual

const authStore = useAuthStore();
const router = useRouter();

const password = ref("");
const confirmPassword = ref("");
const fileInput = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const isLoading = ref(false);

// --- VALIDACIÓN DE CONTRASEÑA ---
const passwordRequirements = computed(() => [
  { label: "Mínimo 8 caracteres", met: password.value.length >= 8 },
  { label: "Al menos una mayúscula", met: /[A-Z]/.test(password.value) },
  { label: "Al menos una minúscula", met: /[a-z]/.test(password.value) },
  { label: "Al menos un número", met: /\d/.test(password.value) },
  {
    label: "Un carácter especial (!@#$%^&*)",
    met: /[!@#$%^&*(),.?":{}|<>]/.test(password.value),
  },
]);

const esPrimeraVez = computed(() => {
  return authStore.user?.debeCambiarPassword && !authStore.user?.fotoPerfilUrl;
});

// Verifica si todos los requisitos se cumplen
const isPasswordSecure = computed(() =>
  passwordRequirements.value.every((r) => r.met)
);

// Verifica si las contraseñas coinciden
const passwordsMatch = computed(
  () => password.value && password.value === confirmPassword.value
);

// Validez general del formulario
const isFormValid = computed(
  () => isPasswordSecure.value && passwordsMatch.value
);

// --- MANEJO DE ARCHIVO ---
const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    fileInput.value = target.files[0];
    previewUrl.value = URL.createObjectURL(target.files[0]);
  }
};

// --- ENVÍO ---
const handleSubmit = async () => {
  // Doble verificación por seguridad
  if (!isFormValid.value) return;

  isLoading.value = true;
  const success = await authStore.completeInitialSetup(
    password.value,
    fileInput.value
  );
  isLoading.value = false;

  if (success) {
    router.push("/");
  }
};
</script>

<template>
  <main
    class="min-h-screen flex items-center justify-center bg-base-200 px-4 font-sans"
  >
    <section
      class="card w-full max-w-lg bg-base-100 shadow-xl"
      aria-labelledby="setup-title"
    >
      <div class="card-body text-center">
        <header>
         <h2 class="card-title text-2xl justify-center mb-6">
        {{ esPrimeraVez ? 'Bienvenido a MiniTicker' : 'Actualizar Contraseña' }}
      </h2>
         <p class="text-sm text-center opacity-70 mb-4">
        {{ esPrimeraVez 
           ? 'Como es tu primera vez, configura tu contraseña y sube una foto.' 
           : 'Por seguridad, debes establecer una nueva contraseña.' }}
      </p>
        </header>

        <form @submit.prevent="handleSubmit" class="text-left space-y-5">
          <div v-if="esPrimeraVez" class="flex justify-center mb-2">
            <div class="avatar placeholder relative group cursor-pointer">
              <div
                class="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden bg-base-300 transition-transform hover:scale-105"
              >
                <img
                  v-if="previewUrl"
                  :src="previewUrl"
                  alt="Vista previa de foto de perfil"
                />
              </div>
              <div
                class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full text-white font-bold text-xs"
              >
                Cambiar
              </div>
              <input
                type="file"
                @change="onFileSelected"
                accept="image/*"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Subir foto de perfil"
              />
            </div>
          </div>
          <p v-if="esPrimeraVez" class="text-center text-xs text-gray-400 mb-4">
            Haz clic en el círculo para subir una foto (Opcional)
          </p>

          <fieldset class="space-y-4">
            <legend class="sr-only">Configuración de contraseña</legend>

            <div class="form-control">
              <label class="label" for="new-password">
                <span class="label-text font-bold">Nueva Contraseña</span>
              </label>
              <input
                id="new-password"
                v-model="password"
                type="password"
                placeholder="Ingresa tu contraseña segura"
                class="input input-bordered w-full focus:input-primary transition-all"
                :class="{
                  'input-error': password && !isPasswordSecure,
                  'input-success': isPasswordSecure,
                }"
                autocomplete="new-password"
              />

              <ul
                class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs px-1"
              >
                <li
                  v-for="(req, index) in passwordRequirements"
                  :key="index"
                  class="flex items-center gap-2 transition-colors duration-200"
                  :class="
                    req.met
                      ? 'text-success font-medium'
                      : 'text-base-content'
                  "
                >
                  <input
                    type="checkbox"
                    disabled
                    :checked="req.met"
                    class="checkbox checkbox-xs cursor-default disabled:opacity-100"
                    :class="req.met ? 'checkbox-success' : 'checkbox-ghost'"
                  />
                  {{ req.label }}
                </li>
              </ul>
            </div>

            <div class="form-control">
              <label class="label" for="confirm-password">
                <span class="label-text font-bold">Confirmar Contraseña</span>
              </label>
              <input
                id="confirm-password"
                v-model="confirmPassword"
                type="password"
                placeholder="Repite la contraseña"
                class="input input-bordered w-full"
                :class="{
                  'input-error': confirmPassword && !passwordsMatch,
                  'input-success': confirmPassword && passwordsMatch,
                }"
                autocomplete="new-password"
              />
              <span
                v-if="confirmPassword && !passwordsMatch"
                class="text-error text-xs mt-1 ml-1"
              >
                Las contraseñas no coinciden
              </span>
            </div>
          </fieldset>

          <div class="pt-2">
            <button
              type="submit"
              class="btn btn-primary w-full shadow-lg shadow-primary/20"
              :disabled="isLoading || !isFormValid"
            >
              <span v-if="isLoading" class="loading loading-spinner"></span>
              {{ isLoading ? "Guardando..." : "Guardar y Continuar" }}
            </button>
          </div>
        </form>
      </div>
    </section>
  </main>
</template>
