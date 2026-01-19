<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import authService from '@/services/authService';
import { toast } from 'vue-sonner'; // 👈 Importamos Sonner

const email = ref('');
const codigo = ref('');
const loading = ref(false);
const router = useRouter();

const handleSubmit = async () => {
  if (codigo.value.length !== 4) {
    // Reemplazo de alert()
    toast.warning('El código debe tener exactamente 4 caracteres.');
    return;
  }

  loading.value = true;
  try {
    const response = await authService.requestPasswordReset(email.value, codigo.value);
    
    // 👇 Éxito con Sonner
    toast.success('Solicitud enviada', {
      description: response.data || 'Si los datos son correctos, el administrador será notificado.'
    });

    router.push('/login'); 
  } catch (error) {
    console.error(error);
    // 👇 Error con Sonner
    toast.error('Error al enviar', {
      description: 'Verifica tus datos o intenta más tarde.'
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200">
    <div class="card w-full max-w-md bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title justify-center mb-2">Recuperar Contraseña</h2>
        <p class="text-xs text-center opacity-70 mb-6">
          Ingresa tu correo y los primeros 4 caracteres de tu ID de usuario para verificar tu identidad.
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="form-control">
            <label class="label"><span class="label-text">Correo Electrónico</span></label>
            <input type="email" v-model="email" required class="input input-bordered" placeholder="usuario@miniticker.com" />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text">Código de Seguridad</span>
              <span class="label-text-alt text-xs text-info">(Primeros 4 dígitos de tu ID)</span>
            </label>
            <input 
              type="text" 
              v-model="codigo" 
              required 
              maxlength="4" 
              class="input input-bordered uppercase tracking-widest font-mono" 
              placeholder="A1B2" 
            />
          </div>

          <div class="form-control mt-6">
            <button class="btn btn-primary" :disabled="loading">
              <span v-if="loading" class="loading loading-spinner"></span>
              {{ loading ? 'Enviando...' : 'Solicitar Reseteo' }}
            </button>
          </div>

          <div class="text-center mt-4">
            <RouterLink to="/login" class="link link-hover text-sm">Volver al Login</RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>