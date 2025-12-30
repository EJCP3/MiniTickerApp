<script setup lang="ts">
const submitHandler = async (data: any) => {
  console.log(data)
  // Aquí iría la lógica de login
}
</script>

<template>
  <main class="bg-login relative flex min-h-screen items-center justify-center p-4">
    
    <div class="absolute inset-0 bg-black/80" aria-hidden="true"></div>

    <div class=" z-10 grid w-full max-w-6xl grid-cols-1  gap-10 lg:grid-cols-2 lg:items-center lg:h-screen">
      
      <header class="flex flex-col px-4 text-white lg:px-12">
        <div class="mb-10 flex  gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-10 w-10" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
          <span class="text-3xl font-bold tracking-wide">MiniTicker</span>
        </div>

        <h1 class="mb-6 text-4xl font-light leading-tight lg:text-5xl">
          Solicitudes internas sin complicaciones
        </h1>
        <p class="text-xl font-light opacity-90">
          Del pedido a la solución, en un solo lugar.
        </p>
      </header>

      <section class="flex w-full lg:h-screen  lg:justify-end items-end " aria-labelledby="login-title">
        <div class="flex flex-col  w-full  lg:h-[80vh] max-w-md rounded-3xl lg:rounded-t-3xl bg-white p-10 shadow-2xl lg:p-12">
          
          <h2 id="login-title" class="mb-8 text-3xl font-bold text-gray-900">
            Inicia sesión
          </h2>

          <FormKit
            type="form"
            :actions="false"
            @submit="submitHandler"
          >
            <FormKit
              type="email"
              name="email"
              label="Email"
              placeholder="johnsondoe@nomail.com"
              validation="required|email"
              :classes="{
                outer: 'mb-5',
                label: 'block mb-2 text-xs font-bold text-gray-500 uppercase tracking-wide',
                input: 'w-full px-4 py-3 bg-gray-100 border-none rounded-md text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-900 focus:outline-none transition duration-200',
                message: 'text-red-500 text-xs mt-1'
              }"
            />

            <FormKit
              type="password"
              name="password"
              label="Password"
              placeholder="****************"
              validation="required"
              :classes="{
                outer: 'mb-8',
                label: 'block mb-2 text-xs font-bold text-gray-500 uppercase tracking-wide',
                input: 'w-full px-4 py-3 bg-gray-100 border-none rounded-md text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-gray-900 focus:outline-none transition duration-200',
                message: 'text-red-500 text-xs mt-1'
              }"
            />

            <button type="submit" class="w-full rounded-md bg-gray-900 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2">
              Continue
            </button>
          </FormKit>
        </div>
      </section>

    </div>
  </main>
</template>

<style scoped>
.bg-login {
  width: 100%;
  min-height: 100vh;
  background-image: url('/login.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>

